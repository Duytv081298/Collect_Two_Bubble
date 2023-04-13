import GlobalEvent from "../../../../component/event/GlobalEvent";

const { ccclass, property } = cc._decorator;

@ccclass
export class ProgressBubble extends cc.Component {
    @property(cc.Node)
    bottom: cc.Node = null;
    @property(cc.Node)
    left: cc.Node = null;
    @property(cc.Node)
    right: cc.Node = null;
    @property(cc.Node)
    topLeft: cc.Node = null;
    @property(cc.Node)
    topRight: cc.Node = null;
    @property(cc.Node)
    sang1: cc.Node | null = null;
    @property(cc.Node)
    sang2: cc.Node | null = null;
    sizeBottom: number = 0;
    // sizeLeft: number = 0;
    // sizeRight: number = 0;
    // sizeTopLeft: number = 0;
    // sizeTopRight: number = 0;
    // sizeGoc: number = 0;

    // height: number = 0;

    @property(cc.Node)
    listGoc: cc.Node[] = [];



    protected onEnable(): void {
        GlobalEvent.instance().addEventListener(GlobalEvent.START_GAME, this.clear, this);
        GlobalEvent.instance().addEventListener(GlobalEvent.REPLAY_GAME, this.clear, this);
        GlobalEvent.instance().addEventListener(GlobalEvent.CLEAR_BUBBLE_PROGRESS, this.clear, this);
        GlobalEvent.instance().addEventListener(GlobalEvent.SHOW_BUBBLE_PROGRESS, this.show, this);
    }
    protected onDisable(): void {
        GlobalEvent.instance().removeEventListener(GlobalEvent.START_GAME, this.clear, this);
        GlobalEvent.instance().removeEventListener(GlobalEvent.REPLAY_GAME, this.clear, this);
        GlobalEvent.instance().removeEventListener(GlobalEvent.CLEAR_BUBBLE_PROGRESS, this.clear, this);
        GlobalEvent.instance().removeEventListener(GlobalEvent.SHOW_BUBBLE_PROGRESS, this.show, this);
    }

    // protected onLoad(): void {
        // this.sizeBottom = this.bottom.width;
        // this.sizeLeft = this.left.height;
        // this.sizeRight = this.right.height;
        // this.sizeTopLeft = this.topLeft.width;
        // this.sizeTopRight = this.topRight.width;
        // this.sizeGoc = this.listGoc[0].width;
        // this.height = this.bottom.height;
    // }

    clear() {
        this.bottom.setScale(cc.Vec3.ZERO)
        this.left.setScale(cc.Vec3.ZERO)
        this.right.setScale(cc.Vec3.ZERO)
        this.topLeft.setScale(cc.Vec3.ZERO)
        this.topRight.setScale(cc.Vec3.ZERO)

        this.sang1.active = false;
        this.sang2.active = false;

        this.listGoc.forEach(goc => {
            goc.active = false
        });
    }
    show(data) {
        // console.log("show progress bubble");
        
        let count = data.count
        if(!count) return
        this.clear();
        this.sang1.active = true;
        this.sang2.active = true;

        var newCount = count >= 8 ? 8 : count;
        if (newCount <= 3) {
            this.sang1.angle = 0;
            this.sang2.angle = 180;
            this.bottom.setScale(new cc.Vec3(newCount * (1 / 3), 1, 1))

            var x = (this.bottom.scaleX * this.bottom.width) * 0.5;

            this.sang1.setPosition(x, this.bottom.position.y)
            this.sang2.setPosition(-x, this.bottom.position.y)

            if (newCount == 3) {
                this.listGoc[0].active = true;
                this.listGoc[1].active = true;

                this.sang1.angle = 90;
                this.sang2.angle = 90;

                this.sang1.setPosition(this.right.position.x, this.bottom.position.y + this.listGoc[0].width)
                this.sang2.setPosition(this.left.position.x, this.bottom.position.y + this.listGoc[0].width)
            }

            this.left.setScale(cc.Vec3.ZERO)
            this.right.setScale(cc.Vec3.ZERO)
            this.topLeft.setScale(cc.Vec3.ZERO)
            this.topRight.setScale(cc.Vec3.ZERO)
        } else if (newCount <= 6) {
            this.bottom.setScale(cc.Vec3.ONE)
            this.listGoc[0].active = true;
            this.listGoc[1].active = true;


            this.sang1.angle = 90;
            this.sang2.angle = 90;

            this.left.setScale(new cc.Vec3((newCount - 3) * (1 / 3), 1, 1))
            this.right.setScale(new cc.Vec3((newCount - 3) * (1 / 3), 1, 1))


            var y = (this.left.scaleX * this.bottom.width);

            this.sang1.setPosition(this.right.position.x, this.right.position.y + y)
            this.sang2.setPosition(this.left.position.x, this.left.position.y + y)


            if (newCount == 6) {
                this.listGoc[2].active = true;
                this.listGoc[3].active = true;

                this.sang1.angle = 180;
                this.sang2.angle = 0;

                this.sang1.setPosition(this.right.position.x - this.listGoc[0].width, this.topRight.position.y)
                this.sang2.setPosition(this.left.position.x + this.listGoc[0].width, this.topLeft.position.y)
            }

            this.topLeft.setScale(cc.Vec3.ZERO)
            this.topRight.setScale(cc.Vec3.ZERO)
        }
        else {
            this.bottom.setScale(cc.Vec3.ONE)
            this.left.setScale(cc.Vec3.ONE)
            this.right.setScale(cc.Vec3.ONE)

            this.listGoc[0].active = true;
            this.listGoc[1].active = true;
            this.listGoc[2].active = true;
            this.listGoc[3].active = true;

            this.sang1.angle = 180;
            this.sang2.angle = 0;

            this.topLeft.setScale(new cc.Vec3((newCount - 6) * (1 / 2), 1, 1))
            this.topRight.setScale(new cc.Vec3((newCount - 6) * (1 / 2), 1, 1))


            var x = (this.topLeft.scaleX * this.topLeft.width);

            this.sang1.setPosition(this.topRight.position.x - x, this.topRight.position.y)
            this.sang2.setPosition(this.topLeft.position.x + x, this.topLeft.position.y)

            if (newCount == 8) {
                this.sang1.active = false;
                this.sang2.active = false;
            }
        }
    }
}


