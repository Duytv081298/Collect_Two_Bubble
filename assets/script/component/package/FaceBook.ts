import { Utils } from "../component/Utils";
import SharePictureScore1 from "../share/SharePictureScore1";
import MainData from "../storage/MainData";
export default class FaceBook {
    static getPhoto() {
        if (window["FBInstant"] !== undefined) {
            return FBInstant.player.getPhoto();
        } else {
            return "";
        }
    }
    static getName() {
        if (window["FBInstant"] !== undefined) {
            return FBInstant.player.getName();
        } else {
            return "";
        }
    }
    static getID() {
        if (window["FBInstant"] !== undefined) {
            return FBInstant.player.getID();
        } else {
            return "";
        }
    }
    static startAsync() {
        if (window["FBInstant"] !== undefined) {
            FBInstant.startGameAsync();
        }
    }
    static setDataAsync(name: string, params: string) {
        if (window["FBInstant"] !== undefined) {
            FBInstant.player.setDataAsync({
                [name]: params
            })
        }
    }
    static getImgBase64(_texture) {
        let target = cc.find('Canvas');
        let width = 600, height = 315;
        let canvas = document.createElement('canvas');
        let ctx = canvas.getContext('2d');
        canvas.width = width;
        canvas.height = height;
        let image = _texture.getHtmlElementObj();
        ctx.drawImage(image, 0, 0);
        return canvas.toDataURL('image/png');
    }
    static getImageShareFacebook(): string {
        let arrShare = ["image/banner_share_tour_1", "image/banner_share_tour_2"];
        return arrShare[Utils.randomInt(0, arrShare.length - 1)]
    }

    static getMoreSpin(contextId) {
        let arrStr = [
            FBInstant.player.getName() + " Please help me get spins. Thanks!",
            FBInstant.player.getName() + " need more spins, can you help?",
            FBInstant.player.getName() + " Help me earn spins, please. Thanks!",
            FBInstant.player.getName() + " want more spins? your help appreciated!"
        ]

        cc.resources.load("image/spin/texture", (err, texture) => {
            FBInstant.updateAsync({
                action: 'CUSTOM',
                cta: 'Play',
                image: FaceBook.getImgBase64(texture),
                text: arrStr[Utils.randomInt(0, arrStr.length - 1)],
                template: 'challenge',
                data: {
                    type: "get_more_spin",
                    id: FBInstant.player.getID(),
                    avatar: FBInstant.player.getPhoto(),
                    name: FBInstant.player.getName()
                },
                strategy: 'IMMEDIATE'
            })
        });
    }

    static shareAttack(contextId) {

        if (window["FBInstant"] !== undefined) {
            let arrStr = [
                "Can't believe your friend destroyed your reward!",
                FBInstant.player.getName() + " ruined  your prize. Devastated!",
                "Reward destroyed by " + FBInstant.player.getName() + " . Feeling betrayed.",
                FBInstant.player.getName() + " wrecked your treasure. Heartbroken"
            ]

            cc.resources.load("image/spin/texture", (err, texture) => {
                FBInstant.updateAsync({
                    action: 'CUSTOM',
                    cta: 'Play',
                    image: FaceBook.getImgBase64(texture),
                    text: arrStr[Utils.randomInt(0, arrStr.length - 1)],
                    template: 'challenge',
                    data: {
                        type: "get_more_spin",
                        id: FBInstant.player.getID(),
                        avatar: FBInstant.player.getPhoto(),
                        name: FBInstant.player.getName()
                    },
                    strategy: 'IMMEDIATE'
                })
            });
        }
    }



    static showAvatarMe(avatar: cc.Sprite) {
        if (MainData.instance().avatarMe) {
            avatar.getComponent(cc.Sprite).spriteFrame = MainData.instance().avatarMe;
            return;
        }

        let urlImage = FaceBook.getPhoto();

        if (urlImage == "" || urlImage == null) {
        } else {
            cc.assetManager.loadRemote(urlImage, { ext: '.jpg' }, (err, imageAsset: cc.Texture2D) => {
                if (imageAsset == null) {
                    return;
                }
                if (err) {
                    return;
                }
                const spriteFrame = new cc.SpriteFrame(imageAsset);
                avatar.getComponent(cc.Sprite).spriteFrame = spriteFrame;
                MainData.instance().avatarMe = spriteFrame;
            });
        }
    }

    static shareScore(score: number) {
        if (window["FBInstant"] !== undefined) {
            let arrStr = [
                FBInstant.player.getName() + " got " + score + " score. Can you beat them",
                FBInstant.player.getName() + "/'s score is unbeatable. Want to give it a try",
                FBInstant.player.getName() + " get " + score + " score ! so easy! play it again.",
                FBInstant.player.getName() + " get " + score + " scores! So easy! Can you?"
            ]
            let shareImage = new SharePictureScore1(score, (dataImage) => {
                if (dataImage == null) {
                    return;
                }
                FBInstant.updateAsync({
                    action: 'CUSTOM',
                    cta: 'Play',
                    image: dataImage,
                    text: arrStr[Utils.randomInt(0, arrStr.length - 1)],
                    template: 'challenge',
                    data: {
                        challenge: true,
                        id: FBInstant.player.getID(),
                        score: score,
                        avatar: FBInstant.player.getPhoto(),
                        name: FBInstant.player.getName()
                    },
                    strategy: 'IMMEDIATE'
                }).then(() => {
                }).catch(() => {
                });

            })
        }
    }


    static shareTournament(score: number, callFunction: Function, target: Object) {
        // if (window["FBInstant"] !== undefined) {
        //     let shareImage = new SharePictureTournament(score, (dataImage) => {
        //         if (dataImage == null) {
        //             callFunction.call(target);
        //             return;
        //         }
        //         let tomorrow = new Date();
        //         tomorrow.setDate(tomorrow.getDate() + 1);
        //         let endTime = Math.floor(tomorrow.getTime() / 1000);
        //         try {
        //             FBInstant.tournament.createAsync(
        //                 {
        //                     initialScore: score,
        //                     data: {
        //                     },
        //                     config: {
        //                         title: 'Tournament',
        //                         image: dataImage,
        //                         sortOrder: 'HIGHER_IS_BETTER',
        //                         scoreFormat: 'NUMERIC',
        //                         endTime: endTime
        //                     },
        //                 }).then(() => {
        //                     callFunction.call(target);
        //                 }).catch(() => {
        //                     callFunction.call(target)
        //                 });
        //         } catch (error) {
        //             callFunction.call(target)
        //         }
        //     });
        // }
    }
    static callTutorial() {
        // if (window["FBInstant"] !== undefined) {
        //     let contextId = FBInstant.context.getID();
        //     if (contextId == null) {
        //         try {
        //             FBInstant.getTournamentAsync().then((tournament) => {
        //                 // console.log("tournament: ", tournament);
        //                 MainData.instance().ktJoinTour = true;
        //             }).catch((err) => {
        //                 if (MainData.instance().isFistJoinTour == true) {
        //                     MainData.instance().isFistJoinTour = false;
        //                     let tourID = MainData.instance().idTour;
        //                     FBInstant.tournament
        //                         .joinAsync(tourID)
        //                         .then(() => {
        //                             MainData.instance().ktJoinTour = true;
        //                         }).catch((err) => {
        //                             MainData.instance().ktJoinTour = false;
        //                         });
        //                 }
        //             });
        //         } catch (error) {

        //         }
        //     }

        // }
    }

    static callSubscribeBot() {
        FBInstant.player.canSubscribeBotAsync().then((can_subscribe) => {
            if (can_subscribe) {
                FBInstant.player.subscribeBotAsync();
            }
        });
    }
    static logEvent(eventName: string, valueToSum: number = 1) {
        if (window["FBInstant"] == undefined) return;
        FBInstant.logEvent(
            eventName,
            valueToSum,
            {}
        );
    }
}