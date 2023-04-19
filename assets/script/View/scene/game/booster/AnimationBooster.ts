import { BOOSTER, MAXCOLUMNBOARD } from "../../../../component/constant/constant";
import GlobalEvent from "../../../../component/event/GlobalEvent";
import MainData from "../../../../component/storage/MainData";
import Bubble from '../item/Bubble';

const { ccclass, property } = cc._decorator;

@ccclass
export default class AnimationBooster extends cc.Component {
    skeletonData_Rocket: sp.SkeletonData = null;
    skeletonData_Bomb: sp.SkeletonData = null;
    skeletonData_Reverse: sp.SkeletonData = null;
    skeletonData_Hammer: sp.SkeletonData = null;
    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        this.hideAll();
        this.loadAni();

    }

    protected onEnable(): void {
        GlobalEvent.instance().addEventListener(GlobalEvent.SHOW_ANI_BOOSTER, this.show, this);
        GlobalEvent.instance().addEventListener(GlobalEvent.CLEAR_BOOSTER, this.hideAll, this);
    }
    protected onDisable(): void {
        GlobalEvent.instance().removeEventListener(GlobalEvent.SHOW_ANI_BOOSTER, this.show, this);
        GlobalEvent.instance().removeEventListener(GlobalEvent.CLEAR_BOOSTER, this.hideAll, this);
    }
    loadAni() {
        cc.resources.load("spine/item-rocket/anim-tenlua", sp.SkeletonData, (err, res: sp.SkeletonData) => {
            if (!err) {
                this.skeletonData_Rocket = res;
                console.log("load anim-tenlua thanh cong");

            } else {
                console.log(err);
            }
        });
        cc.resources.load("spine/item-bomb/item-bom", sp.SkeletonData, (err, res: sp.SkeletonData) => {
            if (!err) {
                this.skeletonData_Bomb = res;
                console.log("load item-bom thanh cong");
            } else {
                console.log(err);
            }
        });
        cc.resources.load("spine/anim_reverse/swap-anim", sp.SkeletonData, (err, res: sp.SkeletonData) => {
            if (!err) {
                this.skeletonData_Reverse = res;
                console.log("load swap-anim thanh cong");
            } else {
                console.log(err);
            }
        });
        cc.resources.load("spine/item_hammer/item-bua", sp.SkeletonData, (err, res: sp.SkeletonData) => {
            if (!err) {
                this.skeletonData_Hammer = res;
                console.log("load item-bua thanh cong");
            } else {
                console.log(err);
            }
        });
    }

    hideAll() {
        console.log("hideAll");
        for (let i = 0; i < this.node.children.length; i++) {
            this.node.children[i].active = false;
            console.log(this.node.children[i].active);
        }
    }

    show(data) {
        console.log("show animation");

        let bubble: Bubble = data.bubble;
        let child: cc.Node = this.node.children[0];

        // console.log(child);
        // for (let i = 0; i < this.node.childrenCount; i++) {
        //     let c = this.node.children[i];
        //     console.log(this.node.children[i].active);
        //     if (c.active == false) {
        //         child = c;
        //         break;
        //     }
        // }
        // console.log(11111111);

        if (child == null) return;
        console.log(222222);

        let anim = child.getComponent(sp.Skeleton);
        if (!anim) return;
        console.log("MainData.instance().keyBooster: " + MainData.instance().keyBooster);


        switch (MainData.instance().keyBooster) {
            case BOOSTER.rocket:

                if (this.skeletonData_Rocket) {
                    console.log("=======================");

                    console.log(this.skeletonData_Rocket);

                    child.active = true;
                    child.setPosition(bubble.node.position);
                    anim.skeletonData = this.skeletonData_Rocket;
                    // anim.clearTrack(0);
                    anim.timeScale = 1.5;
                    anim.defaultSkin = "default";
                    anim.animation = "anim-tenlua-cong";
                    anim.setAnimation(0, "anim-tenlua-cong", false);
                    // anim.setCompleteListener(() => { child.active = false })
                    break;
                } else break;

            case BOOSTER.bomb:
                if (this.skeletonData_Bomb) {
                    child.active = true;
                    child.setPosition(bubble.node.position);
                    anim.skeletonData = this.skeletonData_Bomb;
                    // anim.clearTrack(0);
                    anim.timeScale = 1;
                    anim.defaultSkin = "default";
                    anim.animation = "boomno";
                    anim.setAnimation(0, "boomno", false);
                    // anim.setCompleteListener(() => { child.active = false })
                    break;
                } else break;

            case BOOSTER.reverse:
                if (this.skeletonData_Reverse) {
                    let name = this.getNameAniReverse(bubble)
                    child.active = true;
                    child.setPosition(bubble.node.position);
                    anim.skeletonData = this.skeletonData_Reverse;
                    anim.clearTrack(0);
                    anim.timeScale = 1;
                    anim.setSkin("default");
                    anim.animation = name;
                    anim.setAnimation(0, name, true);
                    // anim.setCompleteListener(() => { })
                    break;
                } else break;

            case BOOSTER.hammer:
                if (this.skeletonData_Hammer) {
                    child.setPosition(bubble.node.position);
                    anim.skeletonData = this.skeletonData_Hammer;
                    anim.clearTrack(0);
                    anim.timeScale = 1;
                    anim.setSkin("default");
                    anim.animation = "animation";
                    anim.setAnimation(0, "animation", false);
                    // anim.setCompleteListener(() => { child.active = false })
                    child.active = true;
                    break;
                } else break;

            default:
                break;
        }
    }



    getNameAniReverse(bubble: Bubble): string {
        let row: number = bubble.row;
        let col: number = bubble.col;

        let top: boolean = row > 0; // 0-> 5 == true
        let bottom: boolean = row < MAXCOLUMNBOARD - 1;

        let left: boolean = col > 0; // 0-> 5 == true
        let right: boolean = col < MAXCOLUMNBOARD - 1;

        if (!top && !left && bottom && right) return "swap1";
        else if (!top && left && bottom && right) return "swap2";
        else if (!top && left && bottom && !right) return "swap3";
        else if (top && !left && bottom && right) return "swap4";
        else if (top && left && bottom && right) return "swap5";
        else if (top && left && bottom && !right) return "swap6";
        else if (top && !left && !bottom && right) return "swap7";
        else if (top && left && !bottom && right) return "swap8";
        else if (top && left && !bottom && !right) return "swap9";
        return null;
    }
    // update (dt) {}
}
