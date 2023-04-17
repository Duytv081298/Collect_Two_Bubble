import { Utils } from "../../../../component/component/Utils";
import CreateBubble from "../../../../component/pool/CreateBubble";
import MainData from "../../../../component/storage/MainData";

const { ccclass, property } = cc._decorator;

@ccclass
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
        this.upDateUI();

    }
    // LIFE-CYCLE CALLBACKS:
    // onLoad () {}
    row: number = 0;
    col: number = 0;

    isSelect: boolean = false;
    private color: number = 0;

    setData(row: number, col: number, color: number, coefficients: number = 1) {
        // console.log("setData: row: " + row + "  col: " + col + "  name " + this.node.name);
        this.deActiveRigidBody();
        this.reSetData(row, col, color, coefficients);
        this.upDateUI();
    }
    reSetData(row: number, col: number, color: number, coefficients: number = 1) {

        this.row = row;
        this.col = col;
        this.color = color;
        this.coefficients = coefficients;
    }
    updateIndex(row: number, col: number) {
        this.row = row;
        this.col = col;
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
        console.log("clearAnimationSelect");

        cc.tween(this.node)
            .to(0.1, { scale: 0.8 }, { easing: "sineOutIn" })
            .start();
    }
    setColor(color: number) {
        this.color = color;
        this.upDateUI();
    }
    getColor() {
        return this.color;
    }

    onCollisionEnter(other: cc.Node, self: cc.Node) {
        this.node.emit("CollisionEnter", this);
    }

    activeRigidBody(status: boolean = false, isBonus: boolean = false) {

        let rigidBody = this.node.getComponent(cc.RigidBody)
        rigidBody.active = true;
        rigidBody.awake = true;
        rigidBody.enabledContactListener = true;

        let physicsCircleCollider = this.node.getComponent(cc.PhysicsCircleCollider)
        physicsCircleCollider.enabled = true;

        // itemNode.setSiblingIndex(itemNode.parent.children.length - 1);

        this.randomLinearVelocity(status, isBonus);
        // this.autoClear();

    }

    autoClear() {
        console.log("auto clear");
        this.node.stopAllActions();
        cc.tween(this.node)
            .delay(2)
            .call(() => {
                if (this.node.parent.name == "Bubble Die") {
                    console.log("autoClear");

                    CreateBubble.instance().removeItem(this.node);
                    MainData.instance().realityBubble++;
                }
            })
            .start();
    }
    deActiveRigidBody() {
        let rigidBody = this.node.getComponent(cc.RigidBody);
        rigidBody.active = false;
        rigidBody.awake = false;
        rigidBody.enabledContactListener = false;

        let physicsCircleCollider = this.node.getComponent(cc.PhysicsCircleCollider)
        physicsCircleCollider.enabled = false;
    }

    randomLinearVelocity(status: boolean, isBonus: boolean = false) {
        // console.log("status:  " + status + "   isBonus: " + isBonus);

        let rigidBody = this.node.getComponent(cc.RigidBody);
        rigidBody.gravityScale = 50;
        if (rigidBody) {
            let randomX = isBonus ? Utils.randomInt(0, 7) * 50 : Utils.randomInt(3, 7) * 15
            if (!status) randomX += 200
            else {
                randomX *= (-1)
                randomX -= 200
            }
            let randomY = isBonus ? Utils.randomInt(0, 10) * 100 + 2000 : Utils.randomInt(0, 5) * 100 + 2000;
            // console.log("randomX: " + randomX + "   randomY: " + randomY);

            rigidBody.linearVelocity = new cc.Vec2(randomX, randomY)
        }

    }

}
