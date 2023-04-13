import { GOLD_USE_BOOSTER } from "../component/constant/constant";
import GlobalEvent from "../component/event/GlobalEvent";
import LocalStorage from "../component/storage/LocalStorage";
import MainData from "../component/storage/MainData";

const { ccclass, property } = cc._decorator;

@ccclass
export default class UIController extends cc.Component {



    @property(cc.Label)
    score_game: cc.Label = null;

    @property(cc.Label)
    gold_game: cc.Label = null;

    @property(cc.Label)
    move_game: cc.Label = null;

    @property(cc.Label)
    hight_score_home: cc.Label = null;

    @property(cc.Label)
    gold_home: cc.Label = null;
    // LIFE-CYCLE CALLBACKS:

    // this.backHightScore = parseInt(LocalStorage.getItem(LocalStorage.HIGHT_SCORE));
    // onLoad () {}

    protected onEnable(): void {
        GlobalEvent.instance().addEventListener(GlobalEvent.UPDATE_HIGHT_SCORE, this.updateHightScore, this);
        GlobalEvent.instance().addEventListener(GlobalEvent.UPDATE_SCORE_GAME, this.updateScore, this);
        GlobalEvent.instance().addEventListener(GlobalEvent.UPDATE_MOVE_GAME, this.updateMove, this);
        GlobalEvent.instance().addEventListener(GlobalEvent.UPDATE_GOLD_GAME, this.updateGold, this);
    }
    protected onDisable(): void {
        GlobalEvent.instance().removeEventListener(GlobalEvent.UPDATE_HIGHT_SCORE, this.updateHightScore, this);
        GlobalEvent.instance().removeEventListener(GlobalEvent.UPDATE_SCORE_GAME, this.updateScore, this);
        GlobalEvent.instance().removeEventListener(GlobalEvent.UPDATE_MOVE_GAME, this.updateMove, this);
        GlobalEvent.instance().removeEventListener(GlobalEvent.UPDATE_GOLD_GAME, this.updateGold, this);
    }
    updateHightScore(data) {
        console.log("updateHightScore =========");
        
        let score = MainData.instance().score;
        let hightScore = parseInt(LocalStorage.getItem(LocalStorage.HIGHT_SCORE));
        if (hightScore < score) {
            LocalStorage.setItem(LocalStorage.HIGHT_SCORE, score);
        }
        this.hight_score_home.string = LocalStorage.getItem(LocalStorage.HIGHT_SCORE).toString();
    }
    updateScore(data) {
        let score = parseInt(data.score);
        MainData.instance().score += score;
        GlobalEvent.instance().dispatchEvent(GlobalEvent.TWEEN_PLAYER_RANKING);
        this.score_game.string = MainData.instance().score.toString();
    }
    updateMove(data) {

        let move = parseInt(data.move);
        MainData.instance().move += move;

        let status = data.status;
        var time = 0.2;
        cc.tween(this.move_game.node)
            .to(time,
                { position: new cc.Vec3(0, status ? -this.move_game.node.height : this.move_game.node.height, 0) })
            .call(() => {
                this.move_game.node.position = new cc.Vec3(0, status ? this.move_game.node.height : -this.move_game.node.height)
                this.move_game.string = MainData.instance().move.toString();
            })
            .to(time,
                { position: cc.Vec3.ZERO })
            .start();
    }
    updateGold(data) {
        let gold = parseInt(data.gold);
        if (data.gold == 0) return;
        LocalStorage.setItem(LocalStorage.CURRENT_GOLD, MainData.instance().goldPlayer + gold);
        if (MainData.instance().goldPlayer >= GOLD_USE_BOOSTER)
            GlobalEvent.instance().dispatchEvent(GlobalEvent.UPDATE_UI_BOOSTER);
        this.gold_game.string = MainData.instance().goldPlayer.toString();
        this.gold_home.string = MainData.instance().goldPlayer.toString();
    }

    // update (dt) {}
}
