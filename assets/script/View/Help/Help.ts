import SoundManager from "../../component/component/SoundManager";
import GlobalEvent from "../../component/event/GlobalEvent";

const { ccclass, property } = cc._decorator;

@ccclass
export default class Help extends cc.Component {

    @property(cc.ScrollView)
    scrollView: cc.ScrollView = null;

    onLoad(): void {
        console.log("onLoad Setting");
        GlobalEvent.instance().addEventListener(GlobalEvent.SHOW_HELP, this.show, this);
    }
    onDestroy(): void {
        console.log("onDestroy Setting");
        GlobalEvent.instance().removeEventListener(GlobalEvent.SHOW_HELP, this.show, this);
    }
    protected onEnable(): void {
        this.scrollView.scrollToTop()
    }
    show(){
        
        this.node.active = true;
        GlobalEvent.instance().dispatchEvent(GlobalEvent.HIDE_LOADING);
    }
    hide(){
        SoundManager.instance().playEffect("button");
        this.node.active = false;
    }

}
