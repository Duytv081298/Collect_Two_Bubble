import RewardAds from "../../../component/ads/RewardAds";
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
        GlobalEvent.instance().addEventListener(GlobalEvent.REWARD_ADS_ON_READY, this.showReadyAds, this);
        GlobalEvent.instance().addEventListener(GlobalEvent.REWARD_ADS_ON_REWARD, this.viewAdsComplete, this);
    }
    onDestroy(): void {
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

        this.timeDelay = maxTime;
        this.btnNoThanks.active = false;
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
                // SoundManager.instance().playEffect("time");
            }
            if (this.timeDelay == 0) {
                this.onHandlerNothanks();
            } else {
                this.beginTime();
            }
        }).start();
    }
    showTime() {
        this.txtTime.string = Math.round(this.timeDelay / 10) + "";
        this.time.fillRange = 1 - (this.timeDelay / maxTime);
    }

    onHandlerNothanks() {
        // SoundManager.instance().playEffect("button"); 
        this.hide();
        
        GlobalEvent.instance().dispatchEvent(GlobalEvent.SWITCH_SCENES, { idScene: SCENE.game });
        GlobalEvent.instance().dispatchEvent(GlobalEvent.SHOW_GAME_OVER_POPUP);
        // this.node.emit("SHOW_ENDGAME");
    }

    onHandlerShowAds() {
        // SoundManager.instance().playEffect("button");           
        RewardAds.instance.show(RewardAds.REWARDED_MOVE);
    }
    viewAdsComplete(data) {
        if (data.type == RewardAds.REWARDED_MOVE) {
            this.hide()
            GlobalEvent.instance().dispatchEvent(GlobalEvent.UPDATE_MOVE_GAME, { move: 5 });
        }
    }
    hide() {
        this.node.active = false;
        MainData.instance().isShowNoMove = false;
    }
    // update (dt) {}
}
