import Bubble from "../../View/scene/game/item/Bubble";

const { ccclass, property } = cc._decorator;

@ccclass
export default class CreateBubble {
    private static item: CreateBubble;
    public static instance(): CreateBubble {
        if (!CreateBubble.item) {
            CreateBubble.item = new CreateBubble();
        }
        return CreateBubble.item;
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
        itemNode.setScale(0.8);
        itemNode.setPosition(cc.Vec2.ZERO)
        itemNode.x = 0;
        itemNode.y = 0;
        itemNode.angle = 0;
        itemNode.opacity = 255;
        itemNode.getComponent(Bubble).isTutorial = false;
        itemNode.stopAllActions();

        return itemNode;
    }
    removeItem(itemNode: cc.Node) {
        itemNode.getComponent(Bubble).isTutorial = false;
        itemNode.stopAllActions();
        itemNode.off("CollisionEnter");
        // itemNode.getComponent(Bubble).deActiveRigidBody();
        this.pool.put(itemNode);
    }

}
