import BroadContainer from "./broad/BroadContainer";

const { ccclass, property } = cc._decorator;

@ccclass
export default class GameController extends cc.Component {

    @property(BroadContainer)
    broadContainer: BroadContainer = null;





    // LIFE-CYCLE CALLBACKS:

    onLoad() {

        var manager = cc.director.getCollisionManager();
        manager.enabled = true;
        cc.director.getPhysicsManager().enabled = true;
        // cc.director.getPhysicsManager().gravity = new cc.Vec2(10, 10);
        // manager.enabledDebugDraw = true;
        // manager.enabledDrawBoundingBox = true;

        this.setUpEmit();
        try {
            FBInstant.startGameAsync()
            .then(() => {

            });
        } catch (error) {
            
        }
    

    }

    start() {
        this.setUp();
    }

    // update (dt) {}
    setUpEmit() {

    }
    reset() {
        console.log(" GameController reset: ");


        this.broadContainer.init(this)
    }
    setUp() {
        console.log("GameController setUp: ");

        this.reset();
    }

}
