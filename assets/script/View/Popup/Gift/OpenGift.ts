import SoundManager from "../../../component/component/SoundManager";
import { Utils } from "../../../component/component/Utils";
import { BOOSTER } from "../../../component/constant/constant";
import GlobalEvent from "../../../component/event/GlobalEvent";
import LocalStorage from "../../../component/storage/LocalStorage";
import MainData from "../../../component/storage/MainData";

const { ccclass, property } = cc._decorator;

@ccclass
export class OpenGift extends cc.Component {
    @property(sp.Skeleton)
    aniGift: sp.Skeleton = null;
    @property(cc.Node)
    parentGift: cc.Node = null;
    @property(cc.Sprite)
    gift: cc.Sprite = null;
    @property(cc.Button)
    btnOpen: cc.Button = null;

    @property(cc.SpriteFrame)
    listSPGift: cc.SpriteFrame[] = [];
    @property(cc.Node)
    toPos: cc.Node[] = [];

    isActive: boolean = false;
    indexGift: number = null;
    isAutoOpen: boolean = false;
    isSpin: boolean = false;

    protected onLoad(): void {
        GlobalEvent.instance().addEventListener(GlobalEvent.SHOW_GIFT, this.show, this);
    }

    protected onDestroy(): void {
        GlobalEvent.instance().removeEventListener(GlobalEvent.SHOW_GIFT, this.show, this);
    }

    start() {
    }
    show(data) {
        this.node.active = true;
        this.isSpin = false;
        this.isSpin = data.isSpin;
        this.btnOpen.interactable = false;
        // this.isAutoOpen = autoOpen;
        SoundManager.instance().playEffect("gift_xuat hien");

        this.indexGift = this.isSpin ? Utils.randomInt(0, 3) : Utils.randomInt(0, 5);

        this.node.active = true;
        this.aniGift.node.active = true;
        this.parentGift.active = false;
        this.isActive = false;

        // this.aniGift.clearTrack(0)
        this.aniGift.setSkin("default");
        this.aniGift.setAnimation(0, "nhay ra", false);

        this.aniGift.setCompleteListener(() => { this.showAnimationRung(); })

    }
    showAnimationRung() {
        // this.aniGift.clearTrack(0)

        this.btnOpen.interactable = true;
        this.aniGift.setSkin("default");
        this.aniGift.setAnimation(0, "runglac", true);
        this.aniGift.setCompleteListener(() => { if (this.isAutoOpen) this.onHanlderOpenGift() })
    }

    onHanlderOpenGift() {
        if (this.isActive) return;
        this.isActive = true;
        // this.indexGift = 5
        this.gift.spriteFrame = this.listSPGift[this.indexGift]
        this.showGift();
        SoundManager.instance().playEffect("sfx_open_gift_reward");
        // this.aniGift.clearTrack(0)
        this.aniGift.setSkin("default");
        this.aniGift.setAnimation(0, "mo hop", false);
        this.aniGift.setCompleteListener(() => { })
    }

    showGift() {
        let toPosCurr = this.isSpin ? cc.Vec2.ZERO : this.toPos[this.indexGift].getPosition();

        let oldPost = new cc.Vec2(0, -100);
        let point2 = new cc.Vec2(-1 * Utils.randomInt(oldPost.x - 100, oldPost.x + 100), Utils.randomInt(oldPost.y + 100, toPosCurr.y - 100))

        this.activeGift(true)
        cc.tween(this.parentGift)
            .delay(0.3)
            .to(0.5, { scale: 1.2, position: new cc.Vec3(0, -100, 0) }, { easing: "expoOut" })
            .delay(1)
            .bezierTo(0.5,
                oldPost,
                point2,
                toPosCurr
            )
            .start();

        cc.tween(this.parentGift)
            .delay(2)
            .to(0.5, { scale: 0.6 }, { easing: "expoOut" })
            .call(() => {
                this.claimGift();
                this.activeGift(false);
                this.node.active = false
            })
            .start();
    }

    activeGift(status) {
        this.parentGift.active = status;
        this.parentGift.setScale(0.5)
        this.parentGift.setPosition(0, -440)
        this.parentGift.opacity = 255;
        this.parentGift.stopAllActions();
        for (let i = 0; i < this.parentGift.children.length; i++) {
            this.parentGift.children[i].active = status;
        }
    }

    claimGift() {
        switch (this.indexGift) {
            case 0:
            case 1:
            case 2:
            case 3:
                if (this.isSpin) LocalStorage.setItem(this.IdBoosterToLocalKey(this.indexGift), MainData.instance().amountBooster[this.indexGift] + 1);
                GlobalEvent.instance().dispatchEvent(GlobalEvent.UPDATE_AMOUNT_BOOSTER, { booster: this.indexGift, amount: 1 });
                break;
            case 4:  // bong x4
                GlobalEvent.instance().dispatchEvent(GlobalEvent.HIDDEN_PRIZES_MULTI_BUBBLES, { coefficient: 4 });
                break;
            case 5: // bouns move
                MainData.instance().updateMove(1);

                GlobalEvent.instance().dispatchEvent(GlobalEvent.ANIMATION_UPDATE_MOVE, { status: true });
                break;
            default:
                break;
        }
        MainData.instance().isOpenGift = false;
        GlobalEvent.instance().dispatchEvent(GlobalEvent.CLEAR_ALL_BUBBLE_DIE);
    }

    IdBoosterToLocalKey(booster: BOOSTER) {
        switch (booster) {
            case BOOSTER.rocket:
                return LocalStorage.BOOSTER_ROCKET;
            case BOOSTER.bomb:
                return LocalStorage.BOOSTER_BOMB;
            case BOOSTER.reverse:
                return LocalStorage.BOOSTER_REVERSE;
            case BOOSTER.hammer:
                return LocalStorage.BOOSTER_HAMMER;
            default:
                break;
        }
    }
}


