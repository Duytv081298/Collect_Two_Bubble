// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import MainData from "../../../../component/storage/MainData";
import CreateBubble from "../CreateBubble";
import Bubble from "./Bubble";

const { ccclass, property } = cc._decorator;

@ccclass
export default class ScoreWall extends cc.Component {

    @property
    score: number = 0;
    // start() {

    // }


    onBeginContact(contact, selfCollider, otherCollider) {
        // let tag = otherCollider.
        // console.log();
        contact.disabledOnce = true;
        let scoreUser = MainData.instance().score;
        if (otherCollider.node.group == "bubble") {
            // console.log("tu" );
            
            let bubble: cc.Node = otherCollider.node;
            CreateBubble.instance().removeItem(bubble);
            cc.game.emit("UPDATE_SCORE", this.score)
            MainData.instance().score += this.score;
        }

    }
    // update (dt) {}
}
