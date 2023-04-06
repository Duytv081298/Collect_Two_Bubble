const { ccclass, property } = cc._decorator;

@ccclass()
export default class Bubble extends cc.Component {
    @property(cc.Sprite)
    item: cc.Sprite = null;
    @property(cc.Node)
    border: cc.Node = null;

    @property([cc.SpriteFrame])
    spriteFrameData: cc.SpriteFrame[] = [];

    private _coefficients: number = 1;
    public get coefficients(): number {
        return this._coefficients;
    }
    public set coefficients(value: number) {
        this._coefficients = value;
    }
    // LIFE-CYCLE CALLBACKS:
    // onLoad () {}
    row: number = 0;
    col: number = 0;
    localX: number = 0;
    localY: number = 0;

    isSelect: boolean = false;
    private color: number = 0;

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {}

    start() {

    }


    setData(row: number, col: number, localX: number, localY: number, color: number, coefficients: number = 1) {
        // console.log("setData: row: " + row + "  col: " + col + "  name " + this.node.name);
        
        this.row = row;
        this.col = col;
        this.localX = localX;
        this.localY = localY;
        this.color = color;
        this.coefficients = coefficients;
        this.upDateUI();
    }
    updateIndex(row: number, col: number, localX: number, localY: number) {
        this.row= row;
        this.col = col;
        this.localX = localX;
        this.localY = localY;        
    }
    upDateUI() {
        this.item.spriteFrame = this.getSpriteFrame();
    }
    getSpriteFrame(): cc.SpriteFrame {
        let index = this.color * 5 + (this.coefficients - 1);
        return this.spriteFrameData[index]
    }
    select() {
        this.isSelect = true;
        this.addAnimationSelect();
    }
    nonSelect() {
        this.isSelect = false;
        this.clearAnimationSelect();
    }
    addAnimationSelect() {
        this.border.active = true;
        let tweenDuration: number = 0.2;
        let t1 = cc.tween(this.node)
            .to(tweenDuration, { scale: 0.9 }, { easing: "sineOutIn" })
        let t2 = cc.tween(this.node)
            .to(tweenDuration, { scale: 0.8 }, { easing: "sineInOut" })
        cc.tween(this.node).sequence(t1, t2)
            .repeatForever()
            .start();
    }
    clearAnimationSelect() {
        this.border.active = false;
        this.node.stopAllActions()
        cc.tween(this.node)
            .to(0.1, { scale: 0.8 }, { easing: "sineOutIn" })
            .start();
    }
    setColor(color: number) {
        this.color = color;
    }
    getColor() {
        return this.color;
    }
    // update (dt) {}


    onCollisionEnter(other: cc.Node, self: cc.Node) {
        // console.log('onCollisionEnter row: ' + this.row + " col: " + this.col);
        this.node.emit("CollisionEnter", this);
    }

    onCollisionStay(other: cc.Node, self: cc.Node) {
        //console.log('onCollisionStay');
    }
    onCollisionExit(other: cc.Node, self: cc.Node) {
        //console.log('onCollisionExit');
    }

}
