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
export default class NewClass extends cc.Component {
    @property(cc.Node)
    positionGold: cc.Node = null;
    @property(cc.Node)
    positionMove: cc.Node = null;
    @property(cc.Node)
    iconMove: cc.Node = null;

    hiddenPrizes: cc.Node = null
    onLoad() {
        this.preLoadHiddenPrizes();
    }

    protected onEnable(): void {
        GlobalEvent.instance().addEventListener(GlobalEvent.SHOW_HIDDEN_PRIZES, this.loadHiddenPrizes, this);
        GlobalEvent.instance().addEventListener(GlobalEvent.SHOW_CLAIM_GOLD_HOLE, this.claimGoldHole, this);
        GlobalEvent.instance().addEventListener(GlobalEvent.ANIMATION_PLUS_MOVE, this.animationPlusMove, this);
        for (let i = 0; i < this.node.children.length; i++) {
            this.node.children[i].active = false;
        }
    }
    protected onDisable(): void {

        GlobalEvent.instance().removeEventListener(GlobalEvent.SHOW_HIDDEN_PRIZES, this.loadHiddenPrizes, this);
        GlobalEvent.instance().removeEventListener(GlobalEvent.SHOW_CLAIM_GOLD_HOLE, this.claimGoldHole, this);
        GlobalEvent.instance().removeEventListener(GlobalEvent.ANIMATION_PLUS_MOVE, this.animationPlusMove, this);
    }

    start() {

    }
    preLoadHiddenPrizes() {
        cc.resources.preload("prefab/Hidden prizes/Hidden prizes", cc.Prefab, (err) => {
            this.loadHiddenPrizes(null);
        });
    }
    loadHiddenPrizes(data: any = null) {
        if (this.hiddenPrizes) {
            GlobalEvent.instance().removeEventListener(GlobalEvent.SHOW_HIDDEN_PRIZES, this.loadHiddenPrizes, this);
            return;
        }
        // console.log("loadHiddenPrizes");
        cc.resources.load("prefab/Hidden prizes/Hidden prizes", cc.Prefab, (err, prefab: cc.Prefab) => {
            if (!err) {
                if (this.hiddenPrizes == null) {
                    this.hiddenPrizes = cc.instantiate(prefab);
                    this.hiddenPrizes.setParent(this.node)
                    this.hiddenPrizes.active = true;
                    // if (sp) GlobalEvent.instance().dispatchEvent(GlobalEvent.SHOW_HIDDEN_PRIZES, { spfPlayer: sp });
                }
            }
        });
    }

    claimGoldHole(data) {
        let position = data.position;
        // console.log(position);
        this.positionGold.active = true;
        let endPosition = this.positionGold.position;
        if (!position) return;
        let pos = this.node.convertToNodeSpaceAR(position);
        let gold = CreateGoldHole.instance().createItem();
        gold.setParent(this.node);
        gold.setPosition(pos);
        // console.log(position);
        // console.log(pos);
        gold.stopAllActions();
        cc.tween(gold)
            .bezierTo(1,
                pos,
                cc.v2(Utils.randomInt(pos.x - 300 <= -320 ? -320 : pos.x - 300, pos.x + 300 >= 320 ? 320 : pos.x + 300), Utils.randomInt(pos.y + ((endPosition.y - pos.y) * 0.3), position.y + ((endPosition.y - pos.y) * 0.7))),
                cc.v2(endPosition)
            )
            .call(() => {
                GlobalEvent.instance().dispatchEvent(GlobalEvent.UPDATE_GOLD_GAME, { gold: 1 });
                CreateGoldHole.instance().removeItem(gold);
            })
            .start();
    }

    animationPlusMove() {
        
        this.positionMove.active = true;
        let posEnd = this.positionMove.getPosition()
        // console.log(posEnd);
        
        let posStart = new cc.Vec2(0, 70);
        this.iconMove.active = true;
        this.iconMove.opacity = 0;
        this.iconMove.stopAllActions()
        this.iconMove.setPosition(posStart)
        cc.tween(this.iconMove)
            .to(0.3, { scale: 2, opacity: 255 }, { easing: "cubicOut" })
            .to(0.5, { scale: 0.3 }, { easing: "cubicIn" })
            .call(() => {
                this.iconMove.setPosition(posStart)
                this.iconMove.active = false;
                GlobalEvent.instance().dispatchEvent(GlobalEvent.UPDATE_MOVE_GAME, { move: 1 });
            })
            .start();
        cc.tween(this.iconMove)
            .bezierTo(0.8,
                posStart,
                cc.v2(Utils.randomInt(posStart.x - 300 <= -320 ? -320 : posStart.x - 300, posStart.x + 300 >= 320 ? 320 : posStart.x + 300),
                    Utils.randomInt(posStart.y + ((posEnd.y - posStart.y) * 0.3), posStart.y + ((posEnd.y - posStart.y) * 0.7))),
                cc.v2(posEnd)
            )
            .start();
    }
    // update (dt) {}
}
