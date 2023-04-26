// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import GlobalEvent from "../../component/event/GlobalEvent";
import BaseLoad, { DataScreen } from "./base/BaseLoad";

const {ccclass, property} = cc._decorator;
const noMove:DataScreen = new DataScreen("noMove", "prefab/NoMove/NoMoves", GlobalEvent.SHOW_NO_MOVE_POPUP);
const gameOver:DataScreen = new DataScreen("gameOver", "prefab/EndGame/EndGame", GlobalEvent.SHOW_GAME_OVER_POPUP);
const setting:DataScreen = new DataScreen("setting", "prefab/setting/Setting", GlobalEvent.SHOW_SETTING_POPUP);
const gift:DataScreen = new DataScreen("gift", "prefab/HopQua/Open_Gift", GlobalEvent.SHOW_GIFT);
const spin:DataScreen = new DataScreen("spin", "prefab/spin/Spin", GlobalEvent.SHOW_SPIN);
const fourGift:DataScreen = new DataScreen("fourGift", "prefab/FourGift/FourGift", GlobalEvent.SHOW_FOUR_GIFT);
const forfeitAttack:DataScreen = new DataScreen("forfeitAttack", "prefab/Forfeit attack/Forfeit attack", GlobalEvent.SHOW_FORFEIT_ATTACK);
const help:DataScreen = new DataScreen("help", "prefab/help/Help", GlobalEvent.SHOW_HELP);
const inviteFriend:DataScreen = new DataScreen("inviteFriend", "prefab/Invite friend/Invite friend", GlobalEvent.SHOW_INVITE_FRIEND_POPUP);
const videoReward:DataScreen = new DataScreen("videoReward", "prefab/Get Rewards/Video Rewards", GlobalEvent.SHOW_VIDEO_REWARDS_POPUP);

@ccclass
export default class PopupController extends BaseLoad {   

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
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
    protected onDestroy(): void {
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

    preLoadBundle(){
        this.checkLoadBundle(setting, null, false);   
        this.checkLoadBundle(noMove, null, false);
        this.checkLoadBundle(gameOver, null, false);
        this.checkLoadBundle(gift, null, false);      
        this.checkLoadBundle(spin, null, false);
        this.checkLoadBundle(fourGift, null, false);    
        this.checkLoadBundle(forfeitAttack, null, false);    
        this.checkLoadBundle(help, null, false);      
        this.checkLoadBundle(inviteFriend, null, false);
        this.checkLoadBundle(videoReward, null, false);        
    }

    start () {

    }
    showNoMoves(data = null){
        this.checkLoadBundle(noMove, data);
    }
    showEndGame(data = null){
        this.checkLoadBundle(gameOver, data);
    }
    showSetting(data = null){
        this.checkLoadBundle(setting, data);
    }
    showGift(data = null){
        this.checkLoadBundle(gift, data);
    }
    showSpin(data = null){
        this.checkLoadBundle(spin, data);
    }
    showFourGift(data = null){
        this.checkLoadBundle(fourGift, data);
    }
    showForfeitAttack(data = null){
        this.checkLoadBundle(forfeitAttack, data);
    }
    showHelp(data = null){
        this.checkLoadBundle(help, data);
    }
    showInviteFriend(data = null){
        this.checkLoadBundle(inviteFriend, data);
    }
    showVideoRewards(data = null){
        this.checkLoadBundle(videoReward, data);
    }

    // update (dt) {}
}
