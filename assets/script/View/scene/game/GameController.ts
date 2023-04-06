import BroadContainer from "./broad/BroadContainer";

const { ccclass, property } = cc._decorator;

@ccclass
export default class GameController extends cc.Component {

    @property(BroadContainer)
    broadContainer: BroadContainer = null;

    
    @property(cc.Node)
    itemCheck: cc.Node = null;



    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        
        var manager = cc.director.getCollisionManager();
        manager.enabled = true;
        // manager.enabledDebugDraw = true;

        this.onEventTouch();

        this.setUpEmit();
    }

    start() {
        this.setUp();
    }

    // update (dt) {}


    onEventTouch() {
        var canvas = cc.find('Canvas');
        canvas.on(cc.Node.EventType.TOUCH_START, this.onTouchStart, this);
        canvas.on(cc.Node.EventType.TOUCH_MOVE, this.onTouchMove, this);
        canvas.on(cc.Node.EventType.TOUCH_END, this.onTouchEnd, this);
        canvas.on(cc.Node.EventType.TOUCH_CANCEL, this.onTouchEnd, this);
    }
    setUpEmit() {

    }
    onTouchStart(event) {

        let currentTouch = event.touch.getLocation();
        console.log("x: " + currentTouch.x + "  y: " + currentTouch.y);
        // console.log(currentTouch);
        
        this.itemCheck.setPosition(currentTouch)
        // console.log("item check x: " + this.itemCheck.position.x + "  y: " + this.itemCheck.position.y);
        

    }
    onTouchMove(event) {

        let currentTouch = event.touch.getLocation();
        this.itemCheck.setPosition(currentTouch)
        // console.log("x: " + currentTouch.x + "y: " + currentTouch.y);
    }
    onTouchEnd(event) {
        this.broadContainer.touchEnd();
        this.itemCheck.setPosition(-100, -100)
    }
    reset() {
        console.log(" GameController reset: " );
        this.itemCheck.setPosition(-100, -100)


        this.broadContainer.init(this)
    }
    setUp() {
        console.log("GameController setUp: " );
        
        this.reset();
    }

}
