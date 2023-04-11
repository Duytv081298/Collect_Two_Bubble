import NoMoves from "./NoMove/NoMoves";

const { ccclass, property } = cc._decorator;

@ccclass
export default class PopupController extends cc.Component {

    noMove: cc.Node = null;
    ktShowNoMoves: boolean = false;

    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        this.preLoadNoMove();
    }


    start() {
        // this.showNoMoves();
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
    showNoMoves() {
        if (this.noMove != null) {
            this.hideLoading();
            this.ktShowNoMoves = false;
            this.noMove.active = true;
            this.noMove.getComponent(NoMoves).show();
        } else {
            this.showLoading();
            this.ktShowNoMoves = true;
        }
    }
    hideLoading() {

    }
    showLoading() {

    }
    // update (dt) {}
}
