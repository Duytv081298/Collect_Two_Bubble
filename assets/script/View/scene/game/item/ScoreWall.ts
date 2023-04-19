

import SoundManager from "../../../../component/component/SoundManager";
import GlobalEvent from "../../../../component/event/GlobalEvent";
import CreateBubble from "../../../../component/pool/CreateBubble";
import CreateScoreBubble from "../../../../component/pool/CreateScoreBubble";
import MainData from "../../../../component/storage/MainData";
import Bubble from "./Bubble";
import ScoreBubble from './ScoreBubble';

const { ccclass, property } = cc._decorator;

@ccclass
export default class ScoreWall extends cc.Component {

    @property
    score: number = 0;
    @property
    index: number = 0;

    @property(cc.Node)
    parentScoreBubble: cc.Node = null;
    onBeginContact(contact, selfCollider, otherCollider) {
        contact.disabledOnce = true;
        if (this.index == 999) {
            let bubble: cc.Node = otherCollider.node;
            SoundManager.instance().playEffect(bubble.name);
            return;
        }
        if (otherCollider.node.group == "bubble") {
            MainData.instance().realityBubble++;

            let bubble: cc.Node = otherCollider.node;
            // let parent = bubble.parent;
            let coefficients = bubble.getComponent(Bubble).coefficients;

            CreateBubble.instance().removeItem(bubble);


            GlobalEvent.instance().dispatchEvent(GlobalEvent.UPDATE_SCORE_GAME, { score: this.score * coefficients, status: true });
            GlobalEvent.instance().dispatchEvent(GlobalEvent.SHOW_ANI_HOLE, { index: this.index }); //show ani the hien bubble roi trung hole
            GlobalEvent.instance().dispatchEvent(GlobalEvent.SHOW_ANI_GOLD_HOLE); // show ani the hien co the duoc tang gold


            let score = CreateScoreBubble.instance().createItem();
            score.setParent(this.parentScoreBubble);
            score.getComponent(ScoreBubble).setUp(this.score * coefficients, this.index);

            GlobalEvent.instance().dispatchEvent(GlobalEvent.HIDE_ANI_GOLD_HOLE);

            if (this.index == MainData.instance().indexHoleCoin) SoundManager.instance().playEffect("Bubble_ho_coin");
            else SoundManager.instance().playEffect("sfx_bubble_bounce");

            // console.log("parent.childrenCount: " + parent.childrenCount);
            // if (parent.childrenCount == 0)
            //     GlobalEvent.instance().dispatchEvent(GlobalEvent.CLEAR_ALL_BUBBLE_DIE);
        }

    }
    // update (dt) {}
}
