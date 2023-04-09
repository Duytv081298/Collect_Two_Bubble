import CreateBubble from "./CreateBubble";
import CreateConnect from "./CreateConnect";


const { ccclass, property } = cc._decorator;

@ccclass
export default class Pool extends cc.Component {


    @property(cc.Prefab)
    bubble: cc.Prefab | null = null;
    @property(cc.Prefab)
    connect: cc.Prefab | null = null;

    onLoad() {
        CreateBubble.instance().setPrefab(this.bubble);
        CreateConnect.instance().setPrefab(this.connect);
    }

}
