export default class CreatePlayerRank {
    private static item: CreatePlayerRank;
    public static instance(): CreatePlayerRank {
        if (!CreatePlayerRank.item) {
            CreatePlayerRank.item = new CreatePlayerRank();
        }
        return CreatePlayerRank.item;
    }
    protected pool = new cc.NodePool();
    protected itemPrefab: cc.Prefab = null;
    private _defaultAvatar: cc.SpriteFrame;
    public get defaultAvatar(): cc.SpriteFrame {
        return this._defaultAvatar;
    }
    public set defaultAvatar(value: cc.SpriteFrame) {
        this._defaultAvatar = value;
    }
    setPrefab(itemPrefab: cc.Prefab) {
        this.itemPrefab = itemPrefab;
    }

    createItemRank() {
        let itemNode: cc.Node = null;
        if (this.pool.size() > 0) {
            itemNode = this.pool.get();
        } else {
            itemNode = cc.instantiate(this.itemPrefab);
        }
        itemNode.active = true;
        itemNode.setScale(0.85);
        itemNode.setPosition(0, 0);
        itemNode.angle = 0;
        itemNode.opacity = 255;
        itemNode.stopAllActions();
        return itemNode;
    }
    removeItemRank(itemNode: cc.Node) {
        itemNode.stopAllActions();
        itemNode.active = false;
        this.pool.put(itemNode);
    }
}