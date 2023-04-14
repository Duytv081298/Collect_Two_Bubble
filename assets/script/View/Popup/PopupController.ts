import GlobalEvent from "../../component/event/GlobalEvent";
import MainData from "../../component/storage/MainData";
import GameOver from "./EndGame/GameOver";
import { OpenGift } from "./Gift/OpenGift";
import NoMoves from "./NoMove/NoMoves";
import { Setting } from "./Setting/Setting";
import { VideoRewards } from "./Video Rewards/VideoRewards";

const { ccclass, property } = cc._decorator;

@ccclass
export default class PopupController extends cc.Component {

    noMove: cc.Node = null;
    endGame: cc.Node = null;
    setting: cc.Node = null;
    gift: cc.Node = null;
    inviteFriend: cc.Node = null;
    videoRewards: cc.Node = null;

    ktShowNoMoves: boolean = false;
    ktShowEndGame: boolean = false;
    ktShowSetting: boolean = false;
    ktShowGift: boolean = false;

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

        GlobalEvent.instance().addEventListener(GlobalEvent.SHOW_INVITE_FRIEND_POPUP, this.showInviteFriend, this);
        GlobalEvent.instance().addEventListener(GlobalEvent.SHOW_VIDEO_REWARDS_POPUP, this.showVideoRewards, this);
    }
    protected onDisable(): void {

        GlobalEvent.instance().removeEventListener(GlobalEvent.SHOW_NO_MOVE_POPUP, this.showNoMoves, this);
        GlobalEvent.instance().removeEventListener(GlobalEvent.SHOW_GAME_OVER_POPUP, this.showEndGame, this);
        GlobalEvent.instance().removeEventListener(GlobalEvent.SHOW_SETTING_POPUP, this.showSetting, this);
        GlobalEvent.instance().removeEventListener(GlobalEvent.SHOW_GIFT, this.showGift, this);

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
                    this.setting.active = this.ktShowSetting;
                    this.setting.setParent(this.node)
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
                    this.noMove.active = this.ktShowNoMoves;
                    this.noMove.setParent(this.node)
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
                    this.endGame.active = this.ktShowEndGame;
                    this.endGame.setParent(this.node);
                    if (this.ktShowEndGame == true) {
                        this.showEndGame();
                    }
                }
            }
        });
    }
    preLoadGift() {
        cc.resources.preload("prefab/HopQua/Opent_Gift", cc.Prefab, (err) => {

            if (this.gift == null || !this.gift.active) this.loadGift();
        });
    }
    loadGift() {
        cc.resources.load("prefab/HopQua/Opent_Gift", cc.Prefab, (err, prefab: cc.Prefab) => {
            if (!err) {
                if (this.gift == null) {
                    this.gift = cc.instantiate(prefab);
                    this.gift.active = this.ktShowGift;
                    this.gift.setParent(this.node);
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
                    this.inviteFriend.active = this.ktInviteFriend;
                    this.inviteFriend.setParent(this.node);
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
                    this.videoRewards.active = this.ktVideoRewards;
                    this.videoRewards.setParent(this.node);
                    if (this.ktVideoRewards == true) {
                        this.showGift();
                    }
                }
            }
        });
    }
    showNoMoves() {
        if (MainData.instance().isShowNoMove) return;
        if (this.noMove != null) {
            this.hideLoading();
            MainData.instance().isShowNoMove = true;
            this.ktShowNoMoves = false;
            this.noMove.active = true;
            this.noMove.getComponent(NoMoves).show();
        } else {
            this.showLoading();
            this.ktShowNoMoves = true;
            this.loadNoMove();
        }
    }


    showEndGame() {
        // console.log("showEndGame------------")
        if (this.noMove) this.noMove.active = false;
        if (this.endGame != null) {
            this.hideLoading();
            this.ktShowEndGame = false;
            this.endGame.active = true;
            // let arrDataRank = this.arrPlayerRank.concat();
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
            this.setting.getComponent(Setting).showPopup();
        } else {
            this.showLoading();
            this.ktShowSetting = true;
            this.loadSetting();
        }
    }


    showGift() {

        if (this.gift != null) {

            this.hideLoading();
            if (this.gift.active == true) return;
            this.ktShowGift = false;
            this.gift.active = true;
            this.gift.getComponent(OpenGift).show();
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
            this.videoRewards.getComponent(VideoRewards).show();
        } else {
            this.showLoading();
            this.ktVideoRewards = true;
            this.loadVideoRewards();
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
