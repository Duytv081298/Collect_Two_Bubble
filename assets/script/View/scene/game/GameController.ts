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

    // LIFE-CYCLE CALLBACKS:

    onLoad() {

        var manager = cc.director.getCollisionManager();
        manager.enabled = true;
        cc.director.getPhysicsManager().enabled = true;
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

        // GlobalEvent.instance().addEventListener(GlobalEvent.UPDATE_SCORE_GAME, this.updateScore, this);
        // GlobalEvent.instance().addEventListener(GlobalEvent.UPDATE_MOVE_GAME, this.updateMove, this);
        // GlobalEvent.instance().addEventListener(GlobalEvent.UPDATE_GOLD_GAME, this.updateGold, this);
        GlobalEvent.instance().addEventListener(GlobalEvent.START_GAME, this.reset, this);
        GlobalEvent.instance().addEventListener(GlobalEvent.REPLAY_GAME, this.reset, this);
    }
    closeEmit() {

        // GlobalEvent.instance().removeEventListener(GlobalEvent.UPDATE_SCORE_GAME, this.updateScore, this);
        // GlobalEvent.instance().removeEventListener(GlobalEvent.UPDATE_MOVE_GAME, this.updateMove, this);
        // GlobalEvent.instance().removeEventListener(GlobalEvent.UPDATE_GOLD_GAME, this.updateGold, this);
        GlobalEvent.instance().removeEventListener(GlobalEvent.START_GAME, this.reset, this);
        GlobalEvent.instance().removeEventListener(GlobalEvent.REPLAY_GAME, this.reset, this);
    }
    reset() {
        console.log(" GameController reset: ");
        MainData.instance().score = 0;
        MainData.instance().move = MAX_MOVE;

        GlobalEvent.instance().dispatchEvent(GlobalEvent.UPDATE_SCORE_GAME, { score: 0 });
        GlobalEvent.instance().dispatchEvent(GlobalEvent.UPDATE_MOVE_GAME, { move: 0, status: true });
        GlobalEvent.instance().dispatchEvent(GlobalEvent.UPDATE_GOLD_GAME, { gold: 0 });
        this.broadContainer.init()
    }
    startGame() {
        console.log("GameController setUp: ");

        this.reset();
    }

    clickSetting() {
        GlobalEvent.instance().dispatchEvent(GlobalEvent.SHOW_SETTING);
    }

    // updateScore(data) {
    //     let score = parseInt(data.score);

    //     MainData.instance().score += score;
    //     GlobalEvent.instance().dispatchEvent(GlobalEvent.TWEEN_PLAYER_RANKING);

    // }
    // updateMove(data) {
    //     // console.log("update move: " + data.move);

    //     let move = parseInt(data.move);
    //     MainData.instance().move += move;
    // }
    // updateGold(data) {
    //     let gold = parseInt(data.gold);
    //     if (data.gold == 0) return;
    //     LocalStorage.setItem(LocalStorage.CURRENT_GOLD, MainData.instance().goldPlayer + gold);
    //     if (MainData.instance().goldPlayer >= GOLD_USE_BOOSTER)
    //         GlobalEvent.instance().dispatchEvent(GlobalEvent.UPDATE_UI_BOOSTER);
    // }



}
