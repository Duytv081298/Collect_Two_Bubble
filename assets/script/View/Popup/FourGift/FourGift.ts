import RewardAds from "../../../component/ads/RewardAds";
import PlayerLocal from "../../../component/component/PlayerLocal";
import SoundManager from "../../../component/component/SoundManager";
import GlobalEvent from "../../../component/event/GlobalEvent";
import FaceBook from "../../../component/package/FaceBook";
import MainData from "../../../component/storage/MainData";
import GiftLucky from "./GiftLucky";

const { ccclass, property } = cc._decorator;

@ccclass
export class FourGift extends cc.Component {

    @property(cc.Sprite)
    avatar: cc.Sprite = null;
    @property(cc.SpriteFrame)
    avatarDefault: cc.SpriteFrame = null;
    @property(cc.Label)
    txtName: cc.Label = null;
    @property(cc.Label)
    txtCoin: cc.Label = null;
    @property(cc.Node)
    iconCoin: cc.Node = null;
    @property(cc.Node)
    nodeWinMoney: cc.Node = null;
    @property(cc.RichText)
    content: cc.RichText = null;
    @property(cc.Button)
    btnClaimX2: cc.Button = null;
    @property(cc.Node)
    btnClose: cc.Node = null;
    isClaimX2: boolean = false
    @property(cc.Node)
    title: cc.Node = null;
    @property(GiftLucky)
    listGift: GiftLucky[] = [];
    @property(cc.Node)
    toPosCoin: cc.Node = null;
    dataPlayer: any = null;
    indexNoGift: number = null;
    countOpenGift: number = null;
    totalGift: number = 0;
    totalCoin: number = 0;
    isAttack: boolean = false;
    listGiftOpen: number[] = [];

    protected onLoad(): void {
        GlobalEvent.instance().addEventListener(GlobalEvent.SHOW_FOUR_GIFT, this.show, this);
    }

    protected onDestroy(): void {
        GlobalEvent.instance().removeEventListener(GlobalEvent.SHOW_FOUR_GIFT, this.show, this);
    }

    onEnable() {
        GlobalEvent.instance().addEventListener(GlobalEvent.REWARD_ADS_ON_READY, this.readyAds, this);
        GlobalEvent.instance().addEventListener(GlobalEvent.REWARD_ADS_ON_REWARD, this.adsReward, this);
    }
    onDisable(): void {
        GlobalEvent.instance().removeEventListener(GlobalEvent.REWARD_ADS_ON_READY, this.readyAds, this);
        GlobalEvent.instance().removeEventListener(GlobalEvent.REWARD_ADS_ON_REWARD, this.adsReward, this);
    }

    readyAds() {

        if (!this.isClaimX2) this.activeBtnClaimX2(RewardAds.instance.ready);
    }
    adsReward(data) {
        if (data.type == RewardAds.REWARDED_COIN_CONGRATULATION) {
            this.isClaimX2 = true;

            this.totalCoin *= 2;
            this.setTextWin();

            this.activeBtnClaimX2(false);
            this.node.stopAllActions()
            cc.tween(this.node)
                .delay(0.5)
                .call(() => {
                    if(this.isAttack == false){
                        GlobalEvent.instance().dispatchEvent(GlobalEvent.CHANGE_USER_SPIN);
                    }
                    MainData.instance().updateGold(this.totalCoin);
                    GlobalEvent.instance().dispatchEvent(GlobalEvent.ANIMATION_GOLD_SPIN);
                    this.node.active = false;
                })
                .start();
        }
    }

    reset() {
        this.isClaimX2 = false;
        this.activeBtnClaimX2(true)
        this.title.active = true;
        this.isAttack = null;
        this.dataPlayer = null;
        this.btnClose.active = false;
        this.readyAds();

        this.indexNoGift = Math.floor(Math.random() * this.listGift.length)
        this.countOpenGift = 0;
        this.totalCoin = 0;
        this.totalGift = 0;
        this.listGiftOpen = [];

        // this.nodeWinMoney.active = false;
        this.nodeWinMoney.setPosition(0, -this.node.height * 0.7)


        for (let i = 0; i < this.listGift.length; i++) {
            this.listGift[i].reset();
        }
    }
    show(data) {
        this.node.active = true;
        GlobalEvent.instance().dispatchEvent(GlobalEvent.HIDE_LOADING);
        this.reset();
        this.isAttack = data.isAttack;
        this.dataPlayer = data.dataPlayer;
        // console.log("this.dataPlayer: ", this.dataPlayer);
        if (this.isAttack == false) {
            if (this.dataPlayer.isFb) {
                FaceBook.loadRemote(this.avatar, this.dataPlayer.avatar);
            } else {
                PlayerLocal.instance().setSprite(this.avatar, this.dataPlayer.avatar)
            }
            this.txtName.node.y = 39;
            this.txtName.string = this.dataPlayer.name;
            this.txtCoin.string = this.dataPlayer.coin;           
            this.iconCoin.active = true;
        } else {
            this.avatar.spriteFrame = this.avatarDefault;
            this.txtName.node.y = 0;
            this.txtName.string = "New Friend";
            this.iconCoin.active = false;
            this.txtCoin.string = "";
        }


    }

    clickGift(event: Event, customEventData: string) {
        var index = parseInt(customEventData);
        if (this.countOpenGift > 2 || this.listGiftOpen.indexOf(index) >= 0) return;
        let coinRd = index == this.indexNoGift ? 0 : Math.floor(Math.random() * 51 + 50)
        this.countOpenGift++;
        this.listGift[index].open(coinRd);
        this.totalCoin += coinRd;

        if (this.countOpenGift >= 3) this.openWin()
    }
    openWin() {
        this.btnClose.active = true;
        this.nodeWinMoney.stopAllActions();
        cc.tween(this.nodeWinMoney)
            .delay(0.3)
            .call(() => {
                this.title.active = false;
                this.nodeWinMoney.active = true;
                this.setTextWin();
            })
            .to(0.5, { position: new cc.Vec3(this.nodeWinMoney.position.x, -this.node.height * 0.3, 0) }, { easing: "expoOut" })
            .start();
    }

    setTextWin() {
        if (this.dataPlayer) {
            this.content.string = `<color=#ffffff>You stole </color><color=#FFEC00>$${this.totalCoin}</color><br/><color=#ffffff>from </color><color=#FFEC00>${this.dataPlayer.name}</color>`
        } else {
            if (this.totalGift < 3) {
                this.content.string = `<color=#ffffff>You attacked a friends and won </color><color=#FFEC00>$${this.totalCoin}</color>`
            } else {
                this.content.string = `<color=#ffffff>You were blocked by a friends and won </color><color=#FFEC00>$${this.totalCoin}</color>`
            }
        }
    }



    hide() {
        SoundManager.instance().playEffect("button");
        if(this.isAttack == false){
            GlobalEvent.instance().dispatchEvent(GlobalEvent.CHANGE_USER_SPIN);
        }
        MainData.instance().updateGold(this.totalCoin);
        GlobalEvent.instance().dispatchEvent(GlobalEvent.ANIMATION_GOLD_SPIN);
        this.node.active = false;
       
    }
    onHandlerClaimX2() {
        SoundManager.instance().playEffect("button");
        RewardAds.instance.show(RewardAds.REWARDED_COIN_CONGRATULATION)
        // FaceBook.logEvent(LogEventName.claimX2GiftSpin)
    }
    onHandlerShare() {
        SoundManager.instance().playEffect("button");
        cc.resources.load(FaceBook.getImageShareFacebook(), (err, texture) => {
            FBInstant.shareAsync({
                image: FaceBook.getImgBase64(texture),
                text: FBInstant.player.getName() + " invited you to play",
                data: {
                },
                intent: "SHARE",
                switchContext: false
            }).then(() => {

            }).catch(() => {

            });
        })
    }
    activeBtnClaimX2(status: boolean) {
        this.btnClaimX2.interactable = status;
    }
}


