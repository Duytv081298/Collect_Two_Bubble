import { PlayfabManager } from "../../component/package/PlayfabManager";
import FaceBook from "../../component/package/FaceBook";
import GlobalEvent from "../../component/event/GlobalEvent";
import { SCENE } from "../../component/constant/constant";

const { ccclass, property } = cc._decorator;

@ccclass
export class UserHome extends cc.Component {


    @property(cc.Label)
    txtName: cc.Label = null;
    @property(cc.Label)
    txtScore: cc.Label = null;
    @property(cc.Label)
    txtStt: cc.Label = null;
    @property(cc.Sprite)
    avatar: cc.Sprite = null;
    @property(cc.Node)
    icon_rank1: cc.Node = null;
    @property(cc.Node)
    icon_rank2: cc.Node = null;
    @property(cc.Node)
    icon_rank3: cc.Node = null;
    @property(cc.SpriteFrame)
    defaultAvatar: cc.SpriteFrame = null;
    @property(cc.Node)
    btnChallenge: cc.Node = null;

    playfabId: string = "";

    setUp(name: string, score: number, avatar: string, stt: number, playfabId: string) {
        // console.log("stt: " + stt + "  name: " + name + "  score: " + score + "  playfabId: " + playfabId);

        this.icon_rank1.active = false;
        this.icon_rank2.active = false;
        this.icon_rank3.active = false;
        this.txtStt.node.active = false;

        this.btnChallenge.active = true;



        if (stt == 1) this.icon_rank1.active = true;
        else if (stt == 2) this.icon_rank2.active = true;
        else if (stt == 3) this.icon_rank3.active = true;
        else {

            this.txtStt.node.active = true;
            this.txtStt.string = stt + "";
        }
        // console.log(PlayfabManager.install.friends);
        // console.log("playfabId: " + playfabId);


        if (PlayfabManager.install.friends.indexOf(playfabId) >= 0) this.btnChallenge.active = true;
        else this.btnChallenge.active = false;

        if (PlayfabManager.install.playfabId == playfabId) this.btnChallenge.active = false;

        this.playfabId = playfabId;
        this.txtName.string = name;
        this.txtScore.string = "Score: " + score;
        this.avatar.spriteFrame = this.defaultAvatar;
        if (avatar == "" || avatar == null) return;
        // cc.assetManager.loadRemote(avatar, { ext: '.jpg' }, (err, imageAsset: cc.Texture2D) => {
        //     if (imageAsset == null) {
        //         return;
        //     }
        //     if (err) {
        //         return;
        //     }
        //     const spriteFrame = new cc.SpriteFrame(imageAsset);
        //     this.avatar.spriteFrame = spriteFrame;
        // });
        
        FaceBook.loadRemote(this.avatar, avatar);

    }
    start() {
    }

    update(deltaTime: number) {

    }
    onHanlderPlaywithFriends() {
        let idFB = PlayfabManager.install.facebookMapIds.get(this.playfabId);
        if (idFB) {
            if (idFB == FaceBook.getID()) return;
            FBInstant.context
                .createAsync(idFB)
                .then(() => {
                    GlobalEvent.instance().dispatchEvent(GlobalEvent.SWITCH_SCENES, { idScene: SCENE.game });
                }).catch(() => {
                })
        }
    }
}


