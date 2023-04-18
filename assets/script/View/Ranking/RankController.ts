import NameBot from "../../component/component/NameBot";
import PlayerLocal from "../../component/component/PlayerLocal";
import { Utils } from "../../component/component/Utils";
import GlobalEvent from "../../component/event/GlobalEvent";
import FaceBook from "../../component/package/FaceBook";
import CreatePlayerRank from "../../component/pool/CreatePlayerRank";
import MainData from "../../component/storage/MainData";
import User from "./User";
const spaceScore: number = 800;

const beginXRank: number = 250;
const beginYPlayerRank: number = 90;
const beginSpaceLeftMeRank: number = 265;
// const beginSpaceOtherMid: number = 150;
const beginXSpaceRank: number = 250;

const widthScreen: number = 640;

const { ccclass, property } = cc._decorator;

@ccclass
export default class RankController extends cc.Component {


    @property(User)
    user: User = null;

    @property(cc.SpriteFrame)
    defaultAvatar: cc.SpriteFrame | null = null;


    backScorePlay: number = 0;
    arrPlayerRank = [];
    playerRank: number = 99;
    idxRank: number = 0;
    idxSpeedScore = 0;
    arrOtherPlayer: any[] = [];
    listPositionPlayer: cc.Vec2[] = [];
    listScorePlayer: number[] = [];

    protected onEnable(): void {
        GlobalEvent.instance().addEventListener(GlobalEvent.START_GAME, this.reset, this);
        GlobalEvent.instance().addEventListener(GlobalEvent.REPLAY_GAME, this.reset, this);
        GlobalEvent.instance().addEventListener(GlobalEvent.TWEEN_PLAYER_RANKING, this.tweenSpinScore, this);
    }
    protected onDisable(): void {

        GlobalEvent.instance().removeEventListener(GlobalEvent.START_GAME, this.reset, this);
        GlobalEvent.instance().removeEventListener(GlobalEvent.REPLAY_GAME, this.reset, this);
        GlobalEvent.instance().removeEventListener(GlobalEvent.TWEEN_PLAYER_RANKING, this.tweenSpinScore, this);
    }

    reset() {
        this.node.stopAllActions();
        this.backScorePlay = 0;
        this.arrPlayerRank = [];
        this.playerRank = 99;
        this.idxRank = 0;
        this.idxSpeedScore = 0;
        this.arrOtherPlayer = [];
        this.listPositionPlayer = [];
        this.listScorePlayer = [];
        PlayerLocal.instance().clearPlayer();
        while (this.node.childrenCount > 0) {
            CreatePlayerRank.instance().removeItemRank(this.node.children[0]);
        }
        this.node.x = -widthScreen / 2;

        this.createDataRank();
        MainData.instance().rankMe = this.playerRank;
        MainData.instance().arrDataRank = this.arrPlayerRank;

        this.showPlayerDefault();
        CreatePlayerRank.instance().defaultAvatar = this.defaultAvatar;
    }

    createDataRank() {
        this.playerRank = Utils.randomInt(30, 40);   //Utils.randomInt(5, 10)  
        let score = 0;
        for (let i = 1; i < this.playerRank + 1; i++) {
            let name = PlayerLocal.instance().getNamePlayerRank();
            score = score + spaceScore + Utils.randomInt(spaceScore * 2, spaceScore * 4) + Utils.randomInt(spaceScore * 4, spaceScore * 6);
            let dataPlay = {
                name: name,
                avatar: name,
                score: score,
                rank: this.playerRank - i,
                isFb: false,
            }
            this.arrPlayerRank.push(dataPlay);
            this.listScorePlayer.push(score)
        }
    }


    showPlayerDefault() {
        for (let i = 0; i < 5; i++) {
            this.showRankPlayer();
        }
        this.user.setUp(this.playerRank + 1)
    }

    showRankPlayer() {
        if (this.idxRank > this.arrPlayerRank.length - 1) return;
        let idxRankCopy = this.idxRank;
        let itemRank = CreatePlayerRank.instance().createItemRank();

        itemRank.x = beginXRank + beginSpaceLeftMeRank + beginXSpaceRank * idxRankCopy;
        itemRank.y = beginYPlayerRank;
        itemRank.getChildByName("txtRank").getComponent(cc.Label).string = (this.arrPlayerRank[idxRankCopy].rank + 1) + '';
        itemRank.getChildByName("txtScore").getComponent(cc.Label).string = this.arrPlayerRank[idxRankCopy].score;
        itemRank.getChildByName("avatar").getComponent(cc.Sprite).spriteFrame = this.defaultAvatar;

        if (itemRank.x > this.node.width - 1000) this.node.width = (itemRank.x + 2000)
        if (this.arrPlayerRank[idxRankCopy].isFb == false) {
            PlayerLocal.instance().setSprite(itemRank.getChildByName("avatar").getComponent(cc.Sprite), this.arrPlayerRank[idxRankCopy].avatar)
        } else {
            FaceBook.loadRemote(itemRank.getChildByName("avatar").getComponent(cc.Sprite), this.arrPlayerRank[idxRankCopy].avatar);
        }

        itemRank.setParent(this.node)
        itemRank.active = true;
        this.arrOtherPlayer.push(itemRank);
        this.listPositionPlayer.push(itemRank.getPosition())
        this.idxRank++;
    }


    tweenSpinScore() {
        if (MainData.instance().score == 0) return;
        if (this.playerRank == 0) return;

        MainData.instance().isRunPlayer = true;
        let scorePlay = MainData.instance().score;

        let listIndexPlayerPass = this.getIndexPlayerPass()

        let totalPlayerPass = listIndexPlayerPass.length;

        let totalPlayerPlus = (totalPlayerPass + 1) - this.arrOtherPlayer.length // bo xung them user de the hien co the vuot qua them

        if (totalPlayerPlus > 0) {
            for (let i = 0; i < totalPlayerPlus; i++) this.showRankPlayer();
        }

        let start = Math.abs(this.node.position.x) - (widthScreen / 2 - beginXRank);

        if (totalPlayerPass > 0) {

            //di chuyen den player vuot qua xa nhat
            let maxIndex = listIndexPlayerPass[listIndexPlayerPass.length - 1]
            let end0 = this.listPositionPlayer[maxIndex]
            let maxKc0 = end0.x - start;
            let scoreEnd0 = this.listScorePlayer[maxIndex];
            let vx = this.node.position.x - maxKc0;

            if (maxIndex == this.listPositionPlayer.length - 1) { //vuot qua player cuoi cung
                cc.tween(this.node).to(0.2, { x: vx }).call(() => { }).start()

            } else {

                // di chuyen not phan diem con lại khoang cach dua tren kc moi tu user den player
                let end1 = this.listPositionPlayer[maxIndex + 1]
                let maxKc1 = end1.x - end0.x;
                let scoreEnd1 = this.listScorePlayer[maxIndex + 1];
                let maxScoreKc1 = scoreEnd1 - scoreEnd0;
                let scoreKc1 = scorePlay - scoreEnd0;

                let vx1 = vx - ((scoreKc1 / maxScoreKc1) * maxKc1);

                cc.tween(this.node).to(0.2, { x: vx1 }).call(() => {
                    MainData.instance().isRunPlayer = false;
                }).start()
            }


        } else {
            let end = this.listPositionPlayer[this.idxSpeedScore]
            let maxKc = end.x - start;
            let scoreEnd = this.listScorePlayer[this.idxSpeedScore]
            let maxScoreKc = scoreEnd - this.backScorePlay;
            let scoreKc = scorePlay - this.backScorePlay;
            let vx: number = this.node.position.x - ((scoreKc / maxScoreKc) * maxKc);
            cc.tween(this.node).to(0.2, { x: vx }).call(() => {
                MainData.instance().isRunPlayer = false;
            }).start()
        }

        for (let i = 0; i < totalPlayerPass; i++) {
            let item: cc.Node = this.arrOtherPlayer[i];
            cc.tween(item).to(0.3, { scaleY: 1.2 }).delay(0.1).to(0.3, { scale: 0, opacity: 0, y: item.y - 65 }).call(() => {
                let sp = item.getChildByName("avatar").getComponent(cc.Sprite).spriteFrame;
                CreatePlayerRank.instance().removeItemRank(item);
                if (i == totalPlayerPass - 1) GlobalEvent.instance().dispatchEvent(GlobalEvent.SHOW_HIDDEN_PRIZES, { spfPlayer: sp });
                MainData.instance().isRunPlayer = false;
            }).start();
            this.showRankPlayer();
        }
        this.arrOtherPlayer.splice(0, totalPlayerPass);

        this.playerRank -= totalPlayerPass;
        this.idxSpeedScore += totalPlayerPass;
        this.backScorePlay = scorePlay;

        MainData.instance().rankMe = this.playerRank;
        MainData.instance().arrDataRank = this.arrPlayerRank;

        this.user.showRank(this.playerRank + 1)

    }

    getIndexPlayerPass(): number[] {
        let scoreUser = MainData.instance().score;
        let arrIndex: number[] = [];
        for (let i = this.idxSpeedScore; i < this.listScorePlayer.length; i++) {
            let score = this.listScorePlayer[i];
            if (score <= scoreUser) arrIndex.push(i)
            else return arrIndex;
        }
        return arrIndex;
    }






}
