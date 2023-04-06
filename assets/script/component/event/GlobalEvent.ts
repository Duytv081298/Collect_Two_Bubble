// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import BaseEvent from "./BaseEvent";
const {ccclass, property} = cc._decorator;

@ccclass
export default class GlobalEvent extends BaseEvent {

    private static event: GlobalEvent;
    static instance(): GlobalEvent {
        if (!GlobalEvent.event) {
            GlobalEvent.event = new GlobalEvent();
        }
        return GlobalEvent.event;
    }
    static UPDATE_SCORE_GAME:string = "GlobalEvent.UPDATE_SCORE_GAME";
    static UPDATE_BEST_SCORE_GAME:string = "GlobalEvent.UPDATE_BEST_SCORE_GAME";
    static UPDATE_BEST_SCORE_TODAY_GAME:string = "GlobalEvent.UPDATE_BEST_SCORE_TODAY_GAME";
    static UPDATE_SCORE_BONUS_GAME:string = "GlobalEvent.UPDATE_SCORE_BONUS_GAME";
    static UPDATE_TOTAL_MOVE_GAME:string = "GlobalEvent.UPDATE_TOTAL_MOVE_GAME";
    static UPDATE_PLUS_MOVE_GAME:string = "GlobalEvent.UPDATE_PLUS_MOVE_GAME";

}

