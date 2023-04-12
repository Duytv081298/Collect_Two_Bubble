import GlobalEvent from "../../component/event/GlobalEvent";
import MainData from "../../component/storage/MainData";
import GameOver from "./EndGame/GameOver";
import NoMoves from "./NoMove/NoMoves";

const { ccclass, property } = cc._decorator;

@ccclass
export default class PopupController extends cc.Component {

    noMove: cc.Node = null;
    endGame: cc.Node = null;
    ktShowNoMoves: boolean = false;
    ktShowEndGame: boolean = false;
    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        this.preLoadNoMove();
        this.preLoadEndGame();
    }

    protected onEnable(): void {
        GlobalEvent.instance().addEventListener(GlobalEvent.SHOW_NO_MOVE_POPUP, this.showNoMoves, this);
        GlobalEvent.instance().addEventListener(GlobalEvent.SHOW_GAME_OVER_POPUP, this.showEndGame, this);
    }
    protected onDisable(): void {

        GlobalEvent.instance().removeEventListener(GlobalEvent.SHOW_NO_MOVE_POPUP, this.showNoMoves, this);
        GlobalEvent.instance().removeEventListener(GlobalEvent.SHOW_GAME_OVER_POPUP, this.showEndGame, this);
    }

    preLoadNoMove() {

        cc.resources.preload("prefab/NoMove/NoMoves", cc.Prefab, (err) => {
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
        });
    }

    preLoadEndGame() {
        cc.resources.preload("prefab/EndGame/EndGame", cc.Prefab, (err) => {
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
            this.ktShowEndGame = true;
            this.showLoading();
        }
    }














    hideLoading() {

    }
    showLoading() {

    }
    // update (dt) {}
}
