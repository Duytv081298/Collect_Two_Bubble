import MainData from "../storage/MainData";

var INSTANCE:BannerAds = null;

class BannerAds {
    static get instance() {
        if (!INSTANCE)
            INSTANCE = new BannerAds();
        return INSTANCE;
    }
    inited = false;
    loading = false;
    init(){
        if(MainData.instance().isTest == true) return;
        if(typeof FBInstant == undefined) return;
        if(this.inited == true) return;
        if(this.loading == true) return;
        this.loading = true;
        FBInstant.loadBannerAdAsync(
            '511146747820468_514928207442322'
          ).then(() => {   
            this.loading = false;   
            this.inited = true;
        });
    }
}
export default BannerAds;