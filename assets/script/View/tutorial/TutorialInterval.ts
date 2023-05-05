import GlobalEvent from "../../component/event/GlobalEvent";
import MainData from "../../component/storage/MainData";
import BroadContainer from "../scene/game/broad/BroadContainer";
import Bubble from "../scene/game/item/Bubble";


const blockSpace = [[0, -1], [1, 0], [0, 1], [-1, 0]];
const timeDelay = 7;
const { ccclass, property } = cc._decorator;

@ccclass
export default class TutorialInterval extends cc.Component {

    protected onEnable(): void {
        GlobalEvent.instance().addEventListener(GlobalEvent.SHOW_TUTORIAL_INTERVAL, this.startTut, this);
    }
    protected onDisable(): void {
        GlobalEvent.instance().removeEventListener(GlobalEvent.SHOW_TUTORIAL_INTERVAL, this.startTut, this);
    }

    @property(BroadContainer)
    boardReal: BroadContainer = null;
    @property(cc.Node)
    hand: cc.Node = null;
    arrBubble: Bubble[][] = [[]];
    arrPathBubble = [];
    startTut() {
        this.clearSelect()
        this.node.stopAllActions();
        cc.tween(this.node)
            .delay(timeDelay)
            .call(() => {
                // console.log("MainData.instance().isPlay: " + MainData.instance().isPlay);
                // console.log(MainData.instance().keyBooster != null);

                if (MainData.instance().isShowEndGame || MainData.instance().isShowNoMove ||
                MainData.instance().keyBooster != null ||
                    MainData.instance().isUseBooster || MainData.instance().isTutorial ||
                    MainData.instance().isPlay || MainData.instance().isOpenGift || MainData.instance().isUserPlay
                ) return;
                this.arrBubble = this.boardReal.arrBubble.concat();
                this.arrPathBubble = [];
                this.checkEndGame(0, 0);
            })
            .start();
    }



    checkEndGame(row: number, col: number, arrPath = []) {
        let item: Bubble = null;
        if (arrPath.length == 0) {
            item = this.arrBubble[row][col];
            let idx = 0;
            for (let i = 0; i < blockSpace.length; i++) {
                let space = blockSpace[i];
                let tCol = col + space[0];
                let tRow = row + space[1];
                if (tCol == col && tRow == row) continue;
                if (tCol < 0 || tRow < 0) continue;
                if (this.arrBubble[tRow] == undefined) continue;
                if (this.arrBubble[tRow][tCol] == undefined) continue;
                let itemCheck: Bubble = this.arrBubble[tRow][tCol];
                if (item.getColor() == itemCheck.getColor()) {
                    arrPath[idx] = [item, itemCheck];
                    idx++;
                }
            }
            if (idx == 0) {
                this.checkNextEndGame(col, row, arrPath);
            } else {
                this.checkEndGame(row, col, arrPath);
            }
        } else {
            let idx = 0;
            let arrPathNew = [];
            for (let l = 0; l < arrPath.length; l++) {
                item = arrPath[l][arrPath[l].length - 1];
                for (let i = 0; i < blockSpace.length; i++) {
                    let space = blockSpace[i];
                    let tCol = item.col + space[0];
                    let tRow = item.row + space[1];

                    if (tCol == item.col && tRow == item.row) continue;
                    if (tCol < 0 || tRow < 0) continue;
                    if (this.arrBubble[tRow] == undefined) continue;
                    if (this.arrBubble[tRow][tCol] == undefined) continue;
                    let itemCheck: Bubble = this.arrBubble[tRow][tCol];
                    if (item.row == itemCheck.row && item.col == itemCheck.col) continue;

                    if (item.getColor() == itemCheck.getColor()) {
                        let ktExist = false;
                        for (let m = 0; m < arrPath[l].length - 1; m++) {
                            let itemExist: Bubble = arrPath[l][m];
                            if (itemExist.row == itemCheck.row && itemExist.col == itemCheck.col) {
                                ktExist = true;
                                break;
                            }
                        }
                        if (ktExist == false) {
                            arrPathNew[idx] = arrPath[l].concat(itemCheck);
                            idx++;
                        }
                    }

                }
            }
            if (idx == 0) {
                this.checkNextEndGame(col, row, arrPath);
            } else {
                this.checkEndGame(row, col, arrPathNew);
            }
        }
    }
    checkNextEndGame(row: number, col: number, arrPath = []) {
        let idxJNext = row + 1;
        if (idxJNext == 6) {
            idxJNext = 0;
            col += 1;
        }
        if (col < 6) {
            this.arrPathBubble = this.arrPathBubble.concat(arrPath);
            this.checkEndGame(col, idxJNext, []);
        } else {
            // console.log("arrPathBlock: " + this.arrPathBlock);

            this.arrPathBubble.sort((a, b) => {
                if (a.length > b.length) return -1;
                if (a.length < b.length) return 1;
                return 0;
            })

            // console.log("arrPathBlock: " + this.arrPathBubble);
            if (this.arrPathBubble.length > 0) {
                let pathBlock = this.arrPathBubble[0];
                // console.log("Duong dai nhat");

                // console.log(pathBlock);

                if (pathBlock.length < 2) {
                    // console.log("GameOVer");
                } else {
                    this.indexDot = 0;
                    this.showTut(pathBlock)
                }
            } else {
                // console.log("GameOVer");
                // this.gameOver.active = true;
            }
        }
    }


    indexDot: number = 0;
    showTut(arrBubble: Bubble[]) {
        if (this.indexDot == 0) this.clearSelect()
        // if (this.isShow) return;
        // this.isShow = true;
        // MainData.instance().isTutorialInterval = true;
        let timeDelay = this.indexDot == arrBubble.length - 2 ? 2 : 0;
        let startBubble = arrBubble[this.indexDot];
        let endBubble = arrBubble[this.indexDot + 1];
        this.hand.active = true;
        this.hand.setPosition(startBubble.node.position);
        this.hand.stopAllActions()

        this.boardReal.collisionEnter(startBubble)
        // console.log("startBubble: row: " + startBubble.row + "  col: " + startBubble.col);
        cc.tween(this.hand)
            .to(0.5, { position: endBubble.node.position })
            .call(() => {
                // console.log("endBubble: row: " + endBubble.row + "  col: " + endBubble.col);
                this.boardReal.collisionEnter(endBubble)
                this.indexDot++;
                if (this.indexDot < arrBubble.length - 1) {
                    this.showTut(arrBubble)
                }
                if (this.indexDot == arrBubble.length - 1) {
                    this.indexDot = 0;
                }

            })
            .delay(timeDelay)
            .call(() => {
                // console.log("index: " + this.indexDot);

                if (this.indexDot == 0) {
                    this.clearSelect();
                    this.showTut(arrBubble)
                }
            })
            .start()
    }

    clearSelect() {
        this.indexDot = 0;
        this.hand.stopAllActions()
        this.hand.active = false;
        this.boardReal.cancel_Select_Tut();
        // MainData.instance().isTutorialInterval = false;
    }

}
