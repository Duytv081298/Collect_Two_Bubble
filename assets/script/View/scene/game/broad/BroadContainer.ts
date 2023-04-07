import { Utils } from '../../../../component/component/Utils';
import { SIZE, TOTALBALL } from "../../../../component/constant/constant";
import MainData from "../../../../component/storage/MainData";
import GameController from "../GameController";
import Pooling from "../CreateBubble";
import Bubble from '../item/Bubble';
import CreateBubble from "../CreateBubble";
import CreateConnect from "../CreateConnect";

const { ccclass, property } = cc._decorator;

const speedBall = 0.1;
@ccclass
export default class BroadContainer extends cc.Component {

    _gameController: GameController;



    @property(cc.Node)
    content: cc.Node = null;
    @property(cc.Node)
    connect: cc.Node = null;
    @property(cc.Node)
    overlay: cc.Node = null;

    @property(cc.Node)
    itemCheck: cc.Node = null;


    isQuadrilateral: boolean = false;
    isPlay: boolean = false;

    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        this.onEventTouch();
    }

    arrBubble: [Bubble[]] = [[]];
    listBubbleSelect: Bubble[] = [];
    listBubbleSelectQuadrilateral: Bubble[] = [];
    listConnect: cc.Node[] = [];
    listColorGroup1: number[] = [];
    listColorGroup2: number[] = [];


    onEventTouch() {
        let canvas = cc.find('Canvas');
        canvas.on(cc.Node.EventType.TOUCH_START, this.onTouchStart, this);
        canvas.on(cc.Node.EventType.TOUCH_MOVE, this.onTouchMove, this);
        canvas.on(cc.Node.EventType.TOUCH_END, this.onTouchEnd, this);
        canvas.on(cc.Node.EventType.TOUCH_CANCEL, this.onTouchEnd, this);
    }
    start() {
    }
    init(game: GameController) {
        this._gameController = game;
        this.reset();
        this.setUpBubble();

    }
    reset() {
        this.isPlay = false;
        this.isQuadrilateral = false;

        this.arrBubble = [[]];
        this.listBubbleSelect = [];
        this.listBubbleSelectQuadrilateral = [];
        this.listConnect = [];
        this.listColorGroup1 = [];
        this.listColorGroup2 = [];

        this.generateGroupColor();
        this.itemCheck.setPosition(-100, -100)
    }

    // update (dt) {}

    setUpBubble() {
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

                let bubble: cc.Node = CreateBubble.instance().createItem();
                let pos: cc.Vec2 = this.getPosition(row, col);
                // console.log(pos);

                bubble.setPosition(pos);
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
        this.hideAllConnect();
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
        this.isPlay = true;

        // if (!isBooster) this._gameController.endMove(this.listDotSelect.length)
        // this.hideAllHighlight();
        if (this.isQuadrilateral) this.listBubbleSelect = this.mergeListDotSelect();

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
    mergeListDotSelect(): Bubble[] {
        let arr: Bubble[] = this.listBubbleSelect.concat(this.listBubbleSelectQuadrilateral);
        arr = Array.from(new Set(arr));
        this.listBubbleSelectQuadrilateral = [];
        return arr;
    }

    clearDot(isBooster: boolean = false) {
        let touches = this.listBubbleSelect.concat();
        let delay = 0.07;
        let time = 0;
        for (let i = 0; i < touches.length; i++) {
            const bubble = touches[i];
            if (i > 0) time = i % 2 == 0 ? time + delay : time;
            else if (i == touches.length - 1) time += delay;
            cc.tween(bubble.node)
                .delay(time)
                .call(() => {
                    bubble.nonSelect();
                    bubble.node.parent = this.overlay;
                    CreateBubble.instance().activeRigidBody(bubble.node, i % 2 == 0);
                    this.arrBubble[bubble.row][bubble.col] = null;
                    if (i == touches.length - 1) {
                        this.reSetUpBubble()
                    }
                })
                .start();
        }
    }
    reSetUpBubble() {

        let amountDefaultGroupColor = this.getAmountDefaultGroupColor();
        let existGroupColor1: number = 0;
        let existGroupColor2: number = 0;
        let maxTime = 0;
        let countMore = [];
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
                    // console.log("idxRow: " + idxRow + "  col: " + col + " posX: " + pos.x + "  poxY: " + pos.y);

                    bubble.updateIndex(idxRow, col, pos.x, pos.y);
                    let kc = idxRow - row;
                    maxTime = Math.max(maxTime, speedBall * kc);
                    bubble.node.stopAllActions();
                    cc.tween(bubble.node).to(speedBall * kc, { x: pos.x, y: pos.y }).start();
                }
            }
            countMore[col] = count;
        }
        let freeColorGroup1 = amountDefaultGroupColor.groupA - existGroupColor1;
        let freeColorGroup2 = amountDefaultGroupColor.groupB - existGroupColor2;
        let kc = 0;
        for (let col = 0; col < countMore.length; col++) {
            let count = countMore[col];
            let tempRow = -1;
            if (count > 0) {
                kc = count;
                while (count > 0) {
                    let row = count - 1;
                    let color = 0;
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
                    let bubble: cc.Node = CreateBubble.instance().createItem();

                    let posBegin: cc.Vec2 = this.getPosition(tempRow, col);

                    // console.log("row: " + (tempRow) + "  col: " + col);
                    // console.log("posBegin: " + posBegin);

                    bubble.setPosition(posBegin);
                    bubble.setScale(0.8);
                    bubble.setParent(this.content);
                    bubble.name = row + "_" + col;
                    bubble.active = true;

                    bubble.on("CollisionEnter", this.collisionEnter.bind(this), this)
                    let bubbleScript = bubble.getComponent(Bubble);


                    this.arrBubble[row][col] = bubbleScript;
                    let pos: cc.Vec2 = this.getPosition(row, col);
                    bubbleScript.setData(row, col, pos.x, pos.y, color);

                    maxTime = Math.max(maxTime, speedBall * (row + 1));
                    bubble.stopAllActions();
                    cc.tween(bubble).to(speedBall * kc, { x: pos.x, y: pos.y }).start();
                    count--;
                    tempRow--;
                }
            }
        }
        // this.node.stopAllActions();
        // console.log('maxTime: ' + maxTime);
        maxTime = maxTime + speedBall;
        cc.tween(this.node)
            .delay(maxTime)
            .call(() => {
                this.clearBubbleSelected()
            })
            .start()

    }



    pushBubble(bubble: Bubble) {
        // console.log("pushDot");

        // console.log("isQuadrilateral 0 : " + this.isQuadrilateral);
        // console.log(this.listBubbleSelect);

        if (!bubble || this.isQuadrilateral) return;
        for (let i = 0; i < this.listBubbleSelect.length; i++) {
            let bubbleSelect = this.listBubbleSelect[i];
            if (bubbleSelect.row == bubble.row && bubbleSelect.col == bubble.col) {
                this.isQuadrilateral = true;
                break;
            }
        }
        this.listBubbleSelect.push(bubble)
        bubble.select();
        // console.log("isQuadrilateral 1 : " + this.isQuadrilateral);
        // console.log(this.listBubbleSelect);


        if (this.listBubbleSelect.length > 1) {
            let startBubble = this.listBubbleSelect[this.listBubbleSelect.length - 2];
            let connect = this.createConnect(startBubble, bubble)
            this.listConnect.push(connect);
        }
        if (this.isQuadrilateral) {
            this.listBubbleSelectQuadrilateral = this.pushAllBubbleColor(bubble.getColor());
        }
        // this.progressBubble.show(this.isQuadrilateral ? 8 : this.listDotSelect.length);
        // let count = this.listDotSelect.length - 1 <= 0 ? 0 : this.listDotSelect.length - 1 >= 11 ? 11 : this.listDotSelect.length - 1;
        // SoundManager.instance().playEffect("Colloect _Bubble_" + count);
    }

    pushAllBubbleColor(color: number) {
        let arr: Bubble[] = []
        for (let i = 0; i < this.arrBubble.length; i++) {
            const row = this.arrBubble[i];
            for (let j = 0; j < row.length; j++) {
                const bubble = row[j];
                if (bubble.getColor() == color && !bubble.isSelect) {
                    arr.push(bubble)
                    bubble.select();
                }
            }
        }
        return arr;
    }

    createConnect(startDot: Bubble, toDot: Bubble): cc.Node {
        // console.log("createConnect");
        let connect = CreateConnect.instance().createItem();
        // highlight.parent = this.isPlayTutorial ? this.parentHighlighTutorial : this.underlayContainer.node;
        connect.parent = this.connect;

        connect.position = startDot.node.position;
        connect.width = Utils.getDistance(startDot.node.position, toDot.node.position);
        connect.angle = Utils.getAngle(startDot, toDot);
        connect.active = true;
        return connect;
    }
    hideOneConnect() {
        if (this.listConnect.length <= 0) return;
        var connect = this.listConnect.pop()
        if (connect) {
            CreateConnect.instance().removeItem(connect)
        }
    }
    hideAllConnect() {
        this.listConnect.forEach(connect => {
            CreateConnect.instance().removeItem(connect);
        })
        this.listConnect = [];
    }
    cutDot(bubble: Bubble) {

        // console.log("cutDot");
        let dataEnd = this.listBubbleSelect[this.listBubbleSelect.length - 1];
        if (this.isQuadrilateral) {
            this.unQuadrilateral();
        } else {
            this.arrBubble[dataEnd.row][dataEnd.col].getComponent(Bubble).nonSelect();
        }
        this.listBubbleSelect.splice(this.listBubbleSelect.length - 1, 1);

        this.hideOneConnect();

        // this.progressBubble.show(this.isQuadrilateral ? 8 : this.listDotSelect.length);
        // let count = this.listDotSelect.length - 1 <= 0 ? 0 : this.listDotSelect.length - 1 >= 11 ? 11 : this.listDotSelect.length - 1;
        // count = this.isQuadrilateral ? 11 : count;
        // SoundManager.instance().playEffect("Colloect _Bubble_" + count);

    }

    unQuadrilateral() {
        for (let i = 0; i < this.listBubbleSelectQuadrilateral.length; i++) {
            const bubble = this.listBubbleSelectQuadrilateral[i];
            bubble.nonSelect();
        }
        this.listBubbleSelectQuadrilateral = [];
        this.isQuadrilateral = false;
    }

    clearBubbleSelected() {
        for (let i = 0; i < this.listBubbleSelect.length; i++) {
            const bubble = this.listBubbleSelect[i];
            bubble.nonSelect();
        }
        this.listBubbleSelect = [];
        this.isPlay = false;
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


















    onTouchStart(event) {
        if (this.isPlay == true) return;
        this.isQuadrilateral = false;
        let currentTouch = event.touch.getLocation();
        this.itemCheck.setPosition(currentTouch)


    }
    onTouchMove(event) {
        if (this.isPlay == true) return;
        let currentTouch = event.touch.getLocation();
        this.itemCheck.setPosition(currentTouch)
        // console.log("x: " + currentTouch.x + "y: " + currentTouch.y);
    }
    onTouchEnd(event) {
        if (this.isPlay == true) return;
        this.touchEnd();
        this.itemCheck.setPosition(-100, -100)
    }




    getPosition(row: number, col: number) {

        return new cc.Vec2(SIZE.beginX + SIZE.spaceX * col, SIZE.beginY - SIZE.spaceY * row);
    }

}
