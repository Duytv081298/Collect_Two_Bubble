
// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import { Utils } from "../../../component/component/Utils";
import { HIDDEN_PRIZES } from "../../../component/constant/constant";
import GlobalEvent from "../../../component/event/GlobalEvent";

const { ccclass, property } = cc._decorator;
@ccclass
export default class HiddenPrizes extends cc.Component {

    @property(cc.SpriteFrame)
    defaultAvatar: cc.SpriteFrame = null;


    @property(cc.Node)
    player: cc.Node = null;

    @property(cc.Sprite)
    playerSp: cc.Sprite = null;

    @property(cc.Node)
    plusMove: cc.Node = null;

    @property(cc.Sprite)
    giftSp: cc.Sprite = null;

    @property(cc.SpriteFrame)
    spf_Multi_Bubbles_X2: cc.SpriteFrame = null;

    @property(cc.SpriteFrame)
    spf_Multi_Bubbles_X3: cc.SpriteFrame = null;

    @property(cc.SpriteFrame)
    spf_Bubbles_Bonus: cc.SpriteFrame = null;
    @property(cc.SpriteFrame)
    spf_Bonus_Coin: cc.SpriteFrame = null;

    spfPlayer: cc.SpriteFrame = null;



    @property(cc.Node)
    posGold: cc.Node = null;

    @property(cc.Node)
    posMove: cc.Node = null;

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {}
    protected onEnable(): void {
        GlobalEvent.instance().addEventListener(GlobalEvent.SHOW_HIDDEN_PRIZES, this.show, this);
    }
    protected onDisable(): void {

        GlobalEvent.instance().removeEventListener(GlobalEvent.SHOW_HIDDEN_PRIZES, this.show, this);
    }
    start() {

        for (let i = 0; i < this.node.children.length; i++) {
            this.node.children[i].active = false;
        }
    }

    show(data) {
        for (let i = 0; i < this.node.children.length; i++) {
            this.node.children[i].active = false;
        }
        this.spfPlayer = this.defaultAvatar;
        let spf = data.spfPlayer;
        if (spf) this.spfPlayer = spf;
        let rd = Utils.randomInt(0, 3);

        rd = 0;
        switch (rd) {
            case HIDDEN_PRIZES.bonus_Moves:
                console.log("case bonus Moves");
                this.hPBonusMoves();
                break;
            case HIDDEN_PRIZES.multi_Bubbles:
                console.log("case multi Bubbles");
                this.hPMultiBubbles();

                break;
            case HIDDEN_PRIZES.bubbles_Bonus:
                console.log("case bubbles Bonus");
                this.hPBubblesBonus();
                break;
            case HIDDEN_PRIZES.bonus_Coin:
                console.log("case bonus Coin");
                this.hPBonusCoin();
                break;
            default:
                break;
        }
        this.showUserBount();
    }
    hPBonusMoves() {
        this.posMove.active = true;
        this.plusMove.active = true;
        let posEnd = this.posMove.getPosition()
        let posStart = cc.Vec2.ZERO;
        this.plusMove.stopAllActions()
        this.plusMove.setPosition(posStart)
        cc.tween(this.plusMove)
            .to(0.2, { scale: 1.5 }, { easing: "cubicOut" })
            .bezierTo(0.5,
                posStart,
                cc.v2(Utils.randomInt(posStart.x - 400, posStart.x + 400), Utils.randomInt(posStart.y + 200, posStart.y + 400)),
                cc.v2(posEnd)
            )
            .start();
        cc.tween(this.plusMove)
            .delay(0.2)
            .to(0.5, { scale: 0.3 }, { easing: "cubicIn" })
            .call(() => {
                this.plusMove.setPosition(posStart)
                this.plusMove.active = false;
                GlobalEvent.instance().dispatchEvent(GlobalEvent.UPDATE_MOVE_GAME, { move: 1 });
                // this.updateMove(1);
            })
            .start();
    }


    showUserBount() {
        console.log("showUserBount");
        
        this.playerSp.spriteFrame = this.spfPlayer;
        this.player.active = true;
        this.player.setScale(cc.Vec2.ZERO);
        this.player.opacity = 255;
        this.player.stopAllActions();
        this.player.setScale(2);

        cc.tween(this.player)
            .to(0.4, { scale: 2 }, { easing: "backOut" })
            .to(0.5, { scale: 4, opacity: 0 }, { easing: "cubicOut" })
            .start()
    }
    hPMultiBubbles() {
        this.giftSp.node.active = true;
        var coefficient = Utils.randomInt(2, 3)
        if (coefficient == 2) this.giftSp.spriteFrame = this.spf_Multi_Bubbles_X2;
        else this.giftSp.spriteFrame = this.spf_Multi_Bubbles_X3;
        for (let i = 0; i < 3; i++) {

        }
    }
    hPBubblesBonus() {
        this.giftSp.node.active = true;

    }
    hPBonusCoin() {
        this.giftSp.node.active = true;

    }

}
