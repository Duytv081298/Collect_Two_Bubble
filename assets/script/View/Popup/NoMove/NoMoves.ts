import RewardAds from "../../../component/ads/RewardAds";
import SoundManager from "../../../component/component/SoundManager";
import { SCENE } from "../../../component/constant/constant";
import GlobalEvent from "../../../component/event/GlobalEvent";
import MainData from "../../../component/storage/MainData";


const { ccclass, property } = cc._decorator;
const maxTime: number = 100;
@ccclass
export default class NoMoves extends cc.Component {

    @property(cc.Node)
    btnNoThanks: cc.Node = null;

    @property(cc.Button)
    btnAds: cc.Button = null;

    @property(cc.Sprite)
    time: cc.Sprite = null;

    @property(cc.Label)
    txtTime: cc.Label = null;

    timeDelay: number = 0;

    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        GlobalEvent.instance().addEventListener(GlobalEvent.SHOW_NO_MOVE_POPUP, this.show, this);
        GlobalEvent.instance().addEventListener(GlobalEvent.REWARD_ADS_ON_READY, this.showReadyAds, this);
        GlobalEvent.instance().addEventListener(GlobalEvent.REWARD_ADS_ON_REWARD, this.viewAdsComplete, this);
    }
    onDestroy(): void {
        GlobalEvent.instance().removeEventListener(GlobalEvent.SHOW_NO_MOVE_POPUP, this.show, this);
        GlobalEvent.instance().removeEventListener(GlobalEvent.REWARD_ADS_ON_READY, this.showReadyAds, this);
        GlobalEvent.instance().removeEventListener(GlobalEvent.REWARD_ADS_ON_REWARD, this.viewAdsComplete, this);
    }
    onEnable(): void {

    }
    onDisable(): void {
        this.node.stopAllActions();
    }
    showReadyAds() {
        this.btnAds.interactable = RewardAds.instance.ready;
    }
    show() {
        // SoundManager.instance().playEffect("end_game_continue");
        // console.log("show NoMoves");
        this.node.active = true;
        MainData.instance().isShowNoMove = true;
        GlobalEvent.instance().dispatchEvent(GlobalEvent.HIDE_LOADING);
        this.timeDelay = maxTime;
        this.btnNoThanks.active = false;
        this.txtTime.string = 10 + ''
        this.showReadyAds();
        this.beginTime();
    }
    beginTime() {
        this.showTime();
        this.node.stopAllActions();
        cc.tween(this.node).delay(0.1).call(() => {
            this.timeDelay--;
            if (this.timeDelay < 80 && this.btnNoThanks.active == false) {
                this.btnNoThanks.active = true;
            }
            if (this.timeDelay % 10 == 0) {
                this.txtTime.string = Math.round(this.timeDelay / 10) + "";
                SoundManager.instance().playEffect("time");
            }
            if (this.timeDelay == 0) {
                this.onHandlerNothanks();
            } else {
                this.beginTime();
            }
        }).start();
    }
    showTime() {
        this.time.fillRange = 1 - (this.timeDelay / maxTime);
    }

    onHandlerNothanks() {
        SoundManager.instance().playEffect("button"); 
        this.hide();

        GlobalEvent.instance().dispatchEvent(GlobalEvent.SWITCH_SCENES, { idScene: SCENE.game });
        GlobalEvent.instance().dispatchEvent(GlobalEvent.SHOW_GAME_OVER_POPUP);
        // this.node.emit("SHOW_ENDGAME");
    }

    onHandlerShowAds() {
        SoundManager.instance().playEffect("button");           
        RewardAds.instance.show(RewardAds.REWARDED_MOVE);
    }
    viewAdsComplete(data) {
        if (data.type == RewardAds.REWARDED_MOVE) {
            this.hide()
            MainData.instance().updateMove(5);
            GlobalEvent.instance().dispatchEvent(GlobalEvent.ANIMATION_UPDATE_MOVE, { status: true });
        }
    }
    hide() {
        this.node.active = false;
        MainData.instance().isShowNoMove = false;
    }
    // update (dt) {}
}
