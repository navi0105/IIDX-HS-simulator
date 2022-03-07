document.addEventListener('DOMContentLoaded', function(){
    //action list
    document.getElementById('bpmChange_action').onclick = bpmModify;
    document.getElementById('keyPress_action').onclick = pressKey;
    document.getElementById('scratchPush_action').onclick = scratchPush;
    document.getElementById('pressStartTwice_action').onclick = pressStartTwice;
    document.getElementById('switchHsMode_action').onclick = switchHsMode;
}, false);

//ACTION LIST
function bpmModify(){
    let next_BPM = Number(document.getElementById('BPM_after_changes').value);
    hiSpeed_status.bpmChange(next_BPM)
    hiSpeed_status.showStatus();
}

function pressKey(){
    let key_type = Number(document.getElementById('key_type').value);
    let key_count = Number(document.getElementById('key_count').value);
    let press_times = Number(document.getElementById('press_times').value);

    hiSpeed_status.pressKey(key_type, key_count, press_times);
    hiSpeed_status.showStatus();
}

function scratchPush(){
    let scr_movement = document.getElementById('scr_movement').value == ""? undefined: Number(document.getElementById('scr_movement').value);

    hiSpeed_status.scratchPush(scr_movement);
    hiSpeed_status.showStatus();
}

function pressStartTwice(){
    hiSpeed_status.pressStartTwice();
    hiSpeed_status.showStatus();

}

function switchHsMode(){
    hiSpeed_status.switchHsMode();
    hiSpeed_status.showStatus();
}