var minute = 24;
var second = 60;
var interval = undefined;
var isPause = false;
var isReset = false;
var pomodoroCount = 0;
var breakCount = 0;
var pomodoroDoneEvent = new Event('pomodoroDone');
var breakDoneEvent = new Event('breakDone');

const types = {POMODORO: 'Pomodoro', BREAK: 'break'};

var timer = document.getElementById('timer');
var numOfPomodoro = document.getElementById('pomodoro-done');
const updatePomodoroCountListener = function(e){
  updatePomodoroCount();
};
const breakDoneListener = function(e){
  breakCount++;
};

timer.addEventListener('pomodoroDone', updatePomodoroCountListener);
timer.addEventListener('breakDone', breakDoneListener);

function startTheDay(){
  if(isReset){
    clearInterval(interval);
    updateTimer(25, 00, types.POMODORO);
    changeMainButtonText("Start your Pomorodo!");
    isReset = false;
    //When the user resets we pause the timer
    isPause = true;
  }
  else{
    changeMainButtonText("Reset");
    startPomodoro();
    isPause = false;
  }
  updatePauseButton();

}

function updatePomodoroCount(){
  pomodoroCount++;
  numOfPomodoro.innerHTML += "X "
}
function initTimer(min, sec){
  minute = min;
  second = sec;
}
function initPomodoro(){
  initTimer(24, 60);
  // initTimer(0, 5);
}

function initShortBreak(){
  initTimer(4, 60);
  // initTimer(0, 3);
}

function initLongBreak(){
  initTimer(14, 60);
  // initTimer(0, 7);
}
function startPomodoro(){
  initPomodoro();
  var message = "1 Pomodoro is done! Now take a 5-minute short-break!";
  if(pomodoroCount > 0 && pomodoroCount % 3 == 0){
    message = "4 Pomodoro is done! Now take a 15-minute long-break!";
  }
  interval = setInterval(startTimer, 1000, types.POMODORO, doneNInvokeNextStep, message, startBreak, pomodoroDoneEvent);
}
function startTimer(type, doneNInvokeNextStep, message, nextStep, event){
  if(isPause){
    return;
  }
  second--;
  updateTimer(minute, second, type);

  if(second == 0){
    if(minute == 0){
      if(event){
        timer.dispatchEvent(event);
      }
      doneNInvokeNextStep(message, nextStep);
      return;
    }else{
      minute--;
    }
    second = 59;
  }
}

function updateTimer(minute, second, type){
  var time =  checkTime(minute) + ":"
    + checkTime(second);
  var title = document.getElementsByTagName("title")[0];
  timer.innerHTML = time;
  if(type == types.POMODORO){
    title.innerHTML = "Pomodoro (" + time + ")";
  }else if(type == types.BREAK){
    title.innerHTML = "Break (" + time + ")";
  }

}
function checkTime(i){
  if(i < 10) {
    i = "0" + i;
  }
  return i;
}
function doneNInvokeNextStep(message, nextStep){
  displayNotification(message);
  clearInterval(interval);
  nextStep();
}

function displayNotification(message){
  if (!("Notification" in window)) {
    alert(message);
	bing();
  } else if (Notification.permission === "granted") {
    var notification = new Notification(message);
  } else if (Notification.permission !== 'denied') {
    Notification.requestPermission(function (permission) {
      if (permission === "granted") {
        var notification = new Notification(message);
      }
    });
  } else {
    alert(message);
	bing();
  }
}

function startBreak(){
  if(pomodoroCount > 0 && pomodoroCount % 4 == 0){
    initLongBreak();
  }else{
    initShortBreak();
  }
  var message = "Break is done! Now start another Pomodoro";
  interval = setInterval(startTimer, 1000, types.BREAK, doneNInvokeNextStep, message, startPomodoro, breakDoneEvent);
}

function pauseTimer(){
  isPause = !isPause;
  updatePauseButton();
}

function updatePauseButton(){
  if(isPause){
    changePauseButtonText('Resume');
  }else{
    changePauseButtonText('Pause');
  }
}

function changePauseButtonText(text){
  document.getElementById('pauseButton').innerHTML = text;
}

function changeMainButtonText(text){
  document.getElementById('mainButton').innerHTML = text;
  isReset = true;
}

function bing(){
  var audio = new Audio('../../alarm.mp3');
  audio.play();
}
