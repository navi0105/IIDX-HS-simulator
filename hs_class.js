const green_const = 174800;
const white_const = 1000;
let nhs_gear2green = {1:1200,
    2:1000,
    3:800,
    4:700,
    5:650,
    6:600,
    7:550,
    8:500,
    9:480,
    10:460,
    11:440,
    12:420,
    13:400,
    14:380,
    15:360,
    16:340,
    17:320,
    18:300,
    19:280,
    20:260};

//Calculate Formula
    //174800*(1000-白数字)/1000=BPM*HS*緑数字
    //HS=174800 * ((1000-白数字)/1000) / (BPM*緑数字)
class hiSpeedStatus{
    constructor(start_green_number, sudden, lift, bpm, hs, nhs_gear, curr_hsmode, vision_mode, using_chs){
        //sudden_enable: check if using sud+
        //lift_enable: check if using lift
        this.vision_mode = vision_mode;

        switch(vision_mode){
            //no SUD+, no Lift
            case 0:
                this.sudden_enable = false;
                this.lift_enable = false;
                break;
            //SUD+ only
            case 1:
                this.sudden_enable = true;
                this.lift_enable = false;
                break;
            //Lift only
            case 2:
                this.sudden_enable = false;
                this.lift_enable = true;           
                break;
            //Both SUD+ and Lift are enable
            case 3:
                this.sudden_enable = true;
                this.lift_enable = true;
                break;
        }

        //chs_enable: check if using CHS mode instead of NHS mode
            //if chs_enable = false, that means there is using NHS mode
        this.chs_enable = using_chs;
        switch(curr_hsmode){
            case 0: // CHS mode
                this.green_number = green_const * ((white_const - (sudden + lift)) / white_const) / (bpm * hs);
                this.hs = hs
                this.nhs_gear = -1;
                this.default_green_number = -1;
                this.default_hs = hs;
                break;
            case 1: // NHS mode
                this.green_number = nhs_gear2green[nhs_gear] * (white_const - (sudden + lift)) / white_const;
                this.hs = green_const * ((white_const - (sudden + lift)) / white_const) / (bpm * this.green_number)
                this.nhs_gear = nhs_gear;
                this.default_green_number = -1;
                this.default_hs = hs;
                break;
            case 2: // FHS mode
                this.green_number = start_green_number;
                this.hs = green_const * ((white_const - (sudden + lift)) / white_const) / (bpm * start_green_number)
                this.nhs_gear = -1;
                this.default_green_number = start_green_number;
                if(vision_mode == 0 || vision_mode == 2){                    
                    this.default_green_number_no_sud = start_green_number;
                }
                else if(vision_mode == 1 || vision_mode == 3){
                    this.default_green_number_no_sud = green_const / (bpm * start_green_number)
                }
                
            default:break;
        }
        
        //default_green_number:
        //default_raw_green_number:
        //sudden: current sudden value
        //default_sudden: the default value of sudden
            //if never used sudden before, the default value will be 124
            //value will be saved when closing sudden(start*2)
            //will affected by variation of lift
                //e.g. after sudden closed, if lift value += N, default_sudden -= N
        //lift: current lift value
        //bpm: current BPM of song
        //this.default_raw_green_number = 
        this.sudden = sudden;
        this.default_sudden = sudden;
        this.lift = lift;
        this.bpm = bpm;


        //hs_mode: current Hi-speed mode
        //0 = CHS, 1 = NHS, 2 = FHS
        this.hs_mode = curr_hsmode;

        //this.rt = this.green_number * 100 / 60;

        this.curr_action = 'Simulation Start';
    }

    //Calculate Formula
    //Green Constant = 174800
    //White COnstant = 1000
    //174800 * (1000-白数字)/1000=BPM*HS*緑数字
    hsCalculate(){        
        let hs = green_const * ((white_const - (this.sudden + this.lift)) / white_const) / (this.bpm * this.green_number);
        return hs;
    }
    greenNumberCalculate(nhs_adjust=false){
        //緑数字 = 174800 * ((1000-白数字)/1000) / (BPM*HS)
        let green_number;
        if(this.hs_mode == 1 && nhs_adjust == true){
            green_number = nhs_gear2green[this.nhs_gear] * (white_const - (this.sudden + this.lift)) / white_const;
        }
        else{
            green_number = green_const * ((white_const - (this.sudden + this.lift)) / white_const) / (this.bpm * this.hs);
        }
        return green_number;
    }
    
    getGreenNumberWithNoSud(){
        let raw_green_number = this.green_number * white_const / (white_const - (this.sudden + this.lift));
        return raw_green_number;
    }

//function getKeyByValue(object, value) {
//    return Number(Object.keys(object).find(key => object[key] === value));
//}
    getClosetGear(green_number_with_no_sud){
        let closetNhs = Object.values(nhs_gear2green).reduce((a, b) => {
            return Math.abs(b - green_number_with_no_sud) < Math.abs(a - green_number_with_no_sud)? b : a;
        })
        return Number(Object.keys(nhs_gear2green).find(key => nhs_gear2green[key] === closetNhs));
    }

    //単位を ms に変換する場合は 100 * 緑数字/60 で得られる
    greenNumberToRealTime(){
        let rt = this.green_number * 100 / 60;
        return rt
    }


    statusToLog(){
        let log = {};
        log.curr_action = this.curr_action;
        log.hs_mode = this.hs_mode;
        log.bpm = this.bpm;
        log.green_number = (Number(this.green_number)).toFixed(0);
        log.sudden = this.sudden;
        log.lift = this.lift;
        log.hs = this.hs.toFixed(2);
        log.nhs_gear = this.hs_mode == 1? this.nhs_gear : -1;
        log.real_time = (this.greenNumberToRealTime()).toFixed(2);

        return log;
    }

    bpmChange(new_bpm){            
            this.green_number = this.green_number * this.bpm / new_bpm;
            this.bpm = new_bpm;

            this.curr_action = 'BPM Becomes ' + new_bpm;
    }

    //Start + white/black key
    //CHS mode: 
        //1 white = HS-0.25
        //1 black = HS+0.25
        //Green Number recalculate
    //NHS mode:
        //1 white = NHS gear-1
        //1 black = NHS gear+1
        //Green Number Recalculate
        //HS recalculate
    //FHS mode:
        //1 white = HS-0.50
        //1 black = HS+0.50
        //Green Number Recalculate
    //key_type: -1=white key; 1=black key
    pressKey(key_type, key_count, times){
        this.curr_action = 'Press ' + key_type==1?'Black' : 'White' + ' key * ' + key_count + ' for ' + times + 'time(s)';

        switch(this.hs_mode){
            case 0://CHS
                for(let i=0; i<key_count * times; i++){
                    if(key_type == -1){
                        if(this.hs>1.0 && this.hs <=2.0){
                            this.hs -= 0.5;
                        }
                        else if(this.hs>2.0){
                            this.hs -= 0.25;
                        }
                    }
                    else if(key_type == 1){
                        if(this.hs>=1.0 && this.hs<2.0){
                            this.hs +=  0.5;
                        }
                        else if(this.hs<4.0){
                            this.hs += 0.25
                        }
                    }
                }
                this.green_number = this.greenNumberCalculate();
                break;
            case 1://NHS
                let next_nhs_gear = this.nhs_gear + (key_type * key_count * times);
                if(next_nhs_gear<1){
                    this.nhs_gear = 1;
                }
                else if(next_nhs_gear>20){
                    this.nhs_gear = 20;
                }
                else{
                    this.nhs_gear = next_nhs_gear;
                }
                this.green_number = this.greenNumberCalculate(true);
                this.hs = this.hsCalculate()
                break;
            case 2://FHS
                let next_hs = this.hs + (key_type * 0.5 * key_count * times);
                if(next_hs<0.5){
                    this.hs = 0.5;
                }
                else if(next_hs > 10){
                    this.hs = 10.0;
                }
                else{
                    this.hs = next_hs;
                }
                this.green_number = this.greenNumberCalculate()

                if(this.vision_mode == 3 && this.sudden_enable == false){
                    this.default_hs = this.hs;
                    this.default_green_number_no_sud = this.green_number;
                }
                break;
            default:break;
        }
    }

    //Start + Effect(to change HS mode)
    //FHS to CHS
        //HS adjust to the nearest HS in CHS mode
            //i.e. in FHS mode, HS 2.65 => FHS to CHS => the nearest HS=2.75 => HS adjust to 2.5
        //Green Number will be recalculated
        //SUD+/Lift keep
    //FHS to NHS
        //Get the corresponding NHS gear value according to the Green Number of FHS mode
        //Green Number will be recalculated
        //SUD+/Lift keep
    //CHS/NHS to FHS
        //Green number keep
        //SUD+/Lift keep
    switchHsMode(){
        this.curr_action = 'Switch Hi-Speed Mode to' + this.hs_mode == 2? 'FHS mode' : (this.chs_enable ? 'CHS mode': 'NHS mode')

        if(this.hs_mode==2){
            if(this.chs_enable){
                this.hs_mode = 0;
                if(this.hs>4.0){
                    this.hs = 4.0;
                    this.green_number = this.greenNumberCalculate();
                }
                else if(this.hs < 1){
                    this.hs = 1.0;
                    this.green_number = this.greenNumberCalculate();
                }
                else{
                    this.hs = Math.round(this.hs / 0.25) * 0.25;
                    this.green_number = this.greenNumberCalculate();
                }
            }
            else{
                this.hs_mode = 1;
                //get raw green number(white number sum = 0)
                let green_number_with_no_sud = this.getGreenNumberWithNoSud();
                this.nhs_gear = this.getClosetGear(green_number_with_no_sud);
                this.green_number = this.greenNumberCalculate(true);
                this.hs = this.hsCalculate();
            }
        }
        else{
            this.hs_mode = 2;
            this.default_green_number = this.green_number;
            this.default_hs = this.hs;
        }
    }

    //Start + Scratch Push
    //SUD+ enable
        //Varying degrees of change to White number
            //
        //FHS mode
            //Green Number will be reset to the value when switching from NHS/CHS mode to FHS mode
            //HS recalculate since white number changes(if have)
        //NHS/CHS mode
            //HS / NHS gear keep
            //Green Number needs to be recalculated because of the change in White Number(if have)
    //SUD+ disable, Lift enable
        //Varying degrees of change to White number
        //HS / NHS gear keep
        //Green Number needs to be recalculated because of the change in White Number(if have)
    //SUD+ disable, Lift disable
        //IDK
    //base_on_green_or_white = decide the amount of movement is based on green/white number
        // 0=base on white(default), 1=base on green
    scratchPush(movement){
        // CHS/NHS mode
        if(movement == undefined){
            movement = 5;
        }
        let scratch_direction = movement >= 0? 'clockwise':'counterclockwise'
        this.curr_action = 'Turn Scratch ' + scratch_direction + '(Movement:' + movement + ')';        

        if(this.hs_mode != 2){
            switch(this.vision_mode){
                case 0:
                    //Change nothing
                    break;
                case 1:
                    if(this.sudden_enable){
                        if(this.sudden + movement < 41){
                            this.sudden = 41;
                        }
                        else if(this.sudden + movement > 999){
                            this.sudden =  999
                        }
                        else{
                            this.sudden += movement;
                        }
                        this.green_number = this.greenNumberCalculate();
                    }
                    else{
                        //Do nothing
                    }
                    break;
                //Lift only
                case 2:
                    if(this.lift + movement < 0){
                        this.lift = 0;
                    }
                    else if(this.lift + movement>829){
                        this.lift = 829;
                    }
                    else{
                        this.lift += movement;
                    }
                    this.green_number = this.greenNumberCalculate();
                    break;
                case 3:
                    if(this.sudden_enable){
                        if(this.sudden + movement < 41){
                            this.sudden = 41;
                        }
                        else if(this.sudden + movement > 999){
                            this.sudden =  999
                        }
                        else{
                            this.sudden += movement;
                        }
                        this.green_number = this.greenNumberCalculate();
                        
                    }
                    else{
                        if(this.lift + movement < 0){
                            this.lift = 0;
                            movement = Math.abs(this.lift + movement);
                        }
                        else if(this.lift + movement>829){
                            movement = 829 - this.lift;
                            this.lift = 829;
                        }
                        else{
                            this.lift += movement;
                        }
                                                
                        movement *= -1;
                        if(this.default_sudden + movement < 41){
                            this.default_sudden = 41;
                        }
                        else{
                            this.default_sudden += movement;
                        }
                        this.green_number = this.greenNumberCalculate();
                    }
                    break;
                default:
                    break;
            }
        }
        // FHS mode
        else{
            switch(this.vision_mode){
                case 0:
                    this.green_number += movement;
                    this.default_green_number = this.green_number;
                    this.hsCalculate();
                    break;
                case 1:
                    if(this.sudden_enable){
                        this.green_number = this.default_green_number;
                        if(this.sudden + movement < 41){
                            this.sudden = 41;
                        }
                        else{
                            this.sudden += movement;
                        }
                        this.hs = this.hsCalculate();
                    }
                    else{
                        this.green_number += movement;
                        this.default_green_number_no_sud = this.green_number
                        this.hs = this.hsCalculate();
                    }
                    break;
                case 2:
                    this.green_number = this.default_green_number;
                    if(this.lift + movement < 0){
                        this.lift = 0;
                    }
                    else if(this.lift + movement>829){
                        this.lift = 829;
                    }
                    else{
                        this.lift += movement;
                    }
                    this.hs = this.hsCalculate();
                    break;
                case 3:
                    if(this.sudden_enable){
                        this.green_number = this.default_green_number;
                        if(this.sudden + movement < 41){
                            this.sudden = 41;
                        }
                        else{
                            this.sudden += movement;
                        }
                        this.hs = this.hsCalculate();
                    }
                    else{                        
                        if(this.lift + movement < 0){
                            this.lift = 0;
                            movement = Math.abs(this.lift + movement);
                        }
                        else if(this.lift + movement>829){
                            movement = 829 - this.lift;
                            this.lift = 829;
                        }
                        else{
                            this.lift += movement;
                        }
                        
                        movement *= -1;
                        if(this.default_sudden + movement < 41){
                            this.default_sudden = 41;
                        }
                        else{
                            this.default_sudden += movement;
                        }
                        this.green_number = this.greenNumberCalculate();
                    }
                    break;
                default:
                    break;
            }
        }

    }

    //press start button twice quickly to open/close SUD+
    //SUD+ enable => disable
        //SUD+ = 0
        //Green Number Recalculate
    //SUD+ disable => enable
        //SUD+ value = SUD+ value before SUD+ closed
        //Green Number Recalculate
    pressStartTwice(){
        this.curr_action = 'Press Start Key Twice';
        switch(this.vision_mode){
            //no SUD+ nor Lift
            case 0:
                this.vision_mode = 1; //SUD+ on, Lift off
                this.sudden_enable = true;
                this.sudden = this.default_sudden;
                if(this.hs_mode != 2){
                    this.green_number = this.greenNumberCalculate();
                }
                else{
                    //Green Number Keep
                    //HS recalculate
                    this.hs = this.hsCalculate();
                }
                break;
            case 1:
                if(this.sudden_enable){
                    this.sudden_enable = false;
                    this.default_sudden = this.sudden;
                    this.sudden = 0;
                    if(this.hs_mode != 2){
                        this.green_number = this.greenNumberCalculate();
                    }
                    else{
                        //待測
                        this.green_number = this.greenNumberCalculate();
                    }
                }
                else{
                    this.sudden_enable = true;
                    this.sudden = this.default_sudden;
                    if(this.hs_mode != 2){
                        this.green_number = this.greenNumberCalculate();
                    }
                    else{
                        this.green_number = this.default_green_number;
                        this.hs = this.hsCalculate();
                    }
                }
                break;
            case 2:
                this.vision_mode = 3; //SUD+ on, Lift off
                this.sudden_enable = true;
                this.sudden = this.default_sudden;
                if(this.hs_mode != 2){
                    this.green_number = this.greenNumberCalculate();
                }
                else{
                    //Green Number Keep
                    //HS recalculate
                    this.hs = this.hsCalculate();
                }
                break;
            case 3:
                if(this.sudden_enable){
                    if(this.hs_mode != 2){
                        this.sudden_enable = false;
                        this.default_sudden = this.sudden;
                        this.sudden = 0;
                        this.green_number = this.greenNumberCalculate();
                    }
                    else{
                        this.green_number = this.default_green_number;
                        this.hs = this.hsCalculate();

                        this.sudden_enable = false;
                        this.default_sudden = this.sudden;
                        this.sudden = 0;
                        this.green_number = this.greenNumberCalculate();
                    }
                }
                else{
                    this.sudden_enable = true;
                    this.sudden = this.default_sudden;
                    if(this.hs_mode != 2){
                        this.green_number = this.greenNumberCalculate();
                    }
                    else{
                        this.green_number = this.default_green_number;
                        this.hs = this.hsCalculate();
                    }
                }
                break;
            default:
                break;
        }

        
    }
}