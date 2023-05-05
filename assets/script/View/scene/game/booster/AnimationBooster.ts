import { BOOSTER, MAXCOLUMNBOARD } from "../../../../component/constant/constant";
import GlobalEvent from "../../../../component/event/GlobalEvent";
import CreateAnimationBooster from "../../../../component/pool/CreateAnimationBooster";
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
    }

    protected onEnable(): void {
        GlobalEvent.instance().addEventListener(GlobalEvent.SHOW_ANI_BOOSTER, this.show, this);
        GlobalEvent.instance().addEventListener(GlobalEvent.CLEAR_BOOSTER, this.hideAll, this);
    }
    protected onDisable(): void {
        GlobalEvent.instance().removeEventListener(GlobalEvent.SHOW_ANI_BOOSTER, this.show, this);
        GlobalEvent.instance().removeEventListener(GlobalEvent.CLEAR_BOOSTER, this.hideAll, this);
    }
    hideAll() {
        while (this.node.childrenCount > 0) {
            CreateAnimationBooster.instance().removeItem(this.node.children[0]);
        }
    }

    show(data) {
        let bubble: Bubble = data.bubble;
        if (!bubble) return;
        while (this.node.childrenCount > 0) {
            CreateAnimationBooster.instance().removeItem(this.node.children[0]);
        }
        let animation = CreateAnimationBooster.instance().createItem(MainData.instance().keyBooster, bubble);
        
        if(!animation) return;
        animation.setParent(this.node);
        animation.active = true;
        animation.setPosition(bubble.node.position);
    }



    // update (dt) {}
}
