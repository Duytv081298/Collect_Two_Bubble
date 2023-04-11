// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import { BOOSTER, MAXCOLUMNBOARD } from "../../../../component/constant/constant";
import GlobalEvent from "../../../../component/event/GlobalEvent";
import MainData from "../../../../component/storage/MainData";
import Bubble from '../item/Bubble';

const { ccclass, property } = cc._decorator;

@ccclass
export default class NewClass extends cc.Component {
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

        GlobalEvent.instance().addEventListener(GlobalEvent.SHOW_ANI_BOOSTER, this.show, this);
        GlobalEvent.instance().removeEventListener(GlobalEvent.CLEAR_BOOSTER, this.hideAll, this);
    }
    loadAni() {
        cc.resources.load("spine/item-rocket/anim-tenlua", sp.SkeletonData, (err, res: sp.SkeletonData) => {
            if (!err) {
                this.skeletonData_Rocket = res;
            } else {
                console.log(err);
            }
        });
        cc.resources.load("spine/item-bomb/item-bom", sp.SkeletonData, (err, res: sp.SkeletonData) => {
            if (!err) {
                this.skeletonData_Bomb = res;
            } else {
                console.log(err);
            }
        });
        cc.resources.load("spine/anim_reverse/swap-anim", sp.SkeletonData, (err, res: sp.SkeletonData) => {
            if (!err) {
                this.skeletonData_Reverse = res;
            } else {
                console.log(err);
            }
        });
        cc.resources.load("spine/item_hammer/item-bua", sp.SkeletonData, (err, res: sp.SkeletonData) => {
            if (!err) {
                this.skeletonData_Hammer = res;
            } else {
                console.log(err);
            }
        });
    }

    hideAll() {
        for (let i = 0; i < this.node.children.length; i++) {
            this.node.children[i].active = false;
        }
    }

    show(data) {
        console.log("show animation");

        let bubble: Bubble = data.bubble;
        let child: cc.Node = null;

        for (let i = 0; i < this.node.children.length; i++) {
            let c = this.node.children[i];
            if (c.active == false) {
                child = c;
                break;
            }
        }
        let anim = child.getComponent(sp.Skeleton);
        if (!anim) return;

        switch (MainData.instance().keyBooster) {
            case BOOSTER.rocket:
                if (this.skeletonData_Rocket) {
                    child.active = true;
                    child.setPosition(bubble.node.position);
                    anim.skeletonData = this.skeletonData_Rocket;
                    anim.timeScale = 1.5;
                    anim.defaultSkin = "default";
                    anim.setCompleteListener(() => { child.active = false })
                    anim.setAnimation(0, "anim-tenlua-cong", false);
                    break;
                } else break;

            case BOOSTER.bomb:
                if (this.skeletonData_Bomb) {
                    child.active = true;
                    child.setPosition(bubble.node.position);
                    anim.skeletonData = this.skeletonData_Bomb;
                    anim.timeScale = 1;
                    anim.defaultSkin = "default";
                    anim.setCompleteListener(() => { child.active = false })
                    anim.setAnimation(0, "boomno", false);
                    break;
                } else break;

            case BOOSTER.reverse:
                if (this.skeletonData_Reverse) {
                    let name = this.getNameAniReverse(bubble)
                    child.active = true;
                    child.setPosition(bubble.node.position);
                    anim.skeletonData = this.skeletonData_Reverse;
                    anim.timeScale = 1;
                    anim.setSkin("default");
                    anim.setAnimation(0, name, true);
                    break;
                } else break;

            case BOOSTER.hammer:
                if (this.skeletonData_Hammer) {
                    child.setPosition(bubble.node.position);
                    anim.skeletonData = this.skeletonData_Hammer;
                    anim.timeScale = 1;
                    anim.setSkin("default");
                    anim.setCompleteListener(() => { child.active = false })
                    anim.setAnimation(0, "animation", false);
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
