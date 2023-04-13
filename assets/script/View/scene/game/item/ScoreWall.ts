

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
        if (otherCollider.node.group == "bubble") {
            MainData.instance().realityBubble++;
            let bubble: cc.Node = otherCollider.node;

            let coefficients = bubble.getComponent(Bubble).coefficients;
            GlobalEvent.instance().dispatchEvent(GlobalEvent.UPDATE_SCORE_GAME, { score: this.score * coefficients, status: true });
            GlobalEvent.instance().dispatchEvent(GlobalEvent.SHOW_ANI_HOLE, { index: this.index });
            GlobalEvent.instance().dispatchEvent(GlobalEvent.SHOW_ANI_COIN_HOLE);

            let score = CreateScoreBubble.instance().createItem();
            score.setParent(this.parentScoreBubble);
            score.getComponent(ScoreBubble).setUp(this.score * coefficients, this.index);

            if (MainData.instance().estimateBubble <= MainData.instance().realityBubble) {
                GlobalEvent.instance().dispatchEvent(GlobalEvent.HIDE_ANI_COIN_HOLE);
            }
            if (MainData.instance().indexHoleCoin == this.index) {
                GlobalEvent.instance().dispatchEvent(GlobalEvent.UPDATE_GOLD_GAME, { gold: 1 });
            }

            CreateBubble.instance().removeItem(bubble);
        }

    }
    // update (dt) {}
}
