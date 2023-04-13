import RewardAds from "../../../../component/ads/RewardAds";
import { BOOSTER, GOLD_USE_BOOSTER } from "../../../../component/constant/constant";
import GlobalEvent from "../../../../component/event/GlobalEvent";
import LocalStorage from "../../../../component/storage/LocalStorage";
import MainData from "../../../../component/storage/MainData";

const { ccclass, property } = cc._decorator;

@ccclass
export default class Booster extends cc.Component {

    @property(cc.Label)
    amount: cc.Label[] = [];
    @property(cc.Node)
    bgAmount: cc.Node[] = [];
    @property(cc.Node)
    bgCoin: cc.Node[] = [];
    @property(cc.Node)
    bgAds: cc.Node[] = [];

    keyBoosterAds: BOOSTER = null;

    ready: boolean = false;

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {}

    protected onEnable(): void {
        GlobalEvent.instance().addEventListener(GlobalEvent.CLEAR_BOOSTER, this.clearBooster, this);
        GlobalEvent.instance().addEventListener(GlobalEvent.UPDATE_AMOUNT_BOOSTER, this.updateAmountBooster, this);
        GlobalEvent.instance().addEventListener(GlobalEvent.UPDATE_UI_BOOSTER, this.updateAllUiBooster, this);

        
        GlobalEvent.instance().addEventListener(GlobalEvent.START_GAME, this.reset, this);
        GlobalEvent.instance().addEventListener(GlobalEvent.REPLAY_GAME, this.reset, this);

        GlobalEvent.instance().addEventListener(GlobalEvent.REWARD_ADS_ON_READY, this.showReadyAds, this);
        GlobalEvent.instance().addEventListener(GlobalEvent.REWARD_ADS_ON_REWARD, this.viewAdsComplete, this);
        
    }
    protected onDisable(): void {

        GlobalEvent.instance().removeEventListener(GlobalEvent.CLEAR_BOOSTER, this.clearBooster, this);
        GlobalEvent.instance().removeEventListener(GlobalEvent.UPDATE_AMOUNT_BOOSTER, this.updateAmountBooster, this);
        GlobalEvent.instance().removeEventListener(GlobalEvent.UPDATE_UI_BOOSTER, this.updateAllUiBooster, this);

        GlobalEvent.instance().removeEventListener(GlobalEvent.REWARD_ADS_ON_READY, this.showReadyAds, this);
        GlobalEvent.instance().removeEventListener(GlobalEvent.REWARD_ADS_ON_REWARD, this.viewAdsComplete, this);

        GlobalEvent.instance().removeEventListener(GlobalEvent.START_GAME, this.reset, this);
        GlobalEvent.instance().removeEventListener(GlobalEvent.REPLAY_GAME, this.reset, this);
    }

    showReadyAds() {
        // this.activeBtnRewardAds(RewardAds.instance.ready)
        this.updateAllUiBooster();
    }
    viewAdsComplete(data) {
        if (this.keyBoosterAds == null) return;
        if (data.type == RewardAds.REWARDED_BOOSTER) {
            // switch (this.keyBoosterAds) {
            //     case BOOSTER.rocket:
            //         // this.updateAmountBooster(BOOSTER.rocket, 1);
            //         game.emit("SHOW_POPUP_GIFT_PLUS_BOOSTER", BOOSTER.rocket)
            //         FaceBook.logEvent(LogEventName.buyBoosterRocketVideo)
            //         break;
            //     case BOOSTER.bomb:
            //         game.emit("SHOW_POPUP_GIFT_PLUS_BOOSTER", BOOSTER.bomb)
            //         FaceBook.logEvent(LogEventName.buyBoosterBombVideo)
            //         // this.updateAmountBooster(BOOSTER.bomb, 1);
            //         break;
            //     case BOOSTER.reverse:
            //         game.emit("SHOW_POPUP_GIFT_PLUS_BOOSTER", BOOSTER.reverse)
            //         FaceBook.logEvent(LogEventName.buyBoosterReverseVideo)
            //         // this.updateAmountBooster(BOOSTER.reverse, 1);
            //         break;
            //     case BOOSTER.hammer:
            //         game.emit("SHOW_POPUP_GIFT_PLUS_BOOSTER", BOOSTER.hammer)
            //         FaceBook.logEvent(LogEventName.buyBoosterHammerVideo)
            //         // this.updateAmountBooster(BOOSTER.hammer, 1);
            //         break;
            //     default:
            //         return;
            // }

            this.updateAmountBooster({ booster: this.keyBoosterAds, amount: 1 });

            MainData.instance().keyBooster = this.keyBoosterAds;
            this.setOpacityBoosterChoose(this.keyBoosterAds);
            // this.tooltip.showTooltipBomb();
        }
    }

    reset() {
        this.clearBooster();
        this.updateAllUiBooster();

    }
    updateAllUiBooster() {
        for (let i = 0; i < this.amount.length; i++) {
            this.updateUiBooster(i);
        }
    }




    onClickRocket() {

        if (MainData.instance().isUseBooster) return;
        if (MainData.instance().keyBooster == BOOSTER.rocket) {
            this.clearBooster();
            return;
        }
        let key = BOOSTER.rocket;

        if (MainData.instance().amountBooster[key] > 0) {
            MainData.instance().keyBooster = key;
            this.setOpacityBoosterChoose(key);
        } else {
            if (MainData.instance().goldPlayer >= GOLD_USE_BOOSTER) {
                GlobalEvent.instance().dispatchEvent(GlobalEvent.UPDATE_GOLD_GAME, { gold: -GOLD_USE_BOOSTER });
                this.updateAmountBooster({ booster: key, amount: 1 });

                MainData.instance().keyBooster = key;
                this.setOpacityBoosterChoose(key);
            }
            else {
                this.keyBoosterAds = key;
                this.showAds();
            };
        }

    }
    onClickBomb() {
        if (MainData.instance().isUseBooster) return;
        if (MainData.instance().keyBooster == BOOSTER.bomb) {
            this.clearBooster();
            return;
        }
        let key = BOOSTER.bomb;


        if (MainData.instance().amountBooster[key] > 0) {
            MainData.instance().keyBooster = key;
            this.setOpacityBoosterChoose(key);
        } else {
            if (MainData.instance().goldPlayer >= GOLD_USE_BOOSTER) {
                GlobalEvent.instance().dispatchEvent(GlobalEvent.UPDATE_GOLD_GAME, { gold: -GOLD_USE_BOOSTER });
                this.updateAmountBooster({ booster: key, amount: 1 });

                MainData.instance().keyBooster = key;
                this.setOpacityBoosterChoose(key);
            }
            else {
                this.keyBoosterAds = key;
                this.showAds();
            };
        }
    }
    onClickReverse() {
        if (MainData.instance().isUseBooster) return;
        if (MainData.instance().keyBooster == BOOSTER.reverse) {
            this.clearBooster();
            return;
        }
        let key = BOOSTER.reverse;

        if (MainData.instance().amountBooster[key] > 0) {
            MainData.instance().keyBooster = key;
            this.setOpacityBoosterChoose(key);
        } else {
            if (MainData.instance().goldPlayer >= GOLD_USE_BOOSTER) {
                GlobalEvent.instance().dispatchEvent(GlobalEvent.UPDATE_GOLD_GAME, { gold: -GOLD_USE_BOOSTER });
                this.updateAmountBooster({ booster: key, amount: 1 });

                MainData.instance().keyBooster = key;
                this.setOpacityBoosterChoose(key);
            }
            else {
                this.keyBoosterAds = key;
                this.showAds();
            };
        }
    }
    onClickHammer() {
        if (MainData.instance().isUseBooster) return;
        if (MainData.instance().keyBooster == BOOSTER.hammer) {
            this.clearBooster();
            return;
        }
        let key = BOOSTER.hammer;

        if (MainData.instance().amountBooster[key] > 0) {
            MainData.instance().keyBooster = key;
            this.setOpacityBoosterChoose(key);
        } else {
            if (MainData.instance().goldPlayer >= GOLD_USE_BOOSTER) {
                GlobalEvent.instance().dispatchEvent(GlobalEvent.UPDATE_GOLD_GAME, { gold: -GOLD_USE_BOOSTER });
                this.updateAmountBooster({ booster: key, amount: 1 });

                MainData.instance().keyBooster = key;
                this.setOpacityBoosterChoose(key);
            }
            else {
                this.keyBoosterAds = key;
                this.showAds();
            };
        }
    }

    clearBooster() {

        MainData.instance().isUseBooster = false;
        MainData.instance().keyBooster = null;
        MainData.instance().isHandlerReverse = null;
        // this.keyBooster = null;
        this.keyBoosterAds = null;
        // this.tooltip.hide();
        this.clearOpacityBooster()
    }
    setOpacityBoosterChoose(booster: BOOSTER) {
        for (let i = 0; i < this.bgAmount.length; i++) {
            let parent = this.bgAmount[i].parent;
            parent.stopAllActions();
            parent.opacity = 150;
            if (i == booster) {
                parent.opacity = 255;
                this.animation(parent);
            }
        }
    }


    clearOpacityBooster() {
        for (let i = 0; i < this.bgAmount.length; i++) {
            let parent = this.bgAmount[i].parent;
            parent.stopAllActions();
            parent.opacity = 255;
            parent.setScale(1);
        }
    }

    animation(child: cc.Node) {
        let tweenDuration: number = 0.2;
        let t1 = cc.tween(child)
            .to(tweenDuration, { scale: 1.1 }, { easing: "sineOutIn" })
        let t2 = cc.tween(child)
            .to(tweenDuration, { scale: 1 }, { easing: "sineInOut" })
        cc.tween(child).sequence(t1, t2)
            .repeatForever()
            .start();
    }


    updateAmountBooster(data) {
        let booster: BOOSTER = data.booster;
        let amount: number = data.amount;

        LocalStorage.setItem(this.IdBoosterToLocalKey(booster), MainData.instance().amountBooster[booster] + amount);
        this.updateAllUiBooster();
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

    updateUiBooster(booster: BOOSTER) {

        this.amount[booster].node.active = false
        this.bgAmount[booster].active = false
        this.bgCoin[booster].active = false
        this.bgAds[booster].active = false

        if (MainData.instance().amountBooster[booster] > 0) {
            this.bgAmount[booster].active = true;
            this.amount[booster].node.active = true;
            this.amount[booster].string = MainData.instance().amountBooster[booster].toString();
        }
        else {
            if (MainData.instance().goldPlayer >= GOLD_USE_BOOSTER) {
                this.bgCoin[booster].active = true;
            }
            else {
                this.bgAds[booster].active = true;
                this.bgAds[booster].opacity = RewardAds.instance.ready ? 255 : 150;
            };
        }
    }
    getStatusBooster(booster: BOOSTER) {
        if (MainData.instance().amountBooster[booster] > 0) return MainData.instance().amountBooster[booster]
        else {
            if (MainData.instance().goldPlayer >= GOLD_USE_BOOSTER) return 0;
            else return -1;
        }
    }

    showAds() {
        RewardAds.instance.show(RewardAds.REWARDED_BOOSTER);
    }
    // update (dt) {}
}
