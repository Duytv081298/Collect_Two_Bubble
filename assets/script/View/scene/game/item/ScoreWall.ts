// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import GlobalEvent from "../../../../component/event/GlobalEvent";
import CreateBubble from "../../../../component/pool/CreateBubble";
import MainData from "../../../../component/storage/MainData";
import Bubble from "./Bubble";

const { ccclass, property } = cc._decorator;

@ccclass
export default class ScoreWall extends cc.Component {

    @property
    score: number = 0;
    // start() {

    // }


    onBeginContact(contact, selfCollider, otherCollider) {
        contact.disabledOnce = true;
        if (otherCollider.node.group == "bubble") {
            let bubble: cc.Node = otherCollider.node;
            CreateBubble.instance().removeItem(bubble);
            GlobalEvent.instance().dispatchEvent(GlobalEvent.UPDATE_SCORE_GAME, { score: this.score });
        }

    }
    // update (dt) {}
}
