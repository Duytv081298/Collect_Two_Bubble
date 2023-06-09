import { SCENE } from "../../../component/constant/constant";
import GlobalEvent from "../../../component/event/GlobalEvent";
import { PlayfabManager } from "../../../component/package/PlayfabManager";
import LocalStorage from "../../../component/storage/LocalStorage";
import MainData from "../../../component/storage/MainData";

const { ccclass, property } = cc._decorator;

@ccclass
export default class HomeController extends cc.Component {
    @property(cc.Label)
    hight_score_home: cc.Label = null;

    @property(cc.Label)
    gold_home: cc.Label = null;

    protected onEnable(): void {
        GlobalEvent.instance().addEventListener(GlobalEvent.UPDATE_HIGHT_SCORE, this.updateHightScore, this);
        GlobalEvent.instance().addEventListener(GlobalEvent.UPDATE_GOLD_GAME, this.updateGold, this);
        this.updateHightScore();
        this.updateGold();
    }
    protected onDisable(): void {
        GlobalEvent.instance().removeEventListener(GlobalEvent.UPDATE_HIGHT_SCORE, this.updateHightScore, this);
        GlobalEvent.instance().removeEventListener(GlobalEvent.UPDATE_GOLD_GAME, this.updateGold, this);
    }
    updateHightScore() {
        let score = MainData.instance().score;
        let hightScore = parseInt(LocalStorage.getItem(LocalStorage.HIGHT_SCORE));
        PlayfabManager.install.updateScoreToLeaderboardAsync(PlayfabManager.WEEKLY, score);
        if (hightScore < score) {
            LocalStorage.setItem(LocalStorage.HIGHT_SCORE, score);
        }
        this.hight_score_home.string = LocalStorage.getItem(LocalStorage.HIGHT_SCORE).toString();
    }
    updateGold() {
        this.gold_home.string = MainData.instance().goldPlayer.toString();
    }
    onHanlderPlayGlobal() {
        // SoundManager.instance().playEffect("button");
        this.showLoading()
        FBInstant.checkCanPlayerMatchAsync()
            .then(canMatch => {
                // FaceBook.logEvent(LogEventName.clickBtnGlobal)
                // console.log("canMatch: ", canMatch);
                if (canMatch == true) {
                    FBInstant
                        .matchPlayerAsync("globalUser", false, true)
                        .then(() => {
                            this.hideLoading();
                            this.onHandlerPlayNow();
                        }).catch((err) => {
                            this.hideLoading();
                            this.onHandlerPlayNow();
                        })
                } else {
                    this.hideLoading();
                    this.onHandlerPlayNow();
                }
            }).catch(() => {
                this.hideLoading();
                this.onHandlerPlayNow();
                // FaceBook.logEvent(LogEventName.clickBtnGlobal)
            });
    }

    onHandlerPlayWithFriends() {
        // SoundManager.instance().playEffect("button");
        this.showLoading()
        MainData.instance().dataFriendPlay = null;
        // FaceBook.logEvent(LogEventName.playFriendsHome)
        if (MainData.instance().idxPlayFriends < MainData.instance().friends.length) {
            FBInstant.context
                .createAsync(MainData.instance().friends[MainData.instance().idxPlayFriends].id)
                .then(() => {
                    MainData.instance().dataFriendPlay = MainData.instance().friends[MainData.instance().idxPlayFriends];
                    MainData.instance().idxPlayFriends++;
                    this.hideLoading();
                    this.onHandlerPlayNow();
                }).catch(() => {
                    this.hideLoading();
                    this.onHandlerPlayNow();
                })
        } else {
            FBInstant.context
                .chooseAsync({
                    filters: ['NEW_PLAYERS_ONLY'],
                    maxSize: 2
                })
                .then(() => {
                    this.hideLoading();
                    this.onHandlerPlayNow();
                }).catch(() => {
                    this.hideLoading();
                    this.onHandlerPlayNow();
                });
        }
    }

    // onHandlerInviteFriends() {
    //     // SoundManager.instance().playEffect("button");
    //     this.showLoading()
    //     if (window["FBInstant"] == undefined) return;
    //     FBInstant.context
    //         .chooseAsync()
    //         .then(() => {
    //             console.log(FBInstant.context.getID());
    //             let contextId = FBInstant.context.getID();
    //             FBInstant.context
    //                 .createAsync(contextId)
    //                 .then(() => {
    //                     cc.resources.load(FaceBook.getImageShareFacebook(), (err, texture) => {
    //                         FBInstant.updateAsync({
    //                             action: 'CUSTOM',
    //                             cta: 'Play',
    //                             image: FaceBook.getImgBase64(texture),
    //                             text: '\"' + FBInstant.player.getName() + '\"' + ' ' + "Mời chơi",
    //                             template: 'challenge',
    //                             data: {
    //                             },
    //                             strategy: 'IMMEDIATE'
    //                         }).then(() => {
    //                             this.hideLoading();
    //                             this.onHandlerPlayNow();
    //                         }).catch(() => {
    //                             this.hideLoading();
    //                             this.onHandlerPlayNow();
    //                         });
    //                     })
    //                 })
    //                 .catch(() => {
    //                     this.hideLoading();
    //                     this.onHandlerPlayNow();

    //                 });
    //         }).catch(() => {
    //             this.hideLoading();
    //             this.onHandlerPlayNow();

    //         });
    // }




    clickSetting() {
        GlobalEvent.instance().dispatchEvent(GlobalEvent.SHOW_SETTING_POPUP);
    }

    clickInviteFriend() {
        GlobalEvent.instance().dispatchEvent(GlobalEvent.SHOW_INVITE_FRIEND_POPUP);
    }

    clickVideoRewards() {
        GlobalEvent.instance().dispatchEvent(GlobalEvent.SHOW_VIDEO_REWARDS_POPUP);
    }
    clickSpin() {
        GlobalEvent.instance().dispatchEvent(GlobalEvent.SHOW_SPIN);
    }

    onHandlerPlayNow() {
        GlobalEvent.instance().dispatchEvent(GlobalEvent.SWITCH_SCENES, { idScene: SCENE.game });
    }

    hideLoading() {
        GlobalEvent.instance().dispatchEvent(GlobalEvent.HIDE_LOADING);
    }
    showLoading() {
        GlobalEvent.instance().dispatchEvent(GlobalEvent.SHOW_LOADING);
    }
}
