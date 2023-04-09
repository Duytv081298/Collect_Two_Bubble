

class AdEntity {
    public id = null;
    public type = "";
    public isAnyPrice = null;
    public adInstance = null;
    public blocked = false;
    public adLoaded = false;

    public onLoadError : Function = null;
    public onLoad : Function = null;
    public onShow : Function = null;

    constructor(type, id, isAnyPrice) {
        this.type = type;
        this.id = id;
        this.blocked = false;
        this.adLoaded = false;
        this.adInstance = null;
        this.isAnyPrice = isAnyPrice;
    }

    addOnLoadError(callback){
        this.onLoadError = callback;
    }

    addOnLoad(callback){
        this.onLoad = callback;
    }
    
    addOnShow(callback){
        this.onShow = callback;
    }

    preload() {
        // instant game handle
        if (this.adInstance !== null) {
            this.adInstance.loadAsync()
                .then(() => {
                    this.handleLoadSuccess();
                })
                .catch((error) => {
                    this.handleLoadError(error, 2);
                });
        } else {
            if(typeof FBInstant === undefined) return;
            if(this.type == AdEntity.REWARD_TYPE){
                FBInstant.getRewardedVideoAsync(this.id)
                .then((rewardedVideo) => {
                    this.adInstance = rewardedVideo;
                    return this.adInstance.loadAsync();
                })
                .then(() => {
                    this.handleLoadSuccess();
                })
                .catch((error) => {
                    //console.log("error reward : ", error)
                    this.handleLoadError(error, 2);
                });
            }else if(this.type == AdEntity.INTERSTITIAL_TYPE){
                FBInstant.getInterstitialAdAsync(this.id)
                .then((interstitial) => {
                    this.adInstance = interstitial;
                    return this.adInstance.loadAsync();
                })
                .then(() => {
                    this.handleLoadSuccess();
                })
                .catch((error) => {
                    //console.log("error inter : ", error)
                    this.handleLoadError(error, 2);
                });
            }
            
        }
    }

    handleLoadSuccess() {
        //console.log("load sucess")
        this.adLoaded = true;
        if(this.onLoad) this.onLoad();
    }

    handleLoadError(error, attemptNumber) {
        //console.log("reward error : ", error)
        if (this.isAnyPrice) {
            setTimeout(() => {
                try {
                    if (this.adInstance != null)
                        this.handleAdsNoFill(attemptNumber);
                } catch (error) {
                    
                }
                
            }, 30000);
        } else
            this.blocked = true;
        if(this.onLoadError) this.onLoadError(error);
    }

    handleAdsNoFill(retryNumber) {
        if (retryNumber > 3)            
            this.blocked = true;
        else {
            this.adInstance.loadAsync()
                .then(() => {
                    this.handleLoadSuccess();
                })
                .catch((error) => {
                    this.handleLoadError(error, retryNumber + 1);
                });
        }
    }

    show(itemId?) {
        // if(typeof FBInstant === undefined) return;
        // SoundManager.instance().setVolum(0);
        // this.adInstance.showAsync()
        //     .then(() => {
        //         // reset data
        //         SoundManager.instance().setVolum(1);
        //         this.adInstance = null;
        //         this.adLoaded = false;                
        //         if(this.onShow) this.onShow(this.id, itemId);               
        //         setTimeout(() => {
        //             this.preload();
        //         }, 1000);
        //     })
        //     .catch((error) => {
        //         SoundManager.instance().setVolum(1);
        //         this.adInstance = null;
        //         this.adLoaded = false;
        //         this.showErrorPopup(error);
        //         setTimeout(() => {
        //             this.preload();
        //         }, 1000);
        //     })
    }

    showErrorPopup(error) {        
        if (error && error.message) {
            // show notification error ad
        }
    }

    static get REWARD_TYPE(){
        return "reward_type";
    }

    static get INTERSTITIAL_TYPE(){
        return "interstitial_type";
    }

}
export default AdEntity;
