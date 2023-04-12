import { SCENE } from "../../component/constant/constant";
import GlobalEvent from "../../component/event/GlobalEvent";
import GameController from "./game/GameController";
import HomeController from "./main/HomeController";

const { ccclass, property } = cc._decorator;

@ccclass
export default class SceneController extends cc.Component {

    @property(GameController)
    gameController: GameController = null;

    @property(cc.Node)
    bg_home: cc.Node = null;

    @property(HomeController)
    homeController: HomeController = null;

    currentIdScene: SCENE = null;

    // LIFE-CYCLE CALLBACKS:


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
        let id = data.idScene
        if (id == null) {
            this.gameController.node.active = false;
            this.homeController.node.active = false;
            return;
        } else if (this.currentIdScene == id) {
            return;
        } else {

            switch (id) {
                case SCENE.game:
                    this.bg_home.active = true;
                    this.gameController.node.active = true;
                    GlobalEvent.instance().dispatchEvent(GlobalEvent.START_GAME);
                    this.homeController.node.active = false;
                    break;
                case SCENE.home:
                    this.bg_home.active = false;
                    this.gameController.node.active = false;
                    this.homeController.node.active = true;
                    break;
                default:
                    break;
            }
            this.currentIdScene = id;
        }
    }

    // update (dt) {}
}
