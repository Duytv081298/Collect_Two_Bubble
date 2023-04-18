import { SCENE } from "../../component/constant/constant";
import GlobalEvent from "../../component/event/GlobalEvent";
import MainData from "../../component/storage/MainData";

const { ccclass, property } = cc._decorator;

@ccclass
export default class SceneController extends cc.Component {

    @property(cc.Node)
    gameScene: cc.Node = null;
    homeScene: cc.Node = null;
    ktShowHome: boolean = false;

    protected onLoad(): void {
        this.preLoadHome();
    }
    protected onEnable(): void {
        GlobalEvent.instance().addEventListener(GlobalEvent.SWITCH_SCENES, this.switchScene, this);
    }
    protected onDisable(): void {
        GlobalEvent.instance().removeEventListener(GlobalEvent.SWITCH_SCENES, this.switchScene, this);
    }

    start() {
        this.switchScene({ idScene: SCENE.game })
    }
    switchScene(data) {
        let id = data.idScene;
        if (MainData.instance().currentIdScene == id) {
            return;
        } else {
            switch (id) {
                case SCENE.game:
                    this.gameScene.active = true;
                    console.log("GlobalEvent.START_GAME");
                    GlobalEvent.instance().dispatchEvent(GlobalEvent.START_GAME);
                    if (this.homeScene) this.homeScene.active = false;
                    break;
                case SCENE.home:
                    this.gameScene.active = false;
                    this.showHome();
                    break;
                default:
                    break;
            }
            MainData.instance().currentIdScene = id;
        }
    }

    preLoadHome() {
        cc.resources.preload("prefab/Scene Home/Home", cc.Prefab, (err) => {
            if (this.homeScene == null || !this.homeScene.active) this.loadHome();
        });
    }
    loadHome() {
        cc.resources.load("prefab/Scene Home/Home", cc.Prefab, (err, prefab: cc.Prefab) => {
            if (!err) {
                if (this.homeScene == null) {
                    this.homeScene = cc.instantiate(prefab);
                    this.homeScene.active = this.ktShowHome;
                    this.homeScene.setParent(this.node)
                    if (this.ktShowHome == true) {
                        this.showHome();
                    }
                }

            }
        });
    }

    showHome() {
        if (this.homeScene != null) {
            GlobalEvent.instance().dispatchEvent(GlobalEvent.HIDE_LOADING);
            this.ktShowHome = false;
            this.homeScene.active = true;
        } else {
            GlobalEvent.instance().dispatchEvent(GlobalEvent.SHOW_LOADING);
            this.ktShowHome = true;
            this.loadHome();
        }
    }
}
