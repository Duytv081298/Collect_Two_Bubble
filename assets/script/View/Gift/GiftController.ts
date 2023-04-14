import PopupController from "../../../script/View/Popup/PopupController";
import { Utils } from "../../../script/component/component/Utils";
import GlobalEvent from "../../../script/component/event/GlobalEvent";
import MainData from "../../../script/component/storage/MainData";

const { ccclass, property } = cc._decorator;

const MINTARGET: number = 50000;
const DICSHOWANI: number = 2000;

@ccclass
export class GiftController extends cc.Component {


    @property(cc.Node)
    giftDefault: cc.Node = null;
    @property(sp.Skeleton)
    aniGift: sp.Skeleton = null;

    @property(cc.Label)
    lbTarget: cc.Label = null;

    amountTarget: number = MINTARGET;
    // isShow: boolean = false;
    isPlayAni: boolean = false;


    protected onEnable(): void {
        GlobalEvent.instance().addEventListener(GlobalEvent.START_GAME, this.reset, this);
        GlobalEvent.instance().addEventListener(GlobalEvent.REPLAY_GAME, this.reset, this);
        GlobalEvent.instance().addEventListener(GlobalEvent.CHECK_SHOW_GIFT, this.upScore, this);
    }
    protected onDisable(): void {

        GlobalEvent.instance().removeEventListener(GlobalEvent.START_GAME, this.reset, this);
        GlobalEvent.instance().removeEventListener(GlobalEvent.REPLAY_GAME, this.reset, this);
        GlobalEvent.instance().removeEventListener(GlobalEvent.CHECK_SHOW_GIFT, this.upScore, this);
    }

    reset() {
        this.amountTarget = MINTARGET;
        this.lbTarget.string = Utils.shortenLargeNumber(this.amountTarget, 0);
        this.giftDefault.active = true;
        this.aniGift.node.active = false;
    }
    upScore() {
        if (this.amountTarget - MainData.instance().score <= DICSHOWANI && !this.isPlayAni) {
            this.giftDefault.active = false;
            this.aniGift.node.active = true;
            this.aniGift.clearTrack(0);
            this.aniGift.setSkin("default");
            this.aniGift.setAnimation(0, "animation", true);
            this.isPlayAni = true;
        }
        if (this.amountTarget - MainData.instance().score <= 0) {
            // SoundManager.instance().playEffect("TargetComplete");
            this.showReceiveGift();
        }
    }
    showReceiveGift() {
        this.nextTargetGift();
        this.isPlayAni = false;
        this.giftDefault.active = true;
        this.aniGift.node.active = false;

        GlobalEvent.instance().dispatchEvent(GlobalEvent.SHOW_GIFT);
        // this.popupController.showPopupGift();
    }

    nextTargetGift() {
        this.amountTarget += MINTARGET;
        this.lbTarget.string = Utils.shortenLargeNumber(this.amountTarget, 0);
    }


}


