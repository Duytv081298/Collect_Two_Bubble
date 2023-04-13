import GlobalEvent from "../../component/event/GlobalEvent";
import MainData from "../../component/storage/MainData";
import GameOver from "./EndGame/GameOver";
import NoMoves from "./NoMove/NoMoves";
import { Setting } from "./Setting/Setting";

const { ccclass, property } = cc._decorator;

@ccclass
export default class PopupController extends cc.Component {

    noMove: cc.Node = null;
    endGame: cc.Node = null;
    setting: cc.Node = null;
    ktShowNoMoves: boolean = false;
    ktShowEndGame: boolean = false;
    ktShowSetting: boolean = false;
    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        this.preLoadNoMove();
        this.preLoadEndGame();
        this.preLoadSetting();
    }

    protected onEnable(): void {
        GlobalEvent.instance().addEventListener(GlobalEvent.SHOW_NO_MOVE_POPUP, this.showNoMoves, this);
        GlobalEvent.instance().addEventListener(GlobalEvent.SHOW_GAME_OVER_POPUP, this.showEndGame, this);
        GlobalEvent.instance().addEventListener(GlobalEvent.SHOW_SETTING, this.showSetting, this);
    }
    protected onDisable(): void {

        GlobalEvent.instance().removeEventListener(GlobalEvent.SHOW_NO_MOVE_POPUP, this.showNoMoves, this);
        GlobalEvent.instance().removeEventListener(GlobalEvent.SHOW_GAME_OVER_POPUP, this.showEndGame, this);
        GlobalEvent.instance().removeEventListener(GlobalEvent.SHOW_SETTING, this.showSetting, this);
    }


    preLoadSetting() {
        cc.resources.preload("prefab/setting/Setting", cc.Prefab, (err) => {
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
        });
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

    showSetting() {
        if (this.setting != null) {
            this.hideLoading();
            this.ktShowSetting = false;
            this.setting.active = true;
            this.setting.getComponent(Setting).showPopup();
        } else {
            this.showLoading();
            this.ktShowSetting = true;
        }
    }















    hideLoading() {

    }
    showLoading() {

    }
    // update (dt) {}
}
