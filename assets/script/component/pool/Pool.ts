import CreateAnimationBubble from "./CreateAnimationBubble";
import CreateBubble from "./CreateBubble";
import CreateConnect from "./CreateConnect";
import CreatePlayerRank from "./CreatePlayerRank";


const { ccclass, property } = cc._decorator;

@ccclass
export default class Pool extends cc.Component {


    @property(cc.Prefab)
    bubble: cc.Prefab | null = null;
    @property(cc.Prefab)
    animationBubble: cc.Prefab | null = null;
    @property(cc.Prefab)
    connect: cc.Prefab | null = null;
    @property(cc.Prefab)
    player_ranking_game: cc.Prefab | null = null;

    onLoad() {
        CreateBubble.instance().setPrefab(this.bubble);
        CreateAnimationBubble.instance().setPrefab(this.animationBubble);
        CreateConnect.instance().setPrefab(this.connect);
        CreatePlayerRank.instance().setPrefab(this.player_ranking_game);
    }

}
