import LocalStorage from "../../component/storage/LocalStorage";
import MainData from "../../component/storage/MainData";
import Bubble from "../scene/game/item/Bubble";


const blockSpace = [[0, -1], [1, 0], [0, 1], [-1, 0]];
const {ccclass, property} = cc._decorator;

@ccclass
export default class TutorialInterval extends cc.Component {



    @property(cc.Node)
    hand: cc.Node = null;




    arrBubble: [Bubble[]] = [[]];

    totalClick: number = 0;
    startTut() {
        // console.log("startTut");
        if (MainData.instance().isShowEndGame || MainData.instance().isShowNoMove ||
            MainData.instance().isUseBooster || LocalStorage.getItem(LocalStorage.IS_NEW)) return;

        // console.log("startTut ========");
        this.clearSelect()
        this.node.stopAllActions();
        cc.tween(this.node)
            .delay(7)
            .call(() => {

                if (MainData.instance().isShowEndGame || MainData.instance().isShowNoMove || MainData.instance().isUseBooster) return;
                this.updateArrDot();
                this.checkEndGame(0, 0);
            })
            .start();
    }

    update(deltaTime: number) {

    }
    protected onEnable(): void {
        // game.on("START_TUT_INTERVAL", this.startTut.bind(this), this);
        this.totalClick = 0;
    }
    protected onDisable(): void {
        // game.off("START_TUT_INTERVAL");
        this.totalClick = 0;

    }
    updateArrDot() {
        // console.log("updateArrDot");
        // this.arrayDot = this.boardContainer.getArrayDot();
        // this.arrPathBlock = [];

    }



    arrPathBubble = [];
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
                    // this.indexDot = 0;
                    // this.showTut(pathBlock)
                }
            } else {
                // console.log("GameOVer");
                // this.gameOver.active = true;
            }
        }
    }


    indexDot: number = 0;
    showTut(arrDot: Bubble[]) {

        // let timeDelay = this.indexDot == arrDot.length - 2 ? 1 : 0;
        // let startDot = arrDot[this.indexDot];
        // let endDot = arrDot[this.indexDot + 1];
        // startDot.select();
        // this.listDotSelect.push(startDot)
        // this.hand.active = true;
        // this.hand.setPosition(startDot.node.position);
        // Tween.stopAllByTarget(this.hand)
        // tween(this.hand)
        //     .to(0.5, { position: endDot.node.position })
        //     .call(() => {
        //         this.listHighlight.push(this.boardContainer.createHighlight(startDot, endDot));
        //         endDot.select();
        //         this.listDotSelect.push(endDot)

        //         this.indexDot++;
        //         if (this.indexDot < arrDot.length - 1) {
        //             this.showTut(arrDot)
        //         }
        //         if (this.indexDot == arrDot.length - 1) {
        //             this.hand.active = false;
        //             this.indexDot = 0;
        //         }

        //     })
        //     .delay(timeDelay)
        //     .call(() => {
        //         if (this.indexDot == 0) {
        //             this.clearSelect();
        //             this.showTut(arrDot)
        //         }
        //     })
        //     .start()
    }

    clearSelect() {

        // this.listDotSelect = [];
        this.indexDot = 0;
        this.hand.stopAllActions()
        this.hand.active = false;
    }

}
