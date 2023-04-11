// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

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
    static UPDATE_SCORE_GAME: string = "GlobalEvent.UPDATE_SCORE_GAME";
    static UPDATE_MOVE_GAME: string = "GlobalEvent.UPDATE_MOVE_GAME";
    static UPDATE_GOLD_GAME: string = "GlobalEvent.UPDATE_GOLD_GAME";



    static SHOW_ANI_BOOSTER: string = "GlobalEvent.SHOW_ANI_BOOSTER";
    static CLEAR_BOOSTER: string = "GlobalEvent.CLEAR_BOOSTER";
    static UPDATE_AMOUNT_BOOSTER: string = "GlobalEvent.UPDATE_AMOUNT_BOOSTER";
    static UPDATE_UI_BOOSTER: string = "GlobalEvent.UPDATE_UI_BOOSTER";

    static SHOW_ANI_HOLE: string = "GlobalEvent.SHOW_ANI_HOLE";

    static TWEEN_PLAYER_RANKING: string = "GlobalEvent.TWEEN_PLAYER_RANKING";
    
    static SHOW_LOADING: string = "GlobalEvent.SHOW_LOADING";
    static HIDE_LOADING: string = "GlobalEvent.HIDE_LOADING";

    



    static REWARD_ADS_ON_READY: string = "GlobalEvent.rewardads.onready";
    static REWARD_ADS_ON_REWARD: string = "GlobalEvent.rewardads.onreward";
    static REWARD_ADS_TIME_DELAY: string = "GlobalEvent.rewardads.timedelay";
    static SHOW_ADS_INTER_COMPLETE: string = "GlobalEvent.inter.conplete";

}

