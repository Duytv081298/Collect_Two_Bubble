// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import { BOOSTER } from "../../../../component/constant/constant";
import GlobalEvent from "../../../../component/event/GlobalEvent";
import MainData from "../../../../component/storage/MainData";

const { ccclass, property } = cc._decorator;

@ccclass
export default class Booster extends cc.Component {

    @property(cc.Label)
    amount: cc.Label[] = [];
    @property(cc.Node)
    bgAmount: cc.Node[] = [];
    @property(cc.Node)
    bgCoin: cc.Node[] = [];
    @property(cc.Node)
    bgAds: cc.Node[] = [];



    // LIFE-CYCLE CALLBACKS:

    // onLoad () {}

    protected onEnable(): void {
        GlobalEvent.instance().addEventListener(GlobalEvent.CLEAR_BOOSTER, this.clearBooster, this);
    }
    protected onDisable(): void {

        GlobalEvent.instance().removeEventListener(GlobalEvent.CLEAR_BOOSTER, this.clearBooster, this);
    }
    start() {
        this.reset();
    }

    reset() {
        for (let i = 0; i < this.amount.length; i++) {
            let childAmount = this.amount[i];
            let childBgAmount = this.bgAmount[i];
            let childBgCoin = this.bgCoin[i];
            let childBgAds = this.bgAds[i];

            childAmount.node.active = false;
            childBgAmount.active = false;
            childBgCoin.active = false;
            childBgAds.active = false;
        }
    }

    onClickBomb() {
        if (MainData.instance().isUseBooster) return;
        if (MainData.instance().keyBooster == BOOSTER.bomb) {
            this.clearBooster();
            return;
        }
        MainData.instance().keyBooster = BOOSTER.bomb;
        console.log("MainData.instance().keyBooster: " + MainData.instance().keyBooster);

        this.setOpacityBoosterChoose(BOOSTER.bomb);
    }
    onClickRocket() {
        console.log("onClickRocket");

        if (MainData.instance().isUseBooster) return;
        if (MainData.instance().keyBooster == BOOSTER.rocket) {
            this.clearBooster();
            return;
        }
        MainData.instance().keyBooster = BOOSTER.rocket;
        console.log("MainData.instance().keyBooster: " + MainData.instance().keyBooster);
        this.setOpacityBoosterChoose(BOOSTER.rocket);
    }
    onClickReverse() {
        if (MainData.instance().isUseBooster) return;
        if (MainData.instance().keyBooster == BOOSTER.reverse) {
            this.clearBooster();
            return;
        }
        MainData.instance().keyBooster = BOOSTER.reverse;
        this.setOpacityBoosterChoose(BOOSTER.reverse);
    }
    onClickHammer() {
        if (MainData.instance().isUseBooster) return;
        if (MainData.instance().keyBooster == BOOSTER.hammer) {
            this.clearBooster();
            return;
        }
        MainData.instance().keyBooster = BOOSTER.hammer;
        this.setOpacityBoosterChoose(BOOSTER.hammer);
    }

    clearBooster() {
        console.log("clearBooster");

        MainData.instance().isUseBooster = false;
        MainData.instance().keyBooster = null;
        // this.keyBooster = null;
        // this.keyBoosterAds = null;
        // this.tooltip.hide();
        this.clearOpacityBooster()
    }
    setOpacityBoosterChoose(booster: BOOSTER) {
        for (let i = 0; i < this.bgAmount.length; i++) {
            let parent = this.bgAmount[i].parent;
            parent.stopAllActions();
            parent.opacity = 150;
            if (i == booster) {
                parent.opacity = 255;
                this.animation(parent);
            }
        }
    }


    clearOpacityBooster() {
        for (let i = 0; i < this.bgAmount.length; i++) {
            let parent = this.bgAmount[i].parent;
            parent.stopAllActions();
            parent.opacity = 255;
            parent.setScale(1);
        }
    }

    animation(child: cc.Node) {
        let tweenDuration: number = 0.2;
        let t1 = cc.tween(child)
            .to(tweenDuration, { scale: 1.1 }, { easing: "sineOutIn" })
        let t2 = cc.tween(child)
            .to(tweenDuration, { scale: 1 }, { easing: "sineInOut" })
        cc.tween(child).sequence(t1, t2)
            .repeatForever()
            .start();
    }
    // update (dt) {}
}
