import { BOOSTER } from "../constant/constant";
import FaceBook from "../package/FaceBook";
import MainData from "./MainData";

const { ccclass, property } = cc._decorator;
var dataGame: Map<string, string> = new Map();
@ccclass
export default class LocalStorage {
    static SOUND: string = "sound"
    static MUSIC: string = "music"
    static IS_NEW: string = "isNew"
    // static IS_NEW_WATTING: string = "isNewWatting"
    static HIGHT_SCORE: string = "hightScore"
    static CURRENT_GOLD: string = "current_gold";

    static BOOSTER_ROCKET: string = "boosterRocket"
    static BOOSTER_BOMB: string = "boosterBomb"
    static BOOSTER_REVERSE: string = "boosterReverse"
    static BOOSTER_HAMMER: string = "boosterHammer"



    // static TOOLTIP_ROCKET: string = "tooltipRocket"
    // static TOOLTIP_BOMB: string = "tooltipBomb"
    // static TOOLTIP_REVERSE: string = "tooltipReverse"
    // static TOOLTIP_HAMMER: string = "tooltipHammer"

    static COUNT_FREE_GIFT: string = "countFreeGift"

    // static COUNT_PLAY_FRIEND: string = "countPlayFriend"
    // static COUNT_ITEM_HAMMER: string = "countItemHammer"
    // static COUNT_ITEM_CHANGE_COLOR: string = "countItemChangeColor"
    // static DATA_SCORE_FRIENDS: string = "dataScoreFriends"
    static CURRENT_DATE: string = "currentDate"
    // static DAILY_COLLECT: string = "daily_connect";
    // static CURRENT_DAILY_COLLECT: string = "current_daily_connect";
    static TOTAL_COLLECT_SPIN: string = "total_collect_spin";
    static CURRENT_SPIN: string = "current_spin";
    static TIME_GET_SPIN: string = "time_get_spin";
    static DATA_GET_MORE_SPIN: string = "data_get_more_spin";
    static DATA_INVITE_FRIEND: string = "data_invite_friend";
    static getItem(name: string) {
        return dataGame.get(name);
    }

    static setItem(name: string, params: any) {
        // console.log(name, " : ", params);
        // if (name == LocalStorage.COUNT_PLAY_FRIEND) {
        //     MainData.instance().countPlayFriends = params;
        // }
        // if (name == LocalStorage.DAILY_COLLECT) {
        //     MainData.instance().dailyInfo.collected = params;
        // }
        // if (name == LocalStorage.CURRENT_DAILY_COLLECT) {
        //     if (params < 1) params = 1;
        //     MainData.instance().dailyInfo.day = params;
        // }
        if (name == LocalStorage.CURRENT_GOLD) {
            MainData.instance().goldPlayer = params;
        }
        if (name == LocalStorage.BOOSTER_ROCKET) {
            MainData.instance().amountBooster[BOOSTER.rocket] = params;
        }
        if (name == LocalStorage.BOOSTER_BOMB) {
            MainData.instance().amountBooster[BOOSTER.bomb] = params;
        }
        if (name == LocalStorage.BOOSTER_REVERSE) {
            MainData.instance().amountBooster[BOOSTER.reverse] = params;
        }
        if (name == LocalStorage.BOOSTER_HAMMER) {
            MainData.instance().amountBooster[BOOSTER.hammer] = params;
        }
        if (name == LocalStorage.CURRENT_SPIN) {
            MainData.instance().currentSpin = params;
        }
        if (name == LocalStorage.TOTAL_COLLECT_SPIN) {
            MainData.instance().total_collect_spin = params;
        }
        if (name == LocalStorage.DATA_GET_MORE_SPIN) {
            MainData.instance().dataGetMoreSpin = params;
        }
        if (name == LocalStorage.DATA_INVITE_FRIEND) {
            MainData.instance().dataInviteFriend = params;
        }
        if (name == LocalStorage.TIME_GET_SPIN) {
            MainData.instance().totalTimeGetSpin = 1800;
        }

        dataGame.set(name, params);
        FaceBook.setDataAsync(name, params);
        cc.sys.localStorage.setItem(name, String(params));
    }
    static setSound(isOn: boolean) {
        LocalStorage.setItem(LocalStorage.SOUND, isOn);
    }

    static getSound() {
        if (LocalStorage.getItem(LocalStorage.SOUND) == undefined || LocalStorage.getItem(LocalStorage.SOUND) == null)
            LocalStorage.setItem(LocalStorage.SOUND, true);
        return LocalStorage.getItem(LocalStorage.SOUND);
    }
    static setMusic(isOn: boolean) {
        this.setItem(LocalStorage.MUSIC, isOn);
        // if (isOn == false) {
        //     SoundManager.instance().stopMusic();
        // } else {
        //     SoundManager.instance().playSoungBg();
        // }
    }
    static getMusic() {
        if (LocalStorage.getItem(LocalStorage.MUSIC) == undefined || LocalStorage.getItem(LocalStorage.MUSIC) == null)
            LocalStorage.setItem(LocalStorage.MUSIC, true);
        return LocalStorage.getItem(LocalStorage.MUSIC);
    }
}
