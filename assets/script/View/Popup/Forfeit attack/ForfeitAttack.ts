// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import GlobalEvent from "../../../component/event/GlobalEvent";

const { ccclass, property } = cc._decorator;

@ccclass
export default class ForfeitAttack extends cc.Component {


    onHandlerAttack() {
        GlobalEvent.instance().dispatchEvent(GlobalEvent.SHOW_ATTACK);
        this.hide();
    }
    onHandlerClose() {
        this.hide();
        // game.emit("NEXT_USER_SPIN");
    }
    hide() {
        this.node.active = false;
    }
}
