import GlobalEvent from "../../component/event/GlobalEvent";
import MainData from "../../component/storage/MainData";
import GameOver from "./EndGame/GameOver";
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
    inviteFriend: cc.Node = null;
    videoRewards: cc.Node = null;

    ktShowNoMoves: boolean = false;
    ktShowEndGame: boolean = false;
    ktShowSetting: boolean = false;
    ktShowGift: boolean = false;
    ktShowSpin: boolean = false;
    ktInviteFriend: boolean = false;
    ktVideoRewards: boolean = false;
    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        this.preLoadNoMove();
        this.preLoadEndGame();
        this.preLoadSetting();
        this.preLoadGift();
        this.preLoadInviteFriends();
        this.preLoadVideoRewards();
    }

    protected onEnable(): void {

        GlobalEvent.instance().addEventListener(GlobalEvent.SHOW_NO_MOVE_POPUP, this.showNoMoves, this);
        GlobalEvent.instance().addEventListener(GlobalEvent.SHOW_GAME_OVER_POPUP, this.showEndGame, this);
        GlobalEvent.instance().addEventListener(GlobalEvent.SHOW_SETTING_POPUP, this.showSetting, this);
        GlobalEvent.instance().addEventListener(GlobalEvent.SHOW_GIFT, this.showGift, this);
        GlobalEvent.instance().addEventListener(GlobalEvent.SHOW_SPIN, this.showSpin, this);

        GlobalEvent.instance().addEventListener(GlobalEvent.SHOW_INVITE_FRIEND_POPUP, this.showInviteFriend, this);
        GlobalEvent.instance().addEventListener(GlobalEvent.SHOW_VIDEO_REWARDS_POPUP, this.showVideoRewards, this);
    }
    protected onDisable(): void {

        GlobalEvent.instance().removeEventListener(GlobalEvent.SHOW_NO_MOVE_POPUP, this.showNoMoves, this);
        GlobalEvent.instance().removeEventListener(GlobalEvent.SHOW_GAME_OVER_POPUP, this.showEndGame, this);
        GlobalEvent.instance().removeEventListener(GlobalEvent.SHOW_SETTING_POPUP, this.showSetting, this);
        GlobalEvent.instance().removeEventListener(GlobalEvent.SHOW_GIFT, this.showGift, this);
        GlobalEvent.instance().removeEventListener(GlobalEvent.SHOW_SPIN, this.showSpin, this);

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
        cc.resources.preload("prefab/NoMove/NoMoves", cc.Prefab, (err) => {
            if (this.noMove == null || !this.noMove.active) this.loadNoMove();
        });
    }
    loadNoMove() {
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

            if (this.gift == null || !this.gift.active) this.loadGift();
        });
    }
    loadGift() {
        cc.resources.load("prefab/HopQua/Open_Gift", cc.Prefab, (err, prefab: cc.Prefab) => {
            if (!err) {
                if (this.gift == null) {
                    this.gift = cc.instantiate(prefab);
                    this.gift.setParent(this.node);
                    this.gift.name = "OpenGift";
                    this.gift.active = false;
                    if (this.ktShowGift == true) {
                        this.showGift();
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
                        this.showGift();
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



    showNoMoves() {

        if (MainData.instance().isShowNoMove) return;
        if (this.noMove != null) {
            console.log("showNoMoves");
            this.hideLoading();
            MainData.instance().isShowNoMove = true;
            this.ktShowNoMoves = false;
            this.noMove.active = true;
            // this.noMove.setSiblingIndex(this.node.children.length)
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
            console.log("showEndGame")
            this.hideLoading();
            this.ktShowEndGame = false;
            this.endGame.active = true;
            // this.endGame.setSiblingIndex(this.node.children.length)
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
            // this.setting.setSiblingIndex(this.node.children.length)
            this.setting.getComponent(Setting).showPopup();
        } else {
            this.showLoading();
            this.ktShowSetting = true;
            this.loadSetting();
        }
    }
    showGift() {
        if (this.noMove && this.noMove.active) return;
        if (this.gift != null) {
            this.hideLoading();
            if (this.gift.active == true) return;
            this.ktShowGift = false;
            this.gift.active = true;
            // this.gift.setSiblingIndex(this.node.children.length)
            this.gift.getComponent(OpenGift).show();
            console.log(this.gift.name);

        } else {
            this.showLoading();
            this.ktShowGift = true;
            this.loadGift();
        }
    }
    showInviteFriend() {

        if (this.inviteFriend != null) {

            this.hideLoading();
            if (this.inviteFriend.active == true) return;
            this.ktInviteFriend = false;
            this.inviteFriend.active = true;
            // this.inviteFriend.setSiblingIndex(this.node.children.length)
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
            // this.videoRewards.setSiblingIndex(this.node.children.length)
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
            console.log("===========");

            if (this.spin.active == true) return;
            console.log("popup controller show spin");
            this.ktShowSpin = false;
            this.spin.active = true;
            // this.spin.setSiblingIndex(this.node.children.length)
            this.spin.getComponent(Spin).show();
        } else {
            this.showLoading();
            this.ktShowSpin = true;
            this.loadSpin();
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
