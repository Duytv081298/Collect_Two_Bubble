import SoundManager from '../../../../component/component/SoundManager';
import { Utils } from '../../../../component/component/Utils';
import { BOOSTER, DEFAULT_MAP, MAXCOLUMNBOARD, MAXROWBOARD, SIZE, TOTAL_BALL } from "../../../../component/constant/constant";
import GlobalEvent from '../../../../component/event/GlobalEvent';
import CreateAnimationBubble from '../../../../component/pool/CreateAnimationBubble';
import CreateBubble from '../../../../component/pool/CreateBubble';
import CreateConnect from '../../../../component/pool/CreateConnect';
import MainData from "../../../../component/storage/MainData";
import { TUT } from '../../../tutorial/Tutorial';
import Bubble from '../item/Bubble';

const { ccclass, property } = cc._decorator;

const speedBall = 0.1;
const MAXTIME = 0.3;
@ccclass
export default class BroadContainer extends cc.Component {
    @property(cc.Node)
    content: cc.Node = null;
    @property(cc.Node)
    connectContainer: cc.Node = null;
    @property(cc.Node)
    bubbleDieContainer: cc.Node = null;
    @property(cc.Node)
    aniBubbleContainer: cc.Node = null;


    @property(cc.Node)
    tut_connectContainer: cc.Node = null;
    @property(cc.Node)
    tut_aniBubbleContainer: cc.Node = null;

    parentBubbleDie: cc.Node = null;
    parentConnect: cc.Node = null;
    parentAniBubble: cc.Node = null;


    @property(cc.Node)
    itemCheck: cc.Node = null;
    isQuadrilateral: boolean = false;



    arrBubble: [Bubble[]] = [[]];
    listBubbleSelect: Bubble[] = [];
    listBubbleSelectQuadrilateral: Bubble[] = [];
    listConnect: cc.Node[] = [];
    listColorGroup1: number[] = [];
    listColorGroup2: number[] = [];
    // arrPathBubble = [];

    protected onEnable(): void {
        this.onEventTouch();
        GlobalEvent.instance().addEventListener(GlobalEvent.HIDDEN_PRIZES_BUBBLE_BONUS, this.hPBubblesBonus, this);
        GlobalEvent.instance().addEventListener(GlobalEvent.HIDDEN_PRIZES_MULTI_BUBBLES, this.hPMultiBubblesX, this);
        GlobalEvent.instance().addEventListener(GlobalEvent.CANCEL_BUBBLE_COLLECT, this.cancel_Select, this);

        // GlobalEvent.instance().addEventListener(GlobalEvent.CHECK_END_GAME, this.checkEndGame, this);
        GlobalEvent.instance().addEventListener(GlobalEvent.START_GAME, this.reset, this);
        GlobalEvent.instance().addEventListener(GlobalEvent.REPLAY_GAME, this.reset, this);

        GlobalEvent.instance().addEventListener(GlobalEvent.CLEAR_ALL_BUBBLE_DIE, this.clearAllBubbleDie, this);
    }
    protected onDisable(): void {
        this.offEventTouch();
        GlobalEvent.instance().removeEventListener(GlobalEvent.HIDDEN_PRIZES_BUBBLE_BONUS, this.hPBubblesBonus, this);
        GlobalEvent.instance().removeEventListener(GlobalEvent.HIDDEN_PRIZES_MULTI_BUBBLES, this.hPMultiBubblesX, this);
        GlobalEvent.instance().removeEventListener(GlobalEvent.CANCEL_BUBBLE_COLLECT, this.cancel_Select, this);

        // GlobalEvent.instance().removeEventListener(GlobalEvent.CHECK_END_GAME, this.checkEndGame, this);
        GlobalEvent.instance().removeEventListener(GlobalEvent.START_GAME, this.reset, this);
        GlobalEvent.instance().removeEventListener(GlobalEvent.REPLAY_GAME, this.reset, this);

        GlobalEvent.instance().removeEventListener(GlobalEvent.CLEAR_ALL_BUBBLE_DIE, this.clearAllBubbleDie, this);
    }
    onEventTouch() {
        let canvas = cc.find('Canvas');
        canvas.on(cc.Node.EventType.TOUCH_START, this.onTouchStart, this);
        canvas.on(cc.Node.EventType.TOUCH_MOVE, this.onTouchMove, this);
        canvas.on(cc.Node.EventType.TOUCH_END, this.onTouchEnd, this);
        canvas.on(cc.Node.EventType.TOUCH_CANCEL, this.onTouchEnd, this);
    }
    offEventTouch() {
        let canvas = cc.find('Canvas');
        canvas.off(cc.Node.EventType.TOUCH_START);
        canvas.off(cc.Node.EventType.TOUCH_MOVE);
        canvas.off(cc.Node.EventType.TOUCH_END);
        canvas.off(cc.Node.EventType.TOUCH_CANCEL);
    }
    reset() {

        this.unscheduleAllCallbacks();
        this.node.stopAllActions()
        this.isQuadrilateral = false;

        this.arrBubble = [[]];
        this.listBubbleSelect = [];
        this.listBubbleSelectQuadrilateral = [];
        this.listConnect = [];
        this.listColorGroup1 = [];
        this.listColorGroup2 = [];

        while (this.content.childrenCount > 0) {
            CreateBubble.instance().removeItem(this.content.children[0]);
        }
        this.generateGroupColor();
        this.itemCheck.setPosition(-100, -100)

        MainData.instance().isUserPlay = false;
        MainData.instance().isPlay = false;
        MainData.instance().realityBubble = 0;
        MainData.instance().estimateBubble = 0;

        this.setUpBubble();
        this.setParentTutorial();
        GlobalEvent.instance().dispatchEvent(GlobalEvent.SHOW_TUTORIAL)
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
                //  console.log(pos);
                if (MainData.instance().isTutorial) color = DEFAULT_MAP[row][col]
                bubble.setPosition(pos);
                bubble.setParent(this.content);
                bubble.name = row + "_" + col;
                bubble.active = true;
                bubble.on("CollisionEnter", this.collisionEnter.bind(this), this)

                let bubbleScript = bubble.getComponent(Bubble);
                bubbleScript.setData(row, col, color)

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

        let amountGroupA = Math.floor(TOTAL_BALL * percentage);
        let amountGroupB = TOTAL_BALL - amountGroupA;
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
    boardReady() {
        // console.log("boardReady");

        // console.log("boardReady content.childrenCount: " + this.content.childrenCount);
        MainData.instance().isPlay = false;
        if (MainData.instance().keyBooster != null || MainData.instance().isUseBooster) {
            GlobalEvent.instance().dispatchEvent(GlobalEvent.CLEAR_BOOSTER);
        }
        if (!this.checkActiveMove()) this.reloadBroad();
        if (MainData.instance().isTutorial) GlobalEvent.instance().dispatchEvent(GlobalEvent.NEXT_TUTORIAL)

        this.checkEndGame()
    }

    clearAllBubbleDie() {
        // console.log("clearAllBubbleDie");
        this.checkEndGame()

    }
    checkEndGame() {

        if (MainData.instance().move <= 0) {
            // console.log("MainData.instance().isHiddenPrizes: " + MainData.instance().isHiddenPrizes);
            // console.log("this.bubbleDieContainer.childrenCount: " + this.bubbleDieContainer.childrenCount);
            // console.log("MainData.instance().isPlay: " + MainData.instance().isPlay);
            // console.log("MainData.instance().isOpenGift: " + MainData.instance().isOpenGift);
            if (MainData.instance().isOpenGift) return;

            if (this.bubbleDieContainer.childrenCount > 0 || MainData.instance().isPlay || MainData.instance().isHiddenPrizes) {
                this.scheduleOnce(() => { this.checkEndGame() }, 1)
                return;
            };
            GlobalEvent.instance().dispatchEvent(GlobalEvent.SHOW_NO_MOVE_POPUP);
        }
    }

    collisionEnter(bubble: Bubble) {
        // console.log("collisionEnter");

        if (MainData.instance().keyBooster != null) {
            this.itemCheck.setPosition(-100, -100)
            if (MainData.instance().keyBooster == BOOSTER.reverse) {
                // console.log("keyBooster == BOOSTER.reverse");

                this.reverseBroad(bubble);
                MainData.instance().isUseBooster = true;
            } else if (!MainData.instance().isUseBooster) {
                MainData.instance().isPlay = true;
                MainData.instance().isUseBooster = true;
                let timeDelay = this.useBooster(bubble);
                // console.log("timeDelay");

                this.scheduleOnce(() => {
                    this.touchEnd();
                    GlobalEvent.instance().dispatchEvent(GlobalEvent.UPDATE_AMOUNT_BOOSTER, { booster: MainData.instance().keyBooster, amount: -1 });
                    GlobalEvent.instance().dispatchEvent(GlobalEvent.HIDE_ANI_BOOSTER);
                }, timeDelay);
            }
        } else {
            if (MainData.instance().isTutorial && !bubble.isTutorial) return;
            if (this.listBubbleSelect.length == 0) {
                this.pushBubble(bubble)
            } else {
                let bubbleCheck = this.checkCollect(bubble);
                if (bubbleCheck == null) return; // = vs bubble chon gan nhat, khong phu hop dieu kien
                else if (bubbleCheck == true) this.cutBubble(bubble); // quay tro lai 1 bubble
                else this.pushBubble(bubble);
            }
            if (MainData.instance().isTutorial && this.listBubbleSelect.length > 0) {
                GlobalEvent.instance().dispatchEvent(GlobalEvent.PAUSE_TUTORIAL);
            }
        }



    }
    touchEnd() {
        // console.log("touchEnd");

        MainData.instance().isPlay = true;
        this.hideAllConnect();
        // loai bo vong tron progress
        GlobalEvent.instance().dispatchEvent(GlobalEvent.CLEAR_BUBBLE_PROGRESS);
        if (MainData.instance().keyBooster != null) {
            this.clearDot();
            return;
        }
        if (this.checkTutorial()) return;
        if (this.listBubbleSelect.length < 2) {
            this.clearBubbleSelected();
            MainData.instance().isPlay = false;
            return;
        } else {
            // dem so luong move khi hien hole gold
            GlobalEvent.instance().dispatchEvent(GlobalEvent.UPDATE_MOVE_PROGRESS_GOLD);

            if (this.listBubbleSelect.length >= 8 || this.isQuadrilateral) {
                MainData.instance().move += 1;
                GlobalEvent.instance().dispatchEvent(GlobalEvent.ANIMATION_PLUS_MOVE);
            }
            else {
                MainData.instance().updateMove(-1);
                GlobalEvent.instance().dispatchEvent(GlobalEvent.ANIMATION_UPDATE_MOVE, { status: false });
            }

            if (this.isQuadrilateral) this.listBubbleSelect = this.mergeListDotSelect();
            GlobalEvent.instance().dispatchEvent(GlobalEvent.SHOW_CO_VU, { amount: this.listBubbleSelect.length});
            this.clearDot();

        }
    }
    mergeListDotSelect(): Bubble[] {

        let arr: Bubble[] = this.listBubbleSelect.concat(this.listBubbleSelectQuadrilateral);
        arr = Array.from(new Set(arr));
        this.listBubbleSelectQuadrilateral = [];
        return arr;
    }

    clearDot() {
        // console.log("clear dot");
        let touches = this.listBubbleSelect.concat();
        this.clearBubbleSelected();
        // console.log("listBubbleSelect length: " + this.listBubbleSelect.length);
        // console.log("touches length: " + touches.length);


        // console.log("clearDot content.childrenCount: " + this.content.childrenCount);
        let delay = 0.07;
        let time = 0;
        for (let i = 0; i < touches.length; i++) {
            const bubble = touches[i];
            if (i > 0) time = i % 2 == 0 ? time + delay : time;
            else if (i == touches.length - 1) time += delay;
            if (MainData.instance().keyBooster == BOOSTER.rocket && i == 0 ||
                MainData.instance().keyBooster == BOOSTER.bomb && i == 0) {
                bubble.nonSelect();
                CreateBubble.instance().removeItem(bubble.node);
                this.arrBubble[bubble.row][bubble.col] = null;
                continue;
            }
            let aniBubble = CreateAnimationBubble.instance().createItem(bubble.getColor())
            if (aniBubble) {
                aniBubble.setParent(this.parentAniBubble);
                aniBubble.setPosition(bubble.node.position);
            }
            time = Math.min(time, 0.15)

            bubble.nonSelect();
            bubble.node.parent = this.bubbleDieContainer;
            bubble.node.name = touches.length < 5 ? "sfx_bubble _break1" : "sfx_bubble_break2";
            this.arrBubble[bubble.row][bubble.col] = null;
            MainData.instance().estimateBubble++;

            this.scheduleOnce(() => {
                bubble.activeRigidBody(i % 2 == 0);
                SoundManager.instance().playEffect("bubble_out_broad");
            }, time);
        }
        this.scheduleOnce(() => { this.reSetUpBubble() }, time + delay)
    }
    reSetUpBubble() {
        // console.log("reSetUpBubble");

        // console.log("reSetUpBubble 0 content.childrenCount: " + this.content.childrenCount);

        let amountDefaultGroupColor = this.getAmountDefaultGroupColor();
        let existGroupColor1: number = 0;
        let existGroupColor2: number = 0;
        let maxTime = 0;
        let maxTime1 = 0;
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

                    bubble.updateIndex(idxRow, col);
                    let kc = (idxRow - row) > 1 ? (idxRow - row) * 0.8 : (idxRow - row);
                    maxTime = Math.max(maxTime, speedBall * kc);
                    maxTime = Math.min(MAXTIME, maxTime)

                    bubble.node.stopAllActions();
                    cc.tween(bubble.node).to(maxTime, { x: pos.x, y: pos.y }).start();
                }
            }
            countMore[col] = count;
        }

        // console.log("reSetUpBubble 1 content.childrenCount: " + this.content.childrenCount);
        let freeColorGroup1 = amountDefaultGroupColor.groupA - existGroupColor1;
        let freeColorGroup2 = amountDefaultGroupColor.groupB - existGroupColor2;

        for (let col = 0; col < countMore.length; col++) {
            let count = countMore[col];
            let tempRow = -1;
            if (count > 0) {
                let maxKc = count > 1 ? count * 0.8 : count;
                maxTime1 = Math.max(maxTime1, speedBall * maxKc);
                maxTime1 = Math.min(MAXTIME, maxTime1)

                while (count > 0) {
                    let row = count - 1;
                    let color = 0;
                    if (amountDefaultGroupColor.groupA == TOTAL_BALL * 0.5 && Utils.randomInt(0, 1) == 0) {
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

                    bubble.setPosition(posBegin);
                    bubble.setScale(0.8);
                    bubble.setParent(this.content);
                    bubble.name = row + "_" + col;
                    bubble.active = true;

                    bubble.on("CollisionEnter", this.collisionEnter.bind(this), this)
                    let bubbleScript = bubble.getComponent(Bubble);


                    this.arrBubble[row][col] = bubbleScript;
                    let pos: cc.Vec2 = this.getPosition(row, col);
                    bubbleScript.setData(row, col, color);

                    bubble.stopAllActions();
                    cc.tween(bubble).to(maxTime1, { x: pos.x, y: pos.y }).start();
                    count--;
                    tempRow--;
                }
            }
        }

        // console.log("reSetUpBubble 2 content.childrenCount: " + this.content.childrenCount);
        let maxTimeDelay = Math.max(maxTime, maxTime1) + speedBall;
        this.scheduleOnce(() => { this.boardReady(); }, maxTimeDelay);
    }

    pushBubble(bubble: Bubble) {
        // console.log("pushBubble");

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

        if (this.listBubbleSelect.length > 1) {
            let startBubble = this.listBubbleSelect[this.listBubbleSelect.length - 2];
            let connect = CreateConnect.instance().createConnect(startBubble, bubble);
            connect.setParent(this.parentConnect);
            this.listConnect.push(connect);
        }
        if (this.isQuadrilateral) {
            this.listBubbleSelectQuadrilateral = this.pushAllBubbleColor(bubble.getColor());
        }

        GlobalEvent.instance().dispatchEvent(GlobalEvent.SHOW_BUBBLE_PROGRESS, { count: this.isQuadrilateral ? 8 : this.listBubbleSelect.length });

        var count = this.listBubbleSelect.length - 1 <= 0 ? 0 : this.listBubbleSelect.length - 1 >= 11 ? 11 : this.listBubbleSelect.length - 1;
        SoundManager.instance().playEffect("Colloect _Bubble_" + count);
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
    hideOneConnect() {
        if (this.listConnect.length <= 0) return;
        let connect = this.listConnect.pop()
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
    cutBubble(bubble: Bubble) {
        // console.log("cutBubble");

        // console.log("cutDot");
        let dataEnd = this.listBubbleSelect[this.listBubbleSelect.length - 1];
        if (this.isQuadrilateral) {
            this.unQuadrilateral();
        } else {
            this.arrBubble[dataEnd.row][dataEnd.col].getComponent(Bubble).nonSelect();
        }
        this.listBubbleSelect.splice(this.listBubbleSelect.length - 1, 1);

        this.hideOneConnect();

        GlobalEvent.instance().dispatchEvent(GlobalEvent.SHOW_BUBBLE_PROGRESS, { count: this.isQuadrilateral ? 8 : this.listBubbleSelect.length });

        var count = this.listBubbleSelect.length - 1 <= 0 ? 0 : this.listBubbleSelect.length - 1 >= 11 ? 11 : this.listBubbleSelect.length - 1;
        count = this.isQuadrilateral ? 11 : count;
        SoundManager.instance().playEffect("Colloect _Bubble_" + count);

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
    }
    checkCollect(bubble: Bubble) {
        // console.log("content.childrenCount: " + this.content.childrenCount);

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

    useBooster(bubble: Bubble): number {
        // console.log("useBooster");

        switch (MainData.instance().keyBooster) {
            case BOOSTER.rocket:
                GlobalEvent.instance().dispatchEvent(GlobalEvent.SHOW_ANI_BOOSTER, { bubble: bubble });
                this.listBubbleSelect = this.getBubbleRocket(bubble);
                // console.log("listBubbleSelect.length: " + this.listBubbleSelect.length);
                this.scheduleOnce(() => {
                    SoundManager.instance().playEffect("Booster_rocket");
                }, 0.3)
                return 0.3;
            case BOOSTER.bomb:
                GlobalEvent.instance().dispatchEvent(GlobalEvent.SHOW_ANI_BOOSTER, { bubble: bubble });
                this.listBubbleSelect = this.getDotBomb(bubble);
                // console.log("listBubbleSelect.length: " + this.listBubbleSelect.length);
                this.scheduleOnce(() => {
                    SoundManager.instance().playEffect("color_bomb")
                }, 0.6)
                return 0.6;
            case BOOSTER.reverse:
                this.reverseBroad(bubble);
                return 0;
            case BOOSTER.hammer:
                GlobalEvent.instance().dispatchEvent(GlobalEvent.SHOW_ANI_BOOSTER, { bubble: bubble });
                this.listBubbleSelect = this.getBubbleHammer(bubble);
                // console.log("listBubbleSelect.length: " + this.listBubbleSelect.length);
                this.scheduleOnce(() => {
                    SoundManager.instance().playEffect("booster_hammer");
                }, 0.12)
                return 0.45;
            default:
                return 0;
        }
    }

    getBubbleRocket(bubble: Bubble): Bubble[] {
        // console.log("getBubbleRocket");

        let arr = this.arrBubble.concat();
        let row = bubble.row;
        let col = bubble.col;
        bubble.isSelect = true;

        let listBubble: Bubble[] = [];
        listBubble.push(bubble);


        let left: boolean = col > 0;
        let right: boolean = col < MAXCOLUMNBOARD - 1;
        let top: boolean = row > 0;
        let bottom: boolean = row < MAXROWBOARD - 1;

        let index = 1;

        while (right || left || top || bottom) {
            // console.log("check");

            if (right) {
                let newCol = col + index
                if (newCol == MAXCOLUMNBOARD - 1) right = false
                let tempDot = arr[row][newCol];
                if (listBubble.indexOf(tempDot) < 0) {
                    listBubble.push(tempDot);
                    tempDot.isSelect = true;
                }
            }
            if (top) {
                let newRow = row - index
                if (newRow == 0) top = false
                let tempDot = arr[newRow][col];
                if (listBubble.indexOf(tempDot) < 0) {
                    listBubble.push(tempDot);
                    tempDot.isSelect = true;
                }
            }
            if (left) {
                let newCol = col - index
                if (newCol == 0) left = false
                let tempDot = arr[row][newCol];
                if (listBubble.indexOf(tempDot) < 0) {
                    listBubble.push(tempDot);
                    tempDot.isSelect = true;
                }
            }
            if (bottom) {
                let newRow = row + index
                if (newRow == MAXROWBOARD - 1) bottom = false
                let tempDot = arr[newRow][col];
                if (listBubble.indexOf(tempDot) < 0) {
                    listBubble.push(tempDot);
                    tempDot.isSelect = true;
                }
            }
            index++;

        }
        return listBubble;
    }
    getBubbleHammer(bubble: Bubble): Bubble[] {
        // console.log("getBubbleHammer");

        bubble.isSelect = true;
        return [bubble]
    }
    getDotBomb(bubble: Bubble): Bubble[] {
        // console.log("getDotBomb");
        let arr = this.arrBubble.concat();

        let tempListStepX: number[] = [-1, 0, 1, 0, -1, 1, 1, -1]
        let tempListStepY: number[] = [0, -1, 0, 1, -1, -1, 1, 1]
        bubble.isSelect = true;
        let listDot: Bubble[] = [bubble];
        let row = bubble.row;
        let col = bubble.col;

        for (let i = 0; i < tempListStepX.length; i++) {
            let x = col + tempListStepX[i];
            let y = row + tempListStepY[i];
            x = x < 0 ? x = 0 : x > arr[0].length - 1 ? x = arr[0].length - 1 : x;
            y = y < 0 ? y = 0 : y > arr.length - 1 ? y = arr.length - 1 : y;
            let tempDot = arr[y][x]
            if (listDot.indexOf(tempDot) < 0) {
                listDot.push(tempDot);
                tempDot.isSelect = true;
            }
        }
        return listDot;
    }


    bubbleReverseA: Bubble = null;
    bubbleReverseB: Bubble = null;

    reverseBroad(bubble: Bubble): boolean {
        if (MainData.instance().isHandlerReverse) return;

        if (!this.bubbleReverseA) {
            SoundManager.instance().playEffect("sfx_item_active");
            this.bubbleReverseA = bubble;
            GlobalEvent.instance().dispatchEvent(GlobalEvent.SHOW_ANI_BOOSTER, { bubble: bubble });
        }
        else {
            let x = bubble.col - this.bubbleReverseA.col;
            let y = bubble.row - this.bubbleReverseA.row;
            if (bubble != this.bubbleReverseA && Math.abs(x - y) == 1 && Math.abs(x) <= 1 && Math.abs(y) <= 1) {
                this.bubbleReverseB = bubble;
            }
        }

        if (this.bubbleReverseA && this.bubbleReverseB) this.reverse();
        if (this.bubbleReverseA && !this.bubbleReverseB) return true;
        else return false;
    }

    reverse() {
        SoundManager.instance().playEffect("booster_chance_color");
        GlobalEvent.instance().dispatchEvent(GlobalEvent.UPDATE_AMOUNT_BOOSTER, { booster: MainData.instance().keyBooster, amount: -1 });
        GlobalEvent.instance().dispatchEvent(GlobalEvent.HIDE_ANI_BOOSTER);
        MainData.instance().isHandlerReverse = true;

        let index0: cc.Vec3 = this.bubbleReverseA.node.position;
        let index1: cc.Vec3 = this.bubbleReverseB.node.position;

        let coefficient0 = this.bubbleReverseA.coefficients;
        let row0 = this.bubbleReverseA.row;
        let col0 = this.bubbleReverseA.col;
        let color0 = this.bubbleReverseA.getColor();


        let coefficient1 = this.bubbleReverseB.coefficients;
        let row1 = this.bubbleReverseB.row;
        let col1 = this.bubbleReverseB.col;
        let color1 = this.bubbleReverseB.getColor();

        let a = this.bubbleReverseA;
        let b = this.bubbleReverseB;

        b.reSetData(row0, col0, color1, coefficient1);
        a.reSetData(row1, col1, color0, coefficient0);

        this.bubbleReverseA.node.stopAllActions()
        this.bubbleReverseB.node.stopAllActions()

        cc.tween(this.bubbleReverseA.node)
            .to(speedBall * 2, { position: index1 }, { easing: "cubicOut" })
            .call(() => {
                MainData.instance().isHandlerReverse = false;

                this.arrBubble[row0][col0] = b;
                this.arrBubble[row1][col1] = a;

                this.bubbleReverseA = null;
                this.bubbleReverseB = null;
                this.boardReady();
            })
            .start();

        cc.tween(this.bubbleReverseB.node)
            .to(speedBall * 2, { position: index0 }, { easing: "cubicOut" })
            .start();
    }

    listStep: any[] = [[0, -1], [1, 0], [0, 1], [-1, 0]]
    checkActiveMove(): boolean {
        for (let r = 0; r < this.arrBubble.length; r++) {
            const row = this.arrBubble[r];
            for (let c = 0; c < row.length; c++) {
                const dot = row[c];
                for (let i = 0; i < this.listStep.length; i++) {
                    const x = this.listStep[i][0];
                    const y = this.listStep[i][1];
                    let a = dot.col + x;
                    let b = dot.row + y;
                    a = a < 0 ? a = 0 : a > this.arrBubble[0].length - 1 ? a = this.arrBubble[0].length - 1 : a;
                    b = b < 0 ? b = 0 : b > this.arrBubble.length - 1 ? b = this.arrBubble.length - 1 : b;
                    if (a != dot.col || b != dot.row)
                        if (dot.getColor() == this.arrBubble[b][a].getColor()) {
                            return true
                        };
                }
            }
        }
        return false
    }



    reloadBroad() {
        // console.log("reloadBroad");

        MainData.instance().isPlay = true;
        for (let i = 0; i < this.arrBubble.length; i++) {
            let row = this.arrBubble[i];
            for (let j = 0; j < row.length; j++) {
                let bubble = row[j];
                let pos0 = bubble.node.getPosition();
                let pos1 = cc.Vec2.ZERO;
                let point2 = new cc.Vec2(-1 * Utils.randomInt(pos0.x, pos1.x), Utils.randomInt(pos0.y, pos1.y))
                let point3 = new cc.Vec2(-1 * Utils.randomInt(pos1.x, pos0.x), Utils.randomInt(pos1.y, pos0.y))

                bubble.node.stopAllActions()
                cc.tween(bubble.node)
                    .bezierTo(0.5, pos0, point2, pos1)
                    .bezierTo(0.5, pos1, point3, pos0)
                    .call(() => { MainData.instance().isPlay = false; })
                    .start();
            }
        }
        this.scheduleOnce(() => { this.newSetUpBubble() }, 0.5);

    }

    newSetUpBubble() {
        let tempAmountDefaultGroupColor = this.getAmountDefaultGroupColor();

        for (let i = 0; i < this.content.children.length; i++) {
            let bubble = this.content.children[i];
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
            bubble.getComponent(Bubble).setColor(color);
        }
    }

    hPBubblesBonus(data) {
        let parent = data.parent;
        MainData.instance().estimateBubble += 8;
        for (let i = 0; i < 8; i++) {
            let bubble = CreateBubble.instance().createItem();

            bubble.setPosition(-100 + i * 25, 100);
            bubble.setScale(0.8);
            bubble.setParent(this.bubbleDieContainer);
            bubble.name = "sfx_bubble_break2";
            bubble.active = true;
            let color = Math.floor(Math.random() * 5)


            let bubbleScript = bubble.getComponent(Bubble);
            bubbleScript.coefficients = 1;
            bubbleScript.setColor(color);
            bubbleScript.activeRigidBody(Utils.randomInt(0, 1) == 0, true)
        }
    }
    hPMultiBubblesX(data) {
        let coefficient = data.coefficient;
        if (coefficient) {
            for (let i = 0; i < 3; i++) {
                this.randomBubblesX(coefficient);
            }
        }
    }
    randomBubblesX(coefficient: number | null) {
        let index = 1;
        let bubble = this.arrBubble[Math.floor(Math.random() * 6)][Math.floor(Math.random() * 6)]
        while (bubble.coefficients > 1 && index < 100) {
            let bubble = this.arrBubble[Math.floor(Math.random() * 6)][Math.floor(Math.random() * 6)]
            index++;
        }
        if (bubble.coefficients > 1) return false;

        let tempCoefficient = coefficient ? coefficient : Math.floor(Math.random() * 4) + 2;
        bubble.coefficients = tempCoefficient;
    }




    cancel_Select() {
        this.hideAllConnect();
        this.clearBubbleSelected();
        MainData.instance().isPlay = false;
    }






    onTouchStart(event) {
        MainData.instance().isUserPlay = true;
        if (MainData.instance().move <= 0) return;
        if (MainData.instance().isPlay) return;
        if (MainData.instance().isOpenGift) return;
        if (MainData.instance().keyBooster != null && MainData.instance().keyBooster != BOOSTER.reverse) return;
        this.isQuadrilateral = false;
        let currentTouch = event.touch.getLocation();
        this.itemCheck.setPosition(currentTouch)
    }
    onTouchMove(event) {
        if (MainData.instance().move <= 0) return;
        if (MainData.instance().isPlay) return;
        if (MainData.instance().isOpenGift) return;
        if (MainData.instance().keyBooster != null && MainData.instance().keyBooster != BOOSTER.reverse) return;
        let currentTouch = event.touch.getLocation();
        this.itemCheck.setPosition(currentTouch)
        // console.log("x: " + currentTouch.x + "y: " + currentTouch.y);
    }
    onTouchEnd(event) {
        // console.log("onTouchEnd++++++");
        // console.log("move: " + MainData.instance().move + "\nisPlay: " + MainData.instance().isPlay +
        //     "\nisOpenGift: " + MainData.instance().isOpenGift +
        //     "\nkeyBooster: " + MainData.instance().keyBooster);
        MainData.instance().isUserPlay = false;
        if (MainData.instance().move <= 0) return;
        if (MainData.instance().isPlay) return;
        if (MainData.instance().isOpenGift) return;
        if (MainData.instance().isHandlerReverse) {

            let currentTouch = event.touch.getLocation();
            this.itemCheck.setPosition(currentTouch);
            return;
        }
        if (MainData.instance().isUseBooster) return;
        if (MainData.instance().keyBooster != null) {
            // console.log("onTouchEnd true");
            let currentTouch = event.touch.getLocation();
            this.itemCheck.setPosition(currentTouch);
        } else {
            // console.log("onTouchEnd else");

            this.touchEnd();
            this.itemCheck.setPosition(-100, -100)
        }

    }

    getPosition(row: number, col: number) {

        return new cc.Vec2(SIZE.beginX + SIZE.spaceX * col, SIZE.beginY - SIZE.spaceY * row);
    }

    getCountBubbleTutorial() {
        let index = MainData.instance().indexTutorial
        if (index > TUT.length - 1) return 0;
        return TUT[index].length;
    }
    checkTutorial() {
        if (!MainData.instance().isTutorial) return false
        if (MainData.instance().isTutorial && this.listBubbleSelect.length < this.getCountBubbleTutorial()) {
            this.clearBubbleSelected();
            MainData.instance().isPlay = false;
            GlobalEvent.instance().dispatchEvent(GlobalEvent.SHOW_TUTORIAL)
            return true;
        }
        return false
    }
    setParentTutorial() {
        if (MainData.instance().isTutorial) {
            this.parentConnect = this.tut_connectContainer;
            this.parentAniBubble = this.tut_aniBubbleContainer;
        } else {
            this.parentConnect = this.connectContainer;
            this.parentAniBubble = this.aniBubbleContainer;
        }
    }

}
