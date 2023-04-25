
import RankController from "../View/Ranking/RankController";
import { BOOSTER, GOLD_USE_BOOSTER } from "../component/constant/constant";
import GlobalEvent from "../component/event/GlobalEvent";
import { PlayfabManager } from "../component/package/PlayfabManager";
import LocalStorage from "../component/storage/LocalStorage";
import MainData from "../component/storage/MainData";

const { ccclass, property } = cc._decorator;

@ccclass
export default class Test extends cc.Component {

    @property(RankController)
    rankController: RankController = null;
    amountPress: number = 0;

    countdown: boolean = false;

    isCheck: boolean = false;

    updateBooster() {
        let status = this.startCheck();
        // console.log("status: " + status);

        if (status) {
            GlobalEvent.instance().dispatchEvent(GlobalEvent.UPDATE_AMOUNT_BOOSTER, { booster: BOOSTER.rocket, amount: 1 });
            GlobalEvent.instance().dispatchEvent(GlobalEvent.UPDATE_AMOUNT_BOOSTER, { booster: BOOSTER.bomb, amount: 1 });
            GlobalEvent.instance().dispatchEvent(GlobalEvent.UPDATE_AMOUNT_BOOSTER, { booster: BOOSTER.reverse, amount: 1 });
            GlobalEvent.instance().dispatchEvent(GlobalEvent.UPDATE_AMOUNT_BOOSTER, { booster: BOOSTER.hammer, amount: 1 });

        }
    }

    updateMove() {
        let status = this.startCheck();
        if (!status) return
        MainData.instance().updateMove(5);
        GlobalEvent.instance().dispatchEvent(GlobalEvent.ANIMATION_UPDATE_MOVE, { status: true });
    }
    updateGold() {
        let status = this.startCheck();
        if (!status) return
        MainData.instance().updateGold(GOLD_USE_BOOSTER);
        GlobalEvent.instance().dispatchEvent(GlobalEvent.UPDATE_GOLD_GAME);

    }

    updateScore() {

        let status = this.startCheck();
        if (!status) return

        GlobalEvent.instance().dispatchEvent(GlobalEvent.UPDATE_SCORE_GAME, { score: 10000 });
        let score = MainData.instance().score;
        let hightScore = parseInt(LocalStorage.getItem(LocalStorage.HIGHT_SCORE));
        PlayfabManager.install.updateScoreToLeaderboardAsync(PlayfabManager.WEEKLY, score);
        if (hightScore < score) {
            LocalStorage.setItem(LocalStorage.HIGHT_SCORE, score);
        }


        // GlobalEvent.instance().dispatchEvent(GlobalEvent.UPDATE_SCORE_GAME, { score: 30000 });
        // console.log(this.rankController.listScorePlayer);

        // console.log("score up: " + (this.rankController.listScorePlayer[this.rankController.listScorePlayer.length - 1] - 100));

        // GlobalEvent.instance().dispatchEvent(GlobalEvent.UPDATE_SCORE_GAME, { score: (this.rankController.listScorePlayer[this.rankController.listScorePlayer.length - 1] - 100) });
    }

    startCheck() {
        if(MainData.instance().isTest) return true;
        if (this.isCheck) {
            this.amountPress++;
            if (this.amountPress >= 15) {
                this.isCheck = false;
                this.countdown = false;
                this.amountPress = 0;
                this.node.stopAllActions()
                return true;
            } else return false;
        } else {
            this.isCheck = true;
            this.countdown = true;
            this.node.stopAllActions()
            cc.tween(this.node)
                .delay(3)
                .call(() => {
                    this.isCheck = false;
                    this.countdown = false;
                    this.amountPress = 0;
                })
                .start();
        }
    }
}
