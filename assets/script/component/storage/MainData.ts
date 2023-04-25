import { BOOSTER, SCENE } from "../constant/constant";
import GlobalEvent from "../event/GlobalEvent";
import LocalStorage from "./LocalStorage";

export default class MainData {
    private static mainData: MainData;
    public static instance(): MainData {
        if (!MainData.mainData) {
            MainData.mainData = new MainData();
        }
        return MainData.mainData;
    }
    isLocal: boolean = false;
    isTest: boolean = true;

    currentIdScene: SCENE = null;

    score: number = 0;
    move: number = 0;

    keyBooster: BOOSTER = null;
    isUseBooster: boolean = false;
    isHandlerReverse: boolean = false;
    amountBooster: number[] = [0, 0, 0, 0];

    realityBubble: number = 0
    estimateBubble: number = 0



    indexHoleCoin: number = null;

    rankMe: number = 0;
    avatarMe: cc.SpriteFrame = null;
    arrDataRank: any[] = [];

    ktJoinTour: boolean = false;
    // isFistJoinTour: boolean = true;
    ktFistLogin: boolean = true;
    countEndGame: number = 0;
    idTour: string = "5859813670806859";
    friends = [];
    goldPlayer: number = 0;
    idxPlayFriends: number = 0;
    dataFriendPlay = null;



    currentSpin: number = 0;
    total_collect_spin: number = 3;
    countPlayFriends: number = 0;
    maxCountPlayFriends: number = 5;


    // ktGenDataScore: boolean = false;
    // ktGetFriends: boolean = false;
    // getScoreFriendComplete: boolean = false;
    // dailyInfo = {
    //     day: 1,
    //     collected: false
    // }
    dataGetMoreSpin = {};
    dataInviteFriend = {};
    private _totalTimeGetSpin = 1800;
    private idTimeGetSpin = null;
    public get totalTimeGetSpin() {
        return this._totalTimeGetSpin;
    }
    public set totalTimeGetSpin(value: number) {
        if (this.total_collect_spin <= 0) return;
        this._totalTimeGetSpin = parseInt(value + "");
        if (this._totalTimeGetSpin > 0 && this.idTimeGetSpin == null) {
            this.idTimeGetSpin = setInterval(() => {
                if (this.totalTimeGetSpin > 0) {
                    this.totalTimeGetSpin--;
                    // console.log("-------- totalTimeGetSpin ======");
                    // console.log(this.totalTimeGetSpin);

                    // game.emit("UPDATE_TIME_SPIN_IN_MAIN")
                    // game.emit("UPDATE_TIME_SPIN_IN_SPIN")

                    GlobalEvent.instance().dispatchEvent(GlobalEvent.UPDATE_TIME_SPIN_IN_SPIN);
                    if (this.totalTimeGetSpin == 0) {
                        let currentTime = new Date().getTime();
                        this.total_collect_spin--;
                        LocalStorage.setItem(LocalStorage.CURRENT_SPIN, MainData.instance().currentSpin + 1);
                        LocalStorage.setItem(LocalStorage.TIME_GET_SPIN, currentTime);
                    }
                }

            }, 1000)
        }
    }

    updateMove(move: number) {
        MainData.instance().move += move;
    }
    updateGold(gold: number){
        LocalStorage.setItem(LocalStorage.CURRENT_GOLD, MainData.instance().goldPlayer + gold);
    }
    updateScore(score: number){
        MainData.instance().score + score;
    }

    isPlay: boolean = false;
    isRunPlayer: boolean = false;
    isHiddenPrizes: boolean = false;
    isOpenGift: boolean = false;
    isUserPlay: boolean = false;

    isShowNoMove: boolean = false;
    isShowEndGame: boolean = false;

    isTutorial: boolean = false;
    isTutorialInterval: boolean = false;
    indexTutorial: number = 0;


}