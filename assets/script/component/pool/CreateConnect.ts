import Bubble from "../../View/scene/game/item/Bubble";
import { Utils } from "../component/Utils";

const { ccclass, property } = cc._decorator;

@ccclass
export default class CreateConnect {
    private static item: CreateConnect;
    public static instance(): CreateConnect {
        if (!CreateConnect.item) {
            CreateConnect.item = new CreateConnect();
        }
        return CreateConnect.item;
    }
    protected pool = new cc.NodePool();
    protected itemPrefab: cc.Prefab = null;
    setPrefab(itemPrefab: cc.Prefab) {
        this.itemPrefab = itemPrefab;
    }
    createItem(status: boolean = false) {
        let itemNode: cc.Node = null;
        if (this.pool.size() > 0) {
            itemNode = this.pool.get();
        } else {
            itemNode = cc.instantiate(this.itemPrefab);
        }
        itemNode.active = true;
        itemNode.x = 0;
        itemNode.y = 0;
        itemNode.angle = 0;
        itemNode.opacity = 255;
        itemNode.stopAllActions();

        return itemNode;
    }
    removeItem(itemNode: cc.Node) {
        itemNode.stopAllActions();
        this.pool.put(itemNode);
    }

    createConnect(startDot: Bubble, toDot: Bubble): cc.Node {
        let connect = this.createItem();
        connect.position = startDot.node.position;
        connect.width = Utils.getDistance(startDot.node.position, toDot.node.position);
        connect.angle = Utils.getAngle(startDot, toDot);
        connect.active = true;
        return connect;
    }

    // update (dt) {}
}
