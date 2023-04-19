
// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import { Utils } from "../../../component/component/Utils";
import { HIDDEN_PRIZES } from "../../../component/constant/constant";
import GlobalEvent from "../../../component/event/GlobalEvent";
import MainData from "../../../component/storage/MainData";

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


    show(data) {
        console.log(data);
        
        MainData.instance().isHiddenPrizes = true;
        for (let i = 0; i < this.node.children.length; i++) {
            this.node.children[i].active = false;
        }
        this.spfPlayer = this.defaultAvatar;
        let spf = data.spfPlayer;
        if (spf) this.spfPlayer = spf;
        let rd = Utils.randomInt(0, 3);

        rd = 2;
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
                return;
        }
        this.showUserBount();
    }
    showUserBount() {
        console.log("showUserBount");

        this.playerSp.spriteFrame = this.spfPlayer;
        this.player.active = true;
        this.player.setScale(cc.Vec2.ZERO);
        this.player.opacity = 255;
        this.player.stopAllActions();

        cc.tween(this.player)
            .to(0.4, { scale: 2 }, { easing: "backOut" })
            .to(0.5, { scale: 4, opacity: 0 }, { easing: "cubicOut" })
            .start()
    }
    hPBonusMoves() {

        MainData.instance().move += 1;

        this.posMove.active = true;
        this.plusMove.active = true;
        let posEnd = this.posMove.getPosition()
        let posStart = new cc.Vec2(0, 70);
        this.plusMove.opacity = 0;
        this.plusMove.stopAllActions()
        this.plusMove.setPosition(posStart)
        cc.tween(this.plusMove)
            .to(0.3, { scale: 2, opacity: 255 }, { easing: "cubicOut" })
            .to(0.5, { scale: 0.3 }, { easing: "cubicIn" })
            .call(() => {
                this.plusMove.setPosition(posStart)
                this.plusMove.active = false;
                GlobalEvent.instance().dispatchEvent(GlobalEvent.ANIMATION_UPDATE_MOVE, { status: true });
                MainData.instance().isHiddenPrizes = false;
            })
            .start();
        cc.tween(this.plusMove)
            .bezierTo(0.8,
                posStart,
                cc.v2(Utils.randomInt(posStart.x - 300, posStart.x + 300), Utils.randomInt(posStart.y + 200, posStart.y + 400)),
                cc.v2(posEnd)
            )
            .start();
    }


    hPMultiBubbles() {
        this.giftSp.node.active = true;
        let coefficient = Utils.randomInt(2, 3)
        if (coefficient == 2) this.giftSp.spriteFrame = this.spf_Multi_Bubbles_X2;
        else this.giftSp.spriteFrame = this.spf_Multi_Bubbles_X3;


        let posStart = new cc.Vec3(0, -100, 0);
        let posEnd = new cc.Vec3(0, 200, 0);

        this.giftSp.node.opacity = 0;
        this.giftSp.node.setScale(0);
        this.giftSp.node.stopAllActions()
        this.giftSp.node.setPosition(posStart)

        cc.tween(this.giftSp.node)
            .to(0.6, { scale: 1.5, opacity: 255, position: posEnd }, { easing: "cubicOut" })
            .call(() => {
                GlobalEvent.instance().dispatchEvent(GlobalEvent.HIDDEN_PRIZES_MULTI_BUBBLES, { coefficient: coefficient });

            })
            .to(0.3, { opacity: 0 }, { easing: "cubicIn" })
            .call(() => {
                this.giftSp.node.setPosition(posStart)
                this.giftSp.node.active = false;
                MainData.instance().isHiddenPrizes = false;
            })
            .start();

    }
    hPBubblesBonus() {
        console.log("hPBubblesBonus");
        
        this.giftSp.node.active = true;
        this.giftSp.spriteFrame = this.spf_Bubbles_Bonus;

        let posStart = new cc.Vec3(0, -100, 0);

        let posEnd = new cc.Vec3(0, 100, 0);
        this.giftSp.node.opacity = 0;
        this.giftSp.node.setScale(0);
        this.giftSp.node.stopAllActions()
        this.giftSp.node.setPosition(posStart)


        cc.tween(this.giftSp.node)
            .to(0.5, { scale: 1.5, opacity: 255, position: posEnd }, { easing: "cubicOut" })

            .to(0.2, { opacity: 0 }, { easing: "cubicIn" })
            .call(() => {
                this.giftSp.node.setPosition(posStart)
                this.giftSp.node.active = false;
                MainData.instance().isHiddenPrizes = false;
            })
            .start();
        cc.tween(this.giftSp.node)
            .delay(0.3)
            .call(() => {
                GlobalEvent.instance().dispatchEvent(GlobalEvent.HIDDEN_PRIZES_BUBBLE_BONUS, { parent: this.node });
            })
            .start();

    }
    hPBonusCoin() {
        this.giftSp.node.active = true;
        this.giftSp.spriteFrame = this.spf_Bonus_Coin;

        let posEnd = this.posGold.getPosition()
        let posStart = new cc.Vec2(0, 70);

        this.giftSp.node.opacity = 0;
        this.giftSp.node.setScale(0);
        this.giftSp.node.stopAllActions()
        this.giftSp.node.setPosition(posStart)

        cc.tween(this.giftSp.node)
            .to(0.3, { scale: 1.5, opacity: 255 }, { easing: "cubicOut" })
            .to(0.5, { scale: 0.3 }, { easing: "cubicIn" })
            .call(() => {
                this.giftSp.node.setPosition(posStart)
                this.giftSp.node.active = false;
                GlobalEvent.instance().dispatchEvent(GlobalEvent.UPDATE_GOLD_GAME, { gold: 1 });
                MainData.instance().isHiddenPrizes = false;
            })
            .start();
        cc.tween(this.giftSp.node)
            .bezierTo(0.8,
                posStart,
                cc.v2(Utils.randomInt(posStart.x - 300, posStart.x + 300), Utils.randomInt(posStart.y + 200, posStart.y + 400)),
                cc.v2(posEnd)
            )
            .start();
    }

}
