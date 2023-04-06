// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import { Utils } from "../../../../component/component/Utils";
import { SIZE, TOTALBALL } from "../../../../component/constant/constant";
import MainData from "../../../../component/storage/MainData";
import GameController from "../GameController";
import Pooling from "../Pooling";
import Bubble from '../item/Bubble';

const { ccclass, property } = cc._decorator;

const speedBall = 0.2;
@ccclass
export default class BroadContainer extends cc.Component {

    _gameController: GameController;


    @property(Pooling)
    pooling: Pooling = null;



    @property(cc.Node)
    content: cc.Node = null;

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {}

    arrBubble: [Bubble[]] = [[]];
    listBubbleSelect: Bubble[] = [];
    listColorGroup1: number[] = [];
    listColorGroup2: number[] = [];
    start() {
    }
    init(game: GameController) {
        this._gameController = game;
        this.reset();
        this.setUpBubble();

    }
    reset() { }

    // update (dt) {}

    setUpBubble() {

        this.generateGroupColor();

        let tempAmountDefaultGroupColor = this.getAmountDefaultGroupColor();

        for (let row = 0; row < 6; row++) {
            this.arrBubble[row] = [];

            for (let col: number = 0; col < 6; col++) {

                let color = 0;
                if (tempAmountDefaultGroupColor.groupA > 0 && tempAmountDefaultGroupColor.groupB > 0) {
                    if (Utils.randomInt(0, 1) == 0) {
                        color = this.getColor(0);
                        tempAmountDefaultGroupColor.groupA--;
                    }
                    else {
                        color = this.getColor(1);
                        tempAmountDefaultGroupColor.groupB--;
                    }
                } else if (tempAmountDefaultGroupColor.groupA > 0) {
                    color = this.getColor(0);
                    tempAmountDefaultGroupColor.groupA--;
                } else {
                    color = this.getColor(1);
                    tempAmountDefaultGroupColor.groupB--;
                }

                let bubble: cc.Node = this.pooling.createBubble();
                let pos: cc.Vec2 = this.getPosition(row, col);
                // console.log(pos);

                bubble.setPosition(pos);
                bubble.setScale(0.8);
                bubble.setParent(this.content);
                bubble.name = row + "_" + col;
                bubble.active = true;
                bubble.on("CollisionEnter", this.collisionEnter.bind(this), this)

                let bubbleScript = bubble.getComponent(Bubble);
                bubbleScript.setData(row, col, pos.x, pos.y, color)

                this.arrBubble[row].push(bubbleScript);

            }
        }
    }
    getColor(indexGroup): number {
        return indexGroup == 0 ? this.listColorGroup1[Utils.randomInt(0, this.listColorGroup1.length - 1)] :
            this.listColorGroup2[Utils.randomInt(0, this.listColorGroup2.length - 1)];
    }

    getAmountDefaultGroupColor() {
        let score = MainData.instance().score;
        let percentage = 0;
        if (score < 5000) percentage = 70 / 100;
        else if (score < 15000) percentage = 60 / 100;
        else percentage = 50 / 100;

        let amountGroupA = Math.floor(TOTALBALL * percentage);
        let amountGroupB = TOTALBALL - amountGroupA;
        return { groupA: amountGroupA, groupB: amountGroupB }

    }
    generateGroupColor() {
        this.listColorGroup1 = [];
        this.listColorGroup2 = [];
        while (this.listColorGroup1.length < 3) {
            let color = Math.floor(Math.random() * 5);
            if (this.listColorGroup1.indexOf(color) < 0) this.listColorGroup1.push(color);
        }
        for (let i = 0; i < 5; i++) {
            if (this.listColorGroup1.indexOf(i) < 0) this.listColorGroup2.push(i);
        }
    }
    collisionEnter(bubble: Bubble) {
        // console.log(this.listBubbleSelect);
        // console.log("collisionEnter row: " + bubble.row + "  col : " + bubble.col );


        if (this.listBubbleSelect.length == 0) {
            this.pushBubble(bubble)
        } else {
            let bubbleCheck = this.checkCollect(bubble);
            if (bubbleCheck == null) return; // = vs bubble chon gan nhat, khong phu hop dieu kien
            else if (bubbleCheck == true) this.cutDot(bubble); // quay tro lai 1 bubble
            else this.pushBubble(bubble);
        }


    }
    touchEnd() {
        console.log("user touch End");

        if (this.listBubbleSelect.length < 2) {
            this.clearBubbleSelected()
            // console.log("RESUME ======    touchEnd");
            // game.emit("RESUME_LISTEN_EVENT");
        } else {
            // this.holeController.upDateAmountMove();
            this.liberate();
        }
        // this.progressBubble.clear();
    }

    liberate(isBooster: boolean = false) {
        // console.log("liberate");

        // if (!isBooster) this._gameController.endMove(this.listDotSelect.length)
        // this.hideAllHighlight();
        // if (this.listDotSelectQuadrilateral.length > 0) this.listDotSelect = this.mergeListDotSelect();

        // this.countBubbleCollectEstimate += this.listDotSelect.length;
        // if (isBooster) this.countBubbleCollectEstimate--;

        this.clearDot(isBooster);

        // let nodeDelay = this.parentDelayNode.children[0];
        // Tween.stopAllByTarget(nodeDelay);
        // tween(nodeDelay)
        //     .delay((this.listDotSelect.length + 3) * TIMEDELAYBALL)
        //     .call(() => { this.checkCol() })
        //     .delay(0.35)
        //     .call(() => {
        //         game.emit("RESUME_LISTEN_EVENT");
        //         if (!this.checkActiveMove()) this.reloadBroad();
        //     })
        //     .start()
    }

    clearDot(isBooster: boolean = false) {
        // console.log("clearDot");
        let touches = this.listBubbleSelect.concat();

        for (let i = 0; i < touches.length; i++) {
            const bubble = touches[i];
            cc.tween(bubble.node)
                .delay(0.1 * i)
                .call(() => {
                    bubble.nonSelect();
                    this.pooling.onBubbleKilled(bubble.node)
                    this.arrBubble[bubble.row][bubble.col] = null;
                    if (i == touches.length - 1) {
                        this.reSetUpBubble()
                    }
                })
                .start();
        }
    }
    reSetUpBubble() {
        console.log("reSetUpBubble");

        var amountDefaultGroupColor = this.getAmountDefaultGroupColor();
        let existGroupColor1: number = 0;
        let existGroupColor2: number = 0;
        let maxTime = 0;
        for (let col = 0; col < 6; col++) {
            let count = 0;
            for (let row = 5; row >= 0; row--) {
                let bubble = this.arrBubble[row][col];
                if (bubble == null) {
                    count++;
                } else {
                    if (this.listColorGroup2.indexOf(bubble.getColor()) >= 0) existGroupColor2++;
                    else existGroupColor1++;

                    let idxRow = row + count;
                    this.arrBubble[row][col] = null;
                    this.arrBubble[idxRow][col] = bubble;
                    let pos: cc.Vec2 = this.getPosition(idxRow, col);
                    bubble.updateIndex(idxRow, col, pos.x, pos.y);
                    let kc = idxRow - row;
                    maxTime = Math.max(speedBall * kc);
                    cc.tween(bubble.node).to(speedBall * kc, { x: pos.x, y: pos.y }).start();
                }
            }
        }
        let freeColorGroup1 = amountDefaultGroupColor.groupA - existGroupColor1;
        let freeColorGroup2 = amountDefaultGroupColor.groupB - existGroupColor2;

        for (let i = 5; i >= 0; i--) {
            const row = this.arrBubble[i];
            for (let j = 0; j < 6; j++) {
                const bubble = row[j];
                if (bubble == null) {
                    console.log("row: " + i + "  col: " + j);
                    
                    var color = 0;
                    if (amountDefaultGroupColor.groupA == TOTALBALL * 0.5 && Utils.randomInt(0, 1) == 0) {
                        color = Math.floor(Math.random() * 5);
                    }
                    else {
                        if (freeColorGroup1 > 0 && freeColorGroup2 > 0) {
                            if (Utils.randomInt(0, 1) == 0) {
                                color = this.getColor(0);
                                freeColorGroup1--;
                            }
                            else {
                                color = this.getColor(1);
                                freeColorGroup2--;
                            }
                        } else if (freeColorGroup1 > 0) {
                            color = this.getColor(0);
                            freeColorGroup1--;
                        } else {
                            color = this.getColor(1);
                            freeColorGroup2--;
                        }
                    }

                    let bubble: cc.Node = this.pooling.createBubble();

                    let posBegin: cc.Vec2 = this.getPosition(-1, j);
                    // console.log(pos);
                    console.log(posBegin);
                    
                    bubble.setPosition(posBegin);
                    bubble.setScale(0.8);
                    bubble.setParent(this.content);
                    bubble.name = i + "_" + j;
                    bubble.active = true;
                    
                    bubble.on("CollisionEnter", this.collisionEnter.bind(this), this)
                    let bubbleScript = bubble.getComponent(Bubble);


                    this.arrBubble[i][j] = bubbleScript;
                    let kc = i+1;
                    maxTime = Math.max(speedBall * (i + 1));
                    let pos: cc.Vec2 = this.getPosition(i, j);
                    bubbleScript.setData(i, j, pos.x, pos.y, color)
                    cc.tween(bubble).to(speedBall * kc, { x: pos.x, y: pos.y }).start();



                }

            }
        }

    }

    pushBubble(bubble: Bubble) {
        // console.log("pushDot");

        // if (!dot || this.isQuadrilateral) return;
        // if (this.listDotSelect.indexOf(dot) >= 0) {
        //     this.isQuadrilateral = true;
        // }
        this.listBubbleSelect.push(bubble)
        bubble.select();

        // if (this.listDotSelect.length > 1) {
        //     let startDot = this.listDotSelect[this.listDotSelect.length - 2];
        //     let highlight = this.createHighlight(startDot, dot)
        //     this.listHighlight.push(highlight);
        // }
        // if (this.isQuadrilateral) {
        //     this.listDotSelectQuadrilateral = this.pushAllDotColor1(dot.colorHex);
        // }
        // this.progressBubble.show(this.isQuadrilateral ? 8 : this.listDotSelect.length);
        // let count = this.listDotSelect.length - 1 <= 0 ? 0 : this.listDotSelect.length - 1 >= 11 ? 11 : this.listDotSelect.length - 1;
        // SoundManager.instance().playEffect("Colloect _Bubble_" + count);
    }

    cutDot(bubble: Bubble) {

        // console.log("cutDot");
        let dataEnd = this.listBubbleSelect[this.listBubbleSelect.length - 1];
        this.arrBubble[dataEnd.row][dataEnd.col].getComponent(Bubble).nonSelect();
        this.listBubbleSelect.splice(this.listBubbleSelect.length - 1, 1);
        // var index = this.listDotSelect.indexOf(dot)
        // if (index == this.listDotSelect.length - 1 || index < 0) return false;
        // if (index == this.listDotSelect.length - 2) {
        //     let listDotCancel: Dot[] = this.listDotSelect.splice(index + 1, this.listDotSelect.length);
        //     for (let i = 0; i < listDotCancel.length; i++) {
        //         if (this.listDotSelect.indexOf(listDotCancel[i]) == this.listDotSelect.length - 1 ||
        //             this.listDotSelect.indexOf(listDotCancel[i]) < 0) listDotCancel[i].nonSelect();
        //     }
        //     // this.hideOneHighlight();
        // }

        // if (this.isQuadrilateral) this.unQuadrilateral();


        // this.progressBubble.show(this.isQuadrilateral ? 8 : this.listDotSelect.length);
        // var count = this.listDotSelect.length - 1 <= 0 ? 0 : this.listDotSelect.length - 1 >= 11 ? 11 : this.listDotSelect.length - 1;
        // count = this.isQuadrilateral ? 11 : count;
        // SoundManager.instance().playEffect("Colloect _Bubble_" + count);

    }

    clearBubbleSelected() {
        this.listBubbleSelect.forEach(bubble => { bubble.nonSelect(); });

        // this.hideAllHighlight();
        // this.listHighlight = [];
        this.listBubbleSelect = [];
    }
    checkCollect(bubble: Bubble) {
        // console.log("checkCollect");

        let curDot: Bubble = this.listBubbleSelect[this.listBubbleSelect.length - 1];
        let oldDot: Bubble = this.listBubbleSelect.length >= 2 ? this.listBubbleSelect[this.listBubbleSelect.length - 2] : null;
        if (!bubble || bubble == curDot || !curDot) return null;
        if (bubble == oldDot) return true;
        let x = bubble.col - curDot.col;
        let y = bubble.row - curDot.row; bubble
        if (Math.abs(x - y) == 1 && Math.abs(x) <= 1 && Math.abs(y) <= 1) {
            if (bubble.getColor() == curDot.getColor()) return bubble;
            else return null;
        }
        else return null;
    }




















    getPosition(row: number, col: number) {
        return new cc.Vec2(SIZE.beginX + SIZE.spaceX * col, SIZE.beginY - SIZE.spaceY * row);
    }

}
