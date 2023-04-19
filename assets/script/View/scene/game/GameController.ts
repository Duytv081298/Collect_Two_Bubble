import SoundManager from "../../../component/component/SoundManager";
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

        MainData.instance().isRunPlayer = false;
        MainData.instance().isOpenGift = false;
        MainData.instance().isHiddenPrizes = false;

        this.updateScore({ score: 0 })
        this.updateMove({ status: true })
        this.updateGold({ gold: 0 })
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
    updateGold(data) {
        // console.log("update gold");

        let gold = parseInt(data.gold);
        LocalStorage.setItem(LocalStorage.CURRENT_GOLD, MainData.instance().goldPlayer + gold);
        if (MainData.instance().goldPlayer >= GOLD_USE_BOOSTER)
            GlobalEvent.instance().dispatchEvent(GlobalEvent.UPDATE_UI_BOOSTER);
        this.gold_game.string = MainData.instance().goldPlayer.toString();
    }



}
