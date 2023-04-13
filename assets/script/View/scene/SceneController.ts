import { SCENE } from "../../component/constant/constant";
import GlobalEvent from "../../component/event/GlobalEvent";
import MainData from "../../component/storage/MainData";
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
        // console.log("id: " + id);
        // console.log("MainData.instance().currentIdScene: " + MainData.instance().currentIdScene);
        
        if (id == null) {
            this.gameController.node.active = false;
            this.homeController.node.active = false;
            MainData.instance().currentIdScene = id;
            return;
        } else if (MainData.instance().currentIdScene == id) {
            return;
        } else {
// console.log(111111);

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
            MainData.instance().currentIdScene = id;
        }
        
        // MainData.instance().currentIdScene = id;
    }

    // update (dt) {}
}
