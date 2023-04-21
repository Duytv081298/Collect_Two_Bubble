// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import { Utils } from "../../component/component/Utils";
import GlobalEvent from "../../component/event/GlobalEvent";
import CreateGoldHole from "../../component/pool/CreateGoldHole";

const { ccclass, property } = cc._decorator;

@ccclass
export default class OverlayGame extends cc.Component {
    @property(cc.Node)
    positionGold: cc.Node = null;
    @property(cc.Node)
    positionMove: cc.Node = null;
    onLoad() {
    }

    protected onEnable(): void {
        GlobalEvent.instance().addEventListener(GlobalEvent.CLAIM_GOLD, this.claimGold, this);
    }
    protected onDisable(): void {
        GlobalEvent.instance().removeEventListener(GlobalEvent.CLAIM_GOLD, this.claimGold, this);
    }

    start() {

    }

    claimGold(data) {
        // console.log(11111111111111);

        let end = data.end;
        let start = data.start;
        let amountGold = data.gold;
        // console.log(position);
        this.positionGold.active = true;
        let endPosition = null;
        if (!end) {
            endPosition = this.positionGold.position;
        } else endPosition = this.node.convertToNodeSpaceAR(end);

        if (!start) return;
        let startPosition = this.node.convertToNodeSpaceAR(start);
        let gold = CreateGoldHole.instance().createItem();
        gold.setParent(this.node);
        gold.setPosition(startPosition);
        // console.log(position);
        // console.log(pos);
        gold.stopAllActions();
        cc.tween(gold)
            .bezierTo(1,
                startPosition,
                cc.v2(Utils.randomInt(startPosition.x - 300 <= -320 ? -320 : startPosition.x - 300, startPosition.x + 300 >= 320 ? 320 : startPosition.x + 300), 
                Utils.randomInt(startPosition.y + ((endPosition.y - startPosition.y) * 0.3), startPosition.y + ((endPosition.y - startPosition.y) * 0.7))),
                cc.v2(endPosition)
            )
            .call(() => {
                GlobalEvent.instance().dispatchEvent(GlobalEvent.UPDATE_GOLD_GAME, { gold: amountGold ? amountGold : 0 });
                CreateGoldHole.instance().removeItem(gold);
            })
            .start();
    }

    animationPlusMove() {

        // this.positionMove.active = true;
        // let posEnd = this.positionMove.getPosition()
        // // console.log(posEnd);

        // let posStart = new cc.Vec2(0, 70);
        // this.iconMove.active = true;
        // this.iconMove.opacity = 0;
        // this.iconMove.stopAllActions()
        // this.iconMove.setPosition(posStart)
        // cc.tween(this.iconMove)
        //     .to(0.3, { scale: 2, opacity: 255 }, { easing: "cubicOut" })
        //     .to(0.5, { scale: 0.3 }, { easing: "cubicIn" })
        //     .call(() => {
        //         this.iconMove.setPosition(posStart)
        //         this.iconMove.active = false;
        //         GlobalEvent.instance().dispatchEvent(GlobalEvent.ANIMATION_UPDATE_MOVE, { status: true });
        //     })
        //     .start();
        // cc.tween(this.iconMove)
        //     .bezierTo(0.8,
        //         posStart,
        //         cc.v2(Utils.randomInt(posStart.x - 300 <= -320 ? -320 : posStart.x - 300, posStart.x + 300 >= 320 ? 320 : posStart.x + 300),
        //             Utils.randomInt(posStart.y + ((posEnd.y - posStart.y) * 0.3), posStart.y + ((posEnd.y - posStart.y) * 0.7))),
        //         cc.v2(posEnd)
        //     )
        //     .start();
    }
    // update (dt) {}
}
