import BannerAds from "../../component/ads/BannerAds";
import InterstitialManager from "../../component/ads/InterstitialManager";
import RewardAds from "../../component/ads/RewardAds";
import SoundManager from "../../component/component/SoundManager";
import { Utils } from "../../component/component/Utils";
import { SCENE } from "../../component/constant/constant";
import GlobalEvent from "../../component/event/GlobalEvent";
import { PlayfabManager } from "../../component/package/PlayfabManager";
import LocalStorage from "../../component/storage/LocalStorage";
import MainData from "../../component/storage/MainData";
import PopupController from "../Popup/PopupController";

const { ccclass, property } = cc._decorator;

@ccclass
export default class Loading extends cc.Component {

    @property(PopupController)
    popupController: PopupController = null;

    start() {
        SoundManager.instance().preLoadSound();
        FBInstant.onPause(() => { });

        if (MainData.instance().ktFistLogin == true) {
            FBInstant.player.getSignedPlayerInfoAsync().then((result) => {
                if (!MainData.instance().isLocal) PlayfabManager.install.login(result.getSignature());
            });
        } else {
        }

        let hightScoreTour = "hightScoreTour" + MainData.instance().idTour;
        FBInstant.player
            .getDataAsync([
                LocalStorage.SOUND, LocalStorage.MUSIC,
                LocalStorage.IS_NEW,
                LocalStorage.HIGHT_SCORE,
                LocalStorage.CURRENT_GOLD,
                LocalStorage.BOOSTER_ROCKET,
                LocalStorage.BOOSTER_BOMB,
                LocalStorage.BOOSTER_REVERSE,
                LocalStorage.BOOSTER_HAMMER,
                hightScoreTour,
                LocalStorage.COUNT_PLAY_FRIEND,
                LocalStorage.CURRENT_DATE,
                // LocalStorage.DAILY_COLLECT,
                // LocalStorage.CURRENT_DAILY_COLLECT,
                LocalStorage.TOTAL_COLLECT_SPIN,
                LocalStorage.CURRENT_SPIN,
                LocalStorage.TIME_GET_SPIN,
                LocalStorage.DATA_GET_MORE_SPIN,
                LocalStorage.COUNT_FREE_GIFT,
                LocalStorage.DATA_INVITE_FRIEND
            ])
            .then((data) => {
                if (data.hasOwnProperty(LocalStorage.SOUND) && data[LocalStorage.SOUND] != undefined) {
                    LocalStorage.setItem(LocalStorage.SOUND, data[LocalStorage.SOUND])
                } else {
                    LocalStorage.setItem(LocalStorage.SOUND, true);
                }
                if (data.hasOwnProperty(LocalStorage.MUSIC) && data[LocalStorage.MUSIC] != undefined) {
                    LocalStorage.setItem(LocalStorage.MUSIC, data[LocalStorage.MUSIC])
                } else {
                    LocalStorage.setItem(LocalStorage.MUSIC, true);
                }
                if (data.hasOwnProperty(LocalStorage.IS_NEW)) {
                    // LocalStorage.setItem(LocalStorage.IS_NEW, true);
                    LocalStorage.setItem(LocalStorage.IS_NEW, data[LocalStorage.IS_NEW])
                } else {
                    LocalStorage.setItem(LocalStorage.IS_NEW, true);
                }

                if (data.hasOwnProperty(LocalStorage.HIGHT_SCORE) && data[LocalStorage.HIGHT_SCORE] != undefined) {
                    // LocalStorage.setItem(LocalStorage.HIGHT_SCORE, 0);
                    LocalStorage.setItem(LocalStorage.HIGHT_SCORE, data[LocalStorage.HIGHT_SCORE])
                } else {
                    LocalStorage.setItem(LocalStorage.HIGHT_SCORE, 0);
                }
                if (data.hasOwnProperty(LocalStorage.CURRENT_GOLD)) {
                    // LocalStorage.setItem(LocalStorage.CURRENT_GOLD, 999)
                    LocalStorage.setItem(LocalStorage.CURRENT_GOLD, data[LocalStorage.CURRENT_GOLD])
                } else {
                    LocalStorage.setItem(LocalStorage.CURRENT_GOLD, 0);
                }
                if (data.hasOwnProperty(LocalStorage.BOOSTER_ROCKET) && data[LocalStorage.BOOSTER_ROCKET] != undefined) {
                    LocalStorage.setItem(LocalStorage.BOOSTER_ROCKET, data[LocalStorage.BOOSTER_ROCKET])
                } else {
                    LocalStorage.setItem(LocalStorage.BOOSTER_ROCKET, 0);
                }

                if (data.hasOwnProperty(LocalStorage.BOOSTER_BOMB) && data[LocalStorage.BOOSTER_BOMB] != undefined) {
                    LocalStorage.setItem(LocalStorage.BOOSTER_BOMB, data[LocalStorage.BOOSTER_BOMB])
                } else {
                    LocalStorage.setItem(LocalStorage.BOOSTER_BOMB, 0);
                }

                if (data.hasOwnProperty(LocalStorage.BOOSTER_REVERSE) && data[LocalStorage.BOOSTER_REVERSE] != undefined) {
                    LocalStorage.setItem(LocalStorage.BOOSTER_REVERSE, data[LocalStorage.BOOSTER_REVERSE])
                } else {
                    LocalStorage.setItem(LocalStorage.BOOSTER_REVERSE, 0);
                }

                if (data.hasOwnProperty(LocalStorage.BOOSTER_HAMMER) && data[LocalStorage.BOOSTER_HAMMER] != undefined) {
                    LocalStorage.setItem(LocalStorage.BOOSTER_HAMMER, data[LocalStorage.BOOSTER_HAMMER])
                } else {
                    LocalStorage.setItem(LocalStorage.BOOSTER_HAMMER, 0);
                }

                if (data.hasOwnProperty(hightScoreTour)) {
                    LocalStorage.setItem(hightScoreTour, data[hightScoreTour])
                } else {
                    LocalStorage.setItem(hightScoreTour, 0);
                }
                if (data.hasOwnProperty(LocalStorage.COUNT_PLAY_FRIEND)) {
                    LocalStorage.setItem(LocalStorage.COUNT_PLAY_FRIEND, data[LocalStorage.COUNT_PLAY_FRIEND])
                } else {
                    LocalStorage.setItem(LocalStorage.COUNT_PLAY_FRIEND, 0);
                }

                // if (data.hasOwnProperty(LocalStorage.COUNT_ITEM_CHANGE_COLOR)) {
                //     LocalStorage.setItem(LocalStorage.COUNT_ITEM_CHANGE_COLOR, data[LocalStorage.COUNT_ITEM_CHANGE_COLOR])
                // } else {
                //     LocalStorage.setItem(LocalStorage.COUNT_ITEM_CHANGE_COLOR, 0);
                // }

                // if (data.hasOwnProperty(LocalStorage.DAILY_COLLECT)) {
                //     LocalStorage.setItem(LocalStorage.DAILY_COLLECT, data[LocalStorage.DAILY_COLLECT])
                // } else {
                //     LocalStorage.setItem(LocalStorage.DAILY_COLLECT, false);
                // }
                // if (data.hasOwnProperty(LocalStorage.CURRENT_DAILY_COLLECT)) {
                //     LocalStorage.setItem(LocalStorage.CURRENT_DAILY_COLLECT, data[LocalStorage.CURRENT_DAILY_COLLECT])
                // } else {
                //     LocalStorage.setItem(LocalStorage.CURRENT_DAILY_COLLECT, 0);
                // }


                if (data.hasOwnProperty(LocalStorage.TOTAL_COLLECT_SPIN)) {
                    // LocalStorage.setItem(LocalStorage.TOTAL_COLLECT_SPIN, 5);

                    LocalStorage.setItem(LocalStorage.TOTAL_COLLECT_SPIN, data[LocalStorage.TOTAL_COLLECT_SPIN])
                } else {
                    LocalStorage.setItem(LocalStorage.TOTAL_COLLECT_SPIN, 3);
                }
                if (data.hasOwnProperty(LocalStorage.CURRENT_SPIN)) {
                    LocalStorage.setItem(LocalStorage.CURRENT_SPIN, data[LocalStorage.CURRENT_SPIN])
                } else {
                    LocalStorage.setItem(LocalStorage.CURRENT_SPIN, 0);
                }
                let currentTime = new Date().getTime();
                // // console.log("currentTime: ", currentTime);
                if (data.hasOwnProperty(LocalStorage.TIME_GET_SPIN)) {
                    LocalStorage.setItem(LocalStorage.TIME_GET_SPIN, data[LocalStorage.TIME_GET_SPIN])
                } else {
                    LocalStorage.setItem(LocalStorage.TIME_GET_SPIN, currentTime);
                }
                if (data.hasOwnProperty(LocalStorage.DATA_GET_MORE_SPIN)) {
                    if (data[LocalStorage.DATA_GET_MORE_SPIN] == undefined) {
                        data[LocalStorage.DATA_GET_MORE_SPIN] = {};
                    }
                    LocalStorage.setItem(LocalStorage.DATA_GET_MORE_SPIN, data[LocalStorage.DATA_GET_MORE_SPIN])
                } else {
                    LocalStorage.setItem(LocalStorage.DATA_GET_MORE_SPIN, {});
                }


                if (data.hasOwnProperty(LocalStorage.COUNT_FREE_GIFT) && data[LocalStorage.COUNT_FREE_GIFT] != undefined) {
                    // LocalStorage.setItem(LocalStorage.COUNT_FREE_GIFT, 0);
                    LocalStorage.setItem(LocalStorage.COUNT_FREE_GIFT, data[LocalStorage.COUNT_FREE_GIFT])
                } else {
                    LocalStorage.setItem(LocalStorage.COUNT_FREE_GIFT, 0);
                }

                if (data.hasOwnProperty(LocalStorage.DATA_INVITE_FRIEND)) {
                    LocalStorage.setItem(LocalStorage.DATA_INVITE_FRIEND, data[LocalStorage.DATA_INVITE_FRIEND])
                } else {
                    LocalStorage.setItem(LocalStorage.DATA_INVITE_FRIEND, {});
                }

                let currentDate = Utils.getSqlDate();
                if (data[RewardAds.CURRENT_DATE] !== currentDate) {
                    // console.log("sang ngay khac ----")
                    LocalStorage.setItem(RewardAds.CURRENT_DATE, currentDate);
                    // LocalStorage.setItem(LocalStorage.CURRENT_DAILY_COLLECT, LocalStorage.getItem(LocalStorage.CURRENT_DAILY_COLLECT) + 1);
                    // LocalStorage.setItem(LocalStorage.DAILY_COLLECT, false);
                    LocalStorage.setItem(LocalStorage.TOTAL_COLLECT_SPIN, 3);
                    LocalStorage.setItem(LocalStorage.CURRENT_SPIN, MainData.instance().currentSpin + 2);
                    LocalStorage.setItem(LocalStorage.TIME_GET_SPIN, currentTime);
                    LocalStorage.setItem(LocalStorage.DATA_GET_MORE_SPIN, {});
                    LocalStorage.setItem(LocalStorage.COUNT_FREE_GIFT, 0);

                    // if (!MainData.instance().isLocal) A2UController.instance.sendNotification()
                }
                this.hideLoading();
                this.checkFistLogin();
                this.showData();
            })
            .catch((error) => {
                console.log("error: ", error);
                this.hideLoading();
                LocalStorage.setItem(LocalStorage.IS_NEW, false);
                LocalStorage.setItem(LocalStorage.HIGHT_SCORE, 0);
                LocalStorage.setItem(LocalStorage.CURRENT_GOLD, 0);
                LocalStorage.setItem(LocalStorage.BOOSTER_ROCKET, 0);
                LocalStorage.setItem(LocalStorage.BOOSTER_BOMB, 0);
                LocalStorage.setItem(LocalStorage.BOOSTER_HAMMER, 0);
                LocalStorage.setItem(LocalStorage.BOOSTER_REVERSE, 0);
                LocalStorage.setItem(hightScoreTour, 0);
                LocalStorage.setItem(LocalStorage.COUNT_PLAY_FRIEND, 0);
                LocalStorage.setItem(LocalStorage.COUNT_FREE_GIFT, 0);
                // LocalStorage.setItem(LocalStorage.DAILY_COLLECT, false);
                // LocalStorage.setItem(LocalStorage.CURRENT_DAILY_COLLECT, 1);
                LocalStorage.setItem(LocalStorage.CURRENT_SPIN, 0);
                LocalStorage.setItem(LocalStorage.TIME_GET_SPIN, 0);
                LocalStorage.setItem(LocalStorage.DATA_INVITE_FRIEND, {});
                LocalStorage.setItem(LocalStorage.DATA_GET_MORE_SPIN, {});
                // MainData.instance().ktGenDataScore = true;
                this.checkFistLogin();

                this.showData();
            });
    }

    checkFistLogin() {
        if (MainData.instance().ktFistLogin == true) {
            MainData.instance().ktFistLogin = false;
            let entryPointData = FBInstant.getEntryPointData();
            if (entryPointData) {
                if (entryPointData['challenge'] != undefined) {
                    let dataFriend = {};
                    dataFriend["avatar"] = entryPointData["avatar"]
                    dataFriend["name"] = entryPointData["name"]
                    dataFriend["id"] = entryPointData["id"]
                    dataFriend["score"] = entryPointData["score"]
                    dataFriend["isFb"] = true;
                    MainData.instance().dataFriendPlay = dataFriend;
                }
            }

            SoundManager.instance().playSoungBg();

            FBInstant.startGameAsync()
            .then(() => {
                
                InterstitialManager.instance.init();
                RewardAds.instance.init();
                BannerAds.instance.init();
            });
            //GlobalEvent.instance().dispatchEvent(GlobalEvent.SWITCH_SCENES, { idScene: SCENE.game });
            GlobalEvent.instance().dispatchEvent(GlobalEvent.SWITCH_SCENES, { idScene: SCENE.home });
            // this.onHandlerPlayNow();
            // A2UController.instance.sendNotiDelay();
            // new SharePictureScoreAttack(43243, () => { });
            // new SharePictureScore1(46548, () => { });
            // new SharePictureScore(43242, () => { });
            this.popupController.preLoadBundle();
        }
        cc.tween(this.node).delay(1).call(() => {

            let currentTime = new Date().getTime();
            // console.log("currentTime: ", currentTime);
            let timeBeginGetSpin = parseFloat(LocalStorage.getItem(LocalStorage.TIME_GET_SPIN));
            // console.log("timeBeginGetSpin: ", timeBeginGetSpin);
            let space = Math.round(currentTime - timeBeginGetSpin) / 1000;
            // console.log("space: ", space);
            if (space > 1800) {
                LocalStorage.setItem(LocalStorage.CURRENT_SPIN, MainData.instance().currentSpin + 1);
                LocalStorage.setItem(LocalStorage.TIME_GET_SPIN, currentTime);
            } else {
                MainData.instance().totalTimeGetSpin = 1800 - space;
            }


        }).start();


        // GlobalEvent.instance().dispatchEvent(GlobalEvent.SHOW_TUTORIAL)

    }

    showData() {
        GlobalEvent.instance().dispatchEvent(GlobalEvent.UPDATE_GOLD_GAME);
    }


    hideLoading() {

    }
    showLoading() {

    }
}
