const green_const = 174800;
const white_const = 1000;
var nhs_gear2green = {1:1200,
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

var hs_status;
var prev_status_log = [];
//var next_status_log = [];
var log_text_history = [];
var log_text_history_action_only = [];
var action_only = false

var hs_mode2name = {0: 'Classic Hi-Speed',
                    1: 'Normal Hi-Speed',
                    2: 'Floating Hi-Speed'};