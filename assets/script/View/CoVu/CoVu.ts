// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import SoundManager from "../../component/component/SoundManager";
import { Utils } from "../../component/component/Utils";
import GlobalEvent from "../../component/event/GlobalEvent";

const { ccclass, property } = cc._decorator;

@ccclass
export default class CoVu extends cc.Component {

    onEnable() {
        for (let i = 0; i < this.node.childrenCount; i++) {
            this.node.children[i].active = false;
        }
        GlobalEvent.instance().addEventListener(GlobalEvent.SHOW_CO_VU, this.show, this);
    }
    onDisable(): void {
        GlobalEvent.instance().removeEventListener(GlobalEvent.SHOW_CO_VU, this.show, this);
    }
    index: number = null;

    show(data) {

        if (!data) return;
        let amount = data.amount;
        if (!amount || amount < 10) return;
        let newindex = Math.floor(Math.random() * this.node.children.length)
        while (this.index == newindex) {
            newindex = Math.floor(Math.random() * this.node.children.length)
        }
        this.index = newindex;

        let nameSound = this.getNameSound(newindex);
        let child = this.node.children[newindex];

        this.animation(child);
        SoundManager.instance().playEffect(nameSound)

        // this.playFirework();
    }

    getNameSound(index: number): string {
        switch (index) {
            case 0: return "Excellent"
            case 1: return "good"
            case 2: return "Great"
            case 3: return "incredible"
            case 4: return "perfect"
            default:
                return null;
        }
    }
    animation(child: cc.Node) {
        child.active = true;
        let pos0 = cc.Vec3.ZERO;
        let pos1 = new cc.Vec3(Utils.randomInt(child.position.x - 40, child.position.x + 40), Utils.randomInt(child.position.y, child.position.y + 40));
        let pos2 = new cc.Vec3(Utils.randomInt(child.position.x - 70, child.position.x + 70), Utils.randomInt(child.position.y + 40, child.position.y + 100));

        cc.tween(child).parallel(
            cc.tween(child).to(0.5, { position: cc.Vec3.ZERO }, {
                onUpdate: (target1: cc.Vec3, ratio: number) => {
                    child.position = Utils.twoBezier(ratio, pos0, pos1, pos2,)
                }, easing: "quintInOut"
            }),
            cc.tween(child).to(0.5, { scale: 1.5 })
        ).call(() => {
            child.setPosition(pos0);
            child.active = false;
            child.setScale(0)
        }).start();
    }
}
