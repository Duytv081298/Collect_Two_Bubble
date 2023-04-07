// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import CreateBubble from "../../View/scene/game/CreateBubble";
import CreateConnect from "../../View/scene/game/CreateConnect";

const { ccclass, property } = cc._decorator;

@ccclass
export default class NewClass extends cc.Component {


    @property(cc.Prefab)
    bubble: cc.Prefab | null = null;
    @property(cc.Prefab)
    connect: cc.Prefab | null = null;

    onLoad() {
        CreateBubble.instance().setPrefab(this.bubble);
        CreateConnect.instance().setPrefab(this.connect);
    }

}
