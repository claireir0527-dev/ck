let notices =
JSON.parse(localStorage.getItem("notices")) || [];



function showNotice(){

    let list =
    document.getElementById("noticeList");

    // 通知リスト画面ではない場合
    if(!list){
        return;
    }

    list.innerHTML = "";


    notices.forEach((notice,index)=>{

        let div = document.createElement("div");

        div.className = "card";


        // 昔の通知（文字だけ）にも対応
        if(typeof notice === "string"){

            div.innerHTML =
            `
            <div>
                🔔 ${notice}
            </div>

            <button onclick="deleteNotice(${index})">
                削除
            </button>
            `;

        }

        else{

            let today = new Date();

            today.setHours(0,0,0,0);


            let target = new Date(notice.date);

            target.setHours(0,0,0,0);


            let diff =
            Math.ceil(
                (target - today) / (1000 * 60 * 60 * 24)
            );


            let remainText;
            let remainClass;


            if(diff < 0){

                remainText = "❌ 期限切れ";
                remainClass = "expired";

            }

            else if(diff === 0){

                remainText = "⚠️ 今日";
                remainClass = "today";

            }

            else if(diff === 1){

                remainText = "⏰ 明日";
                remainClass = "tomorrow";

            }

            else{

                remainText = "あと" + diff + "日";
                remainClass = "";

            }


            // 時間がある場合だけ表示
            let timeText = "";

            if(notice.time){

                timeText =
                `<br>⏰ ${notice.time}`;

            }


            div.innerHTML =
            `
            <div>

                🔔 ${notice.text}


               <div class="notice-date-time">

    <span>
        📅 ${notice.date}
    </span>

    ${notice.time ? `
    <span>
        ⏰ ${notice.time}
    </span>
    ` : ""}

</div>

<div class="notice-remain ${remainClass}">
    ${remainText}
</div>

            </div>

            <div class="task-buttons">

                <button
                    class="edit-btn"
                    onclick="editNotice(${index})">
                    編集
                </button>

                <button
                    class="done-btn"
                    onclick="deleteNotice(${index})">
                    削除
                </button>

            </div>
            `;

        }


        list.appendChild(div);

    });

}



function editNotice(index){

    localStorage.setItem(
        "editNoticeIndex",
        index
    );

    location.href="add-notice.html";

}



function addNotice(){

    let text =
    document.getElementById("noticeText").value;

    let date =
    document.getElementById("noticeDate").value;

    let time =
    document.getElementById("noticeTime").value;

    if(text == "" || date == ""){

    Swal.fire({

        icon: "warning",

        title: "入力してください",

        text: "通知内容と日付を入力してください",

        width: 280,

        customClass: {
            popup: "small-alert"
        },

        confirmButtonColor: "#6b3df5"

    });

    return;

}


    let notices =
    JSON.parse(localStorage.getItem("notices")) || [];


    let editIndex =
    localStorage.getItem("editNoticeIndex");


    if(editIndex !== null){

        notices[editIndex] = {

            text: text,

            date: date,

            time: time

        };


        localStorage.removeItem(
            "editNoticeIndex"
        );


    }else{

        notices.push({

            text: text,

            date: date,

            time: time

        });

    }


    localStorage.setItem(
        "notices",
        JSON.stringify(notices)
    );


    location.href = "notice.html";

}


function deleteNotice(index){

    notices.splice(index,1);


    localStorage.setItem(
        "notices",
        JSON.stringify(notices)
    );


    showNotice();

}



showNotice();



if(document.getElementById("noticeDate")){

    flatpickr("#noticeDate",{

        locale: flatpickr.l10ns.ja,

        dateFormat:"Y-m-d",

        allowInput:false,

        disableMobile:true,

        position:"center"

    });

}



function cancelNotice(){

    document.getElementById("noticeText").value="";

    document.getElementById("noticeDate").value="";

    document.getElementById("noticeTime").value="";


    document.getElementById("cancelNoticeBtn")
    .style.display="none";


    document.getElementById("homeNoticeBtn")
    .style.display="block";

}



function checkNoticeInput(){

    let text =
    document.getElementById("noticeText").value;


    let date =
    document.getElementById("noticeDate").value;

    let time =
    document.getElementById("noticeTime").value;


    let cancel =
    document.getElementById("cancelNoticeBtn");


    let home =
    document.getElementById("homeNoticeBtn");



    if(text != "" || date != "" || time != ""){

        cancel.style.display="block";

        home.style.display="none";

    }else{

        cancel.style.display="none";

        home.style.display="block";

    }

}



document
.getElementById("noticeText")
.addEventListener(
"input",
checkNoticeInput
);



document
.getElementById("noticeDate")
.addEventListener(
"change",
checkNoticeInput
);



let noticeTime =
document.getElementById("noticeTime");

if(noticeTime){

    noticeTime.addEventListener(
        "change",
        checkNoticeInput
    );

}

function goHomeNotice(){

    location.href="index.html";

}



function backNotice(){

    let text =
    document.getElementById("noticeText").value;


    let date =
    document.getElementById("noticeDate").value;

    let time =
    document.getElementById("noticeTime").value;



    if(text != "" || date != "" ){

        Swal.fire({

            icon: "warning",

            title: "保存されていません",

            text: "入力内容があります",

            width: 280,

            customClass: {
                popup: "small-alert"
            },

            confirmButtonColor: "#6b3df5"

        });

    }else{

        location.href="notice-menu.html";

    }

}
window.onload = function(){

    let index =
    localStorage.getItem("editNoticeIndex");


    if(index !== null){

        let notices =
        JSON.parse(localStorage.getItem("notices")) || [];


        document.getElementById("noticeText").value =
        notices[index].text;


        document.getElementById("noticeDate").value =
        notices[index].date;


        // 時間を読み込む
        let savedTime =
        notices[index].time || "";


        document.getElementById("noticeTime").value =
        savedTime;


        // 時間ボタンにも表示
        if(savedTime){

            document.getElementById("timeButton").textContent =
            "⏰ " + savedTime;

        }


        document.querySelector(".save").textContent =
        "💾 更新";


        document.getElementById("homeNoticeBtn").textContent =
        "🔙 一覧に戻る";


        document.getElementById("homeNoticeBtn").onclick =
        function(){

            location.href="notice.html";

        };


    }else{

        document.querySelector(".save").textContent =
        "💾 保存";

    }

}



/* ===================================
   時計型 時間選択
=================================== */

let selectedHour = 0;

let selectedMinute = 0;

let timeMode = "hour";


function openTimePicker(){

    let modal =
    document.getElementById("timeModal");

    let savedTime =
    document.getElementById("noticeTime").value;


    // すでに時間が保存されている場合
    if(savedTime){

        let parts =
        savedTime.split(":");

        selectedHour =
        parseInt(parts[0]);

        selectedMinute =
        parseInt(parts[1]);

    }else{

        let now = new Date();

        selectedHour =
        now.getHours();

        selectedMinute =
        Math.round(now.getMinutes() / 5) * 5;

        if(selectedMinute === 60){

            selectedMinute = 0;

            selectedHour++;

            if(selectedHour === 24){
                selectedHour = 0;
            }

        }

    }


    timeMode = "hour";

    updateTimeDisplay();

    createClock();

    modal.classList.add("show");

}


function closeTimePicker(){

    document
    .getElementById("timeModal")
    .classList.remove("show");

}


function selectHourMode(){

    timeMode = "hour";

    updateTimeDisplay();

    createClock();

}


function selectMinuteMode(){

    timeMode = "minute";

    updateTimeDisplay();

    createClock();

}


function updateTimeDisplay(){

    document
    .getElementById("hourDisplay")
    .textContent =
    String(selectedHour).padStart(2,"0");


    document
    .getElementById("minuteDisplay")
    .textContent =
    String(selectedMinute).padStart(2,"0");


    document
    .getElementById("hourDisplay")
    .classList.toggle(
        "active",
        timeMode === "hour"
    );


    document
    .getElementById("minuteDisplay")
    .classList.toggle(
        "active",
        timeMode === "minute"
    );

}


function createClock(){

    let clock =
    document.getElementById("clockNumbers");

    clock.innerHTML = "";


    let numbers;


    if(timeMode === "hour"){

        numbers =
        [12,1,2,3,4,5,6,7,8,9,10,11];

    }else{

        numbers =
        [0,5,10,15,20,25,30,35,40,45,50,55];

    }


    numbers.forEach((number,index)=>{

        let div =
        document.createElement("div");

        div.className =
        "clock-number";


        let value =
        number;


        if(timeMode === "hour"){

            if(value === selectedHour){

                div.classList.add("selected");

            }

        }else{

            if(value === selectedMinute){

                div.classList.add("selected");

            }

        }


        div.textContent =
        String(number).padStart(2,"0");


        let angle =
        index * 30;


        let radius = 95;


        let center = 120;


        let rad =
        (angle - 90) * Math.PI / 180;


        let x =
        center + radius * Math.cos(rad);


        let y =
        center + radius * Math.sin(rad);


        div.style.left =
        x + "px";


        div.style.top =
        y + "px";


        div.onclick =
        function(){

            if(timeMode === "hour"){

                selectedHour =
                value;

                timeMode =
                "minute";

            }else{

                selectedMinute =
                value;

            }


            updateTimeDisplay();

            createClock();

        };


        clock.appendChild(div);

    });


    updateClockHand();

}


function updateClockHand(){

    let hand =
    document.getElementById("clockHand");


    let value;


    if(timeMode === "hour"){

        value =
        selectedHour % 12;

        let angle =
        value * 30;

        hand.style.transform =
        `translate(-50%,-100%) rotate(${angle}deg)`;

    }else{

        value =
        selectedMinute / 5;

        let angle =
        value * 30;

        hand.style.transform =
        `translate(-50%,-100%) rotate(${angle}deg)`;

    }

}


function saveTimePicker(){

    let time =
    String(selectedHour).padStart(2,"0")
    + ":"
    +
    String(selectedMinute).padStart(2,"0");


    document
    .getElementById("noticeTime")
    .value =
    time;


    document
    .getElementById("timeButton")
    .textContent =
    "⏰ " + time;


    checkNoticeInput();


    closeTimePicker();

}
