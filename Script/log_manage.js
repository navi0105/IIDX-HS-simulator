document.addEventListener('DOMContentLoaded', function(){
    document.getElementById('copy_log').onclick = copyLog;
    document.getElementById('show_initial_and_action_only').onclick = showInitialAndActionOnly;
}, false);

function printLogHistory(action_only){
    let all_log_text_history = ''
    if(action_only && log_text_history_action_only.length> 0 ){
        all_log_text_history += log_text_history_action_only[0]; //initial status
        all_log_text_history += '==================================\n'
        for(i=1; i<log_text_history_action_only.length; i++){
            all_log_text_history += i + '.' + log_text_history_action_only[i] + '\n';
        }
    }
    else{
        for(i=0; i<log_text_history.length; i++){
            all_log_text_history += log_text_history[i];
            all_log_text_history += '==================================\n'
        }
    }
    document.getElementById('log_text_history').value = all_log_text_history;
}

function getStatusLog(prev, curr){
    let log_text = ''
    if(prev == undefined){
        log_text += '*** ';
        log_text += curr.curr_action + ' ***\n';
        log_text += 'Hi-Speed mode:' + hs_mode2name[curr.hs_mode] + '\n';
        log_text += 'BPM:' + curr.bpm + '\n'
        log_text += 'Green Number:' +  curr.green_number + '\n'
        log_text += 'SUD+:' + curr.sudden + '\n';
        log_text += 'Lift:' + curr.lift + '\n';
        log_text += 'HS:' + curr.hs + '\n';
        if(curr.hs_mode == 1){
            log_text += 'NHS Gear:' + curr.nhs_gear + '\n'
        }
        log_text += 'Note Scroll Time:' + curr.real_time + '(ms)\n'
    }
    else{
        log_text += '*** ';
        log_text += curr.curr_action + ' ***\n';
        log_text += 'Hi-Speed mode:' + hs_mode2name[prev.hs_mode];
        if(prev.hs_mode != curr.hs_mode){
            log_text += '\n\t    =>' + hs_mode2name[curr.hs_mode];
        }
        log_text += '\n';

        log_text += 'BPM:' + prev.bpm;
        if(prev.bpm != curr.bpm){
            log_text += ' => ' + curr.bpm;
        }
        log_text += '\n';

        log_text += 'Green Number:' +  prev.green_number;
        if(prev.green_number != curr.green_number){
            log_text += ' => ' + curr.green_number;
        }
        log_text += '\n';

        log_text += 'SUD+:' + prev.sudden;
        if(prev.sudden != curr.sudden){
            log_text += ' => ' + curr.sudden;
        }
        log_text += '\n';

        log_text += 'Lift:' + prev.lift;
        if(prev.lift != curr.lift){
            log_text += ' => ' + curr.lift;
        }
        log_text += '\n';

        log_text += 'HS:' + prev.hs;
        if(prev.hs != curr.hs){
            log_text += ' => ' + curr.hs;
        }
        log_text += '\n';
        if(curr.hs_mode == 1){
            if(prev.hs_mode == 1 && (prev.nhs_gear != curr.nhs_gear)){
                log_text += 'NHS Gear:' + prev.nhs_gear + ' => ' + curr.nhs_gear;
            }
            else{              
                log_text += 'NHS Gear:' + curr.nhs_gear;  
            }            
            log_text += '\n'
        }
        log_text += 'Note Scroll Time:' + prev.real_time + '(ms)'
        if(prev.real_time != curr.real_time){
            log_text += '\n\t\t=>' + curr.real_time +'(ms)';
        }
        log_text += '\n'
    }

    return log_text;
}

function showLogs(){
    curr_log = hs_status.statusToLog();
    curr_log_text = getStatusLog(prev_status_log[prev_status_log.length - 1], curr_log);
    prev_status_log.push(curr_log);
    log_text_history.push(curr_log_text);
    if(prev_status_log.length <=1){
        log_text_history_action_only.push(curr_log_text);
    }
    else{
        log_text_history_action_only.push(curr_log.curr_action);
    }
    

    document.getElementById('status').textContent = curr_log_text;

    printLogHistory(action_only);
}

function copyLog(){
    let log = document.getElementById('log_text_history');

    log.select();
    log.setSelectionRange(0, 99999);

    navigator.clipboard.writeText(log.value);
    alert('Copied!')
}

function showInitialAndActionOnly(){
    action_only = !action_only;
    printLogHistory(action_only);
}