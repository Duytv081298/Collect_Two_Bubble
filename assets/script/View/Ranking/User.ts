const { ccclass, property } = cc._decorator;

@ccclass
export default class User extends cc.Component {

    @property(cc.Label)
    txtRank: cc.Label = null;

    @property(cc.Sprite)
    avatar: cc.Sprite = null;
    @property(cc.SpriteFrame)
    avatarDefault: cc.SpriteFrame = null;

    setUp(avatar: cc.SpriteFrame, rank: number) {
        this.avatar.spriteFrame = avatar ? avatar : this.avatarDefault;
        this.txtRank.string = rank >= 0 ? rank.toString() : "";
    }
}
