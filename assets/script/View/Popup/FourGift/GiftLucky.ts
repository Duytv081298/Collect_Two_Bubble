const { ccclass, property } = cc._decorator;

@ccclass
export default class GiftLucky extends cc.Component {


    @property(sp.Skeleton)
    gift: sp.Skeleton = null;
    @property(cc.Label)
    amount_gold: cc.Label = null;

    @property(cc.Node)
    content_gift: cc.Node = null;

    isOpen: boolean = false;

    protected onEnable(): void {
        this.reset()
    }
    reset() {
        this.isOpen = false;

        this.gift.setSkin("default");
        this.gift.setAnimation(0, "runglac", true);

        this.content_gift.active = false;
        this.content_gift.setScale(0.5)
        this.content_gift.setPosition(0, -382, 0)
    }

    open(coin: number) {
        if (this.isOpen) return;
        this.isOpen = true;
        if(coin) this.showGift()

        this.amount_gold.string = coin.toString();

        this.gift.setSkin("default");
        this.gift.setAnimation(0, "mo hop", false);
    }
    showGift() {

        this.content_gift.active = true;
        this.content_gift.setScale(0.5)
        this.content_gift.setPosition(0, -382, 0)
        cc.tween(this.content_gift)
            .delay(0.3)
            .to(0.5, { scale: 1.1, position: new cc.Vec3(0, -155, 0) }, { easing: "expoOut" })
            .start()
    }
}
