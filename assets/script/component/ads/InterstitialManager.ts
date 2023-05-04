import { Utils } from "../component/Utils";
import GlobalEvent from "../event/GlobalEvent";
import MainData from "../storage/MainData";


var INSTANCE:InterstitialManager = null;

class InterstitialManager {
	inited = false;
	adInstance = null;
	ready = false;
	loading = false;
	blocked = false;   
	interstitialCounter = 0;
	lastShowingTime = 0;
	//maxShow = 3;
    maxShow = 999;
	interstitialDate = "";
    interids = "511146747820468_514458497489293";   
    isShowShortCut = false;    
    constructor() {
        this.inited = false;
        this.adInstance = null;
        this.ready = false;
        this.loading = false;
        this.blocked = false;
        this.interstitialCounter = 0;
        this.lastShowingTime = 0;
        this.maxShow = 999;
    }

    static get instance() {
        if (!INSTANCE)
            INSTANCE = new InterstitialManager();
        return INSTANCE;
    }

    init() {     
        if(MainData.instance().isTest == true) return;
        if(typeof FBInstant == undefined) return;
        if (!this.inited) {
            FBInstant.player.getDataAsync(['interstitialDate', 'interstitialCounter', 'lastShowingTime'])
                .then((data) => {
                    if (!this.inited) {
                        this.inited = true;
                        this.interstitialDate = Utils.getSqlDate();
                        var ok = false;
                        if (data['lastShowingTime'])
                            this.lastShowingTime = parseInt(data['lastShowingTime']);
                        if (data['interstitialDate']) {
                            if (data['interstitialCounter'])
                                this.interstitialCounter = parseInt(data['interstitialCounter']);
                            if (data['interstitialDate'] != this.interstitialDate) {
                                this.interstitialCounter = 0;
                                ok = true;
                            }
                        } else
                            ok = true;
                        if (ok) {
                            FBInstant.player.setDataAsync({
                                interstitialDate: this.interstitialDate,
                                interstitialCounter: this.interstitialCounter
                            });
                        }
                        this.load();
                    }
                })
                .catch(() => {
                    setTimeout(() => {
                        InterstitialManager.instance.init();
                    }, 5000);
                });
        } else {
            this.load();
        }
    }

    load() {       
        if(MainData.instance().isTest == true) return;
        if(typeof FBInstant == undefined) return;
        if (this.interstitialCounter >= this.maxShow)
            return;
        if (!this.ready && !this.loading) {
            this.loading = true;           
            this.loadNormalInterstitial()
        }
    }
    loadNormalInterstitial(){
        FBInstant.getInterstitialAdAsync(this.interids)
        .then((interstitial) => {
            this.adInstance = interstitial;
            return this.adInstance.loadAsync();
        }).then(() => {
            this.loading = false;
            this.ready = true;
        }).catch((error) => {
            this.handleLoadError(error, 2);
        });
    }

    handleLoadError(error, attemptNumber) {
        //console.log(error);
        setTimeout(() => {
            if (this.adInstance != null)
                this.handleAdsNoFill(attemptNumber);
        }, 30000);
    }

    handleAdsNoFill(retryNumber) {
        if (retryNumber > 3)
            this.blocked = true;
        else {
            this.adInstance.loadAsync()
                .then(() => {
                    this.loading = false;
                    this.ready = true;
                })
                .catch((error) => {
                    this.handleLoadError(error, retryNumber + 1);
                });
        }
    }

    show() {       
        if(MainData.instance().isTest == true) return;
        if(typeof FBInstant == undefined) return;
        if (this.interstitialCounter >= this.maxShow) return;                 
        if (this.ready) {
            this.adInstance.showAsync()
                .then(() => {                   
                    this.adInstance = null;
                    this.ready = false;
                    this.interstitialCounter = this.interstitialCounter + 1;
                    this.lastShowingTime = new Date().getTime();
                    FBInstant.player.setDataAsync({
                        interstitialCounter: this.interstitialCounter,
                        lastShowingTime: this.lastShowingTime
                    });                   
                    this.checkShowShortCut();
                })
                .catch((error) => {
                    this.adInstance = null;
                    this.ready = false;
                    this.lastShowingTime = new Date().getTime();
                    FBInstant.player.setDataAsync({                       
                        lastShowingTime: this.lastShowingTime
                    });                      
                    this.checkShowShortCut();
                })
        }else{
            this.checkShowShortCut();
        }
    }
    checkShowShortCut() {
        this.init();
        if(this.isShowShortCut == true) {
            GlobalEvent.instance().dispatchEvent(GlobalEvent.SHOW_ADS_INTER_COMPLETE);
            return;
        }            
        this.isShowShortCut = true;
        FBInstant.canCreateShortcutAsync()
            .then( (canCreateShortcut) =>{
                if (canCreateShortcut) {
                    FBInstant.createShortcutAsync()
                        .then(() => {                          
                            GlobalEvent.instance().dispatchEvent(GlobalEvent.SHOW_ADS_INTER_COMPLETE);
                        })
                        .catch( () =>{                           
                            GlobalEvent.instance().dispatchEvent(GlobalEvent.SHOW_ADS_INTER_COMPLETE);
                        });
                }else{
                    GlobalEvent.instance().dispatchEvent(GlobalEvent.SHOW_ADS_INTER_COMPLETE);
                }
            });
    }
}

export default InterstitialManager;