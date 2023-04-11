// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import GlobalEvent from "../../../../component/event/GlobalEvent";

const { ccclass, property } = cc._decorator;

@ccclass
export default class NewClass extends cc.Component {



    @property(cc.Node)
    bg: cc.Node = null;
    @property(cc.Node)
    bgAni: cc.Node[] = [];
    @property(cc.ParticleSystem)
    holeParticle: cc.ParticleSystem[] = [];

    start() {

    }
    protected onLoad(): void {
        this.reset();
    }

    reset(){
        this.bg.active = false;
        for (let i = 0; i < this.bgAni.length; i++) {

            this.bgAni[i].active = false;
            this.holeParticle[i].node.active = false;
        }
    }
    protected onEnable(): void {
        GlobalEvent.instance().addEventListener(GlobalEvent.SHOW_ANI_HOLE, this.showAni, this);
    }
    protected onDisable(): void {

        GlobalEvent.instance().removeEventListener(GlobalEvent.SHOW_ANI_HOLE, this.showAni, this);
    }
    showAni(data) {
        let indexHole = data.index;
        
        let bg = this.bgAni[indexHole];
        let particle = this.holeParticle[indexHole];
        if (bg.active == true) return;

        var anim = bg.getComponent(cc.Animation);
        anim.on(cc.Animation.EventType.FINISHED, () => {
            bg.active = false;
            particle.stopSystem();
            particle.node.active = false;
        }, this)

        bg.active = true;
        anim.play();

        particle.resetSystem();
        particle.node.active = true;
    }

    // update (dt) {}
}
