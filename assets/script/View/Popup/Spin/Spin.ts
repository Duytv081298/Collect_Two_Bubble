import PlayerLocal from "../../../component/component/PlayerLocal";
import { Utils } from "../../../component/component/Utils";
import GlobalEvent from "../../../component/event/GlobalEvent";
import FaceBook from "../../../component/package/FaceBook";
import SharePictureScoreAttack from "../../../component/share/SharePictureScoreAttack";
import LocalStorage from "../../../component/storage/LocalStorage";
import MainData from "../../../component/storage/MainData";

const { ccclass, property } = cc._decorator;

class DataPlayer {
    avatar: string;
    name: string;
    coin: number;
    isFb: boolean;
};
@ccclass
export class Spin extends cc.Component {
    @property(cc.Node)
    wheel: cc.Node = null;
    @property(cc.Button)
    btnPlay: cc.Button = null;
    @property(cc.Sprite)
    avatar: cc.Sprite = null;
    @property(cc.Label)
    txtName: cc.Label = null;
    @property(cc.Label)
    txtCoin: cc.Label = null;
    @property(cc.Label)
    txtCountSpin: cc.Label = null;
    @property(cc.Node)
    hightLight: cc.Node = null;
    @property(cc.Node)
    startCoin: cc.Node = null;
    @property(cc.Node)
    endCoin: cc.Node = null;

    endPosGold: cc.Vec3 = null;
    @property(cc.SpriteFrame)
    defaultAvatar: cc.SpriteFrame = null;
    @property(cc.Button)
    btnGetMore: cc.Button = null;

    @property(cc.Animation)
    animationBungGold: cc.Animation = null;
    @property
    speed: number = 500;
    // LIFE-CYCLE CALLBACKS:
    ktQuay: boolean = false;
    angel: number = 0;
    slicePrizes = ["steal1", "gift1", "100", "attack1", "200", "steal2", "gift2", "400", "attack2", "300"];
    dataResult = null;

    dataPlayer: any = null;
    countPlayFriends: number = 0;
    isFriendShow: any = null;
    protected onLoad(): void {
        GlobalEvent.instance().addEventListener(GlobalEvent.SHOW_SPIN, this.show, this);
    }
    protected onDestroy(): void {
        GlobalEvent.instance().removeEventListener(GlobalEvent.SHOW_SPIN, this.show, this);
    }
    onEnable() {
        
        GlobalEvent.instance().addEventListener(GlobalEvent.SHOW_ATTACK, this.showAttack, this);
        GlobalEvent.instance().addEventListener(GlobalEvent.UPDATE_TIME_SPIN_IN_SPIN, this.updateTimeSpin, this);
        GlobalEvent.instance().addEventListener(GlobalEvent.ANIMATION_GOLD_SPIN, this.playAnimationGold, this);
        GlobalEvent.instance().addEventListener(GlobalEvent.CHANGE_USER_SPIN, this.nextUser, this);
        GlobalEvent.instance().addEventListener(GlobalEvent.SHOW_STEAL, this.showStealPlayer, this);
    }
    onDisable() {
       
        GlobalEvent.instance().removeEventListener(GlobalEvent.SHOW_ATTACK, this.showAttack, this);
        GlobalEvent.instance().removeEventListener(GlobalEvent.UPDATE_TIME_SPIN_IN_SPIN, this.updateTimeSpin, this);
        GlobalEvent.instance().removeEventListener(GlobalEvent.ANIMATION_GOLD_SPIN, this.playAnimationGold, this);
        GlobalEvent.instance().removeEventListener(GlobalEvent.CHANGE_USER_SPIN, this.nextUser, this);
        GlobalEvent.instance().removeEventListener(GlobalEvent.SHOW_STEAL, this.showStealPlayer, this);
    }
    start() {        
    }
    update(deltaTime: number) {
    }
    show() {
        console.log("Spin show");
        this.node.active = true;
        GlobalEvent.instance().dispatchEvent(GlobalEvent.HIDE_LOADING);
        this.hightLight.active = false;
        MainData.instance().currentSpin = 100;
        this.nextUser();
        this.updateSpin();
        this.reset();
    }
    nextUser() {
        this.avatar.spriteFrame = this.defaultAvatar;
        var listFriends = MainData.instance().friends;
        if (listFriends.length > 0 && this.countPlayFriends < listFriends.length) {
            var friend = listFriends[this.countPlayFriends]
            this.dataPlayer = {
                avatar: friend.avatar,
                name: friend.name,
                coin: Math.floor(Math.random() * 501 + 500),
                isFb: true
            }

            this.isFriendShow = friend;
        } else {
            let name = PlayerLocal.instance().getPlayerSpin();
            this.dataPlayer = {
                avatar: name,
                name: name,
                coin: Math.floor(Math.random() * 501 + 500),
                isFb: false
            }
            this.isFriendShow = null;
        }

        if (this.dataPlayer.avatar) {
            if (this.dataPlayer.isFb) {
                FaceBook.loadRemote(this.avatar, this.dataPlayer.avatar);
            } else {
                PlayerLocal.instance().setSprite(this.avatar, this.dataPlayer.avatar)
            }
        }
        this.txtName.string = this.dataPlayer.name;
        this.txtCoin.string = "$ " + this.dataPlayer.coin;
    }

    updateSpin() {
        // console.log("MainData.instance().currentSpin: " + MainData.instance().currentSpin);

        if (MainData.instance().currentSpin < 1) {
            this.txtCountSpin.string = "";
            this.updateTimeSpin();
        } else {
            this.txtCountSpin.string = MainData.instance().currentSpin + "";
        }
        this.setActiveGetMoreSpin();
    }
    updateTimeSpin() {
        // console.log(MainData.instance().total_collect_spin);

        if (MainData.instance().total_collect_spin <= 0) return;
        if (MainData.instance().currentSpin < 1) {
            if (!this.ktQuay) this.txtCountSpin.string = Utils.convertTimeToText(MainData.instance().totalTimeGetSpin);
        }
    }
    hide() {
        if (this.ktQuay === false)
            this.node.active = false;
    }
    reset() {
        this.dataResult = null;
        this.angel = 0;
        this.speed = 500;
        this.wheel.angle = 0;
        this.ktQuay = false;
        this.btnPlay.interactable = true;
        this.hightLight.active = false;


        this.animationBungGold.node.children.forEach((child: cc.Node) => {
            child.setPosition(cc.Vec3.ZERO);
        });
        this.animationBungGold.node.active = false;
    }

    onHandlerWheel() {
        if (this.ktQuay == true) return;
        if (MainData.instance().currentSpin <= 0) return;

        // FaceBook.logEvent(LogEventName.playSpin)
        this.ktQuay = true;       
        // SoundManager.instance().playEffect("lucky_spin");
        this.hightLight.active = false;
        LocalStorage.setItem(LocalStorage.CURRENT_SPIN, MainData.instance().currentSpin - 1);
        this.updateSpin();
        this.btnPlay.interactable = false;
        this.wheel.angle = 0;
        let rd1 = 0;
        let rd = Utils.randomInt(0, 99);


        // console.log("rd: ", rd);

        // coin 2-4-7-9 : 0-> 43
        //gift 1-6: 44->53
        // attack 3-8: 54->73
        //steal 0-5: 74->99


        // rd = 55;

        let localWin = 0;
        if (rd < 15) {
            localWin = 2;
        } else if (rd > 14 && rd < 27) {
            localWin = 4;
        } else if (rd > 26 && rd < 37) {
            localWin = 9;
        } else if (rd > 36 && rd < 44) {
            localWin = 7;
        } else if (rd > 43 && rd < 54) {
            rd1 = Utils.randomInt(0, 1);
            if (rd1 == 1) {
                localWin = 1;
            } else {
                localWin = 6;
            }
        } else if (rd > 53 && rd < 74) {
            rd1 = Utils.randomInt(0, 1);
            if (rd1 == 1) {
                localWin = 3;
            } else {
                localWin = 8;
            }
        } else {
            rd1 = Utils.randomInt(0, 1);
            if (rd1 == 1) {
                localWin = 0;
            } else {
                localWin = 5;
            }
        }
       // localWin = 0;
        let dataResult = {
            value: this.slicePrizes[localWin]
        }
        this.spinResult(dataResult);

    }

    spinResult(data) {
        this.dataResult = data;
        // console.log("this.dataResult: ", this.dataResult);
        let degrees = this.slicePrizes.indexOf(data.value) * 36;
        this.wheel.stopAllActions()
        cc.tween(this.wheel).to(5, { angle: 360 * 5 - (degrees) }, { easing: "cubicOut" }).call(() => {
            this.hightLight.active = true;
        }).delay(1.5).call(() => {
            this.hightLight.active = false;
            this.showResult();
        }).start();
    }
    showResult() {
        if (this.dataResult == null) {
            this.btnPlay.interactable = true;
            this.ktQuay = false;
            return;
        }
        if (
            this.dataResult.value == "100" ||
            this.dataResult.value == "200" ||
            this.dataResult.value == "300" ||
            this.dataResult.value == "400"
        ) {
            MainData.instance().updateGold(parseInt(this.dataResult.value));
            this.playAnimationGold();
            // this.showEffectGold(parseInt(this.dataResult.value));
        } else if (this.dataResult.value == "gift1" || this.dataResult.value == "gift2") {
            this.showEffectGift();
        } else if (this.dataResult.value == "attack1" || this.dataResult.value == "attack2") {
            this.showAttack();
        } else if (this.dataResult.value == "steal1" || this.dataResult.value == "steal2") {
            this.showSteal();
        }
        this.btnPlay.interactable = true;
        this.ktQuay = false;
        this.dataResult = null;

    }
    showSteal() {     
        
        if (this.isFriendShow == null) {
            this.showChooseAChest(false)
        } else {
            this.countPlayFriends++;           
            FBInstant.context
                .createAsync(this.isFriendShow.id)
                .then(() => {
                    this.showChooseAChest(false)
                    new SharePictureScoreAttack(0, (dataImage) => {
                        if (dataImage == null) {
                            return;
                        }
                        FBInstant.updateAsync({
                            action: 'CUSTOM',
                            cta: 'Check now',
                            image: dataImage,
                            text: "Oh no, your friends stole coin from you",
                            template: 'challenge',
                            data: {
                                challenge: true,
                                id: FBInstant.player.getID(),
                                avatar: FBInstant.player.getPhoto(),
                                name: FBInstant.player.getName()
                            },
                            strategy: 'IMMEDIATE'
                        }).then(() => {
                            //this.showChooseAChest(false)
                        }).catch(() => {
                           // this.showChooseAChest(false)
                        });
                    })

                }).catch(() => {
                    //this.showChooseAChest(false);
                    this.showDialogNotAttack(false);
                    // GlobalEvent.instance().dispatchEvent(GlobalEvent.SHOW_FOUR_GIFT , {dataPlayer: this.dataPlayer, isAttack: false})
                })

        }



    }
    showChooseAChest(isAttack: boolean) {

        GlobalEvent.instance().dispatchEvent(GlobalEvent.SHOW_FOUR_GIFT, { dataPlayer: this.dataPlayer, isAttack: isAttack })
        // if (!isAttack) game.emit("OPEN_CHOOSE_A_CHEST", this.dataPlayer, isAttack);
        // else game.emit("OPEN_CHOOSE_A_CHEST", null, isAttack);
       
    }
    showStealPlayer(){
        this.showSteal();
    }
    showAttack() {
        // console.log("showAttack ============");
        FBInstant.context
            .chooseAsync({
                filters: ['NEW_PLAYERS_ONLY'],
                maxSize: 2               
            })
            .then(() => {
                this.showChooseAChest(true);
                let arrStr = [
                    "Can't believe your friend destroyed your reward!",
                    FBInstant.player.getName() + " ruined  your prize. Devastated!",
                    "Reward destroyed by " + FBInstant.player.getName() + ". Feeling betrayed.",
                    FBInstant.player.getName() + "  wrecked your treasure. Heartbroken"
                ]
                new SharePictureScoreAttack(0, (dataImage) => {
                    if (dataImage == null) {
                        return;
                    }
                    FBInstant.updateAsync({
                        action: 'CUSTOM',
                        cta: 'Raid now',
                        image: dataImage,
                        text: arrStr[Utils.randomInt(0, arrStr.length - 1)],
                        template: 'challenge',
                        data: {
                            challenge: true,
                            id: FBInstant.player.getID(),
                            avatar: FBInstant.player.getPhoto(),
                            name: FBInstant.player.getName()
                        },
                        strategy: 'IMMEDIATE'
                    }).then(() => {
                       // this.showChooseAChest(true);
                    }).catch(() => {
                        //this.showChooseAChest(true);
                    });
                })
            }).catch((err) => {
                console.log("err: ", err);
                if(err.code == "SAME_CONTEXT")
                {
                    this.showDialogNotAttack(true, true);
                }else{
                    this.showDialogNotAttack();
                }
                
            });
    }
    showDialogNotAttack(isAttack:boolean = true, sameContext:boolean = false) {
        GlobalEvent.instance().dispatchEvent(GlobalEvent.SHOW_FORFEIT_ATTACK, {isAttack, sameContext});
    }
    showEffectGift() {
        GlobalEvent.instance().dispatchEvent(GlobalEvent.SHOW_GIFT, { isSpin: true });
    }
    onHandlerGetMoreSpin() {

        // FaceBook.logEvent(LogEventName.getMoreSpin)
        FBInstant.context
            .chooseAsync()
            .then(() => {
                let contextId = FBInstant.context.getID();
                if (MainData.instance().dataGetMoreSpin.hasOwnProperty(contextId)) {
                } else {
                    MainData.instance().dataGetMoreSpin[contextId] = 1;
                    LocalStorage.setItem(LocalStorage.DATA_GET_MORE_SPIN, MainData.instance().dataGetMoreSpin);
                    LocalStorage.setItem(LocalStorage.CURRENT_SPIN, MainData.instance().currentSpin + 1);
                    this.updateSpin();
                }
                FaceBook.getMoreSpin(contextId);
            }).catch((e) => {
            });
    }


    setActiveGetMoreSpin() {
        var status = MainData.instance().currentSpin < 10;
        this.btnGetMore.interactable = status;
        if (status) this.btnGetMore.getComponent(cc.Animation).play()
        else this.btnGetMore.getComponent(cc.Animation).stop()
    }
    playAnimationGold() {
        this.animationBungGold.node.active = true;
        this.animationBungGold.play();
        this.animationBungGold.on(cc.Animation.EventType.FINISHED, this.onAnimationEvent, this)
        let pos = this.endCoin.parent.convertToWorldSpaceAR(this.endCoin.position)
        this.endPosGold = this.animationBungGold.node.convertToNodeSpaceAR(pos);
    }
    onAnimationEvent(type: cc.Animation.EventType, state: cc.AnimationState) {
        for (let i = 0; i < this.animationBungGold.node.childrenCount; i++) {
            let child = this.animationBungGold.node.children[i];
            child.active = true;
            this.move(child, i * 0.06);
        }
        cc.tween({}).delay(0.65).call(() => {
            GlobalEvent.instance().dispatchEvent(GlobalEvent.UPDATE_GOLD_GAME);
            this.animationBungGold.node.active = false;
        }).start();
    }

    move(child: cc.Node, timePlus: number) {
        var oldPost = new cc.Vec3(child.position.x, child.position.y, 0);
        let point2 = new cc.Vec3(-1 * Utils.randomInt(oldPost.x, this.endPosGold.x), Utils.randomInt(oldPost.y, this.endPosGold.y))

        cc.tween(child)
            .to(0.35 + timePlus, { position: cc.Vec3.ZERO }, {
                onUpdate: (target1: cc.Vec3, ratio: number) => {
                    child.position = Utils.twoBezier(ratio, oldPost, point2, this.endPosGold)
                }, easing: "backIn"
            })
            .call(() => {
                child.active = false;
                child.setPosition(cc.Vec3.ZERO);
            })
            .start();
    }
}


