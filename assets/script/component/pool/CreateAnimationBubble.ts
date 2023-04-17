const { ccclass, property } = cc._decorator;

const NAME_ANI_BUBBLE: string[] = ["bongnay-yellow", "bongnay-purple", "bongnay-cyan", "bongnay-green", "bongnay-red"]
@ccclass
export default class CreateAnimationBubble {
    private static item: CreateAnimationBubble;
    private skeletonData: sp.SkeletonData;
    public static instance(): CreateAnimationBubble {
        if (!CreateAnimationBubble.item) {
            CreateAnimationBubble.item = new CreateAnimationBubble();
        }
        return CreateAnimationBubble.item;
    }
    protected pool = new cc.NodePool();
    protected itemPrefab: cc.Prefab = null;
    setPrefab(itemPrefab: cc.Prefab) {
        this.itemPrefab = itemPrefab;
        this.loadAni();
    }
    createItem(color: number) {
        if (!this.skeletonData) return;
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

        let anim: sp.Skeleton = itemNode.getComponent(sp.Skeleton);
        anim.skeletonData = this.skeletonData;
        anim.defaultSkin = "default";
        anim.timeScale = 2;
        let nameAni = NAME_ANI_BUBBLE[color];
        anim.animation = nameAni;
        anim.setAnimationCacheMode(sp.Skeleton.AnimationCacheMode.SHARED_CACHE);
        anim.setAnimation(0, nameAni, false);
        
        anim.setCompleteListener(() => {
            anim.node.active = false;
            this.removeItem(itemNode);
        })
        return itemNode;
    }
    removeItem(itemNode: cc.Node) {
        itemNode.stopAllActions();
        this.pool.put(itemNode);
    }

    loadAni() {
        cc.resources.load("spine/item-bubble/anim-bubble", sp.SkeletonData, (err, res: sp.SkeletonData) => {
            if (!err) {
                this.skeletonData = res;
            } else {
                console.log(err);
            }
        });
    }
}
