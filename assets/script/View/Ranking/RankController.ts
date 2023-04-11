// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import NameBot from "../../component/component/NameBot";
import { Utils } from "../../component/component/Utils";
import GlobalEvent from "../../component/event/GlobalEvent";
import CreatePlayerRank from "../../component/pool/CreatePlayerRank";
import MainData from "../../component/storage/MainData";
const spaceScore: number = 800;

const beginXRank: number = 220;
const beginYPlayerRank: number = 75;
const beginSpaceLeftMeRank: number = 185;
const beginSpaceOtherMid: number = 150;
const beginXSpaceRank: number = 250;

const { ccclass, property } = cc._decorator;

@ccclass
export default class RankController extends cc.Component {


    @property(cc.SpriteFrame)
    defaultAvatar: cc.SpriteFrame | null = null;
    backScorePlay: number = 0;
    listNames: string[] = [];
    arrPlayerRank = [];
    playerRank: number = 0;
    idxRank: number = 0;
    idxSpeedScore = 0;
    arrOtherPlayer: any[] = [];

    protected onEnable(): void {
        GlobalEvent.instance().addEventListener(GlobalEvent.TWEEN_PLAYER_RANKING, this.tweenSpinScore, this);
    }
    protected onDisable(): void {

        GlobalEvent.instance().removeEventListener(GlobalEvent.TWEEN_PLAYER_RANKING, this.tweenSpinScore, this);
    }

    protected onLoad(): void {
        this.createDataRank();
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
        }
    }


    showPlayerDefault() {
        for (let i = 0; i < 5; i++) {
            this.showRankPlayer();

        }
    }




    showRankPlayer() {
        if (this.idxRank > this.arrPlayerRank.length - 1) return;
        let idxRankCopy = this.idxRank;
        let itemRank = CreatePlayerRank.instance().createItemRank();

        itemRank.x = beginXRank +  beginSpaceOtherMid + beginSpaceLeftMeRank + beginXSpaceRank * idxRankCopy;
        itemRank.y = beginYPlayerRank;
        itemRank.getChildByName("txtRank").getComponent(cc.Label).string = this.arrPlayerRank[idxRankCopy].rank;
        itemRank.getChildByName("txtScore").getComponent(cc.Label).string = this.arrPlayerRank[idxRankCopy].score;
        itemRank.getChildByName("avatar").getComponent(cc.Sprite).spriteFrame = this.defaultAvatar;
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
        this.idxRank++;
    }


    tweenSpinScore() {
        if (this.playerRank == 1) return;
        let scorePlay = MainData.instance().score;
        let min = 0;
        let max = this.arrPlayerRank[this.idxSpeedScore].score;
        let kc: number = 0;
        let widthKc: number = 0;
        if (this.arrPlayerRank[this.idxSpeedScore - 1]) {
            min = this.arrPlayerRank[this.idxSpeedScore - 1].score;
            kc = max - min;
            widthKc = beginXSpaceRank;
        } else {
            min = 0;
            kc = max - min;
            // widthKc = beginSpaceOtherMid + (this.node.width / 2 - beginSpaceLeftMeRank - this.avatarMe.width / 2);
            widthKc = beginSpaceOtherMid + (this.node.width / 2 - beginSpaceLeftMeRank - 80 / 2);
        }
        let kcDiChuyen = scorePlay - this.backScorePlay;
        if (kcDiChuyen > kc) {
            kcDiChuyen = kc;
        }
        let vx: number = this.node.x - ((kcDiChuyen / kc) * widthKc);
        cc.tween(this.node).to(0.2, { x: vx }).call(() => {
        }).start();
        // if (this.scorePlay > this.arrPlayerRank[this.idxSpeedScore].score) {
        //     let dataRankOut = this.arrPlayerRank[this.idxSpeedScore];
        //     //dataRankOut.rank = this.playerRank;
        //     this.arrPlayerRankOut.push(dataRankOut);
        //     this.idxSpeedScore++;
        //     this.playerRank--;
        //     let item: cc.Node = this.arrOtherPlayer[0];
        //     this.arrOtherPlayer.splice(0, 1);
        //     cc.tween(item).to(0.3, { scaleY: 1.2 }).delay(0.1).to(0.3, { scale: 0, opacity: 0, y: item.y - 65 }).call(() => {
        //         CreatePlayerRank.instance().removeItemRank(item);
        //         this.beginShowAvatarBonus(dataRankOut);
        //     }).start();
        //     if (this.arrOtherPlayer.length > 0) {
        //         /*
        //         let itemNext: cc.Node = this.arrOtherPlayer[0];
        //         itemNext.active = true;
        //         itemNext.opacity = 0;
        //         itemNext.scale = 0.5
        //         cc.tween(itemNext).to(0.3, { opacity: 255, scale: 1 }).start();*/
        //     }
        //     this.showRankPlayer();
        //     this.showRankMe();
        // } 
        this.backScorePlay = scorePlay;

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
