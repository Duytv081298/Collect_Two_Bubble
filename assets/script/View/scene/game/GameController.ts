import SoundManager from "../../../component/component/SoundManager";
import { Utils } from "../../../component/component/Utils";
import { GOLD_USE_BOOSTER, MAX_MOVE } from "../../../component/constant/constant";
import GlobalEvent from "../../../component/event/GlobalEvent";
import LocalStorage from "../../../component/storage/LocalStorage";
import MainData from "../../../component/storage/MainData";
import BroadContainer from "./broad/BroadContainer";

const { ccclass, property } = cc._decorator;

@ccclass
export default class GameController extends cc.Component {

    @property(BroadContainer)
    broadContainer: BroadContainer = null;


    @property(cc.Label)
    score_game: cc.Label = null;

    @property(cc.Label)
    gold_game: cc.Label = null;

    @property(cc.Label)
    move_game: cc.Label = null;

    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        console.log("=========== onLoad game controller");

        GlobalEvent.instance().addEventListener(GlobalEvent.SHOW_GAME_PLAY, this.show, this);
        GlobalEvent.instance().addEventListener(GlobalEvent.HIDE_GAME_PLAY, this.hide, this);
        let manager = cc.director.getCollisionManager();
        manager.enabled = true;
        cc.director.getPhysicsManager().enabled = true;
        cc.macro.ENABLE_MULTI_TOUCH = false;

        // cc.macro.CLEANUP_IMAGE_CACHE = false;
        // cc.dynamicAtlasManager.enabled = true;
        // cc.director.getPhysicsManager().gravity = new cc.Vec2(10, 10);
        // manager.enabledDebugDraw = true;
        // manager.enabledDrawBoundingBox = true;

    }
    protected onDestroy(): void {
        GlobalEvent.instance().removeEventListener(GlobalEvent.SHOW_GAME_PLAY, this.show, this);
        GlobalEvent.instance().removeEventListener(GlobalEvent.HIDE_GAME_PLAY, this.hide, this);

    }
    show() {
        this.node.active = true;
        GlobalEvent.instance().dispatchEvent(GlobalEvent.HIDE_LOADING);
    }
    hide() {
        this.node.active = false;
    }
    onEnable(): void {
        this.setUpEmit();
    }
    onDisable(): void {
        this.closeEmit();
    }


    // update (dt) {}
    setUpEmit() {
        GlobalEvent.instance().addEventListener(GlobalEvent.UPDATE_SCORE_GAME, this.updateScore, this);
        GlobalEvent.instance().addEventListener(GlobalEvent.ANIMATION_UPDATE_MOVE, this.updateMove, this);
        GlobalEvent.instance().addEventListener(GlobalEvent.UPDATE_GOLD_GAME, this.updateGold, this);
        GlobalEvent.instance().addEventListener(GlobalEvent.START_GAME, this.reset, this);
        GlobalEvent.instance().addEventListener(GlobalEvent.REPLAY_GAME, this.reset, this);
    }
    closeEmit() {
        GlobalEvent.instance().removeEventListener(GlobalEvent.UPDATE_SCORE_GAME, this.updateScore, this);
        GlobalEvent.instance().removeEventListener(GlobalEvent.ANIMATION_UPDATE_MOVE, this.updateMove, this);
        GlobalEvent.instance().removeEventListener(GlobalEvent.UPDATE_GOLD_GAME, this.updateGold, this);
        GlobalEvent.instance().removeEventListener(GlobalEvent.START_GAME, this.reset, this);
        GlobalEvent.instance().removeEventListener(GlobalEvent.REPLAY_GAME, this.reset, this);
    }
    reset() {
        console.log(" GameController reset: ");
        MainData.instance().score = 0;
        MainData.instance().move = MAX_MOVE;

        MainData.instance().isPlay = false;
        MainData.instance().isRunPlayer = false;
        MainData.instance().isHiddenPrizes = false;
        MainData.instance().isOpenGift = false;
        MainData.instance().isUserPlay = false;
        MainData.instance().isShowNoMove = false;
        MainData.instance().isShowEndGame = false;

        this.updateScore({ score: 0 })
        this.updateMove({ status: true })
        this.updateGold()
    }

    clickSetting() {
        SoundManager.instance().playEffect("button");
        GlobalEvent.instance().dispatchEvent(GlobalEvent.SHOW_SETTING_POPUP);
    }
    updateScore(data) {
        // console.log(data);

        let score = parseInt(data.score);
        MainData.instance().score += score;
        GlobalEvent.instance().dispatchEvent(GlobalEvent.TWEEN_PLAYER_RANKING);
        GlobalEvent.instance().dispatchEvent(GlobalEvent.CHECK_SHOW_GIFT);
        this.score_game.string = MainData.instance().score.toString();
    }
    updateMove(data) {
        let status = data.status;
        let time = 0.2;
        cc.tween(this.move_game.node)
            .to(time,
                { position: new cc.Vec3(0, status ? -this.move_game.node.height : this.move_game.node.height, 0) })
            .call(() => {
                this.move_game.node.setPosition(0, status ? this.move_game.node.height : - this.move_game.node.height);
                this.move_game.string = MainData.instance().move.toString();
            })
            .to(time,
                { position: cc.Vec3.ZERO })
            .start();
    }
    updateGold() {
        if (MainData.instance().goldPlayer >= GOLD_USE_BOOSTER)
            GlobalEvent.instance().dispatchEvent(GlobalEvent.UPDATE_UI_BOOSTER);
        this.gold_game.string = Utils.formatCurrency2(MainData.instance().goldPlayer).toString();
    }



}
