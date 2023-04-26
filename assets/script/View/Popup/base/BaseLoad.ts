// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import GlobalEvent from "../../../component/event/GlobalEvent";

const { ccclass, property } = cc._decorator;
export class DataScreen {
    url = "";
    namePrefab = "";
    dispatchEvent = "";
    constructor(namePrefab: string, url: string, dispatchEvent: string) {
        this.url = url;
        this.namePrefab = namePrefab;
        this.dispatchEvent = dispatchEvent;
    };

}
@ccclass()
export default class BaseLoad extends cc.Component {
    arrScreen: Map<string, cc.Node> = new Map(); //nhung screen da load
    arrPreLoading: Map<string, DataScreen> = new Map(); //nhung screen dang load
    arrStartLoad: Map<string, DataScreen> = new Map();
    arrPreload = []; //nhung screen se preload
    ktLoadingPreload = false;

    preLoad(dataScreen: DataScreen) {
        if (this.ktLoadingPreload == false) {
            this.ktLoadingPreload = true;
            this.beginPreLoad(dataScreen);
        } else {
            this.arrPreload.push(dataScreen);
        }
    }
    beginPreLoad(dataScreen: DataScreen) {
        console.log("beginPreLoad: ", dataScreen.namePrefab);
        if (this.arrScreen.has(dataScreen.namePrefab) == true) return;
        if (this.arrPreLoading.has(dataScreen.namePrefab) == true) return;
        if (this.arrStartLoad.has(dataScreen.namePrefab) == true) return;
        this.arrPreLoading.set(dataScreen.namePrefab, dataScreen);
        cc.resources.preload(dataScreen.url, cc.Prefab, (err) => {
            this.startLoad(dataScreen, null, false);
            if (this.arrPreload.length > 0) {
                let bundleData = this.arrPreload[0];
                this.beginPreLoad(bundleData);
                this.arrPreload.splice(0, 1);
            } else {
                this.ktLoadingPreload = false;
            }
        });
    }

    startLoad(dataScreen: DataScreen, data: any = null, isShow = true) {
        if (this.arrScreen.has(dataScreen.namePrefab) == true) return;
        if (this.arrStartLoad.has(dataScreen.namePrefab) == true) return;
        this.arrStartLoad.set(dataScreen.namePrefab, dataScreen);
        cc.resources.load(dataScreen.url, cc.Prefab, (err, prefab: cc.Prefab) => {
            if (!err) {
                console.log("loadcomplete: ", dataScreen.namePrefab);
                let item = cc.instantiate(prefab);
                this.arrScreen.set(dataScreen.namePrefab, item);              
                this.node.addChild(item);
                item.active = false;
                if (isShow == true) {
                    GlobalEvent.instance().dispatchEvent(dataScreen.dispatchEvent, data);
                }
            }
        });
    }

    checkLoadBundle(dataScreen: DataScreen, data: any = null, isShow: boolean = true) {
        console.log("checkLoadBundle: ", dataScreen);
        if (isShow == true) {            
            GlobalEvent.instance().dispatchEvent(GlobalEvent.SHOW_LOADING);
            this.startLoad(dataScreen, data);
        } else {
            this.preLoad(dataScreen);
        }
    }
}
