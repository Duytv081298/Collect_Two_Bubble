import PopupController from "../../../script/View/Popup/PopupController";
import { Utils } from "../../../script/component/component/Utils";
import MainData from "../../../script/component/storage/MainData";

const { ccclass, property } = cc._decorator;

const MINTARGET: number = 50000;
const DICSHOWANI: number = 2000;

@ccclass
export class GiftController extends cc.Component {


    @property(PopupController)
    popupController: PopupController = null;

    @property(cc.Node)
    giftDefault: cc.Node = null;
    @property(sp.Skeleton)
    aniGift: sp.Skeleton = null;

    @property(cc.Label)
    lbTarget: cc.Label = null;

    amountTarget: number = MINTARGET;
    scoreUser: number = 0;
    isShow: boolean = false;
    isPlayAni: boolean = false;

    protected onEnable(): void {
        // game.on("SUCCESSFULLY_RECEIVED_GIFTS", () => { this.isShow = false; }, this);
    }
    protected onDisable(): void {
        // game.off("SUCCESSFULLY_RECEIVED_GIFTS");
    }

    init() {

        this.amountTarget = MINTARGET;
        this.scoreUser = 0;
        this.lbTarget.string = Utils.shortenLargeNumber(this.amountTarget, 0);
        this.giftDefault.active = true;
        this.aniGift.node.active = false;

    }
    upScore() {
        this.scoreUser = MainData.instance().score;
        if (this.amountTarget - this.scoreUser <= DICSHOWANI && !this.isPlayAni) {
            this.giftDefault.active = false;
            this.aniGift.node.active = true;
            this.aniGift.setAnimation(0, "animation", true);
            this.aniGift.setSkin("default");
            this.isPlayAni = true;
        }
        if (this.amountTarget - this.scoreUser <= 0 && !this.isShow) {

            // SoundManager.instance().playEffect("TargetComplete");
            this.showReceiveGift();
        }
    }
    showReceiveGift() {
        this.nextTargetGift();
        this.isPlayAni = false;
        this.giftDefault.active = true;
        this.aniGift.node.active = false;

        this.isShow = true;

        // this.popupController.showPopupGift();
    }

    nextTargetGift() {
        this.amountTarget += MINTARGET;
        this.lbTarget.string = Utils.shortenLargeNumber(this.amountTarget, 0);
    }


}


