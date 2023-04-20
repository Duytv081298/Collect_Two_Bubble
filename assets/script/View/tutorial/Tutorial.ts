import GlobalEvent from "../../component/event/GlobalEvent";
import LocalStorage from "../../component/storage/LocalStorage";
import MainData from "../../component/storage/MainData";
import BroadContainer from "../scene/game/broad/BroadContainer";
import Bubble from "../scene/game/item/Bubble";

const { ccclass, property } = cc._decorator;


@ccclass
export class Tutorial extends cc.Component {


    @property(cc.Node)
    bg: cc.Node = null;

    @property(cc.Node)
    tut_content: cc.Node = null;
    @property(cc.Node)
    tut_connectContainer: cc.Node = null;
    @property(cc.Node)
    tut_aniBubbleContainer: cc.Node = null;

    @property(cc.Node)
    hand: cc.Node = null;
    @property(cc.Node)
    great_Job: cc.Node = null;
    @property(cc.Node)
    tutMove: cc.Node = null;

    @property(BroadContainer)
    boardReal: BroadContainer = null;

    @property(cc.Label)
    listStrTut: cc.Label[] = [];

    isShowTutMove: boolean = false;

    isShow : boolean = false;



    protected onEnable(): void {
        MainData.instance().indexTutorial = 0;
        this.isShow = false;
        this.tutMove.active = false;
        this.great_Job.active = false;
        GlobalEvent.instance().addEventListener(GlobalEvent.SHOW_TUTORIAL, this.showTutorial, this);
        GlobalEvent.instance().addEventListener(GlobalEvent.NEXT_TUTORIAL, this.nextTutorial, this);
        GlobalEvent.instance().addEventListener(GlobalEvent.PAUSE_TUTORIAL, this.clearHand, this);
    }
    protected onDisable(): void {
        GlobalEvent.instance().removeEventListener(GlobalEvent.SHOW_TUTORIAL, this.showTutorial, this);
        GlobalEvent.instance().removeEventListener(GlobalEvent.NEXT_TUTORIAL, this.nextTutorial, this);
        GlobalEvent.instance().removeEventListener(GlobalEvent.PAUSE_TUTORIAL, this.clearHand, this);
    }

    reset() {

        this.clearAllText();
        this.clearHand();
        this.node.stopAllActions();
    }
    showTutorial(data) {
        if (LocalStorage.getItem(LocalStorage.IS_NEW)) this.show(data);
        else this.node.active = false;
    }

    nextTutorial(data) {
        MainData.instance().indexTutorial++;
        this.show(data)
    }
    show(data) {
        if(this.isShow) return;
        let timeDelay = data ? data.timeDelay : 0
        this.reset();
        this.isShow = true;
        if (this.isShowTutMove && MainData.instance().indexTutorial == 2) {
            this.isShowTutMove = false;
            this.showTutMove();
            return;
        }
        cc.tween(this.node)
            .delay(timeDelay)
            .call(() => {
                switch (MainData.instance().indexTutorial) {
                    case 0:
                        this.showTut0();
                        break;
                    case 1:
                        this.showTut1();
                        this.isShowTutMove = true;
                        break;
                    case 2:
                        this.showTut2();
                        break;
                    case 3:
                        this.showTut3();
                        break;
                    case 4:
                        this.great_Job.active = true;
                        return;
                    default:
                        LocalStorage.setItem(LocalStorage.IS_NEW, false)
                        this.boardReal.setParentTutorial();
                        this.node.active = false;
                        return;
                }
                this.listStrTut[MainData.instance().indexTutorial].node.active = true;
            })
            .start()

    }
    showTut0() {
        this.bg.active = true;
        let arrDot = this.boardReal.arrBubble.concat();
        let arrTut = TUT[MainData.instance().indexTutorial]
        for (let i = 0; i < arrTut.length; i++) {
            let pos = arrTut[i];
            let bubble: Bubble = arrDot[pos.row][pos.col]
            bubble.node.setParent(this.tut_content)
            bubble.isTutorial = true;
        }


        var pos0 = arrDot[arrTut[0].row][arrTut[0].col].node.position;
        var pos1 = arrDot[arrTut[1].row][arrTut[1].col].node.position;
        this.tweenTut0(pos0, pos1);
    }
    tweenTut0(pos0: cc.Vec3, pos1: cc.Vec3) {
        this.hand.active = true;
        this.hand.opacity = 255;
        this.hand.setPosition(pos0);
        this.hand.stopAllActions();

        let tweenDuration: number = 0.4;
        cc.tween(this.hand)
            .to(tweenDuration, { position: pos1 })
            .call(() => { this.hand.opacity = 0; })
            .delay(tweenDuration)
            .call(() => {
                this.tweenTut0(pos0, pos1)
            })
            .start();

    }
    showTut1() {
        this.bg.active = true;
        let arrDot = this.boardReal.arrBubble.concat();
        let arrTut = TUT[MainData.instance().indexTutorial]
        for (let i = 0; i < arrTut.length; i++) {
            let pos = arrTut[i];
            let bubble: Bubble = arrDot[pos.row][pos.col]
            bubble.node.setParent(this.tut_content)
            bubble.isTutorial = true;
        }
        var pos0 = arrDot[arrTut[0].row][arrTut[0].col].node.position;
        var pos1 = arrDot[arrTut[arrTut.length - 1].row][arrTut[arrTut.length - 1].col].node.position;

        this.tweenTut1(pos0, pos1);
    }
    tweenTut1(pos0: cc.Vec3, pos1: cc.Vec3) {
        this.hand.active = true;
        this.hand.opacity = 255;
        this.hand.setPosition(pos0);
        this.hand.stopAllActions();

        let tweenDuration: number = 0.4;
        cc.tween(this.hand)
            .to(tweenDuration * 2, { position: pos1 })
            .call(() => { this.hand.opacity = 0; })
            .delay(tweenDuration)
            .call(() => {
                this.tweenTut1(pos0, pos1)
            })
            .start();

    }

    showTut2() {
        this.bg.active = true;
        let arrDot = this.boardReal.arrBubble.concat();
        let arrTut = TUT[MainData.instance().indexTutorial]
        for (let i = 0; i < arrTut.length; i++) {
            let pos = arrTut[i];
            let bubble: Bubble = arrDot[pos.row][pos.col]
            bubble.node.setParent(this.tut_content)
            bubble.isTutorial = true;
        }
        var pos0 = arrDot[arrTut[0].row][arrTut[0].col].node.position;
        var pos1 = arrDot[arrTut[2].row][arrTut[2].col].node.position;
        var pos2 = arrDot[arrTut[3].row][arrTut[3].col].node.position;
        var pos3 = arrDot[arrTut[1].row][arrTut[1].col].node.position;
        this.tweenTut2(pos0, pos1, pos2, pos3);
    }
    tweenTut2(pos0: cc.Vec3, pos1: cc.Vec3, pos2: cc.Vec3, pos3: cc.Vec3) {
        this.hand.active = true;
        this.hand.opacity = 255;
        this.hand.setPosition(pos0);
        this.hand.stopAllActions();

        let tweenDuration: number = 0.3;
        cc.tween(this.hand)
            .to(tweenDuration, { position: pos1 })
            .to(tweenDuration, { position: pos2 })
            .to(tweenDuration, { position: pos3 })
            .to(tweenDuration, { position: pos0 })
            .call(() => { this.hand.opacity = 0; })
            .delay(tweenDuration)
            .call(() => {
                this.tweenTut2(pos0, pos1, pos2, pos3)
            })
            .start();

    }

    showTut3() {
        this.bg.active = true;
        let arrDot = this.boardReal.arrBubble.concat();
        let arrTut = TUT[MainData.instance().indexTutorial]
        for (let i = 0; i < arrTut.length; i++) {
            let pos = arrTut[i];
            let bubble: Bubble = arrDot[pos.row][pos.col]
            bubble.node.setParent(this.tut_content)
            bubble.isTutorial = true;
        }

        var pos0 = arrDot[arrTut[0].row][arrTut[0].col].node.position;
        var pos1 = arrDot[arrTut[2].row][arrTut[2].col].node.position;
        var pos2 = arrDot[arrTut[7].row][arrTut[7].col].node.position;

        this.tweenTut3(pos0, pos1, pos2);
    }
    tweenTut3(pos0: cc.Vec3, pos1: cc.Vec3, pos2: cc.Vec3) {
        this.hand.active = true;
        this.hand.opacity = 255;
        this.hand.setPosition(pos0);
        this.hand.stopAllActions();

        let tweenDuration: number = 0.4;
        let t1 = cc.tween(this.hand)
            .to(tweenDuration, { position: pos1 })

        let t2 = cc.tween(this.hand)
            .to(tweenDuration * 2, { position: pos2 })
        cc.tween(this.hand).sequence(t1, t2)
            .call(() => { this.hand.opacity = 0; })
            .delay(tweenDuration)
            .call(() => {
                this.tweenTut3(pos0, pos1, pos2)
            })
            .start();
    }


    clearHand() {
        this.isShow = false;
        this.bg.active = false;
        this.hand.stopAllActions();
        this.hand.active = false;
        this.clearAllText();
    }
    clearAllText() {
        for (let i = 0; i < this.listStrTut.length; i++) {
            this.listStrTut[i].node.active = false;
        }
    }
    showTutMove() {
        this.tutMove.active = true;
    }
    hideTutMove() {
        this.isShow = false;
        this.tutMove.active = false;
        this.show({});
    }

    hideGreatJob() {
        this.isShow = false;
        this.great_Job.active = false;
        
        this.nextTutorial({});
    }

    //     translateTut() {
    //         let arrStr = [
    //             `Connect  bubbles of
    // the same color.`,
    //             `Connections can
    // also be vertical
    // but NOT diagonal`,
    //             `Maximaize your moves!
    // Connect bubbles to
    // form squares...`,
    //             `...or eight+ clusters`,
    //             `Be strategic!
    // Limited moves.`,
    //             `Great job!
    // Keep playing, have fun!`
    //         ]
    //         let arrStrVie = [
    //             `Hãy kết nối 
    // các quả bóng cùng màu.`,
    //             `Có thể nối dọc, ngang
    // nhưng
    // KHÔNG ĐƯỢC
    // nối chéo.`,
    //             `Nhận thêm 1 lượt di chuyển và
    // loại bỏ tất cả bóng cùng màu
    // bằng cách:
    // Nối bóng hình vuông...
    // `,
    //             `...hoặc hơn tám bóng`,
    //             `Hãy chú ý đến
    // lượt di chuyển.`,
    //             `WOW! Bạn đã làm rất tốt
    // Tiếp tục chơi nào`
    //         ]
    //         var locale = FBInstant.getLocale();
    //         locale = "vi_VN";
    //         if (locale == "vi_VN") {
    //             for (let i = 0; i < this.listStrTut.length; i++) {
    //                 const txt = this.listStrTut[i];
    //                 txt.string = arrStrVie[i].toString();
    //             }
    //         } else {
    //             console.log("=========================");

    //             for (let i = 0; i < this.listStrTut.length; i++) {
    //                 const txt = this.listStrTut[i];
    //                 txt.string = arrStr[i].toString();
    //             }
    //         }
    //     }
}

export enum TUTORIAL {
    hand = 0
};

export const TUT = [
    [{ row: 2, col: 2 }, { row: 2, col: 3 }],
    [{ row: 1, col: 2 }, { row: 2, col: 2 }, { row: 3, col: 2 }, { row: 4, col: 2 }],
    [{ row: 3, col: 3 }, { row: 3, col: 4 }, { row: 4, col: 3 }, { row: 4, col: 4 }],
    [{ row: 3, col: 0 }, { row: 4, col: 0 }, { row: 5, col: 0 }, { row: 5, col: 1 }, { row: 5, col: 2 }, { row: 5, col: 3 }, { row: 5, col: 4 }, { row: 5, col: 5 }]
]
// export const TUT0 = [{ row: 2, col: 2 }, { row: 2, col: 3 }]
// export const TUT1 = [{ row: 1, col: 2 }, { row: 2, col: 2 }, { row: 3, col: 2 }, { row: 4, col: 2 }]
// export const TUT2 = [{ row: 3, col: 3 }, { row: 3, col: 4 }, { row: 4, col: 3 }, { row: 4, col: 4 }]
// export const TUT3 = [{ row: 3, col: 0 }, { row: 4, col: 0 }, { row: 5, col: 0 }, { row: 5, col: 1 }, { row: 5, col: 2 }, { row: 5, col: 3 }, { row: 5, col: 4 }, { row: 5, col: 5 }]
