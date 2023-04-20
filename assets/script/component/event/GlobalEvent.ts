import BaseEvent from "./BaseEvent";
const { ccclass, property } = cc._decorator;

@ccclass
export default class GlobalEvent extends BaseEvent {

    private static event: GlobalEvent;
    static instance(): GlobalEvent {
        if (!GlobalEvent.event) {
            GlobalEvent.event = new GlobalEvent();
        }
        return GlobalEvent.event;
    }
    static SWITCH_SCENES: string = "GlobalEvent.SWITCH_SCENES";
    static START_GAME: string = "GlobalEvent.START_GAME";
    static REPLAY_GAME: string = "GlobalEvent.REPLAY_GAME";

    
    static CHECK_END_GAME: string = "GlobalEvent.CHECK_END_GAME";
    static CLEAR_ALL_BUBBLE_DIE: string = "GlobalEvent.CLEAR_ALL_BUBBLE_DIE";


    // static UPDATE_HIGHT_SCORE: string = "GlobalEvent.UPDATE_HIGHT_SCORE";
    static UPDATE_SCORE_GAME: string = "GlobalEvent.UPDATE_SCORE_GAME";
    static ANIMATION_UPDATE_MOVE: string = "GlobalEvent.ANIMATION_UPDATE_MOVE";
    static UPDATE_GOLD_GAME: string = "GlobalEvent.UPDATE_GOLD_GAME";


    static CANCEL_BUBBLE_COLLECT: string = "GlobalEvent.CANCEL_BUBBLE_COLLECT";

    static ANIMATION_PLUS_MOVE: string = "GlobalEvent.ANIMATION_PLUS_MOVE";


    static SHOW_ANI_BOOSTER: string = "GlobalEvent.SHOW_ANI_BOOSTER";
    static HIDE_ANI_BOOSTER: string = "GlobalEvent.HIDE_ANI_BOOSTER";
    static CLEAR_BOOSTER: string = "GlobalEvent.CLEAR_BOOSTER";
    static UPDATE_AMOUNT_BOOSTER: string = "GlobalEvent.UPDATE_AMOUNT_BOOSTER";
    static UPDATE_UI_BOOSTER: string = "GlobalEvent.UPDATE_UI_BOOSTER";



    static SHOW_BUBBLE_PROGRESS: string = "GlobalEvent.SHOW_BUBBLE_PROGRESS";
    static CLEAR_BUBBLE_PROGRESS: string = "GlobalEvent.CLEAR_BUBBLE_PROGRESS";

    static SHOW_ANI_HOLE: string = "GlobalEvent.SHOW_ANI_HOLE";
    static SHOW_CLAIM_GOLD_HOLE: string = "GlobalEvent.SHOW_CLAM_GOLD_HOLE";
    static SHOW_ANI_GOLD_HOLE: string = "GlobalEvent.SHOW_ANI_GOLD_HOLE";
    static HIDE_ANI_GOLD_HOLE: string = "GlobalEvent.HIDE_ANI_GOLD_HOLE";
    static UPDATE_MOVE_PROGRESS_GOLD: string = "GlobalEvent.UPDATE_MOVE_PROGRESS_GOLD";

    static TWEEN_PLAYER_RANKING: string = "GlobalEvent.TWEEN_PLAYER_RANKING";
    // static RELOAD_RANKING_HOME: string = "GlobalEvent.RELOAD_RANKING_HOME";



    static SHOW_LOADING: string = "GlobalEvent.SHOW_LOADING";
    static HIDE_LOADING: string = "GlobalEvent.HIDE_LOADING";


    static SHOW_INVITE_FRIEND_POPUP: string = "GlobalEvent.SHOW_INVITE_FRIEND_POPUP";
    static SHOW_VIDEO_REWARDS_POPUP: string = "GlobalEvent.SHOW_VIDEO_REWARDS_POPUP";
    static SHOW_NO_MOVE_POPUP: string = "GlobalEvent.SHOW_NO_MOVE_POPUP";
    static SHOW_GAME_OVER_POPUP: string = "GlobalEvent.SHOW_GAME_OVER_POPUP";
    static SHOW_SETTING_POPUP: string = "GlobalEvent.SHOW_SETTING_POPUP";


    static SHOW_HIDDEN_PRIZES: string = "GlobalEvent.SHOW_HIDDEN_PRIZES";
    static HIDDEN_PRIZES_BUBBLE_BONUS: string = "GlobalEvent.HIDDEN_PRIZES_BUBBLE_BONUS";
    static HIDDEN_PRIZES_MULTI_BUBBLES: string = "GlobalEvent.HIDDEN_PRIZES_MULTI_BUBBLES";


    static SHOW_GIFT: string = "GlobalEvent.SHOW_GIFT";
    static CHECK_SHOW_GIFT: string = "GlobalEvent.CHECK_SHOW_GIFT";



    static SHOW_SPIN: string = "GlobalEvent.SHOW_SPIN";


    static SHOW_TUTORIAL: string = "GlobalEvent.SHOW_TUTORIAL";
    static NEXT_TUTORIAL: string = "GlobalEvent.NEXT_TUTORIAL";
    static PAUSE_TUTORIAL: string = "GlobalEvent.PAUSE_TUTORIAL";
    

    static REWARD_ADS_ON_READY: string = "GlobalEvent.rewardads.onready";
    static REWARD_ADS_ON_REWARD: string = "GlobalEvent.rewardads.onreward";
    static REWARD_ADS_TIME_DELAY: string = "GlobalEvent.rewardads.timedelay";
    static SHOW_ADS_INTER_COMPLETE: string = "GlobalEvent.inter.conplete";

}

