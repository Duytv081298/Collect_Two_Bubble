const { ccclass, property } = cc._decorator;

@ccclass
export default class CreateUserRankHome {
    private static item: CreateUserRankHome;
    public static instance(): CreateUserRankHome {
        if (!CreateUserRankHome.item) {
            CreateUserRankHome.item = new CreateUserRankHome();
        }
        return CreateUserRankHome.item;
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

    // update (dt) {}
}
