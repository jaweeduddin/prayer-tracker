

alert("Website loaded successfully");
if ("Notification" in window) {

    Notification.requestPermission();

}
let completedCount = 0;
// PRAYER TIMES
// REAL PRAYER TIMES

let prayerTimes = {};



// GET PRAYER TIMES

async function loadPrayerTimes(){

 

    try{



        let response = await fetch(

            "https://api.aladhan.com/v1/timingsByCity?city=Hyderabad&country=India&method=1"

        );



        let data = await response.json();



        prayerTimes = {

            Fajr:
            data.data.timings.Fajr,

            Dhuhr:
            data.data.timings.Dhuhr,

            Asr:
            data.data.timings.Asr,

            Maghrib:
            data.data.timings.Maghrib,

            Isha:
            data.data.timings.Isha

        };



        console.log(

            "Prayer Times Loaded:",

            prayerTimes

        );



    }

    catch(error){

        console.log(

            "Prayer API Error",

            error

        );

    }

}

let prayerStatus = {

    Fajr: "Astaghfirullah Missed",

    Dhuhr: "Astaghfirullah Missed",

    Asr: "Astaghfirullah Missed",

    Maghrib: "Astaghfirullah Missed",

    Isha: "Astaghfirullah Missed"

};
// AZKAR STATUS

let azkarStatus = {

    Fajr:
    "Astaghfirullah Missed",

    Dhuhr:
    "Astaghfirullah Missed",

    Asr:
    "Astaghfirullah Missed",

    Maghrib:
    "Astaghfirullah Missed",

    Isha:
    "Astaghfirullah Missed"

};
let users =
JSON.parse(localStorage.getItem("users")) || [];

let today =
new Date().toDateString();

document.getElementById("date-text")
.innerText = today;



// LOGIN

function login(){

    let username =
    document.getElementById("username-text").value;

    let password =
    document.getElementById("password-input").value;

    let foundUser =
    users.find(function(user){

        return user.username === username
        &&
        user.password === password;

    });

    if(foundUser){

        localStorage.setItem(
            "loggedin",
            "true"
        );

        localStorage.setItem(
            "currentUser",
            username
        );

        prayerStatus = {

            Fajr: "Astaghfirullah Missed",

            Dhuhr: "Astaghfirullah Missed",

            Asr: "Astaghfirullah Missed",

            Maghrib: "Astaghfirullah Missed",

            Isha: "Astaghfirullah Missed"

        };

        document.getElementById("login-container")
        .style.display = "none";

        document.getElementById("app-container")
        .style.display = "block";

        updateWelcome();

        resetButtons();

        loadAllPrayers();

        loadHistory();
        updateDashboard();

    }

    else{

        alert("Invalid Username or Password");

    }

}



// REGISTER

function register(){

    let username =
    document.getElementById("username-text").value;

    let password =
    document.getElementById("password-input").value;

    if(username === "" || password === ""){

        alert("Please fill all fields");

        return;

    }

    let user = {

        username: username,

        password: password

    };

    users.push(user);

    localStorage.setItem(
        "users",
        JSON.stringify(users)
    );

    alert("Account Created Successfully");

}



// WELCOME

function updateWelcome(){

    let currentUser =
    localStorage.getItem("currentUser");

    document.getElementById("welcome-text")
    .innerText =
    "Assalamualaikum, "
    + currentUser + "!";

}



// MARK PRAYER

// MARK / UNMARK PRAYER

function markprayer(prayer){

    let currentUser =
    localStorage.getItem("currentUser");



    let button =
    document.getElementById(prayer);



    let prayerKey =

    currentUser
    + "-"
    + today
    + "-"
    + prayer;



    let azkarKey =

    currentUser
    + "-"
    + today
    + "-"
    + prayer
    + "-azkar";



    let savedData =
    localStorage.getItem(prayerKey);



    // =========================
    // DOUBLE CLICK = UNCHECK
    // =========================

    if(savedData === "completed"){



        localStorage.removeItem(
            prayerKey
        );



        localStorage.removeItem(
            azkarKey
        );



        prayerStatus[prayer] =
        "Astaghfirullah Missed";



        azkarStatus[prayer] =
        "Astaghfirullah Missed";



        button.style.background =
"linear-gradient(135deg,#dc2626,#991b1b)";



        button.innerText =
        prayer;



        completedCount--;



        saveHistory();

        loadHistory();

        updateDashboard();

        updateProgress();



        return;

    }



    // =========================
    // COMPLETE PRAYER
    // =========================

    button.style.background =
"linear-gradient(135deg,#22c55e,#16a34a)";



    button.innerText =
    prayer + " completed !";



    prayerStatus[prayer] =
    "Alhamdulillah Done";



    // ASK AZKAR

    let didAzkar = confirm(

        "Did you read "

        + prayer +

        " Azkar?"

    );



    if(didAzkar){

        azkarStatus[prayer] =

        "Alhamdulillah Done";

    }

    else{

        azkarStatus[prayer] =

        "Astaghfirullah Missed";

    }



    // SAVE AZKAR

    localStorage.setItem(

        azkarKey,

        azkarStatus[prayer]

    );



    // SAVE PRAYER

    localStorage.setItem(

        prayerKey,

        "completed"

    );



    completedCount++;



    updateProgress();

    saveHistory();

    loadHistory();

    updateDashboard();

}



// LOAD SINGLE PRAYER

function loadPrayer(prayer){

    let currentUser =
    localStorage.getItem("currentUser");

    let savedData =
    localStorage.getItem(
        currentUser + "-" + today + "-" + prayer
    );

    if(savedData === "completed"){

        prayerStatus[prayer] =
        "Alhamdulillah Done";

        let button =
        document.getElementById(prayer);

        button.style.background =
"linear-gradient(135deg,#22c55e,#16a34a)";

        button.innerText =
        prayer + " completed !";

        completedCount++;
// LOAD AZKAR STATUS

let savedAzkar =

localStorage.getItem(

    currentUser
    + "-"
    + today
    + "-"
    + prayer
    + "-azkar"

);



if(savedAzkar){

    azkarStatus[prayer] =

    savedAzkar;

}
    }

}



// LOAD ALL

function loadAllPrayers(){

    completedCount = 0;

    loadPrayer("Fajr");

    loadPrayer("Dhuhr");

    loadPrayer("Asr");

    loadPrayer("Maghrib");

    loadPrayer("Isha");

    updateProgress();

}



// UPDATE PROGRESS

function updateProgress(){

    let progressText =
    document.getElementById("progress-text");

    progressText.innerText =
    "Completed: "
    + completedCount
    + " / 5";

    let percentage =
    (completedCount / 5) * 100;

    document.getElementById("progress-bar")
    .style.width =
    percentage + "%";

    document.getElementById("percentage-text")
    .innerText =
    percentage + "%";

    if(completedCount === 5){

        

        alert(
            "Ma sha Allah, Barakallahu feekum"
        );

    }

}
function searchHistory(){

    let selectedDate =
    document.getElementById(
        "history-date"
    ).value;

    let currentUser =
    localStorage.getItem(
        "currentUser"
    );

    let history =
    JSON.parse(

        localStorage.getItem(
            currentUser + "-history"
        )

    ) || [];

    let result =
    document.getElementById(
        "history-result"
    );

    let foundRecord =
    history.find(function(record){

        let recordDate =
new Date(record.date);

let year =
recordDate.getFullYear();

let month =
String(
recordDate.getMonth() + 1
).padStart(2,"0");

let day =
String(
recordDate.getDate()
).padStart(2,"0");

recordDate =
year + "-" + month + "-" + day;

        return recordDate === selectedDate;

    });

    if(foundRecord){

        result.innerHTML = `

        <h3>${foundRecord.date}</h3>

        <p>Fajr:
        ${foundRecord.Fajr}</p>

        <p>Dhuhr:
        ${foundRecord.Dhuhr}</p>

        <p>Asr:
        ${foundRecord.Asr}</p>

        <p>Maghrib:
        ${foundRecord.Maghrib}</p>

        <p>Isha:
        ${foundRecord.Isha}</p>

        `;

    }

    else{

        result.innerHTML =
        "No record found for this date.";

    }

}
function updateDashboard(){

    let currentUser =
    localStorage.getItem(
        "currentUser"
    );

    let history =
    JSON.parse(

        localStorage.getItem(
            currentUser + "-history"
        )

    ) || [];

    let totalDone = 0;

    let totalMissed = 0;

    let fajrMissed = 0;

    let dhuhrMissed = 0;

    let asrMissed = 0;

    let maghribMissed = 0;

    let ishaMissed = 0;



    history.forEach(function(record){

        let prayers = [

            "Fajr",
            "Dhuhr",
            "Asr",
            "Maghrib",
            "Isha"

        ];

        prayers.forEach(function(prayer){

            if(
                record[prayer]
                ===
                "Alhamdulillah Done"
            ){

                totalDone++;

            }

            else{

                totalMissed++;

            }

        });



        if(
            record.Fajr ===
            "Astaghfirullah Missed"
        ){

            fajrMissed++;

        }



        if(
            record.Dhuhr ===
            "Astaghfirullah Missed"
        ){

            dhuhrMissed++;

        }



        if(
            record.Asr ===
            "Astaghfirullah Missed"
        ){

            asrMissed++;

        }



        if(
            record.Maghrib ===
            "Astaghfirullah Missed"
        ){

            maghribMissed++;

        }



        if(
            record.Isha ===
            "Astaghfirullah Missed"
        ){

            ishaMissed++;

        }
 
    });



    document.getElementById(
        "total-done"
    ).innerText =
    "Total Salah Done: "
    + totalDone;



    document.getElementById(
        "total-missed"
    ).innerText =
    "Total Salah Missed: "
    + totalMissed;



    document.getElementById(
        "fajr-missed"
    ).innerText =
    "Fajr Missed: "
    + fajrMissed;



    document.getElementById(
        "dhuhr-missed"
    ).innerText =
    "Dhuhr Missed: "
    + dhuhrMissed;



    document.getElementById(
        "asr-missed"
    ).innerText =
    "Asr Missed: "
    + asrMissed;



    document.getElementById(
    "maghrib-missed"
).innerText =
"Maghrib Missed: "
+ maghribMissed;

    document.getElementById(
        "isha-missed"
    ).innerText =
    "Isha Missed: "
    + ishaMissed;
 document.getElementById(
    "azkar-status"
).innerHTML =

`
<h3>Your Azkar Statistics !</h3>

<p>
Fajr:
${azkarStatus.Fajr}
</p>

<p>
Dhuhr:
${azkarStatus.Dhuhr}
</p>

<p>
Asr:
${azkarStatus.Asr}
</p>

<p>
Maghrib:
${azkarStatus.Maghrib}
</p>

<p>
Isha:
${azkarStatus.Isha}
</p>
`;
}
function toggleHistory(){

    let historySection =
    document.getElementById(
        "history-section"
    );

    if(historySection.style.display === "none"){

        historySection.style.display =
        "block";

    }

    else{

        historySection.style.display =
        "none";

    }

}
// SAVE HISTORY

function saveHistory(){

    let currentUser =
    localStorage.getItem("currentUser");

    let history =
    JSON.parse(
        localStorage.getItem(
            currentUser + "-history"
        )
    ) || [];

    let existingRecord =
history.find(function(item){

    return item.date === today;

});

if(existingRecord){

    existingRecord.Fajr =
    prayerStatus.Fajr;

    existingRecord.Dhuhr =
    prayerStatus.Dhuhr;

    existingRecord.Asr =
    prayerStatus.Asr;

    existingRecord.Maghrib =
    prayerStatus.Maghrib;

    existingRecord.Isha =
    prayerStatus.Isha;

}

else{

    let record = {

        date: today,

        Fajr: prayerStatus.Fajr,

        Dhuhr: prayerStatus.Dhuhr,

        Asr: prayerStatus.Asr,

        Maghrib: prayerStatus.Maghrib,

        Isha: prayerStatus.Isha

    };

    history.push(record);

}
    localStorage.setItem(

        currentUser + "-history",

        JSON.stringify(history)

    );

}



// LOAD HISTORY

function loadHistory(){

    let currentUser =
    localStorage.getItem("currentUser");

    let history =
    JSON.parse(

        localStorage.getItem(
            currentUser + "-history"
        )

    ) || [];

    let table =
    document.getElementById("history-table");

    table.innerHTML = `

    <tr>

        <th>Date :</th>

        <th>Fajr</th>

        <th>Dhuhr</th>

        <th>Asr</th>

        <th>Maghrib</th>

        <th>Isha</th>

    </tr>

    `;

    history.forEach(function(record){

        let row = `

        <tr>

            <td>${record.date}</td>

            <td>${record.Fajr}</td>

            <td>${record.Dhuhr}</td>

            <td>${record.Asr}</td>

            <td>${record.Maghrib}</td>

            <td>${record.Isha}</td>

        </tr>

        `;

        table.innerHTML += row;

    });

}



// RESET BUTTONS

function resetButtons(){

    let prayers = [

        "Fajr",
        "Dhuhr",
        "Asr",
        "Maghrib",
        "Isha"

    ];

    prayers.forEach(function(prayer){

        let button =
        document.getElementById(prayer);

       button.style.background =
"linear-gradient(135deg,#dc2626,#991b1b)";

        button.innerText = prayer;

    });

}



// RESET PRAYERS

function resetprayer(){

    let currentUser =
    localStorage.getItem("currentUser");

    let prayers = [

        "Fajr",
        "Dhuhr",
        "Asr",
        "Maghrib",
        "Isha"

    ];

    prayers.forEach(function(prayer){

        localStorage.removeItem(
currentUser + "-" + today + "-" + prayer);
localStorage.removeItem(

currentUser
+ "-"
+ today
+ "-"
+ prayer
+ "-azkar"

);
    });

    prayerStatus = {

        Fajr: "Astaghfirullah Missed",

        Dhuhr: "Astaghfirullah Missed",

        Asr: "Astaghfirullah Missed",

        Maghrib: "Astaghfirullah Missed",

        Isha: "Astaghfirullah Missed"

    };
// RESET AZKAR STATUS

azkarStatus = {

    Fajr:
    "Astaghfirullah Missed",

    Dhuhr:
    "Astaghfirullah Missed",

    Asr:
    "Astaghfirullah Missed",

    Maghrib:
    "Astaghfirullah Missed",

    Isha:
    "Astaghfirullah Missed"

};
    completedCount = 0;

    resetButtons();

    updateProgress();



    /* UPDATE TODAY HISTORY */

    let history =
    JSON.parse(

        localStorage.getItem(
            currentUser + "-history"
        )

    ) || [];

    let existingRecord =
    history.find(function(item){

        return item.date === today;

    });

    if(existingRecord){

        existingRecord.Fajr =
        "Astaghfirullah Missed";

        existingRecord.Dhuhr =
        "Astaghfirullah Missed";

        existingRecord.Asr =
        "Astaghfirullah Missed";

        existingRecord.Maghrib =
        "Astaghfirullah Missed";

        existingRecord.Isha =
        "Astaghfirullah Missed";

    }

    localStorage.setItem(

        currentUser + "-history",

        JSON.stringify(history)

    );

    loadHistory();

    updateDashboard();

}



// LOGOUT

function logout(){

    localStorage.removeItem("loggedin");

    localStorage.removeItem("currentUser");

    location.reload();

}



// AUTO LOGIN

if(localStorage.getItem("loggedin") === "true"){

    document.getElementById("login-container")
    .style.display = "none";

    document.getElementById("app-container")
    .style.display = "block";

    updateWelcome();

    resetButtons();

    loadAllPrayers();

    updateDashboard();

}

// ===============================
// PRAYER REMINDER NOTIFICATIONS
// ===============================

let lastNotificationTimes = {};



// ======================================
// WORKING PRAYER REMINDER SYSTEM
// ======================================


// TEST TIMES

// CHANGE THESE FOR TESTING





// STORE LAST NOTIFICATIONS




// SHOW NOTIFICATION

function showPrayerNotification(prayer){

    if(Notification.permission === "granted"){

        new Notification(

            "🕌 " + prayer + " Reminder",

            {

                body:
                "You have not prayed "
                + prayer +
                " yet.",

                icon: "icon-192.png"

            }

        );

    }

}



// CONVERT TIME

function convertToMinutes(time){

    let parts = time.split(":");

    let hours = parseInt(parts[0]);

    let minutes = parseInt(parts[1]);

    return (hours * 60) + minutes;

}



// CHECK REMINDERS

function checkPrayerReminder(){

    let currentUser =

    localStorage.getItem(

        "currentUser"

    );



    if(!currentUser){

        return;

    }



    let now = new Date();



    let currentMinutes =

    (now.getHours() * 60)

    +

    now.getMinutes();



    for(let prayer in prayerTimes){



        let prayerMinutes =

        convertToMinutes(

            prayerTimes[prayer]

        );



        let completed =

        localStorage.getItem(

currentUser + "-" + today + "-" + prayer
        );



        if(completed !== "completed"){



            if(currentMinutes >= prayerMinutes){



                let difference =

                currentMinutes

                -

                prayerMinutes;



                if(difference % 15 === 0){



                    if(

                        lastNotificationTimes[prayer]

                        !== currentMinutes

                    ){



                        showPrayerNotification(

                            prayer

                        );



                        lastNotificationTimes[prayer]

                        = currentMinutes;

                    }

                }

            }

        }

    }

}



// MISSED WARNING

function checkMissedFajr(){



    let currentUser =

    localStorage.getItem(

        "currentUser"

    );



    if(!currentUser){

        return;

    }



    let now = new Date();



    let currentMinutes =

    (now.getHours() * 60)

    +

    now.getMinutes();



    let dhuhrMinutes =

    convertToMinutes(

        prayerTimes.Dhuhr

    );



    let fajrCompleted =

    localStorage.getItem(

        currentUser + "-" + today + "-Fajr"

    );



    if(

        currentMinutes >= dhuhrMinutes

        &&

        fajrCompleted !== "completed"

    ){



        if(

            !localStorage.getItem(

                "fajr-warning-shown"

            )

        ){



            alert(

                "⚠️ You missed Fajr Salah.\n\n"

                +

                "The most burdensome prayers "

                +

                "upon the hypocrites are "

                +

                "Isha and Fajr.\n\n"

                +

                "(Sahih al-Bukhari)"

            );



            localStorage.setItem(

                "fajr-warning-shown",

                "yes"

            );

        }

    }

}



// RUN EVERY 10 SECONDS

setInterval(

    checkPrayerReminder,

    10000

);



setInterval(

    checkMissedFajr,

    10000

);

setInterval(

    loadPrayerTimes,

    3600000

);

// RUN NOW ALSO

loadPrayerTimes();

checkPrayerReminder();

checkMissedFajr();