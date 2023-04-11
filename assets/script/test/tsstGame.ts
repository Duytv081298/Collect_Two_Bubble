const {ccclass, property} = cc._decorator;

@ccclass
export default class NewClass extends cc.Component {

    @property(cc.Label)
    label: cc.Label = null;

    @property
    text: string = 'hello';

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        
        var manager = cc.director.getCollisionManager();
        manager.enabled = true;
        manager.enabledDebugDraw = true;
        manager.enabledDrawBoundingBox = true;
        cc.director.getPhysicsManager().enabled = true;
        
        cc.director.getPhysicsManager().gravity= new cc.Vec2(0,-100)

    }

    start () {

    }

    // update (dt) {}
}
