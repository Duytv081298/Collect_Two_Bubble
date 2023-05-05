import Bubble from "../../View/scene/game/item/Bubble";
import { BOOSTER, MAXCOLUMNBOARD } from "../constant/constant";

const { ccclass, property } = cc._decorator;

@ccclass
export default class CreateAnimationBooster {
    private static item: CreateAnimationBooster;
    public static instance(): CreateAnimationBooster {
        if (!CreateAnimationBooster.item) {
            CreateAnimationBooster.item = new CreateAnimationBooster();
        }
        return CreateAnimationBooster.item;
    }
    protected pool = new cc.NodePool();
    protected itemPrefab: cc.Prefab = null;

    skeletonData_Rocket: sp.SkeletonData = null;
    skeletonData_Bomb: sp.SkeletonData = null;
    skeletonData_Reverse: sp.SkeletonData = null;
    skeletonData_Hammer: sp.SkeletonData = null;
    setPrefab(itemPrefab: cc.Prefab) {
        this.itemPrefab = itemPrefab;
        this.loadAni();
    }
    createItem(booster: BOOSTER, bubble: Bubble) {
        let itemNode: cc.Node = null;
        if (this.pool.size() > 0) {
            itemNode = this.pool.get();
        } else {
            itemNode = cc.instantiate(this.itemPrefab);
        }
        itemNode.active = true;
        let status = this.setBooster(itemNode, bubble, booster);
        itemNode.x = 0;
        itemNode.y = 0;
        itemNode.angle = 0;
        itemNode.opacity = 255;
        itemNode.stopAllActions();
        return status ? itemNode : null;
    }
    removeItem(itemNode: cc.Node) {
        itemNode.stopAllActions();
        this.pool.put(itemNode);
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
    setBooster(itemNode: cc.Node, bubble: Bubble, booster: BOOSTER) {
        let anim = itemNode.getComponent(sp.Skeleton);
        if (!anim) return null;
        switch (booster) {
            case BOOSTER.rocket:

                if (this.skeletonData_Rocket) {
                    anim.skeletonData = this.skeletonData_Rocket;
                    anim.timeScale = 1.5;
                    anim.defaultSkin = "default";
                    anim.animation = "anim-tenlua-cong";
                    anim.setAnimation(0, "anim-tenlua-cong", false);
                    return true;
                } else return null;

            case BOOSTER.bomb:
                if (this.skeletonData_Bomb) {
                    anim.skeletonData = this.skeletonData_Bomb;
                    anim.timeScale = 1;
                    anim.defaultSkin = "default";
                    anim.animation = "boomno";
                    anim.setAnimation(0, "boomno", false);
                    return true;
                } else return null;

            case BOOSTER.reverse:
                if (this.skeletonData_Reverse) {
                    let name = this.getNameAniReverse(bubble)
                    anim.skeletonData = this.skeletonData_Reverse;
                    anim.clearTrack(0);
                    anim.timeScale = 1;
                    anim.setSkin("default");
                    anim.animation = name;
                    anim.setAnimation(0, name, true);
                    anim.setCompleteListener(() => { })
                    return true;
                } else return null;

            case BOOSTER.hammer:
                if (this.skeletonData_Hammer) {
                    anim.skeletonData = this.skeletonData_Hammer;
                    anim.timeScale = 1;
                    anim.setSkin("default");
                    anim.animation = "animation";
                    anim.setAnimation(0, "animation", false);
                    return true;
                } else return null;
            default:
                return null;
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
