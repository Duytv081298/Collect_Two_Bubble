import SoundManager from "../../component/component/SoundManager";

const { ccclass, property } = cc._decorator;

@ccclass
export default class Help extends cc.Component {

    @property(cc.ScrollView)
    scrollView: cc.ScrollView = null;

    protected onEnable(): void {
        this.scrollView.scrollToTop()
    }
    hide(){
        SoundManager.instance().playEffect("button");
        this.node.active = false;
    }

}
