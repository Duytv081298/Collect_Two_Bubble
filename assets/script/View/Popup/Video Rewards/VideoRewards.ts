import RewardAds from "../../../component/ads/RewardAds";
import SoundManager from "../../../component/component/SoundManager";
import GlobalEvent from "../../../component/event/GlobalEvent";
import LocalStorage from "../../../component/storage/LocalStorage";
import MainData from "../../../component/storage/MainData";

const { ccclass, property } = cc._decorator;

const MAX_REWARDS_ADS: number = 10;

const LIST_COIN_FREE_GIFT: number[] = [100, 100, 150, 200, 250, 300, 300, 300, 300, 300];

@ccclass
export class VideoRewards extends cc.Component {

    listRange: number[] = [0.15, 0.38, 0.6, 0.85, 1];

    @property(cc.Sprite)
    progress: cc.Sprite = null;

    @property(cc.Button)
    btn_watch_Ads: cc.Button = null;
    @property(cc.Label)
    txtAdsLeft: cc.Label = null;

    @property(cc.Node)
    arrTick: cc.Node[] = [];
    @property(cc.Node)
    arrBgGift: cc.Node[] = [];

    protected onLoad(): void {
        console.log("onLoad VideoRewards: ");
        GlobalEvent.instance().addEventListener(GlobalEvent.SHOW_VIDEO_REWARDS_POPUP, this.show, this);
    }
    protected onDestroy(): void {
        console.log("onDestroy VideoRewards: ");
        GlobalEvent.instance().removeEventListener(GlobalEvent.SHOW_VIDEO_REWARDS_POPUP, this.show, this);
    }

    // @property(iconGift)
    // listItemCollect: iconGift[] = [];
    onEnable() {
        GlobalEvent.instance().addEventListener(GlobalEvent.REWARD_ADS_ON_REWARD, this.onReward, this);
        GlobalEvent.instance().addEventListener(GlobalEvent.REWARD_ADS_ON_READY, this.onReady, this);
    }
    onDisable() {
        GlobalEvent.instance().removeEventListener(GlobalEvent.REWARD_ADS_ON_REWARD, this.onReward, this);
        GlobalEvent.instance().removeEventListener(GlobalEvent.REWARD_ADS_ON_READY, this.onReady, this);
    }


    show() {
        this.node.active = true;
        GlobalEvent.instance().dispatchEvent(GlobalEvent.HIDE_LOADING);

        let count_free_gift = parseInt(LocalStorage.getItem(LocalStorage.COUNT_FREE_GIFT));

        // console.log(count_free_gift);
        var tempIndex = count_free_gift <= 5 ? count_free_gift : 5;

        this.showTick(tempIndex);

        tempIndex = tempIndex + 1;
        if (tempIndex > 5) {
            tempIndex = 5;
        }


        for (let i = 0; i < this.arrBgGift.length; i++) {
            this.arrBgGift[i].active = i >= tempIndex;
        }
        this.progress.fillRange = count_free_gift == 0 ? this.listRange[0] : this.listRange[tempIndex - 1];
        this.txtAdsLeft.string = (MAX_REWARDS_ADS - count_free_gift).toString();


        this.onReady();
    }
    hide() {
        SoundManager.instance().playEffect("button");
        this.node.active = false;
    }

    watchAdClick() {
        // console.log("watchAdClick");
        SoundManager.instance().playEffect("button");

        // FaceBook.logEvent(LogEventName.videoReward)
        RewardAds.instance.show(RewardAds.REWARDED_COIN)
    }
    onReady() {

        var count_free_gift = parseInt(LocalStorage.getItem(LocalStorage.COUNT_FREE_GIFT));
        if (count_free_gift < MAX_REWARDS_ADS) {
            this.btn_watch_Ads.interactable = RewardAds.instance.ready;
        } else {
            this.btn_watch_Ads.interactable = false;
        }
    }

    onReward(data: any) {
        if (data.type == RewardAds.REWARDED_COIN) {
            var count_free_gift = parseInt(LocalStorage.getItem(LocalStorage.COUNT_FREE_GIFT)) + 1
            LocalStorage.setItem(LocalStorage.COUNT_FREE_GIFT, count_free_gift)

            MainData.instance().updateGold(LIST_COIN_FREE_GIFT[count_free_gift - 1]);
            GlobalEvent.instance().dispatchEvent(GlobalEvent.UPDATE_GOLD_GAME);
            this.show()
        }
    }
    showTick(index: number) {
        for (let i = 0; i < this.arrTick.length; i++) {
            var tick = this.arrTick[i];
            if (i < index) tick.active = true;
            else tick.active = false;
        }
    }

    clearWhatchAd() {
        LocalStorage.setItem(LocalStorage.COUNT_FREE_GIFT, 0)
        this.show()
    }

}


