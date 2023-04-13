import GlobalEvent from "../component/event/GlobalEvent";

const { ccclass, property } = cc._decorator;

@ccclass
export default class LoadingUI extends cc.Component {

    @property(cc.Node)
    content: cc.Node = null;
    @property(cc.Node)
    icon: cc.Node = null;

    isShow: boolean = true;


    protected onEnable(): void {
        GlobalEvent.instance().addEventListener(GlobalEvent.SHOW_LOADING, this.show, this);
        GlobalEvent.instance().addEventListener(GlobalEvent.HIDE_LOADING, this.hide, this);
    }
    protected onDisable(): void {
        GlobalEvent.instance().removeEventListener(GlobalEvent.SHOW_LOADING, this.show, this);
        GlobalEvent.instance().removeEventListener(GlobalEvent.HIDE_LOADING, this.hide, this);
    }

    show(){
        this.content.active = this.isShow;
        this.content.active = this.isShow;
    }
    hide(){
        this.content.active = !this.isShow;
        this.content.active = !this.isShow;
    }
    // LIFE-CYCLE CALLBACKS:

    // onLoad () {}

    start() {
        this.hide()
    }

    // update (dt) {}
}
