import NameBot from "../../component/component/NameBot";
import { Utils } from "../../component/component/Utils";
import GlobalEvent from "../../component/event/GlobalEvent";
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
    playerRank: number = 0;
    idxRank: number = 0;
    idxSpeedScore = 0;
    arrOtherPlayer: any[] = [];

    listNames: string[] = [];
    listPositionPlayer: cc.Vec2[] = [];
    listScorePlayer: number[] = [];

    protected onEnable(): void {
        GlobalEvent.instance().addEventListener(GlobalEvent.TWEEN_PLAYER_RANKING, this.tweenSpinScore, this);
    }
    protected onDisable(): void {

        GlobalEvent.instance().removeEventListener(GlobalEvent.TWEEN_PLAYER_RANKING, this.tweenSpinScore, this);
    }

    protected onLoad(): void {
        this.createDataRank();

        // console.log(this.user.node.getPosition());
    }

    protected start(): void {
        this.showPlayerDefault();

    }

    createDataRank() {
        this.playerRank = Utils.randomInt(30, 40);   //Utils.randomInt(5, 10)  
        let score = 0;
        for (let i = 1; i < this.playerRank + 1; i++) {
            let name = this.getNameUser();
            score = score + spaceScore + Utils.randomInt(spaceScore * 2, spaceScore * 4) + Utils.randomInt(spaceScore * 4, spaceScore * 6);
            let dataPlay = {
                name: name,
                avatar: name,
                score: score,
                rank: this.playerRank - i,
                isFb: false,
            }
            cc.resources.preload("profiles/" + name, (err) => { });
            this.arrPlayerRank.push(dataPlay);
            this.listScorePlayer.push(score)
        }
    }


    showPlayerDefault() {
        for (let i = 0; i < 5; i++) {
            this.showRankPlayer();
        }
        this.showRankMe();

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
            cc.resources.load("profiles/" + this.arrPlayerRank[idxRankCopy].avatar, cc.Texture2D, (err, avatar: cc.Texture2D) => {
                if (!err) {
                    const spriteFrame = new cc.SpriteFrame(avatar);
                    itemRank.getChildByName("avatar").getComponent(cc.Sprite).spriteFrame = spriteFrame;
                }
            })
        } else {
            cc.assetManager.loadRemote(this.arrPlayerRank[idxRankCopy].avatar, { ext: '.jpg' }, (err, imageAsset: cc.Texture2D) => {
                if (imageAsset == null) {
                    return;
                }
                if (err) {
                    return;
                }
                const spriteFrame = new cc.SpriteFrame(imageAsset);
                itemRank.getChildByName("avatar").getComponent(cc.Sprite).spriteFrame = spriteFrame;
            });
        }

        itemRank.setParent(this.node)
        itemRank.active = true;
        this.arrOtherPlayer.push(itemRank);
        this.listPositionPlayer.push(itemRank.getPosition())
        this.idxRank++;
    }


    tweenSpinScore() {
        if (this.playerRank == 0) return;
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

                }).start()
            }


        } else {
            let end = this.listPositionPlayer[this.idxSpeedScore]
            let maxKc = end.x - start;
            let scoreEnd = this.listScorePlayer[this.idxSpeedScore]
            let maxScoreKc = scoreEnd - this.backScorePlay;
            let scoreKc = scorePlay - this.backScorePlay;
            let vx: number = this.node.position.x - ((scoreKc / maxScoreKc) * maxKc);
            cc.tween(this.node).to(0.2, { x: vx }).call(() => { }).start()
        }

        for (let i = 0; i < totalPlayerPass; i++) {
            let item: cc.Node = this.arrOtherPlayer[i];
            cc.tween(item).to(0.3, { scaleY: 1.2 }).delay(0.1).to(0.3, { scale: 0, opacity: 0, y: item.y - 65 }).call(() => {
                CreatePlayerRank.instance().removeItemRank(item);
            }).start();
            this.showRankPlayer();
        }
        this.arrOtherPlayer.splice(0, totalPlayerPass);

        this.playerRank -= totalPlayerPass;
        this.idxSpeedScore += totalPlayerPass;
        this.backScorePlay = scorePlay;
        this.showRankMe();

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
    showRankMe() {
        this.user.setUp(null, this.playerRank + 1)
    }
















    getNameUser() {
        let arrName = NameBot.getArrName();
        var name = arrName[Math.floor(Math.random() * arrName.length)];
        while (this.listNames.indexOf(name) >= 0) {
            name = arrName[Math.floor(Math.random() * arrName.length)]
        }
        return name;
    }
}