import GlobalEvent from "../../component/event/GlobalEvent";
import MainData from "../../component/storage/MainData";
import GameOver from "./EndGame/GameOver";
import { FourGift } from "./FourGift/FourGift";
import { OpenGift } from "./Gift/OpenGift";
import NoMoves from "./NoMove/NoMoves";
import { Setting } from "./Setting/Setting";
import { Spin } from "./Spin/Spin";
import { VideoRewards } from "./Video Rewards/VideoRewards";

const { ccclass, property } = cc._decorator;

@ccclass
export default class PopupController extends cc.Component {

    noMove: cc.Node = null;
    endGame: cc.Node = null;
    setting: cc.Node = null;
    gift: cc.Node = null;
    spin: cc.Node = null;
    fourGift: cc.Node = null;
    forfeitAttack: cc.Node = null;


    inviteFriend: cc.Node = null;
    videoRewards: cc.Node = null;
    help: cc.Node = null;

    ktShowNoMoves: boolean = false;
    ktShowEndGame: boolean = false;
    ktShowSetting: boolean = false;
    ktShowGift: boolean = false;
    ktShowSpin: boolean = false;
    ktShowFourGift: boolean = false;
    ktShowForfeitAttack: boolean = false;


    ktInviteFriend: boolean = false;
    ktVideoRewards: boolean = false;
    ktHelp: boolean = false;
    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        this.preLoadNoMove();
        this.preLoadEndGame();
        this.preLoadSetting();
        this.preLoadGift();
        this.preLoadInviteFriends();
        this.preLoadVideoRewards();
        this.preLoadHelp();
        this.preLoadFourGift();
        this.preLoadForfeitAttack()
    }

    protected onEnable(): void {

        GlobalEvent.instance().addEventListener(GlobalEvent.SHOW_NO_MOVE_POPUP, this.showNoMoves, this);
        GlobalEvent.instance().addEventListener(GlobalEvent.SHOW_GAME_OVER_POPUP, this.showEndGame, this);
        GlobalEvent.instance().addEventListener(GlobalEvent.SHOW_SETTING_POPUP, this.showSetting, this);
        GlobalEvent.instance().addEventListener(GlobalEvent.SHOW_GIFT, this.showGift, this);
        GlobalEvent.instance().addEventListener(GlobalEvent.SHOW_SPIN, this.showSpin, this);
        GlobalEvent.instance().addEventListener(GlobalEvent.SHOW_FOUR_GIFT, this.showFourGift, this);
        GlobalEvent.instance().addEventListener(GlobalEvent.SHOW_FORFEIT_ATTACK, this.showForfeitAttack, this);
        GlobalEvent.instance().addEventListener(GlobalEvent.SHOW_HELP, this.showHelp, this);

        GlobalEvent.instance().addEventListener(GlobalEvent.SHOW_INVITE_FRIEND_POPUP, this.showInviteFriend, this);
        GlobalEvent.instance().addEventListener(GlobalEvent.SHOW_VIDEO_REWARDS_POPUP, this.showVideoRewards, this);
    }
    protected onDisable(): void {

        GlobalEvent.instance().removeEventListener(GlobalEvent.SHOW_NO_MOVE_POPUP, this.showNoMoves, this);
        GlobalEvent.instance().removeEventListener(GlobalEvent.SHOW_GAME_OVER_POPUP, this.showEndGame, this);
        GlobalEvent.instance().removeEventListener(GlobalEvent.SHOW_SETTING_POPUP, this.showSetting, this);
        GlobalEvent.instance().removeEventListener(GlobalEvent.SHOW_GIFT, this.showGift, this);
        GlobalEvent.instance().removeEventListener(GlobalEvent.SHOW_SPIN, this.showSpin, this);
        GlobalEvent.instance().removeEventListener(GlobalEvent.SHOW_FOUR_GIFT, this.showFourGift, this);
        GlobalEvent.instance().removeEventListener(GlobalEvent.SHOW_FORFEIT_ATTACK, this.showForfeitAttack, this);
        GlobalEvent.instance().removeEventListener(GlobalEvent.SHOW_HELP, this.showHelp, this);

        GlobalEvent.instance().removeEventListener(GlobalEvent.SHOW_INVITE_FRIEND_POPUP, this.showInviteFriend, this);
        GlobalEvent.instance().removeEventListener(GlobalEvent.SHOW_VIDEO_REWARDS_POPUP, this.showVideoRewards, this);
    }


    preLoadSetting() {
        cc.resources.preload("prefab/setting/Setting", cc.Prefab, (err) => {
            if (this.setting == null || !this.setting.active) this.loadSetting();
        });
    }
    loadSetting() {
        cc.resources.load("prefab/setting/Setting", cc.Prefab, (err, prefab: cc.Prefab) => {
            if (!err) {
                if (this.setting == null) {
                    this.setting = cc.instantiate(prefab);
                    this.setting.setParent(this.node)
                    this.setting.active = false;
                    if (this.ktShowSetting == true) {
                        this.showSetting();
                    }
                }

            }
        });
    }
    preLoadNoMove() {
        console.log("preLoadNoMove");
        cc.resources.preload("prefab/NoMove/NoMoves", cc.Prefab, (err) => {

            console.log("preLoadNoMove thanh cong");
            if (this.noMove == null || !this.noMove.active) this.loadNoMove();
        });
    }
    loadNoMove() {
        console.log("loadNoMove");
        cc.resources.load("prefab/NoMove/NoMoves", cc.Prefab, (err, prefab: cc.Prefab) => {
            if (!err) {
                if (this.noMove == null) {
                    this.noMove = cc.instantiate(prefab);
                    this.noMove.setParent(this.node)
                    this.noMove.active = false;
                    if (this.ktShowNoMoves == true) {
                        this.showNoMoves();
                    }
                }

            }
        });
    }
    preLoadEndGame() {
        cc.resources.preload("prefab/EndGame/EndGame", cc.Prefab, (err) => {
            if (this.endGame == null || !this.endGame.active) this.loadEndGame();
        });
    }
    loadEndGame() {
        cc.resources.load("prefab/EndGame/EndGame", cc.Prefab, (err, prefab: cc.Prefab) => {
            if (!err) {
                if (this.endGame == null) {
                    this.endGame = cc.instantiate(prefab);
                    // this.endGame.on("PLAY_AGAIN", this.playAgain, this);
                    this.endGame.setParent(this.node);
                    this.endGame.active = false;
                    if (this.ktShowEndGame == true) {
                        this.showEndGame();
                    }
                }
            }
        });
    }
    preLoadGift() {
        cc.resources.preload("prefab/HopQua/Open_Gift", cc.Prefab, (err) => {

            if (this.gift == null || !this.gift.active) this.loadGift(null);
        });
    }
    loadGift(data) {
        cc.resources.load("prefab/HopQua/Open_Gift", cc.Prefab, (err, prefab: cc.Prefab) => {
            if (!err) {
                if (this.gift == null) {
                    this.gift = cc.instantiate(prefab);
                    this.gift.setParent(this.node);
                    this.gift.name = "OpenGift";
                    this.gift.active = false;
                    if (data) {
                        this.showGift(data);
                    }
                }
            }
        });
    }
    preLoadInviteFriends() {
        cc.resources.preload("prefab/Invite friend/Invite friend", cc.Prefab, (err) => {
            if (this.inviteFriend == null || !this.inviteFriend.active) this.loadInviteFriends();
        });
    }
    loadInviteFriends() {
        cc.resources.load("prefab/Invite friend/Invite friend", cc.Prefab, (err, prefab: cc.Prefab) => {
            if (!err) {
                if (this.inviteFriend == null) {
                    this.inviteFriend = cc.instantiate(prefab);
                    this.inviteFriend.setParent(this.node);
                    this.inviteFriend.active = false;
                    if (this.ktInviteFriend == true) {
                        this.showInviteFriend();
                    }
                }
            }
        });
    }
    preLoadVideoRewards() {
        cc.resources.preload("prefab/Get Rewards/Video Rewards", cc.Prefab, (err) => {

            if (this.videoRewards == null || !this.videoRewards.active) this.loadVideoRewards();
        });
    }
    loadVideoRewards() {
        cc.resources.load("prefab/Get Rewards/Video Rewards", cc.Prefab, (err, prefab: cc.Prefab) => {
            if (!err) {
                if (this.videoRewards == null) {
                    this.videoRewards = cc.instantiate(prefab);
                    this.videoRewards.setParent(this.node);
                    this.videoRewards.active = false;
                    if (this.ktVideoRewards == true) {
                        this.showVideoRewards();
                    }
                }
            }
        });
    }
    preLoadSpin() {
        cc.resources.preload("prefab/spin/Spin", cc.Prefab, (err) => {

            if (this.spin == null || !this.spin.active) this.loadSpin();
        });
    }
    loadSpin() {
        cc.resources.load("prefab/spin/Spin", cc.Prefab, (err, prefab: cc.Prefab) => {
            if (!err) {
                if (this.spin == null) {
                    this.spin = cc.instantiate(prefab);
                    this.spin.setParent(this.node);
                    this.spin.active = false;
                    if (this.ktShowSpin == true) {
                        this.showSpin();
                    }
                }
            }
        });
    }


    preLoadHelp() {
        cc.resources.preload("prefab/help/Help", cc.Prefab, (err) => {

            if (this.help == null || !this.help.active) this.loadHelp();
        });
    }
    loadHelp() {
        cc.resources.load("prefab/help/Help", cc.Prefab, (err, prefab: cc.Prefab) => {
            if (!err) {
                if (this.help == null) {
                    this.help = cc.instantiate(prefab);
                    this.help.setParent(this.node);
                    this.help.active = false;
                    if (this.ktHelp == true) {
                        this.showHelp();
                    }
                }
            }
        });
    }


    preLoadFourGift() {
        cc.resources.preload("prefab/FourGift/FourGift", cc.Prefab, (err) => {

            if (this.fourGift == null || !this.fourGift.active) this.loadFourGift(null);
        });
    }
    loadFourGift(data) {
        cc.resources.load("prefab/FourGift/FourGift", cc.Prefab, (err, prefab: cc.Prefab) => {
            if (!err) {
                if (this.fourGift == null) {
                    this.fourGift = cc.instantiate(prefab);
                    this.fourGift.setParent(this.node);
                    this.fourGift.active = false;
                    if (data) {
                        this.showFourGift(data);
                    }
                }
            }
        });
    }


    preLoadForfeitAttack() {
        cc.resources.preload("prefab/Forfeit attack/Forfeit attack", cc.Prefab, (err) => {
            if (this.forfeitAttack == null || !this.forfeitAttack.active) this.loadForfeitAttack();
        });
    }
    loadForfeitAttack() {
        console.log("loadForfeitAttack");
        cc.resources.load("prefab/Forfeit attack/Forfeit attack", cc.Prefab, (err, prefab: cc.Prefab) => {
            if (!err) {
                if (this.forfeitAttack == null) {
                    this.forfeitAttack = cc.instantiate(prefab);
                    this.forfeitAttack.setParent(this.node);
                    this.forfeitAttack.active = false;
                    if (this.ktShowForfeitAttack) {
                        this.showForfeitAttack();
                    }
                }
            }
        });
    }
    showNoMoves() {

        if (MainData.instance().isShowNoMove) return;
        if (this.noMove != null) {
            console.log("showNoMoves");
            this.hideLoading();
            MainData.instance().isShowNoMove = true;
            this.ktShowNoMoves = false;
            this.noMove.active = true;
            this.noMove.setSiblingIndex(this.node.childrenCount)
            this.noMove.getComponent(NoMoves).show();
        } else {
            this.showLoading();
            this.ktShowNoMoves = true;
            this.loadNoMove();
        }
    }
    showEndGame() {
        if (this.noMove) this.noMove.active = false;
        if (this.endGame != null) {
            if (this.endGame.active) return;
            console.log("showEndGame")
            this.hideLoading();
            this.ktShowEndGame = false;
            this.endGame.active = true;
            this.endGame.setSiblingIndex(this.node.childrenCount)
            this.endGame.getComponent(GameOver).show();
        } else {
            this.showLoading();
            this.ktShowEndGame = true;
            this.loadEndGame();
        }
    }
    showSetting() {
        if (this.setting != null) {
            this.hideLoading();
            this.ktShowSetting = false;
            this.setting.active = true;
            this.setting.setSiblingIndex(this.node.childrenCount)
            this.setting.getComponent(Setting).showPopup();
        } else {
            this.showLoading();
            this.ktShowSetting = true;
            this.loadSetting();
        }
    }
    showGift(data) {
        if (this.noMove && this.noMove.active) return;
        if (this.gift != null) {
            this.hideLoading();
            if (this.gift.active == true) return;
            this.ktShowGift = false;
            this.gift.active = true;
            this.gift.setSiblingIndex(this.node.childrenCount)
            this.gift.getComponent(OpenGift).show(data);

        } else {
            this.showLoading();
            this.ktShowGift = true;
            this.loadGift(data);
        }
    }
    showInviteFriend() {

        if (this.inviteFriend != null) {

            this.hideLoading();
            if (this.inviteFriend.active == true) return;
            this.ktInviteFriend = false;
            this.inviteFriend.active = true;
            this.inviteFriend.setSiblingIndex(this.node.childrenCount)
        } else {
            this.showLoading();
            this.ktInviteFriend = true;
            this.loadInviteFriends();
        }
    }
    showVideoRewards() {
        if (this.videoRewards != null) {
            this.hideLoading();
            if (this.videoRewards.active == true) return;
            this.ktVideoRewards = false;
            this.videoRewards.active = true;
            this.videoRewards.setSiblingIndex(this.node.childrenCount)
            this.videoRewards.getComponent(VideoRewards).show();
        } else {
            this.showLoading();
            this.ktVideoRewards = true;
            this.loadVideoRewards();
        }
    }
    showSpin() {

        if (this.spin != null) {
            this.hideLoading();
            // console.log("===========");

            if (this.spin.active == true) return;
            // console.log("popup controller show spin");
            this.ktShowSpin = false;
            this.spin.active = true;
            this.spin.setSiblingIndex(this.node.childrenCount)
            // this.spin.setSiblingIndex(this.node.children.length)
            this.spin.getComponent(Spin).show();
        } else {
            this.showLoading();
            this.ktShowSpin = true;
            this.loadSpin();
        }
    }
    showHelp() {
        if (this.help != null) {
            this.hideLoading();
            this.ktHelp = false;
            this.help.active = true;
            this.help.setSiblingIndex(this.node.childrenCount)
        } else {
            this.showLoading();
            this.ktHelp = true;
            this.loadHelp();
        }
    }
    showFourGift(data) {
        if (this.fourGift != null) {
            if (this.fourGift.active) return;
            this.hideLoading();
            this.ktShowFourGift = false;
            this.fourGift.active = true;
            this.fourGift.setSiblingIndex(this.node.childrenCount)
            this.fourGift.getComponent(FourGift).show(data);
        } else {
            this.showLoading();
            this.ktShowFourGift = true;
            this.loadFourGift(data);
        }
    }
    showForfeitAttack() {
        // console.log(111111);
        
        if (this.forfeitAttack != null) {
            if (this.forfeitAttack.active) return;
            this.hideLoading();
            this.ktShowForfeitAttack = false;
            this.forfeitAttack.active = true;
            this.forfeitAttack.setSiblingIndex(this.node.childrenCount)
        } else {
            this.showLoading();
            this.ktShowForfeitAttack = true;
            this.loadForfeitAttack();
        }
    }
    hideLoading() {
        GlobalEvent.instance().dispatchEvent(GlobalEvent.HIDE_LOADING);
    }
    showLoading() {
        GlobalEvent.instance().dispatchEvent(GlobalEvent.SHOW_LOADING);
    }
    // update (dt) {}
}
