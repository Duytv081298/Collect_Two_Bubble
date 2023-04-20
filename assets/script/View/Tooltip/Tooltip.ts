
import SoundManager from "../../component/component/SoundManager";
import { BOOSTER } from "../../component/constant/constant";
import GlobalEvent from "../../component/event/GlobalEvent";
import LocalStorage from "../../component/storage/LocalStorage";
import MainData from "../../component/storage/MainData";


const { ccclass, property } = cc._decorator;
@ccclass
export class Tooltip extends cc.Component {

    @property(cc.Node)
    parentNode: cc.Node | null = null;

    @property(cc.Sprite)
    icon: cc.Sprite | null = null;

    @property(cc.Label)
    nameLb: cc.Label | null = null;

    @property(cc.Label)
    descriptionLb: cc.Label | null = null;


    @property(cc.SpriteFrame)
    listIcon: cc.SpriteFrame[] | [] = [];

    protected onLoad(): void {
        this.parentNode.scale = 0;
        this.parentNode.active = false;
    }

    protected onEnable(): void {
        GlobalEvent.instance().addEventListener(GlobalEvent.SHOW_TOOLTIP, this.show, this);
        GlobalEvent.instance().addEventListener(GlobalEvent.HIDE_TOOLTIP, this.hide, this);
    }
    protected onDisable(): void {
        GlobalEvent.instance().removeEventListener(GlobalEvent.SHOW_TOOLTIP, this.show, this);
        GlobalEvent.instance().removeEventListener(GlobalEvent.HIDE_TOOLTIP, this.hide, this);
    }
    show() {
        this.setUI();
        this.parentNode.active = true;
        this.parentNode.stopAllActions()
        cc.tween(this.parentNode)
            .to(0.2, { scale: 1 })
            .start()
    }
    hide() {
        SoundManager.instance().playEffect("button");
        this.parentNode.stopAllActions()
        cc.tween(this.parentNode)
            .to(0.2, { scale: 0 })
            .call(() => {
                this.parentNode.active = false;
            })
            .start()
    }


    setUI() {
        this.icon.spriteFrame = this.listIcon[MainData.instance().keyBooster]
        switch (MainData.instance().keyBooster) {
            case BOOSTER.rocket:
                this.descriptionLb.string = TOOLTIP.rocket
                break;
            case BOOSTER.bomb:
                this.descriptionLb.string = TOOLTIP.bomb
                break;
            case BOOSTER.reverse:
                this.descriptionLb.string = TOOLTIP.reverse
                break;
            case BOOSTER.hammer:
                this.descriptionLb.string = TOOLTIP.hammer
                break;

            default:
                break;
        }
    }
}


export enum TOOLTIP {
    bomb = "Destroy the surrounding bubbles.",
    rocket = " Clears all bubbles on 4 sides.",
    reverse = "Swap the position of two bubbles.",
    hammer = "Breaks open a specific bubble.",
}
