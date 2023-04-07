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
        itemNode.x = 0;
        itemNode.y = 0;
        itemNode.angle = 0;
        itemNode.opacity = 255;
        itemNode.stopAllActions();
        if (status) this.activeRigidBody(itemNode);
        else this.deActiveRigidBody(itemNode);

        return itemNode;
    }
    removeItem(itemNode: cc.Node) {
        itemNode.stopAllActions();
        itemNode.off("CollisionEnter");
        this.pool.put(itemNode);
    }

    activeRigidBody(itemNode: cc.Node, status: boolean = false) {

        let rigidBody = itemNode.getComponent(cc.RigidBody)
        rigidBody.active = true;
        rigidBody.awake = true;
        rigidBody.enabledContactListener = true;

        let physicsCircleCollider = itemNode.getComponent(cc.PhysicsCircleCollider)
        physicsCircleCollider.enabled = true;

        // itemNode.setSiblingIndex(itemNode.parent.children.length - 1);

        this.randomLinearVelocity(itemNode, status);

    }
    deActiveRigidBody(itemNode: cc.Node) {

        let rigidBody = itemNode.getComponent(cc.RigidBody)
        rigidBody.active = false;
        rigidBody.awake = false;
        rigidBody.enabledContactListener = false;

        let physicsCircleCollider = itemNode.getComponent(cc.PhysicsCircleCollider)
        physicsCircleCollider.enabled = false;
    }

    randomLinearVelocity(itemNode: cc.Node, status: boolean) {
        let rigidBody = itemNode.getComponent(cc.RigidBody);
        rigidBody.gravityScale = 50;
        if (rigidBody) {
            var randomX = Math.random() * 51
            if (status) randomX += 250
            else {
                randomX *= (-1)
                randomX -= 250
            }
            rigidBody.linearVelocity = new cc.Vec2(randomX, (Math.random() * 301 + 2200))
        }

    }
    // update (dt) {}
}
