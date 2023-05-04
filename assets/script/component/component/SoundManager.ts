
import LocalStorage from "../storage/LocalStorage";
import { Utils } from "./Utils";
const { ccclass, property } = cc._decorator;
@ccclass
export default class SoundManager {
    private static soundManager: SoundManager;
    clips: Map<string, cc.AudioClip> = new Map();
    public static instance(): SoundManager {
        if (!SoundManager.soundManager) {
            SoundManager.soundManager = new SoundManager();
            SoundManager.soundManager.onLoad();
        }
        return SoundManager.soundManager;
    }

    isFirst = true;
    onLoad() {
        cc.audioEngine.setEffectsVolume(0.7);
        cc.audioEngine.setMusicVolume(0.7);

    }
    preLoadSound() {
        if (this.isFirst == true) {
            this.isFirst = false;
            this.loadAudioClip("Ready_go");

            this.preloadThenCreateAudioClip("Ready_go");

            this.preloadThenCreateAudioClip("button");
            this.preloadThenCreateAudioClip("Colloect _Bubble_0");
            this.preloadThenCreateAudioClip("Colloect _Bubble_1");
            this.preloadThenCreateAudioClip("Colloect _Bubble_2");
            this.preloadThenCreateAudioClip("Colloect _Bubble_3");
            this.preloadThenCreateAudioClip("Colloect _Bubble_4");
            this.preloadThenCreateAudioClip("Colloect _Bubble_5");
            this.preloadThenCreateAudioClip("Colloect _Bubble_6");
            this.preloadThenCreateAudioClip("Colloect _Bubble_7");
            this.preloadThenCreateAudioClip("Colloect _Bubble_8");
            this.preloadThenCreateAudioClip("Colloect _Bubble_9");
            this.preloadThenCreateAudioClip("Colloect _Bubble_10");
            this.preloadThenCreateAudioClip("Colloect _Bubble_11");
            this.preloadThenCreateAudioClip("Click");              // click booster
            this.preloadThenCreateAudioClip("get_coin");              //nhan coin luc end game
            this.preloadThenCreateAudioClip("GetReward");           //sau khi nhan x3   

            // this.preloadThenCreateAudioClip("lucky_spin");

            this.preloadThenCreateAudioClip("gift_xuat hien");           //du diem de an hop qua 
            this.preloadThenCreateAudioClip("TargetComplete");
            this.preloadThenCreateAudioClip("sfx_open_gift_reward");

            this.preloadThenCreateAudioClip("sfx_bubble_bounce");           //roi trong ho
            this.preloadThenCreateAudioClip("sfx_bubble _break1");           //ball va dap
            this.preloadThenCreateAudioClip("sfx_bubble_break2");           //ball va dap


            this.preloadThenCreateAudioClip("Excellent");
            this.preloadThenCreateAudioClip("good");
            this.preloadThenCreateAudioClip("Great");
            this.preloadThenCreateAudioClip("incredible");
            this.preloadThenCreateAudioClip("perfect");


            this.preloadThenCreateAudioClip("coin_xuat hien");


            this.preloadThenCreateAudioClip("sfx_item_active");

            this.preloadThenCreateAudioClip("color_bomb");
            this.preloadThenCreateAudioClip("Booster_rocket");
            this.preloadThenCreateAudioClip("booster_hammer");
            this.preloadThenCreateAudioClip("booster_chance_color");
            this.preloadThenCreateAudioClip("bubble_out_broad");

            this.preloadThenCreateAudioClip("time");



            this.preloadThenCreateAudioClip("Bubble_ho_coin");


            this.preloadThenCreateAudioClip("Vuot_doi_thu");
            this.preloadThenCreateAudioClip("ranking_win");
        }
    }
    playEffect(name: string) {
        //{name:string, repeat:boolean = false}
        if (LocalStorage.getSound() == "false" || LocalStorage.getSound() == false) return;
        if (name == "") return;
        
        let clip = this.clips.get(name);
        if (clip == undefined) {
        } else {
            cc.audioEngine.play(clip, false, 0.7);
        }
    }
    loadAudioClip(path: string) {
        cc.resources.load("sound/" + path, cc.AudioClip, (err, clip: cc.AudioClip) => {
            if (!err)
                this.addClip(path, clip);
        });

    }
    preloadThenCreateAudioClip(path: string) {
        cc.resources.preload("sound/" + path, cc.AudioClip, (preloadErr) => {
            this.loadAudioClip(path);
        });

    }
    addClip(key: string, clip: cc.AudioClip): void {
        //console.log("addClip: ", key);   
        this.clips.set(key, clip);
    }

    playMusic(data: any) {
        console.log("playMusic: ", data);
        if (LocalStorage.getSound() == "false" || LocalStorage.getSound() == false) return;
        let name = "";
        let repeat = true;
        //console.log("playMusic: ", data);
        if (typeof data === "string") {
            name = data;
        } else if (typeof data === "object") {
            name = data.name;
            repeat = data.repeat;
        }
        if (name == "") return;
        cc.resources.load(name, cc.AudioClip, (err, audio: cc.AudioClip) => {
            if (err) return //console.log('Error url [' + err + ']');     
            if (LocalStorage.getSound() == "false" || LocalStorage.getSound() == false) return;
            cc.audioEngine.playMusic(audio, repeat);
        });

    }

    setVolum(volume: number) {
        cc.audioEngine.setMusicVolume(volume);
    }
    stopMusic() {
        cc.audioEngine.stopMusic();

    }
    pauseMusic() {
        cc.audioEngine.pauseMusic();

    }
    resumeMusic() {
        cc.audioEngine.resumeMusic();
    }

    playSoungBg() {
        let isOn = LocalStorage.getMusic();
        if (isOn == "false" || isOn == false) return;
        //"sound/bgmusic",
        let arrSound = ["sound/bgmusic"]
        this.playMusic(arrSound[Utils.randomInt(0, arrSound.length - 1)]);
    }
}
