import NameBot from "./NameBot";

const { ccclass, property } = cc._decorator;

@ccclass
export default class PlayerLocal {
    private static playerLocal: PlayerLocal;

    public static instance(): PlayerLocal {
        if (!PlayerLocal.playerLocal) {
            PlayerLocal.playerLocal = new PlayerLocal();
        }
        return PlayerLocal.playerLocal;
    }

    listNames: string[] = [];

    indexUserRank: number = 0;
    indexUserSpin: number = 0;
    clearPlayer() {
        this.listNames = [];
        this.indexUserRank = 0;
        this.indexUserSpin = 0;
        this.preLoad();
    }
    preLoad() {
        this.listNames = [];
        for (let i = 0; i < 40; i++) {
            let name = this.getNameUser();
            this.listNames.push(name)
            cc.resources.preload("profiles/" + name, (err) => { });
        }
    }

    getNameUser() {
        let arrName = NameBot.getArrName();
        let name = arrName[Math.floor(Math.random() * arrName.length)];
        while (this.listNames.indexOf(name) >= 0) {
            name = arrName[Math.floor(Math.random() * arrName.length)]
        }
        return name;
    }

    getNamePlayerRank() {
        if (this.indexUserRank >= this.listNames.length - 1) {
            let name = this.getNameUser();
            this.listNames.push(name)
            cc.resources.preload("profiles/" + name, (err) => { });
            this.indexUserRank++;

            return name;
        }
        if (this.indexUserRank > this.listNames.length - 2) {
            let name = this.getNameUser();
            this.listNames.push(name)
            cc.resources.preload("profiles/" + name, (err) => { });
        }
        let nameReturn = this.listNames[this.indexUserRank]
        this.indexUserRank++;

        return nameReturn;
    }
    getPlayerSpin() {
        if (this.indexUserSpin >= this.listNames.length - 1) {
            let name = this.getNameUser();
            this.listNames.push(name)
            cc.resources.preload("profiles/" + name, (err) => { });
            this.indexUserSpin++;

            return name;
        }
        if (this.indexUserSpin > this.listNames.length - 2) {
            let name = this.getNameUser();
            this.listNames.push(name)
            cc.resources.preload("profiles/" + name, (err) => { });
        }
        let nameReturn = this.listNames[this.indexUserSpin]
        this.indexUserSpin++;
        return nameReturn;
    }

    setSprite(avatar: cc.Sprite, name: string) {
        cc.resources.load("profiles/" + name, cc.Texture2D, (err, spf: cc.Texture2D) => {
            if (!err) {
                const spriteFrame = new cc.SpriteFrame(spf);
                avatar.spriteFrame = spriteFrame;
            }
        })
    }
}
