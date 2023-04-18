import FaceBook from '../../component/package/FaceBook';
import MainData from "../../component/storage/MainData";

const { ccclass, property } = cc._decorator;

@ccclass
export default class User extends cc.Component {

    @property(cc.Label)
    txtRank: cc.Label = null;

    @property(cc.Sprite)
    avatar: cc.Sprite = null;
    @property(cc.SpriteFrame)
    avatarDefault: cc.SpriteFrame = null;
    rank: number = 999;

    setUp(rank: number) {
        this.avatar.spriteFrame = this.avatarDefault;
        FaceBook.showAvatarMe(this.avatar);
        this.showRank(rank);
    }
    showRank(rank: number) {
        if (this.rank == rank) return;
        this.rank = rank;
        this.avatar.spriteFrame = this.avatarDefault;
        this.txtRank.string = rank >= 0 ? rank.toString() : "";
    }
}
