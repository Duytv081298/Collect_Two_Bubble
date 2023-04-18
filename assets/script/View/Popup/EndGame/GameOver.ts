import RewardAds from "../../../component/ads/RewardAds";
import PlayerLocal from "../../../component/component/PlayerLocal";
import { SCENE } from "../../../component/constant/constant";
import GlobalEvent from "../../../component/event/GlobalEvent";
import FaceBook from "../../../component/package/FaceBook";
import CreatePlayerRank from "../../../component/pool/CreatePlayerRank";
import RankOther from "../../../component/pool/RankOther";
import MainData from "../../../component/storage/MainData";

const { ccclass, property } = cc._decorator;
const beginX: number = 0;
const spaceX: number = 125;
@ccclass
export default class GameOver extends cc.Component {

    @property(cc.Node)
    nodeRankMe: cc.Node = null;
    @property(cc.Node)
    bgRotation: cc.Node = null;
    @property(cc.Node)
    star: cc.Node = null;
    @property(cc.Node)
    layoutRank: cc.Node = null;
    @property(cc.ScrollView)
    listScroll: cc.ScrollView = null;
    @property(cc.Label)
    txtScore: cc.Label = null;
    ktOnLoad: boolean = false;
    ktShow: boolean = false;
    score: number = 0;
    rankMe: number = 0;
    backHightScoreTour: number = 0;
    arrDataRank = [];
    itemRankMe: cc.Node = null;


    @property(cc.Button)
    btnShare: cc.Button = null;
    @property(cc.Label)
    lbReward: cc.Label = null;
    @property(cc.Button)
    btnClaimX3: cc.Button = null;
    @property(cc.Button)
    btnHome: cc.Button = null;
    @property(cc.Button)
    btnPlayFriends: cc.Button = null;
    @property(cc.Button)
    btnPlayAgain: cc.Button = null;


    // @property(Animation)
    // aniCoin: Animation = null;
    // @property(Node)
    // nodeToCoin: Node = null;
    amountReward: number = 60;
    isClaimX3: boolean = false;
    isClaim: boolean = false;

    // LIFE-CYCLE CALLBACKS:
    onLoad() {
        this.ktOnLoad = true;
        if (this.ktShow == true) {
            this.show();
        }
    }
    onEnable() {
        GlobalEvent.instance().addEventListener(GlobalEvent.REWARD_ADS_ON_READY, this.readyAds, this);
        GlobalEvent.instance().addEventListener(GlobalEvent.REWARD_ADS_ON_REWARD, this.adsReward, this);
    }
    protected onDisable(): void {
        this.reset();
        GlobalEvent.instance().removeEventListener(GlobalEvent.REWARD_ADS_ON_READY, this.readyAds, this);
        GlobalEvent.instance().removeEventListener(GlobalEvent.REWARD_ADS_ON_REWARD, this.adsReward, this);
    }

    removeAllPlayerRank() {
        while (this.layoutRank.childrenCount > 0) {
            if (this.itemRankMe == this.layoutRank.children[0]) {
                this.layoutRank.removeChild(this.layoutRank.children[0]);
            } else {
                // this.layoutRank.children[0].off("CHALLENGE", this.challengePlayer, this);       
                CreatePlayerRank.instance().removeItemRank(this.layoutRank.children[0]);
            }

        }
    }

    showReward() {

        // FaceBook.logEvent(LogEventName.claimx3EndGame)  
        RewardAds.instance.show(RewardAds.REWARDED_COIN)
    }
    readyAds() {
        if (!this.isClaimX3) this.activeBtnClaimX3(RewardAds.instance.ready);
    }
    adsReward(data) {
        if (data.type == RewardAds.REWARDED_COIN) {
            this.ClaimX3();
            this.activeBtnClaimX3(false);
        }
    }

    claimCoin() {
        if (this.isClaim) return;
        this.isClaim = true;
        GlobalEvent.instance().dispatchEvent(GlobalEvent.UPDATE_GOLD_GAME, { gold: this.isClaimX3 ? this.amountReward * 3 : this.amountReward });
    }
    ClaimX3() {
        let maxCoin = this.amountReward * 3;
        let minCoin = this.amountReward;

        this.aniUpCoin(minCoin, maxCoin);
        this.isClaimX3 = true;
        this.activeBtnClaimX3(false);

    }

    aniUpCoin(minCoin: number, maxCoin: number) {
        // SoundManager.instance().playEffect("GetReward");
        let kc = maxCoin - minCoin;
        let dataCoin = {
            score: 0
        }
        cc.tween(dataCoin).to(0.5, { score: this.score }, {
            progress: (start: number, end: number, current: number, ratio: number) => {
                this.lbReward.string = "+ " + (minCoin + Math.round(ratio * kc));
            }
        }).call(() => {
            this.lbReward.string = "+ " + maxCoin;
        }).start();
    }
    show() {
        // console.log("showEndGame------------")
        this.reset();

        GlobalEvent.instance().dispatchEvent(GlobalEvent.UPDATE_HIGHT_SCORE);
        // let backHightScore = parseInt(LocalStorage.getItem(LocalStorage.HIGHT_SCORE));
        this.score = MainData.instance().score;
        // if (backHightScore < this.score) {
        //     LocalStorage.setItem(LocalStorage.HIGHT_SCORE, this.score);
        // }
        this.rankMe = MainData.instance().rankMe > 0 ? MainData.instance().rankMe : 1;
        this.arrDataRank = MainData.instance().arrDataRank.concat();
        this.showRank();
    }
    reset() {
        this.isClaim = false;
        this.isClaimX3 = false;
        this.lbReward.string = "+ " + this.amountReward;

        this.btnShare.node.active = false;
        this.btnHome.node.active = false;
        this.btnPlayFriends.node.active = false;
        this.btnPlayAgain.node.active = false;
        this.bgRotation.active = false;
        this.star.active = false;
        this.readyAds();

        this.nodeRankMe.active = false;
        this.nodeRankMe.stopAllActions();
        this.removeAllPlayerRank();
        this.node.stopAllActions();
        this.layoutRank.stopAllActions();
        if (this.itemRankMe) this.itemRankMe.stopAllActions();
        this.layoutRank.off(cc.Node.EventType.SIZE_CHANGED);
    }
    showRank() {
        // console.log("this.rankMe: " + this.rankMe);

        let contextId = FBInstant.context.getID();
        if (contextId != null) {
            FaceBook.shareScore(this.score);
        }

        if (this.ktOnLoad == false) {
            this.ktShow = true;
            return;
        }
        this.ktShow = false;

        let dataScore = {
            score: 0
        }
        this.txtScore.string = "0";
        this.layoutRank.stopAllActions();
        this.nodeRankMe.active = true;
        this.nodeRankMe.opacity = 255;
        this.nodeRankMe.getChildByName("txtRank").getComponent(cc.Label).string = this.rankMe > 0 ? this.rankMe.toString() : "1";
        this.nodeRankMe.getChildByName("txtScore").getComponent(cc.Label).string = "0";
        this.nodeRankMe.getChildByName("avatar").getComponent(cc.Sprite).spriteFrame = CreatePlayerRank.instance().defaultAvatar;

        FaceBook.showAvatarMe(this.nodeRankMe.getChildByName("avatar").getComponent(cc.Sprite));

        cc.tween(dataScore).to(1, { score: this.score }, {
            progress: (start: number, end: number, current: number, ratio: number) => {
                this.txtScore.string = Math.round(ratio * this.score) + "";
                this.nodeRankMe.getChildByName("txtScore").getComponent(cc.Label).string = Math.round(ratio * this.score) + "";
            }
        }).call(() => {
            this.txtScore.string = this.score + "";
            this.nodeRankMe.getChildByName("txtScore").getComponent(cc.Label).string = this.score + "";
        }).delay(0.5).call(() => {
            this.btnShare.node.active = true;
            this.btnHome.node.active = true;
            this.btnPlayFriends.node.active = true;
            this.btnPlayAgain.node.active = true;
        }).start();
        let rankOut = this.arrDataRank.length - this.rankMe;
        // console.log("rankOut: " + rankOut);

        if (rankOut > 0) {
            if (rankOut < this.arrDataRank.length) {
                for (let i = 0; i < rankOut; i++) {
                    this.arrDataRank[i].rank = this.arrDataRank[i].rank + 1;
                }
            }
        }
        let itemRank1 = CreatePlayerRank.instance().createItemRank();
        itemRank1.opacity = 0;
        let itemRank2 = CreatePlayerRank.instance().createItemRank();
        itemRank2.opacity = 0;
        this.layoutRank.addChild(itemRank1);
        this.layoutRank.addChild(itemRank2);
        if (rankOut == 0) {
            this.itemRankMe = cc.instantiate(this.nodeRankMe);
            this.itemRankMe.opacity = 0;
            this.layoutRank.addChild(this.itemRankMe);
        }
        for (let i = 0; i < this.arrDataRank.length; i++) {
            if (rankOut > 0 && i == rankOut) {
                this.itemRankMe = cc.instantiate(this.nodeRankMe);
                this.itemRankMe.opacity = 0;
                this.layoutRank.addChild(this.itemRankMe);
            } else {
                if (this.arrDataRank[i].rank == 0) continue;
                // console.log(this.arrDataRank[i]);

                let itemRank = CreatePlayerRank.instance().createItemRank();
                // console.log(itemRank.getComponent(RankOther));

                itemRank.getComponent(RankOther).setData(this.arrDataRank[i]);
                // itemRank.on("CHALLENGE", this.challengePlayer, this);
                itemRank.scale = 1;
                itemRank.getChildByName("txtRank").getComponent(cc.Label).string = this.arrDataRank[i].rank;
                itemRank.getChildByName("txtScore").getComponent(cc.Label).string = this.arrDataRank[i].score;
                itemRank.getChildByName("avatar").getComponent(cc.Sprite).spriteFrame = CreatePlayerRank.instance().defaultAvatar;
                if (this.arrDataRank[i].isFb == false) {
                    // cc.resources.preload("profiles/" + this.arrDataRank[i].avatar, (err) => {
                    //     cc.resources.load("profiles/" + this.arrDataRank[i].avatar, cc.Texture2D, (err, avatar: cc.Texture2D) => {
                    //         if (!err) {
                    //             const spriteFrame = new cc.SpriteFrame(avatar);
                    //             itemRank.getChildByName("avatar").getComponent(cc.Sprite).spriteFrame = spriteFrame;
                    //         }
                    //     })
                    // })


                    PlayerLocal.instance().setSprite(itemRank.getChildByName("avatar").getComponent(cc.Sprite), this.arrDataRank[i].avatar)
                } else {
                    // cc.assetManager.loadRemote(this.arrDataRank[i].avatar, { ext: '.jpg' }, (err, imageAsset: cc.Texture2D) => {
                    //     if (imageAsset == null) {
                    //         return;
                    //     }
                    //     if (err) {
                    //         return;
                    //     }
                    //     const spriteFrame = new cc.SpriteFrame(imageAsset);
                    //     itemRank.getChildByName("avatar").getComponent(cc.Sprite).spriteFrame = spriteFrame;
                    // });

                    FaceBook.loadRemote(itemRank.getChildByName("avatar").getComponent(cc.Sprite), this.arrDataRank[i].avatar);
                }

                this.layoutRank.addChild(itemRank);
            }

        }
        if (this.itemRankMe) {
            FaceBook.showAvatarMe(this.itemRankMe.getChildByName("avatar").getComponent(cc.Sprite));
            this.itemRankMe.getChildByName("txtScore").getComponent(cc.Label).string = this.score + "";
        }
        let itemRank4 = CreatePlayerRank.instance().createItemRank();
        itemRank4.opacity = 0;
        let itemRank5 = CreatePlayerRank.instance().createItemRank();
        itemRank5.opacity = 0;
        this.layoutRank.addChild(itemRank4);
        this.layoutRank.addChild(itemRank5);

        this.layoutRank.on(cc.Node.EventType.SIZE_CHANGED, this.sizeChangeComplete, this);
    }
    sizeChangeComplete() {
        // console.log("sizeChangeComplete------------", this.arrDataRank);
        // console.log("this.layoutRank: ", this.layoutRank);
        let abc = this.layoutRank.children[this.arrDataRank.length - this.rankMe];
        if (this.rankMe < this.arrDataRank.length / 2) {
            this.listScroll.scrollToLeft(0);
        } else {
            this.listScroll.scrollToRight(0);
        }

        this.listScroll.scrollToOffset(new cc.Vec2(abc.x - 45, abc.y), 1.5);
        cc.tween(this.node).delay(1).call(() => {
            this.itemRankMe.y = 0;
            this.itemRankMe.opacity = 0;
            cc.tween(this.itemRankMe).to(0.5, { opacity: 255 }).call(() => {
                this.itemRankMe.getChildByName("bgRotation").active = true;
                this.itemRankMe.getChildByName("star").active = true;
            }).start();

            cc.tween(this.nodeRankMe).to(0.4, { opacity: 0 }).call(() => {
                this.nodeRankMe.active = false;
            }).start();

        }).delay(0.5).call(() => {
            this.autoShareScore();
        }).start();
    }
    autoShareScore() {
        GlobalEvent.instance().dispatchEvent(GlobalEvent.SHOW_LOADING);
        if (MainData.instance().countEndGame == 0) {
            cc.resources.load(FaceBook.getImageShareFacebook(), (err, texture) => {
                let tomorrow = new Date();
                tomorrow.setDate(tomorrow.getDate() + 1);
                let endTime = Math.floor(tomorrow.getTime() / 1000);
                try {
                    FBInstant.tournament.createAsync(
                        {
                            initialScore: this.score,
                            data: {
                            },
                            config: {
                                title: 'Tournament',
                                image: FaceBook.getImgBase64(texture),
                                sortOrder: 'HIGHER_IS_BETTER',
                                scoreFormat: 'NUMERIC',
                                endTime: endTime
                            },
                        }).then(() => {
                            GlobalEvent.instance().dispatchEvent(GlobalEvent.HIDE_LOADING);
                        }).catch(() => {
                            GlobalEvent.instance().dispatchEvent(GlobalEvent.HIDE_LOADING);
                        });
                } catch (error) {
                    GlobalEvent.instance().dispatchEvent(GlobalEvent.HIDE_LOADING);
                }
            })
        } else {
            GlobalEvent.instance().dispatchEvent(GlobalEvent.HIDE_LOADING);
        }
        MainData.instance().countEndGame++;
        if (MainData.instance().countEndGame == 2) {
            MainData.instance().countEndGame = 0;
        }

    }


    onHandlerPlayWithFriends() {
        // SoundManager.instance().playEffect("button");

        // FaceBook.logEvent(LogEventName.playFriendsEndGame)   
        GlobalEvent.instance().dispatchEvent(GlobalEvent.SHOW_LOADING);
        MainData.instance().dataFriendPlay = null;
        if (MainData.instance().idxPlayFriends < MainData.instance().friends.length) {
            FBInstant.context
                .createAsync(MainData.instance().friends[MainData.instance().idxPlayFriends].id)
                .then(() => {
                    MainData.instance().dataFriendPlay = MainData.instance().friends[MainData.instance().idxPlayFriends];
                    MainData.instance().idxPlayFriends++;
                    GlobalEvent.instance().dispatchEvent(GlobalEvent.HIDE_LOADING);
                    this.onHandlerReplay()
                }).catch(() => {
                    GlobalEvent.instance().dispatchEvent(GlobalEvent.HIDE_LOADING);
                    this.onHandlerReplay()
                })
        } else {
            FBInstant.context
                .chooseAsync({
                    filters: ['NEW_PLAYERS_ONLY'],
                    maxSize: 2
                })
                .then(() => {
                    GlobalEvent.instance().dispatchEvent(GlobalEvent.HIDE_LOADING);
                    this.onHandlerReplay()
                }).catch(() => {
                    GlobalEvent.instance().dispatchEvent(GlobalEvent.HIDE_LOADING);
                    this.onHandlerReplay()
                });
        }
    }
    onHandlerShare() {
        // console.log("onHandlerShare ======");

        // SoundManager.instance().playEffect("button");
        if (window["FBInstant"] == undefined) return;
        GlobalEvent.instance().dispatchEvent(GlobalEvent.SHOW_LOADING);
        // console.log("onHandlerShare +++++");

        cc.resources.load(FaceBook.getImageShareFacebook(), (err, texture) => {
            // console.log(texture);

            FBInstant.shareAsync({
                image: FaceBook.getImgBase64(texture),
                text: FBInstant.player.getName() + " invited you to play",
                data: {
                    challenge: true,
                    id: FBInstant.player.getID(),
                    score: this.score,
                    avatar: FBInstant.player.getPhoto(),
                    name: FBInstant.player.getName()
                },
                intent: "SHARE",
                switchContext: false
            }).then(() => {
                // console.log("then");

                GlobalEvent.instance().dispatchEvent(GlobalEvent.HIDE_LOADING);
            }).catch((e) => {
                // console.log(e);

                GlobalEvent.instance().dispatchEvent(GlobalEvent.HIDE_LOADING);

            });
        })
    }
    onHandlerMainMenu() {
        this.hide();
        GlobalEvent.instance().dispatchEvent(GlobalEvent.SWITCH_SCENES, { idScene: SCENE.home });
    }

    onHandlerReplay() {
        // SoundManager.instance().playEffect("button");
        GlobalEvent.instance().dispatchEvent(GlobalEvent.SWITCH_SCENES, { idScene: SCENE.game });
        GlobalEvent.instance().dispatchEvent(GlobalEvent.REPLAY_GAME);
        this.hide();
    }
    hide() {
        this.claimCoin();
        this.reset();
        this.node.active = false;
    }
    activeBtnClaimX3(status: boolean) {
        this.btnClaimX3.interactable = status;
    }

    // update (dt) {}
}
