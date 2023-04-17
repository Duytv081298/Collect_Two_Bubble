import { SCENE } from "../../../component/constant/constant";
import GlobalEvent from "../../../component/event/GlobalEvent";
import { PlayfabManager } from "../../../component/package/PlayfabManager";
import MainData from "../../../component/storage/MainData";

const { ccclass, property } = cc._decorator;

@ccclass
export default class HomeController extends cc.Component {

    protected onEnable(): void {
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



    // reloadRanking() {
    //     // console.log("reloadRanking");
    //     // this.contentRanking.removeAllChildren();
    //     PlayfabManager.install.getLeaderboardGlobal(PlayfabManager.WEEKLY).then((dataRank) => {
    //         console.log("dataRank: ", dataRank);
    //         for (let i = 0; i < dataRank.length; i++) {
    //             let name: String = dataRank[i].DisplayName;
    //             let arrName = name.split("_");
    //             let itemRank = instantiate(this.userRanking);
    //             itemRank.getComponent(userRanking).setUp(
    //                 arrName[0],
    //                 dataRank[i].StatValue,
    //                 dataRank[i].Profile.AvatarUrl,
    //                 dataRank[i].Position + 1,
    //                 dataRank[i].PlayFabId
    //             )
    //             this.contentRanking.addChild(itemRank);
    //         }
    //         this.showRankBot(dataRank[dataRank.length - 1].Position + 1)
    //     })


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
