import { SCENE } from "../../component/constant/constant";
import GlobalEvent from "../../component/event/GlobalEvent";
import MainData from "../../component/storage/MainData";
import BaseLoad, { DataScreen } from '../Popup/base/BaseLoad';

const { ccclass, property } = cc._decorator;
const home: DataScreen = new DataScreen("home", "prefab/Scene Home/Home", GlobalEvent.SHOW_HOME);
@ccclass
export default class SceneController extends BaseLoad {

    @property(cc.Node)
    gameScene: cc.Node = null;
    homeScene: cc.Node = null;
    ktShowHome: boolean = false;

    protected onLoad(): void {       
        GlobalEvent.instance().addEventListener(GlobalEvent.SHOW_HOME, this.showHome, this);       
    }
    protected onDestroy(): void {
        GlobalEvent.instance().addEventListener(GlobalEvent.SHOW_HOME, this.showHome, this);
    }
    protected onEnable(): void {
        GlobalEvent.instance().addEventListener(GlobalEvent.SWITCH_SCENES, this.switchScene, this);
    }
    protected onDisable(): void {
        GlobalEvent.instance().removeEventListener(GlobalEvent.SWITCH_SCENES, this.switchScene, this);
    }
    hideAll(){
        
        console.log(" ========== hideAll SceneController");
        for (let i = 0; i < this.node.childrenCount; i++) {
            this.node.children[i].active = false;
        }
    }

    start() {
        this.hideAll();
    }
    switchScene(data) {
        let id = data.idScene;
        this.hideAll()
        switch (id) {
            case SCENE.game:
                GlobalEvent.instance().dispatchEvent(GlobalEvent.SHOW_GAME_PLAY);
                GlobalEvent.instance().dispatchEvent(GlobalEvent.START_GAME);
                break;
            case SCENE.home:
                GlobalEvent.instance().dispatchEvent(GlobalEvent.SHOW_HOME);
                break;
            default:
                break;
        }
        MainData.instance().currentIdScene = id;

    }
    preLoadScene() {
        this.checkLoadBundle(home, null, false);
    }
    showHome(data) {
        this.checkLoadBundle(home, data);
    }
}
