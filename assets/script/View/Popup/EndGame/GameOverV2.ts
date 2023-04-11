import GlobalEvent from "../../../component/event/GlobalEvent";
import FaceBook from "../../../component/package/FaceBook";
import CreatePlayerRank from "../../../component/pool/CreatePlayerRank";
import RankOther from "../../../component/pool/RankOther";
import LocalStorage from "../../../component/storage/LocalStorage";
import MainData from "../../../component/storage/MainData";

const { ccclass, property } = cc._decorator;
const beginX: number = 0;
const spaceX: number = 125;
@ccclass
export default class GameOverV2 extends cc.Component {

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
    backHightScore: number = 0;
    backHightScoreTour: number = 0;
    arrDataRank = [];
    @property(cc.Node)
    btnFriends: cc.Node = null;
    @property(cc.Node)
    btnContinute: cc.Node = null;
    @property(cc.Node)
    btnShare: cc.Node = null;
    itemRankMe: cc.Node = null;

    // LIFE-CYCLE CALLBACKS:
    onLoad() {
        this.ktOnLoad = true;
        if (this.ktShow == true) {
            this.show(this.score, this.rankMe, this.arrDataRank);
        }
        GlobalEvent.instance().addEventListener(GlobalEvent.SHOW_ADS_INTER_COMPLETE, this.showAdsComplete, this);
    }
    onDestroy(): void {
        GlobalEvent.instance().removeEventListener(GlobalEvent.SHOW_ADS_INTER_COMPLETE, this.showAdsComplete, this);
    }
    start() {

    }
    show(score: number, rankMe: number, arrDataRank: any = []) {
        this.backHightScore = parseInt(LocalStorage.getItem(LocalStorage.HIGHT_SCORE));
        let hightScoreTour = "hightScoreTour" + MainData.instance().idTour;
        this.backHightScoreTour = parseInt(LocalStorage.getItem(hightScoreTour));
        this.score = score;
        if (this.backHightScore < this.score) {
            LocalStorage.setItem(LocalStorage.HIGHT_SCORE, score);
        }
        this.rankMe = rankMe;
        this.arrDataRank = arrDataRank;
        this.showRank();
    }
    protected onDisable(): void {
        while (this.layoutRank.childrenCount > 0) {
            if (this.itemRankMe == this.layoutRank.children[0]) {
                this.layoutRank.removeChild(this.layoutRank.children[0]);
            } else {
                // this.layoutRank.children[0].off("CHALLENGE", this.challengePlayer, this);       
                // CreatePlayerRank.instance().removeItemRank(this.layoutRank.children[0]);
            }

        }
    }
    showRank() {
        let contextId = FBInstant.context.getID();
        if (contextId != null) {
            FaceBook.shareScore(this.score);
        }

        this.btnFriends.active = false;
        this.btnContinute.active = false;
        this.btnShare.active = false;
        this.bgRotation.active = false;
        this.star.active = false;

        if (this.ktOnLoad == false) {
            this.ktShow = true;
            return;
        }
        this.ktShow = false;
        this.onDisable();
        let dataScore = {
            score: 0
        }
        this.txtScore.string = "0";
        this.layoutRank.stopAllActions();
        this.nodeRankMe.active = true;
        this.nodeRankMe.opacity = 255;
        this.nodeRankMe.getChildByName("txtRank").getComponent(cc.Label).string = this.rankMe + "";
        this.nodeRankMe.getChildByName("txtScore").getComponent(cc.Label).string = "0";
        this.nodeRankMe.getChildByName("avatar").getComponent(cc.Sprite).spriteFrame = CreatePlayerRank.instance().defaultAvatar;
        let urlImage = FaceBook.getPhoto();
        if (urlImage == "" || urlImage == null) {
        } else {
            cc.assetManager.loadRemote(urlImage, { ext: '.jpg' }, (err, imageAsset: cc.Texture2D) => {
                if (imageAsset == null) {
                    return;
                }
                if (err) {
                    return;
                }
                const spriteFrame = new cc.SpriteFrame(imageAsset);
                this.nodeRankMe.getChildByName("avatar").getComponent(cc.Sprite).spriteFrame = spriteFrame;
            });
        }
        cc.tween(dataScore).to(1, { score: this.score }, {
            progress: (start: number, end: number, current: number, ratio: number) => {
                this.txtScore.string = Math.round(ratio * this.score) + "";
                this.nodeRankMe.getChildByName("txtScore").getComponent(cc.Label).string = Math.round(ratio * this.score) + "";
            }
        }).call(() => {
            // SoundManager.instance().playEffect("end_game");
            this.txtScore.string = this.score + "";
            this.nodeRankMe.getChildByName("txtScore").getComponent(cc.Label).string = this.score + "";
            this.bgRotation.active = true;
            this.star.active = true;
        }).start();
        let rankOut = this.arrDataRank.length - this.rankMe;
        if (rankOut > 0) {
            if (rankOut < this.arrDataRank.length) {
                for (let i = 0; i < rankOut; i++) {
                    this.arrDataRank[i].rank = this.arrDataRank[i].rank + 1;
                }
            }
            if (rankOut < this.arrDataRank.length) {
                for (let i = rankOut; i < this.arrDataRank.length; i++) {
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
                let itemRank = CreatePlayerRank.instance().createItemRank();
                itemRank.getComponent(RankOther).setData(this.arrDataRank[i]);
                itemRank.on("CHALLENGE", this.challengePlayer, this);
                itemRank.scale = 1;
                itemRank.getChildByName("txtRank").getComponent(cc.Label).string = this.arrDataRank[i].rank;
                itemRank.getChildByName("txtScore").getComponent(cc.Label).string = this.arrDataRank[i].score;
                itemRank.getChildByName("avatar").getComponent(cc.Sprite).spriteFrame = CreatePlayerRank.instance().defaultAvatar;
                if (this.arrDataRank[i].isFb == false) {
                    cc.resources.preload("profiles/" + this.arrDataRank[i].avatar, (err) => {
                        cc.resources.load("profiles/" + this.arrDataRank[i].avatar, cc.Texture2D, (err, avatar: cc.Texture2D) => {
                            if (!err) {
                                const spriteFrame = new cc.SpriteFrame(avatar);
                                itemRank.getChildByName("avatar").getComponent(cc.Sprite).spriteFrame = spriteFrame;
                            }
                        })
                    })
                } else {
                    cc.assetManager.loadRemote(this.arrDataRank[i].avatar, { ext: '.jpg' }, (err, imageAsset: cc.Texture2D) => {
                        if (imageAsset == null) {
                            return;
                        }
                        if (err) {
                            return;
                        }
                        const spriteFrame = new cc.SpriteFrame(imageAsset);
                        itemRank.getChildByName("avatar").getComponent(cc.Sprite).spriteFrame = spriteFrame;
                    });
                }

                this.layoutRank.addChild(itemRank);
            }

        }
        if (this.itemRankMe) {
            let urlImage = FaceBook.getPhoto();
            if (urlImage == "" || urlImage == null) {
            } else {
                cc.assetManager.loadRemote(urlImage, { ext: '.jpg' }, (err, imageAsset: cc.Texture2D) => {
                    if (imageAsset == null) {
                        return;
                    }
                    if (err) {
                        return;
                    }
                    const spriteFrame = new cc.SpriteFrame(imageAsset);
                    this.itemRankMe.getChildByName("avatar").getComponent(cc.Sprite).spriteFrame = spriteFrame;
                });
            }
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
        console.log("sizeChangeComplete------------", this.arrDataRank);
        console.log("this.layoutRank: ", this.layoutRank);
        let abc = this.layoutRank.children[this.arrDataRank.length - this.rankMe];
        if (this.rankMe < this.arrDataRank.length / 2) {
            this.listScroll.scrollToLeft(0);
        } else {
            this.listScroll.scrollToRight(0);
        }

        this.listScroll.scrollToOffset(new cc.Vec2(abc.x - 45, abc.y), 3);
        cc.tween(this.node).delay(2.5).call(() => {
            this.itemRankMe.y = 0;
            this.itemRankMe.opacity = 0;
            cc.tween(this.itemRankMe).to(0.5, { opacity: 255 }).call(() => {
                this.itemRankMe.getChildByName("bgRotation").active = true;
                this.itemRankMe.getChildByName("star").active = true;
            }).start();

            cc.tween(this.nodeRankMe).to(0.4, { opacity: 0 }).call(() => {
                this.nodeRankMe.active = false;
            }).start();

        }).delay(1).call(() => {
            this.btnFriends.active = true;
            this.btnContinute.active = true;
            this.btnShare.active = true;

            for (let i = 0; i < this.layoutRank.childrenCount; i++) {
                let iconChallenge = this.layoutRank.children[i].getChildByName("iconChallenge");
                if (iconChallenge) iconChallenge.active = true;
            }

            // if(InterstitialManager.instance.ready == true){
            //     InterstitialManager.instance.show();
            // }else{
            //     this.showAdsComplete();
            // }        
        }).start();
    }
    showAdsComplete() {
        // this.game.showLoading();
        GlobalEvent.instance().dispatchEvent(GlobalEvent.SHOW_LOADING);
        if (MainData.instance().ktJoinTour == true) {
            if (this.backHightScoreTour < this.score) {
                let hightScoreTour = "hightScoreTour" + MainData.instance().idTour;
                LocalStorage.setItem(hightScoreTour, this.score);
                FBInstant.tournament.shareAsync({
                    score: this.score,
                    data: {
                    }
                }).then(() => {
                    // this.game.hideLoading();
                    GlobalEvent.instance().dispatchEvent(GlobalEvent.HIDE_LOADING);
                }).catch(() => {
                    // this.game.hideLoading();
                    GlobalEvent.instance().dispatchEvent(GlobalEvent.HIDE_LOADING);
                });
            } else {
                // this.game.hideLoading();
                GlobalEvent.instance().dispatchEvent(GlobalEvent.HIDE_LOADING);
            }
        } else {
            if (MainData.instance().countEndGame == 0) {
                cc.resources.load("images/bannersharetour", (err, texture) => {
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
                                // this.game.hideLoading();
                                GlobalEvent.instance().dispatchEvent(GlobalEvent.HIDE_LOADING);
                            }).catch(() => {
                                // this.game.hideLoading();
                                GlobalEvent.instance().dispatchEvent(GlobalEvent.HIDE_LOADING);
                            });
                    } catch (error) {
                        // this.game.hideLoading();
                        GlobalEvent.instance().dispatchEvent(GlobalEvent.HIDE_LOADING);
                    }
                })
            } else {
                // this.game.hideLoading();
                GlobalEvent.instance().dispatchEvent(GlobalEvent.HIDE_LOADING);
            }
            MainData.instance().countEndGame++;
            if (MainData.instance().countEndGame == 2) {
                MainData.instance().countEndGame = 0;
            }
        }
    }
    onHandlerPlayGlobal() {
        // SoundManager.instance().playEffect("button");
        // this.game.showLoading();
        GlobalEvent.instance().dispatchEvent(GlobalEvent.SHOW_LOADING);
        FBInstant
            .checkCanPlayerMatchAsync()
            .then(canMatch => {
                if (canMatch) {
                    FBInstant
                        .matchPlayerAsync("globalUser", false, true)
                        .then(() => {
                            this.node.emit("PLAY_AGAIN");
                        }).catch(() => {
                            // this.game.hideLoading();
                            GlobalEvent.instance().dispatchEvent(GlobalEvent.HIDE_LOADING);
                            this.node.emit("PLAY_AGAIN");
                        })
                } else {
                    // this.game.hideLoading();
                    GlobalEvent.instance().dispatchEvent(GlobalEvent.HIDE_LOADING);
                    this.node.emit("PLAY_AGAIN");
                }
            }).catch(() => {
                // this.game.hideLoading();
                GlobalEvent.instance().dispatchEvent(GlobalEvent.HIDE_LOADING);
                this.node.emit("PLAY_AGAIN");
            });
    }
    onHandlerReplay() {
        // SoundManager.instance().playEffect("button");
        this.node.emit("PLAY_AGAIN");
    }
    onHandlerPlayWithFriend() {
        // SoundManager.instance().playEffect("button");
        if (window["FBInstant"] == undefined) return;
        // this.game.showLoading();
        GlobalEvent.instance().dispatchEvent(GlobalEvent.SHOW_LOADING);
        FBInstant.context
            .chooseAsync()
            .then(() => {
                console.log(FBInstant.context.getID());
                let contextId = FBInstant.context.getID();
                FBInstant.context
                    .createAsync(contextId)
                    .then(() => {
                        let str = '\"' + FBInstant.player.getName() + '\"' + ' got ' + this.score + ' score. Can you beat them.';
                        cc.resources.load(FaceBook.getImageShareFacebook(), (err, texture) => {
                            FBInstant.updateAsync({
                                action: 'CUSTOM',
                                cta: 'Play',
                                image: FaceBook.getImgBase64(texture),
                                text: str,
                                template: 'challenge',
                                data: {
                                    challenge: true,
                                    id: FBInstant.player.getID(),
                                    score: this.score,
                                    avatar: FBInstant.player.getPhoto(),
                                    name: FBInstant.player.getName()
                                },
                                strategy: 'IMMEDIATE'
                            }).then(() => {
                                this.node.emit("PLAY_AGAIN");
                            }).catch(() => {
                                this.node.emit("PLAY_AGAIN");
                            });
                        })
                    })
                    .catch(() => {
                        this.node.emit("PLAY_AGAIN");
                    });
            }).catch(() => {
                // this.game.hideLoading();
                GlobalEvent.instance().dispatchEvent(GlobalEvent.HIDE_LOADING);
                this.node.emit("PLAY_AGAIN");
            });
    }
    onHandlerShare() {
        // SoundManager.instance().playEffect("button");
        if (window["FBInstant"] == undefined) return;
        GlobalEvent.instance().dispatchEvent(GlobalEvent.SHOW_LOADING);
        // this.game.showLoading();
        cc.resources.load(FaceBook.getImageShareFacebook(), (err, texture) => {
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
                switchContext: false
            }).then(() => {
                GlobalEvent.instance().dispatchEvent(GlobalEvent.HIDE_LOADING);
                // this.game.hideLoading();
            }).catch(() => {
                // this.game.hideLoading();
                GlobalEvent.instance().dispatchEvent(GlobalEvent.HIDE_LOADING);
            });
        })
    }
    onHandlerMainMenu() {
        cc.director.loadScene("MainMenu", (err: any) => {

        });
    }
    challengePlayer(dataPlayer) {
        console.log("challengePlayer: ", dataPlayer);
        // this.game.showLoading();
        GlobalEvent.instance().dispatchEvent(GlobalEvent.SHOW_LOADING);
        MainData.instance().dataFriendPlay = dataPlayer;
        if (dataPlayer.isFb == true) {
            FBInstant.context
                .createAsync(MainData.instance().dataFriendPlay.id)
                .then(() => {
                    this.updateAsync();
                    this.node.emit("PLAY_AGAIN");
                    GlobalEvent.instance().dispatchEvent(GlobalEvent.HIDE_LOADING);
                    // this.game.hideLoading();
                }).catch(() => {
                    this.node.emit("PLAY_AGAIN");

                    GlobalEvent.instance().dispatchEvent(GlobalEvent.HIDE_LOADING);
                    // this.game.hideLoading();
                })
        } else {
            this.node.emit("PLAY_AGAIN");
        }

    }
    updateAsync() {
        let str = '\"' + FBInstant.player.getName() + '\"' + ' got ' + this.score + ' score. Can you beat them.';
        cc.resources.load(FaceBook.getImageShareFacebook(), (err, texture) => {
            FBInstant.updateAsync({
                action: 'CUSTOM',
                cta: 'Play',
                image: FaceBook.getImgBase64(texture),
                text: str,
                template: 'challenge',
                data: {
                    challenge: true,
                    id: FBInstant.player.getID(),
                    score: this.score,
                    avatar: FBInstant.player.getPhoto(),
                    name: FBInstant.player.getName()
                },
                strategy: 'IMMEDIATE'
            })
        })
    }
    // update (dt) {}
}
