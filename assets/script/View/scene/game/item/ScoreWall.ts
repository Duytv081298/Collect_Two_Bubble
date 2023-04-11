

import GlobalEvent from "../../../../component/event/GlobalEvent";
import CreateBubble from "../../../../component/pool/CreateBubble";

const { ccclass, property } = cc._decorator;

@ccclass
export default class ScoreWall extends cc.Component {

    @property
    score: number = 0;
    @property
    index: number = 0;
    onBeginContact(contact, selfCollider, otherCollider) {
        contact.disabledOnce = true;
        if (otherCollider.node.group == "bubble") {
            let bubble: cc.Node = otherCollider.node;
            CreateBubble.instance().removeItem(bubble);
            GlobalEvent.instance().dispatchEvent(GlobalEvent.UPDATE_SCORE_GAME, { score: this.score, status: true });
            GlobalEvent.instance().dispatchEvent(GlobalEvent.SHOW_ANI_HOLE, { index: this.index });

        }

    }
    // update (dt) {}
}
