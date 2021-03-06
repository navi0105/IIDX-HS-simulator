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
    hs_status.bpmChange(next_BPM)
    showLogs();
}

function pressKey(){
    let key_type = Number(document.getElementById('key_type').value);
    let key_count = Number(document.getElementById('key_count').value);
    let press_times = Number(document.getElementById('press_times').value);
    hs_status.pressKey(key_type, key_count, press_times);
    showLogs();
}

function scratchPush(){
    let scr_movement = document.getElementById('scr_movement').value == ""? undefined: Number(document.getElementById('scr_movement').value);
    hs_status.scratchPush(scr_movement);
    showLogs();
}

function pressStartTwice(){
    hs_status.pressStartTwice();    
    showLogs();
}

function switchHsMode(){
    hs_status.switchHsMode();
    showLogs();
}