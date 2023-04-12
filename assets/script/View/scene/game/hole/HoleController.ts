// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import GlobalEvent from "../../../../component/event/GlobalEvent";
import MainData from "../../../../component/storage/MainData";

const { ccclass, property } = cc._decorator;

const DEFAULTAMOUNTCOIN = 1000;
@ccclass
export default class HoleController extends cc.Component {


    @property(cc.Node)
    listBodyHole: cc.Node[] = [];

    @property(sp.Skeleton)
    animationBGCoin: sp.Skeleton = null;

    @property(cc.Animation)
    animationBG: cc.Animation = null;

    @property(sp.Skeleton)
    animationCoin: sp.Skeleton = null;


    isActiveCoin: boolean = false;
    amountMove: number = 0;
    isDelayHideCoin: boolean = false;

    amountScore: number = DEFAULTAMOUNTCOIN;
    listScore: number[] = [DEFAULTAMOUNTCOIN];
    listplus: number[] = [0];
    amountIsPlus: number = 0;

    bgGoldSkData: sp.SkeletonData = null;
    goldSkData: sp.SkeletonData = null;

    protected onLoad(): void {
        this.loadAni();
    }

    protected onEnable(): void {
        GlobalEvent.instance().addEventListener(GlobalEvent.SHOW_ANI_COIN_HOLE, this.checkAmountScore, this);
        GlobalEvent.instance().addEventListener(GlobalEvent.HIDE_ANI_COIN_HOLE, this.hideCoin, this);
        GlobalEvent.instance().addEventListener(GlobalEvent.UPDATE_MOVE_PROGRESS_GOLD, this.upDateAmountMove, this);
        GlobalEvent.instance().addEventListener(GlobalEvent.START_GAME, this.reset, this);
        GlobalEvent.instance().addEventListener(GlobalEvent.REPLAY_GAME, this.reset, this);
    }
    protected onDisable(): void {
        GlobalEvent.instance().removeEventListener(GlobalEvent.SHOW_ANI_COIN_HOLE, this.checkAmountScore, this);
        GlobalEvent.instance().removeEventListener(GlobalEvent.HIDE_ANI_COIN_HOLE, this.hideCoin, this);
        GlobalEvent.instance().removeEventListener(GlobalEvent.UPDATE_MOVE_PROGRESS_GOLD, this.upDateAmountMove, this);
        GlobalEvent.instance().removeEventListener(GlobalEvent.START_GAME, this.reset, this);
        GlobalEvent.instance().removeEventListener(GlobalEvent.REPLAY_GAME, this.reset, this);
    }
    reset() {
        this.isActiveCoin = false;
        this.amountMove = 0;

        this.animationBGCoin.node.active = false;
        this.animationCoin.node.active = false;
        this.animationBG.node.active = false;

        this.amountMove = DEFAULTAMOUNTCOIN;
        this.listScore = [DEFAULTAMOUNTCOIN];
        this.listplus = [0];
        this.amountIsPlus = 0;
        MainData.instance().indexHoleCoin = null;
    }

    hideCoin() {
        if (!this.isDelayHideCoin) return;
        this.isActiveCoin = false;
        this.isDelayHideCoin = false;

        this.animationBG.node.active = false;
        this.animationBGCoin.node.active = false;
        this.animationCoin.node.active = false;
        this.amountMove = 0;
        MainData.instance().indexHoleCoin = null;
    }

    loadAni() {
        cc.resources.preload("spine/bg-coin/bg tien", sp.SkeletonData, (err) => {
            cc.resources.load("spine/bg-coin/bg tien", sp.SkeletonData, (err, res: sp.SkeletonData) => {
                if (!err) {
                    this.bgGoldSkData = res;
                    this.animationBGCoin.skeletonData = this.bgGoldSkData;
                    this.animationBGCoin.timeScale = 1;
                    this.animationBGCoin.setSkin("default");
                } else {
                    console.log(err);
                }
            });
        });
        cc.resources.preload("spine/hole-coin/tien hole", sp.SkeletonData, (err) => {
            cc.resources.load("spine/hole-coin/tien hole", sp.SkeletonData, (err, res: sp.SkeletonData) => {
                if (!err) {
                    this.goldSkData = res;
                    this.animationCoin.skeletonData = this.goldSkData;
                    this.animationCoin.timeScale = 1;
                    this.animationCoin.setSkin("default");
                } else {
                    console.log(err);
                }
            });
        });
    }




    getNextScore() {
        if (this.amountIsPlus > 0) {
            this.listScore.push(this.listScore[this.listScore.length - 1] + this.listplus[this.listplus.length - 1])
            this.amountIsPlus--;
        } else {
            this.amountIsPlus = Math.pow(2, this.listplus.length);
            this.listplus.push(this.listplus.length * 5000)
            this.listScore.push(this.listScore[this.listScore.length - 1] + this.listplus[this.listplus.length - 1])
            this.amountIsPlus--;
        }
        this.amountScore = this.listScore[this.listScore.length - 1];
    }

    checkAmountScore() {
        // console.log("checkAmountScore: " + MainData.instance().score  + "   this.amountScore: " + this.amountScore);
        if (MainData.instance().score >= this.amountScore) {
            this.getNextScore();
            this.showCoin();
        }
    }

    showCoin() {

        // SoundManager.instance().playEffect("coin_xuat hien");
        this.isActiveCoin = true;
        this.amountMove = 0;
        let indexTemp = Math.floor(Math.random() * 5)
        while (MainData.instance().indexHoleCoin == indexTemp) {
            indexTemp = Math.floor(Math.random() * 5)
        }
        MainData.instance().indexHoleCoin = indexTemp;

        this.showAnimationCoin();

        this.showBGAnimationCoin();
    }


    showAnimationCoin() {
        // console.log("showAnimationCoin");

        let name = this.amountMove <= 3 ? "sangmanh" : this.amountMove <= 4 ? "sangyeu" : "sangdatat"
        if (this.amountMove == 0 || this.amountMove == 4 || this.amountMove == 5) {
            this.animationCoin.clearTrack(0);
            this.animationCoin.node.active = true;
            this.animationCoin.node.setPosition(this.listBodyHole[MainData.instance().indexHoleCoin].position);
            this.animationCoin.timeScale = this.amountMove < 5 ? 1 : 0.5;
            this.animationCoin.setSkin("default");
            console.log("name: " + name);
            this.animationCoin.name = name;
            this.animationCoin.setAnimation(0, name, true);
        }
        // this.animationCoin.setCompleteListener(() => { this.animationCoin.node.active = false })
    }
    showBGAnimationCoin() {
        this.animationBGCoin.node.active = true;
        this.animationBGCoin.setSkin("default");
        this.animationCoin.name = "luc bat dau";
        this.animationBGCoin.setAnimation(0, "luc bat dau", false);
        this.animationBGCoin.setCompleteListener(() => {
            this.animationBGCoin.node.active = false;
            this.animationBG.node.active = true;
            this.animationBG.play();
        })
    }
    upDateAmountMove() {
        if (!this.isActiveCoin) return;
        this.amountMove += 1;
        console.log("move: " + this.amountMove);

        this.showAnimationCoin();
        if (this.amountMove == 6) {
            this.isDelayHideCoin = true;
        }
    }
}
