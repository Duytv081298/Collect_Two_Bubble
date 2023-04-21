import { Utils } from "../component/Utils";
import GlobalEvent from "../event/GlobalEvent";
import MainData from "../storage/MainData";
import AdEntity from "./AdEntity";

type RewardInfo = {
	id: number,
	itemId?: number,
	type: number,
	coin?: number,
	currentDate?: string,
	watchCounter?: number
}

var _INSTANCE: RewardAds = null;

class RewardAds {
	public inited = false;
	public ready = false;
	public watchCounter = 0;
	public spinCounter = 0;
	public tourCounter = 0;
	private currentDate = "";
	private type = -1;
	private ads: AdEntity[] = [];
	private listAds = [];

	constructor() {
		this.inited = false;
		this.ready = false;
		this.watchCounter = 0;
		this.spinCounter = 0;
		this.tourCounter = 0;
		this.ads = [];
		if (typeof FBInstant !== undefined) {
			this.listAds = ["793791708976697_793795788976289"];
		} else {
			return;
		}
		for (let i = 0; i < this.listAds.length; i++) {
			let adEntity: AdEntity = new AdEntity(AdEntity.REWARD_TYPE, this.listAds[i], i == 0 ? true : false);
			adEntity.addOnLoadError(this.onLoadError.bind(this));
			adEntity.addOnLoad(this.onLoad.bind(this));
			adEntity.addOnShow(this.onShow.bind(this));
			this.ads.push(adEntity);
		}

		if (MainData.instance().isTest == true) {
			this.enableTestMode();
		}
	}

	static get instance() {
		if (!_INSTANCE)
			_INSTANCE = new RewardAds();
		return _INSTANCE;
	}

	init() {
		if (typeof FBInstant !== undefined) {
			if (this.inited || FBInstant.getSupportedAPIs().indexOf('getRewardedVideoAsync') == -1 ||
				this.listAds.length == 0) {
				return;
			}
			this.preload();
		}
	}

	preload() {
		if (MainData.instance().isTest) return;

		if (typeof FBInstant !== undefined) {
			this.getDataAsync(() => {
				if (this.listAds.length > 1) {
					if (!this.RV3Instance.blocked)
						this.RV3Instance.preload();
					else if (!this.RV2Instance.blocked)
						this.RV2Instance.preload();
					else
						this.anyPriceInstance.preload();
				} else {
					this.anyPriceInstance.preload();
				}
			});
		} else {
			// mobile
		}
	}

	enableTestMode() {
		//console.log("enableTestMode");
		if (!this.inited) {
			this.getDataAsync(() => {
				setTimeout(() => {
					this.onLoad();
				}, 1000);
			});
		}
	}

	async getDataAsync(callback) {
		FBInstant.player.getDataAsync([
			RewardAds.CURRENT_DATE,
			RewardAds.WATCH_COUNTER
		]).then((data) => {
			this.currentDate = Utils.getSqlDate();
			if (data[RewardAds.WATCH_COUNTER] !== undefined)
				this.watchCounter = parseInt(data[RewardAds.WATCH_COUNTER]);
			if (data[RewardAds.CURRENT_DATE] !== this.currentDate) {
				this.watchCounter = 0;
			}
			FBInstant.player.setDataAsync({
				[RewardAds.CURRENT_DATE]: this.currentDate,
				[RewardAds.WATCH_COUNTER]: this.watchCounter
			})

			this.inited = true;

			if (callback) callback();
		}).catch(function (error) {
			setTimeout(() => {
				this.getDataAsync(callback);
			}, 5000);
		})
	}

	onLoad() {
		if (!this.ready) {
			this.ready = true;
			GlobalEvent.instance().dispatchEvent(GlobalEvent.REWARD_ADS_ON_READY, this.ready);

		}
	}

	onLoadError(adEntity) {
		if (typeof FBInstant === undefined) return;
		if (this.listAds.length > 1) {
			if (adEntity.id == this.RV3Instance.id)
				this.RV2Instance.preload();
			else if (adEntity.id == this.RV2Instance.id)
				this.anyPriceInstance.preload();
		}
	}

	show(type: number, itemId?) {
		console.log("show: ", type);
		console.log("this.ready: ", this.ready);
		if (this.ready) {
			this.type = type;
			if (!MainData.instance().isTest) {
				for (let i = 0; i < this.listAds.length; i++) {
					if (this.ads[i].adLoaded) {
						this.ads[i].show(itemId);
						break;
					}
				}
			} else {
				this.onShow("", itemId);
			}
		} else {

		}
	}

	onShow(adId: string, itemId: string) {
		this.ready = false;
		GlobalEvent.instance().dispatchEvent(GlobalEvent.REWARD_ADS_ON_READY, this.ready);
		switch (this.type) {
			case RewardAds.REWARDED_POPUP_POSITION:
				this.watchCounter = this.watchCounter + 1;
				FBInstant.player.setDataAsync({
					[RewardAds.WATCH_COUNTER]: this.watchCounter
				})
				GlobalEvent.instance().dispatchEvent(GlobalEvent.REWARD_ADS_ON_REWARD, { type: RewardAds.REWARDED_POPUP_POSITION });
				break;
			case RewardAds.REWARDED_USE_ITEM:
				GlobalEvent.instance().dispatchEvent(GlobalEvent.REWARD_ADS_ON_REWARD, { type: RewardAds.REWARDED_USE_ITEM });
				break;
			case RewardAds.REWARDED_COIN:
				GlobalEvent.instance().dispatchEvent(GlobalEvent.REWARD_ADS_ON_REWARD, { type: RewardAds.REWARDED_COIN });
				break;
			case RewardAds.REWARDED_COIN_CONGRATULATION:
				GlobalEvent.instance().dispatchEvent(GlobalEvent.REWARD_ADS_ON_REWARD, { type: RewardAds.REWARDED_COIN_CONGRATULATION });
				break;
			case RewardAds.REWARDED_MOVE:
				GlobalEvent.instance().dispatchEvent(GlobalEvent.REWARD_ADS_ON_REWARD, { type: RewardAds.REWARDED_MOVE });
			case RewardAds.REWARDED_BOOSTER:
				GlobalEvent.instance().dispatchEvent(GlobalEvent.REWARD_ADS_ON_REWARD, { type: RewardAds.REWARDED_BOOSTER });
				break;
			default:
				break;
		}

		if (MainData.instance().isTest) {
			setTimeout(() => {
				this.onLoad();
			}, 1000);
		}
	}
	get anyPriceInstance() {
		return this.ads[0];
	}

	get RV2Instance() {
		return this.ads[1];
	}

	get RV3Instance() {
		return this.ads[2];
	}

	static get WATCH_COUNTER() {
		return "watchCounter"
	}

	static get CURRENT_DATE() {
		return "currentDate"
	}

	static get ON_REWARD() {
		return "onReward";
	}

	static get ON_READY() {
		return "onReady";
	}

	static get REWARDED_POPUP_POSITION() {
		return 1;
	}
	static get REWARDED_USE_ITEM() {
		return 2;
	}
	static get REWARDED_COIN() {
		return 3;
	}
	static get REWARDED_COIN_CONGRATULATION() {
		return 4;
	}
	static get REWARDED_MOVE() {
		return 5;
	}
	static get DAILY_POSITION() {
		return 6;
	}

	static get REWARDED_BOOSTER() {
		return 7;
	}

}

export default RewardAds;
