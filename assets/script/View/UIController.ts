import GlobalEvent from "../component/event/GlobalEvent";
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
    // LIFE-CYCLE CALLBACKS:

    // onLoad () {}

    protected onEnable(): void {
        GlobalEvent.instance().addEventListener(GlobalEvent.UPDATE_SCORE_GAME, this.updateScore, this);
        GlobalEvent.instance().addEventListener(GlobalEvent.UPDATE_MOVE_GAME, this.updateMove, this);
        GlobalEvent.instance().addEventListener(GlobalEvent.UPDATE_GOLD_GAME, this.updateGold, this);
    }
    protected onDisable(): void {
        GlobalEvent.instance().removeEventListener(GlobalEvent.UPDATE_SCORE_GAME, this.updateScore, this);
        GlobalEvent.instance().removeEventListener(GlobalEvent.UPDATE_MOVE_GAME, this.updateMove, this);
        GlobalEvent.instance().removeEventListener(GlobalEvent.UPDATE_GOLD_GAME, this.updateGold, this);
    }
    updateScore(data) {
        this.score_game.string = MainData.instance().score.toString();
    }
    updateMove(data) {
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
        this.gold_game.string = MainData.instance().goldPlayer.toString();
    }
    start() {

    }

    // update (dt) {}
}
