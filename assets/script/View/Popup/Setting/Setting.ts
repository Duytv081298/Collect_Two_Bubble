import { SCENE } from "../../../component/constant/constant";
import GlobalEvent from "../../../component/event/GlobalEvent";
import LocalStorage from "../../../component/storage/LocalStorage";
import MainData from "../../../component/storage/MainData";

const { ccclass, property } = cc._decorator;

@ccclass
export class Setting extends cc.Component {

    @property(cc.Toggle)
    toggMusic: cc.Toggle = null;
    @property(cc.Toggle)
    toggSound: cc.Toggle = null;
    @property(cc.Node)
    musicOn: cc.Node = null;
    @property(cc.Node)
    musicOff: cc.Node = null;
    @property(cc.Node)
    soundOn: cc.Node = null;
    @property(cc.Node)
    soundOff: cc.Node = null;
    @property(cc.Node)
    btnHome: cc.Node = null;
    protected start(): void {
        // this.showPopup();
    }
    showPopup() {
        if (MainData.instance().currentIdScene == SCENE.home) {
            this.btnHome.active = false;
        } else {
            this.btnHome.active = true;
        }

        if (LocalStorage.getItem(LocalStorage.SOUND) != null) LocalStorage.getItem(LocalStorage.SOUND) ? this.toggSound.check() : this.toggSound.uncheck();
        if (LocalStorage.getItem(LocalStorage.MUSIC) != null) LocalStorage.getItem(LocalStorage.MUSIC) ? this.toggMusic.check() : this.toggMusic.uncheck();
        this.show();

    }
    show() {
        this.musicOn.active = this.toggMusic.isChecked;
        this.musicOff.active = !this.toggMusic.isChecked;

        this.soundOn.active = this.toggSound.isChecked;
        this.soundOff.active = !this.toggSound.isChecked;
    }
    onHandlerSound() {
        // SoundManager.instance().playEffect("button");
        LocalStorage.setSound(this.toggSound.isChecked);
        this.show();
    }
    onHandlerMusic() {
        // SoundManager.instance().playEffect("button");
        LocalStorage.setMusic(this.toggMusic.isChecked);
        this.show();
    }
    onHanlderClose() {
        // SoundManager.instance().playEffect("button");
        this.hide();
    }
    onHandlerMainMenu() {
        // SoundManager.instance().playEffect("button");
        // FaceBook.logEvent(LogEventName.settingGameToHome)
        this.hide()
        GlobalEvent.instance().dispatchEvent(GlobalEvent.SWITCH_SCENES, { idScene: SCENE.home });
    }

    onHandlerShowHelp() {
        // SoundManager.instance().playEffect("button");
        // FaceBook.logEvent(LogEventName.openHelp)
        // game.emit("SHOW_HELP");
        this.hide();
    }
    hide() {
        this.node.active = false;
    }
}


