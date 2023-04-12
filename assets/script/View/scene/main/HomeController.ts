import { SCENE } from "../../../component/constant/constant";
import GlobalEvent from "../../../component/event/GlobalEvent";

const {ccclass, property} = cc._decorator;

@ccclass
export default class HomeController extends cc.Component {

    // @property(cc.Label)
    // label: cc.Label = null;
    
    playNow(){
        GlobalEvent.instance().dispatchEvent(GlobalEvent.SWITCH_SCENES, { idScene: SCENE.game });
    }
}
