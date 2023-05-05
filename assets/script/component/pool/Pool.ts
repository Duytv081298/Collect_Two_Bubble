import CreateAnimationBooster from "./CreateAnimationBooster";
import CreateAnimationBubble from "./CreateAnimationBubble";
import CreateBubble from "./CreateBubble";
import CreateConnect from "./CreateConnect";
import CreateGoldHole from "./CreateGoldHole";
import CreatePlayerRank from "./CreatePlayerRank";
import CreateScoreBubble from "./CreateScoreBubble";
import CreateUserRankHome from "./CreateUserRankHome";


const { ccclass, property } = cc._decorator;

@ccclass
export default class Pool extends cc.Component {


    @property(cc.Prefab)
    bubble: cc.Prefab | null = null;
    @property(cc.Prefab)
    animationBubble: cc.Prefab | null = null;
    @property(cc.Prefab)
    animationBooster: cc.Prefab | null = null;
    @property(cc.Prefab)
    scoreBubble: cc.Prefab | null = null;
    @property(cc.Prefab)
    connect: cc.Prefab | null = null;
    @property(cc.Prefab)
    player_ranking_game: cc.Prefab | null = null;
    @property(cc.Prefab)
    player_rank_home : cc.Prefab | null = null;
    @property(cc.Prefab)
    gold : cc.Prefab | null = null;

    onLoad() {
        CreateBubble.instance().setPrefab(this.bubble);
        CreateAnimationBubble.instance().setPrefab(this.animationBubble);
        CreateAnimationBooster.instance().setPrefab(this.animationBooster);
        CreateConnect.instance().setPrefab(this.connect);
        CreatePlayerRank.instance().setPrefab(this.player_ranking_game);
        CreateUserRankHome.instance().setPrefab(this.player_rank_home);
        CreateScoreBubble.instance().setPrefab(this.scoreBubble);
        CreateGoldHole.instance().setPrefab(this.gold);
    }

}
