import { Utils } from "../component/Utils";

var INSTANCE: A2UController = null;
const LISTTIMEPUS = [9 * 3600, 11 * 3600, 13 * 3600, 15 * 3600, 17 * 3600, 19 * 3600, 21 * 3600]
class A2UController {
    static get instance() {
        if (!INSTANCE)
            INSTANCE = new A2UController();
        return INSTANCE;
    }


    sendNotification() {
        FBInstant.player.getASIDAsync().then((asid) => {
            this.cancelAllNotifications(asid);
        })
    }
    sendNotificationComeBack(count, asid) {
        var listTime = [];
        for (let i = 0; i < LISTTIMEPUS.length; i++) {
            if (Utils.randomInt(0, 1) == 0)
                listTime.push(LISTTIMEPUS[i] + 86400 * 3)
            else listTime.push(LISTTIMEPUS[i] + 86400 * 7)
        }
        var currTime = Utils.getSecondInDay()
        var arrStrComeBack = [
            "🎉We haven't seen you in a while. Comeback to us! We miss you!",
            "We hope to see you soon! 🎉 Your spin is ready! Comeback and collect it💝",
            "We are have been waiting 🛎 for you! Did you forget your login bonuses 💝??",
            "🛎Your friends miss playing with you. We hope to see you soon!",
            "It's been a few days. Log in now and join the fun!",
            "We miss you so hard! Your rewards are waiting for you.",
            "Your friend is waiting for you. We are waiting for you. Don't miss out on the fun!",
            "Your game world misses you. Rejoin and continue your journey to glory.",
            "It's been a week! Play now and earn rewards to upgrade your game experience!",
            "You're missing all the fun! Join now and see what you've been missing.",
            "Your friends are eager to play with you. Join now and compete for high score.",
        ]
        var indexTime = 0;
        var timePush = listTime[indexTime] - currTime;
        var indexMessage = Math.floor(Math.random() * arrStrComeBack.length);
        var message = arrStrComeBack[indexMessage];

        this.sendNotificationDelay(asid, "Daily Gift", message, timePush);
        for (let i = 0; i < count - 1; i++) {
            var newIndexTime = Math.floor(Math.random() * listTime.length);
            while (indexTime == newIndexTime) {
                newIndexTime = Math.floor(Math.random() * listTime.length);
            }
            indexTime = newIndexTime;

            var newIndexMessage = Math.floor(Math.random() * arrStrComeBack.length);
            while (indexMessage == newIndexMessage) {
                newIndexMessage = Math.floor(Math.random() * arrStrComeBack.length);
            }
            indexMessage = newIndexMessage;
            timePush = listTime[indexTime] - currTime;
            message = arrStrComeBack[indexMessage];
            this.sendNotificationDelay(asid, "Come back!", message, timePush);
        }
    }
    sendNotificationDaily(count, asid, listTime) {

        var currTime = Utils.getSecondInDay()
        var arrStrDaily = [
            "🎁Don't forget to claim your daily gift. Enjoy your rewards and have a nice day!",
            "Your daily gift 🎁 is waiting! Don't miss out on your chance to earn rewards!",
            "Your 💝 daily gift💝  is a small token of our appreciation. Log in now and claim it!",
            "🎉Your daily gift is waiting for you. Claim it now to beat your high score.",
            "Keep claiming your daily gifts and watch your rewards pile up. Enjoy the rewards!"
        ]
        var indexTime = 0;
        var timePush = listTime[indexTime] - currTime;
        var indexMessage = Math.floor(Math.random() * arrStrDaily.length);
        var message = arrStrDaily[indexMessage];
        console.log("send Notification time: " + "   time: " + listTime[indexTime] / 3600);
        this.sendNotificationDelay(asid, "Daily Gift", message, timePush);
        for (let i = 0; i < count - 1; i++) {
            var newIndexTime = Math.floor(Math.random() * listTime.length);
            while (indexTime == newIndexTime) {
                newIndexTime = Math.floor(Math.random() * listTime.length);
            }
            indexTime = newIndexTime;

            var newIndexMessage = Math.floor(Math.random() * arrStrDaily.length);
            while (indexMessage == newIndexMessage) {
                newIndexMessage = Math.floor(Math.random() * arrStrDaily.length);
            }
            indexMessage = newIndexMessage;
            timePush = listTime[indexTime] - currTime;
            message = arrStrDaily[indexMessage];
            console.log("send Notification time: " + "   time: " + listTime[indexTime] / 3600);
            this.sendNotificationDelay(asid, "Daily Gift", message, timePush);
        }
    }
    sendNotificationDelay(asid, title, message, time) {
        console.log({
            "asid": asid,
            "title": title,
            "message": message,
            "time": time
        });

        FBInstant.graphApi.requestAsync('/' + asid + '/notifications', 'POST', {
            "schedule_interval": time,
            "href": "?giftId=12",
            "template": message,
            "message": {
                "title": title,
                "body": message,
                "media_url": "https://cybergame.live/public/reminders/1.png"
            }
        }).then(result => {
            console.log(result)
        });

    }

    cancelAllNotifications(asid) {
        console.log("cancelAllNotifications");
        
        FBInstant.graphApi.requestAsync('/' + asid + '/cancel_all_notifications', 'POST'
        ).then(result => {
            console.log("cancelAllNotifications: =======");
            
            console.log(result);
            
            var currTime = Utils.getSecondInDay()
            var listNextTime = LISTTIMEPUS.filter(time => time > currTime);

            var countDaily = listNextTime.length >= 3 ? 3 : listNextTime.length;

            this.sendNotificationDaily(countDaily, asid, listNextTime);
            this.sendNotificationComeBack(5 - countDaily, asid);
        });
    }

}
export default A2UController;