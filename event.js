var hiSpeed_status;

document.addEventListener('DOMContentLoaded', function(){
    //checkbox event
    document.getElementById('fhs_start').onchange = fhsStartCheck;
    document.getElementById('using_sud').onchange = sudEnableCheck;
    document.getElementById('using_lift').onchange = liftEnableCheck;
    document.getElementById('using_chs').onchange = chsEnableCheck;
    
    //input event
    document.getElementById('start_green_number').onchange = hsCalculate;
    document.getElementById('hs').onchange = greenNumberCalculate;
    document.getElementById('bpm').onchange = bpmChange;

    document.getElementById('sudden').onchange = suddenChange;
    document.getElementById('lift').onchange = liftChange;

    document.getElementById('chs_gear').onchange = chsChange;
    document.getElementById('nhs_gear').onchange = nhsChange;

    //start simulation
    document.getElementById('start_btn').onclick = startSimulation;

    //action list
    document.getElementById('bpmChange_action').onclick = bpmModify;
    document.getElementById('keyPress_action').onclick = pressKey;
    document.getElementById('scratchPush_action').onclick = scratchPush;
    document.getElementById('pressStartTwice_action').onclick = pressStartTwice;
    document.getElementById('switchHsMode_action').onclick = switchHsMode;
}, false);

function fhsStartCheck(){
    let fhs_start = document.getElementById('fhs_start');
    let start_green_number = document.getElementById('start_green_number');
    let hs = document.getElementById('hs');

    let chs_gear = document.getElementById('chs_gear');
    let nhs_gear = document.getElementById('nhs_gear');

    if(fhs_start.checked){
        start_green_number.disabled = false;
        hs.disabled = false;
        chs_gear.disabled = true;
        nhs_gear.disabled = true;
        hsCalculate();
    }
    else{
        start_green_number.disabled = true;
        hs.disabled = true;
        chsEnableCheck();
    }
}

function sudEnableCheck(){
    let using_sud = document.getElementById('using_sud').checked;
    if(using_sud){
        document.getElementById('sudden').disabled = false;

        let sudden = document.getElementById('sudden').value;
        if(sudden == ""){
            document.getElementById('sudden').value = 124;
        }
        greenNumberCalculate();
    }
    else{
        document.getElementById('sudden').disabled = true;
        greenNumberCalculate();
    }
}

function liftEnableCheck(){
    let using_lift = document.getElementById('using_lift').checked;
    if(using_lift){
        document.getElementById('lift').disabled = false;

        let lift = document.getElementById('lift').value;
        if(lift == ""){
            document.getElementById('lift').value = 124;
        }
        greenNumberCalculate();
    }
    else{
        document.getElementById('lift').disabled = true;
        greenNumberCalculate();
    }
}

function chsEnableCheck(){
    let fhs_start = document.getElementById('fhs_start');
    let chs_checkbox = document.getElementById('using_chs');
    let chs_gear = document.getElementById('chs_gear');
    let nhs_gear = document.getElementById('nhs_gear');
    if(!fhs_start.checked){
        if(chs_checkbox.checked){
            chs_gear.disabled = false;
            nhs_gear.disabled = true;
            chsChange();
        }
        else{
            chs_gear.disabled = true;
            nhs_gear.disabled = false;
            nhsChange();
        }
    }    
}

function startSimulation(){
    let fhs_start = document.getElementById('fhs_start').checked;
    let using_sud = document.getElementById('using_sud').checked;
    let using_lift = document.getElementById('using_lift').checked;
    let using_chs = document.getElementById('using_chs').checked

    let start_green_number = Number(document.getElementById('start_green_number').value);
    let sudden = getSudden();
    let lift = getLift();
    let bpm = Number(document.getElementById('bpm').value);
    let hs = Number(document.getElementById('hs').value);
    let nhs_gear = Number(document.getElementById('nhs_gear').value);

    let curr_hsmode;
    if(fhs_start){
        curr_hsmode = 2;
    }
    else if(!using_chs){
        curr_hsmode = 1;
    }
    else{
        curr_hsmode = 0;
    }

    let vision_mode = Number(using_sud) + 2*Number(using_lift);
    
    hiSpeed_status = new hiSpeedStatus(start_green_number, sudden, lift, bpm, hs, nhs_gear, curr_hsmode, vision_mode, using_chs);
    hiSpeed_status.showStatus()
}

function getSudden(){
    let using_sud = document.getElementById('using_sud').checked;
    if(using_sud){
        return document.getElementById('sudden').value != "" ? Number(document.getElementById('sudden').value) : 0;
    }

    return Number(0);
}

function getLift(){
    let using_lift = document.getElementById('using_lift').checked;
    if(using_lift){
        return document.getElementById('lift').value != "" ? Number(document.getElementById('lift').value) : 0;
    }

    return 0;
}



function hsCalculate(){
    let green_number = Number(document.getElementById('start_green_number').value);
    let sudden = getSudden();
    let lift = getLift();
    let bpm = Number(document.getElementById('bpm').value);

    if(green_number!="" && bpm !=""){
        let hs = (green_const * ((white_const - (sudden + lift)) / white_const) / (bpm * green_number)).toFixed(2);
        if(hs<0.5){
            document.getElementById('hs').value = 0.5;
            greenNumberCalculate();
        }
        else if(hs > 10.0){
            document.getElementById('hs').value = 10.0;
            greenNumberCalculate();
        }
        else{
            document.getElementById('hs').value = hs;
        }
    }

}

function greenNumberCalculate(){
    let fhs_start = document.getElementById('fhs_start').checked;
    let using_chs = document.getElementById('using_chs').checked;

    if(fhs_start == false && using_chs == false){
        let nhs_gear = document.getElementById('nhs_gear').value;
        let sudden = getSudden();
        let lift = getLift();
        document.getElementById('start_green_number').value = (nhs_gear2green[nhs_gear] * (white_const - (sudden + lift)) / white_const).toFixed(0);
    }
    else{
        let hs = document.getElementById('hs').value;
        let sudden = getSudden();
        let lift = getLift();
        let bpm = document.getElementById('bpm').value;

        if(hs!="" && bpm !=""){
            if(sudden + lift >= 999){
                document.getElementById('start_green_number').value = 0;
            }
            else{
                document.getElementById('start_green_number').value = (green_const * ((white_const - (sudden + lift)) / white_const) / (bpm * hs)).toFixed(0);            
            }        
        }
    }    
}

function bpmChange(){
    let fhs_start = document.getElementById('fhs_start').checked;
    if(fhs_start){
        hsCalculate();
    }
    else{
        greenNumberCalculate();
    }
}

function suddenChange(){
    let fhs_start = document.getElementById('fhs_start').checked;
    let using_lift = document.getElementById('using_lift').checked;
    if(using_lift){
        let sudden = getSudden();
        let lift = getLift();        
        
        if(sudden + lift >999){
            sudden = 999 - lift;
        }
        if(sudden < 41){
            sudden = 41;
        }
        document.getElementById('sudden').value = sudden;
    }

    if(fhs_start){
        hsCalculate();        
    }
    else{
        greenNumberCalculate();
    }
}

function liftChange(){
    let fhs_start = document.getElementById('fhs_start').checked;
    let using_sud = document.getElementById('using_sud').checked;
    if(using_sud){
        let sudden = getSudden();
        let lift = getLift();
        
        if(sudden + lift >999){
            lift = 999 - sudden;
        }
        if(lift > 829){
            lift = 829;
        }
        document.getElementById('lift').value = lift;
    }

    if(fhs_start){
        hsCalculate();
    }
    else{
        greenNumberCalculate();
    }
}

function chsChange(){
    let chs_gear = document.getElementById('chs_gear').value;

    document.getElementById('hs').value = chs_gear;
    greenNumberCalculate();
}

function nhsChange(){
    greenNumberCalculate();
    hsCalculate();
}

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