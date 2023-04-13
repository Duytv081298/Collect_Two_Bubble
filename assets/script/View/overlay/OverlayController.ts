// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import GlobalEvent from "../../component/event/GlobalEvent";

const { ccclass, property } = cc._decorator;

@ccclass
export default class NewClass extends cc.Component {

    @property(cc.Label)
    label: cc.Label = null;

    @property
    text: string = 'hello';
    hiddenPrizes: cc.Node = null
    onLoad() {
        this.preLoadHiddenPrizes();
    }

    protected onEnable(): void {
        GlobalEvent.instance().addEventListener(GlobalEvent.SHOW_HIDDEN_PRIZES, this.loadHiddenPrizes, this);
    }
    protected onDisable(): void {

        GlobalEvent.instance().removeEventListener(GlobalEvent.SHOW_HIDDEN_PRIZES, this.loadHiddenPrizes, this);
    }

    start() {

    }
    preLoadHiddenPrizes() {
        cc.resources.preload("prefab/Hidden prizes/Hidden prizes", cc.Prefab, (err) => {
            this.loadHiddenPrizes(null);
        });
    }
    loadHiddenPrizes(data: any = null) {
        // console.log(data);

        // let sp = data ? data.spfPlayer : null;

        if (this.hiddenPrizes) {
            GlobalEvent.instance().removeEventListener(GlobalEvent.SHOW_HIDDEN_PRIZES, this.loadHiddenPrizes, this);
            return;
        }
        console.log("loadHiddenPrizes");
        cc.resources.load("prefab/Hidden prizes/Hidden prizes", cc.Prefab, (err, prefab: cc.Prefab) => {
            if (!err) {
                if (this.hiddenPrizes == null) {
                    this.hiddenPrizes = cc.instantiate(prefab);
                    this.hiddenPrizes.setParent(this.node)
                    this.hiddenPrizes.active = true;
                    // if (sp) GlobalEvent.instance().dispatchEvent(GlobalEvent.SHOW_HIDDEN_PRIZES, { spfPlayer: sp });
                }

            }
        });
    }
    // update (dt) {}
}
