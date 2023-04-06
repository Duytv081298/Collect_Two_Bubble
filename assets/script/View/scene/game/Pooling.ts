const { ccclass, property } = cc._decorator;

@ccclass
export default class Pooling extends cc.Component {

    @property(cc.Prefab)
    bubblePrefab: cc.Prefab | null = null;


    bubblePool: cc.NodePool;

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        
        this.bubblePool = new cc.NodePool();

        for (let i = 0; i < 50; ++i) {
            this.bubblePool.put(cc.instantiate(this.bubblePrefab));
        }
    }

    start() {

    }


    createBubble(): cc.Node {
        if (this.bubblePool.size() > 0) return this.bubblePool.get();
        else return cc.instantiate(this.bubblePrefab);
    }
    onBubbleKilled(bubble: cc.Node) {
        bubble.stopAllActions();
        bubble.off("CollisionEnter");
        this.bubblePool.put(bubble);
    }
    // update (dt) {}
}
