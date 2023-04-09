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






    static REWARD_ADS_ON_READY: string = "GlobalEvent.rewardads.onready";
    static REWARD_ADS_ON_REWARD: string = "GlobalEvent.rewardads.onreward";
    static REWARD_ADS_TIME_DELAY: string = "GlobalEvent.rewardads.timedelay";
    static SHOW_ADS_INTER_COMPLETE: string = "GlobalEvent.inter.conplete";

}

