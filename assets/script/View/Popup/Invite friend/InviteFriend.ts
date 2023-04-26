import SoundManager from "../../../component/component/SoundManager";
import GlobalEvent from "../../../component/event/GlobalEvent";
import FaceBook from "../../../component/package/FaceBook";
import LocalStorage from "../../../component/storage/LocalStorage";
import MainData from "../../../component/storage/MainData";

const { ccclass, property } = cc._decorator;

@ccclass
export class inviteFriend extends cc.Component {

    protected onLoad(): void {
        GlobalEvent.instance().addEventListener(GlobalEvent.SHOW_INVITE_FRIEND_POPUP, this.show, this);
    }
    protected onDestroy(): void {
        GlobalEvent.instance().removeEventListener(GlobalEvent.SHOW_INVITE_FRIEND_POPUP, this.show, this);
    }

    show(){
        this.node.active = true;
    }

    update(deltaTime: number) {

    }
    onHandlerInviteFriends() {
        SoundManager.instance().playEffect("button");
        if (window["FBInstant"] == undefined) return;

        // FaceBook.logEvent(LogEventName.clickBtnInvite)
        FBInstant.context
            .chooseAsync()
            .then(() => {
                let contextId = FBInstant.context.getID();
                if (MainData.instance().dataInviteFriend.hasOwnProperty(contextId)) {
                } else {
                    MainData.instance().dataInviteFriend[contextId] = 1;
                    LocalStorage.setItem(LocalStorage.DATA_INVITE_FRIEND, MainData.instance().dataInviteFriend);
                    
                    MainData.instance().updateGold(500);
                    GlobalEvent.instance().dispatchEvent(GlobalEvent.UPDATE_GOLD_GAME);
                }
                cc.resources.load(FaceBook.getImageShareFacebook(), (err, texture) => {
                    FBInstant.updateAsync({
                        action: 'CUSTOM',
                        cta: 'Play',
                        image: FaceBook.getImgBase64(texture),
                        text: '\"' + FBInstant.player.getName() + '\"' + ' ' + "Mời chơi",
                        template: 'challenge',
                        data: {
                        },
                        strategy: 'IMMEDIATE'
                    })
                })

            })
    }
    hide() {
        SoundManager.instance().playEffect("button");
        this.node.active = false;
    }
}


