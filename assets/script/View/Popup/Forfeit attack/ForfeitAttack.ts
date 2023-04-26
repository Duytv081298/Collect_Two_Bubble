// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import GlobalEvent from "../../../component/event/GlobalEvent";

const { ccclass, property } = cc._decorator;
const stringLabel = [
    "Are you certain you want to give up your attack? You won't get another chance. Think carefully", 
    "No money, no lead role! Are you sure you want that?", 
    "Choose another friend to attack"
]
@ccclass
export default class ForfeitAttack extends cc.Component {
    @property(cc.Label)
    label: cc.Label = null;
    @property(cc.Node)
    btnAttack: cc.Node = null;
    @property(cc.Node)
    btnSteal: cc.Node = null;
    @property(cc.Node)
    titleAttack: cc.Node = null;
    @property(cc.Node)
    titleSteal: cc.Node = null;
    isAttack:boolean = true;

    protected onLoad(): void {
        GlobalEvent.instance().addEventListener(GlobalEvent.SHOW_FORFEIT_ATTACK, this.show, this);
    }
    protected onDestroy(): void {
        GlobalEvent.instance().removeEventListener(GlobalEvent.SHOW_FORFEIT_ATTACK, this.show, this);
    }

    show(data:any){
        this.node.active = true;
        GlobalEvent.instance().dispatchEvent(GlobalEvent.HIDE_LOADING);
        this.isAttack = data.isAttack;
        let sameContext = false;
        if(data.hasOwnProperty("sameContext")) sameContext = data.sameContext;
        if(this.isAttack == true){
            if(sameContext = false){
                this.label.string = stringLabel[0];
            }else{
                this.label.string = stringLabel[2];
            }            
            this.btnAttack.active = true;
            this.btnSteal.active = false;
            this.titleAttack.active = true;
            this.titleSteal.active = false;
        }else{
            this.label.string = stringLabel[1];
            this.btnAttack.active = false;
            this.btnSteal.active = true;
            this.titleAttack.active = false;
            this.titleSteal.active = true;
        }
    }

    onHandlerAttack() {
        GlobalEvent.instance().dispatchEvent(GlobalEvent.SHOW_ATTACK);
        this.hide();
    }
    onHandlerSteal() {
        GlobalEvent.instance().dispatchEvent(GlobalEvent.SHOW_STEAL);
        this.hide();
    }
    onHandlerClose() {
        this.hide();
        // game.emit("NEXT_USER_SPIN");
    }
    hide() {
        this.node.active = false;
    }
}
