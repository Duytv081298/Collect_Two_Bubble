// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import GlobalEvent from "../../component/event/GlobalEvent";
import { PlayfabManager } from "../../component/package/PlayfabManager";
import CreateUserRankHome from "../../component/pool/CreateUserRankHome";
import { UserHome } from "./UserHome";

const { ccclass, property } = cc._decorator

@ccclass
export default class UiRankHome extends cc.Component {

    protected onEnable(): void {
        this.reloadRanking();

    }
    protected onDisable(): void {
    }

    @property(cc.Node)
    contentRanking: cc.Node = null;

    start() {

    }


    reloadRanking() {
        console.log("reloadRanking");
        
        if (PlayfabManager.install.hadLogin == false) return;
        PlayfabManager.install.getLeaderboardGlobal(PlayfabManager.WEEKLY).then((dataRank) => {
            while (this.contentRanking.childrenCount > 0) {
                CreateUserRankHome.instance().removeItem(this.contentRanking.children[0]);
            }
            console.log("dataRank: ", dataRank);
            for (let i = 0; i < dataRank.length; i++) {
                let name: String = dataRank[i].DisplayName;
                let arrName = name.split("_");
                let itemRank = CreateUserRankHome.instance().createItem();
                // console.log(itemRank);

                itemRank.getComponent(UserHome).setUp(
                    arrName[0],
                    dataRank[i].StatValue,
                    dataRank[i].Profile.AvatarUrl,
                    dataRank[i].Position + 1,
                    dataRank[i].PlayFabId
                )
                this.contentRanking.addChild(itemRank);
            }
        })
    }
    // update (dt) {}
}
