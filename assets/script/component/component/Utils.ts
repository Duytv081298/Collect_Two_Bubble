import Bubble from "../../View/scene/game/item/Bubble";


export class Utils {
    static shuffle(arr: any[]) {
        for (let i = 0; i < arr.length; i++) {
            let rd1 = Utils.randomInt(0, arr.length - 1);
            let rd2 = Utils.randomInt(0, arr.length - 1);
            let temp = arr[rd1];
            arr[rd1] = arr[rd2];
            arr[rd2] = temp;
        }
    }
    

    static getDistance(p1: cc.Vec3, p2: cc.Vec3) {
        var a = p1.x - p2.x;
        var b = p1.y - p2.y;
        return Math.sqrt(a * a + b * b);
    }
    static getAngle(dot0: Bubble, dot1: Bubble): number {
        let x = dot1.col - dot0.col;
        let y = dot1.row - dot0.row;
        if (x == 1 && y == 0) return 0;
        else if (x == 1 && y == -1) return 45;
        else if (x == 0 && y == -1) return 90;
        else if (x == -1 && y == -1) return 135;
        else if (x == -1 && y == 0) return 180;
        else if (x == -1 && y == 1) return 225;
        else if (x == 0 && y == 1) return 270;
        else if (x == 1 && y == 1) return 317;
        else return 0;
    }
    static randomInt(low: number, high: number): number {
        return Math.floor(Math.random() * (1 + high - low) + low);
    }
    static getSqlDate() {
        let date = new Date();
        return new Date(date.getTime() - (date.getTimezoneOffset() * 60000)).toISOString().split("T")[0];
    }

    static twoBezier(t: number, p1: cc.Vec3, cp: cc.Vec3, p2: cc.Vec3): cc.Vec3 {
        let x = (1 - t) * (1 - t) * p1.x + 2 * t * (1 - t) * cp.x + t * t * p2.x;
        let y = (1 - t) * (1 - t) * p1.y + 2 * t * (1 - t) * cp.y + t * t * p2.y;
        return new cc.Vec3(x, y, 0);
    }
    static formatCurrency(num) {
        if (isNaN(num)) return "0";

        let str = "";
        let tmp = Math.abs(num).toString();

        for (let i = 0; i < tmp.length; i++) {
            if (((i % 3) === 0) && (i > 0)) {
                str = "," + str;
            }
            str = tmp.charAt(tmp.length - i - 1) + str;
        }

        if (num < 0) {
            return ("-" + str);
        }
        return str;
    }
    static formatCurrency2(num) {
        //cc.log("numBet: " + num);
        num = Number(num);
        let ext = ["K", "M", "B"];
        let range = [1000, 1000000, 1000000000];

        let str = "";
        let tmp = Math.abs(num);

        for (let i = range.length - 1; i >= 0; i--) {
            if (tmp >= range[i]) {
                str = ((Utils.roundNumber(tmp / range[i], 2, 1)) + ext[i]).toString();
                break;
            }
        }

        // in case value of 'tmp' is less than the minimum value in the range-list
        if (str == "") {
            str = tmp.toString();
        }
        str = str.replace(".", ",");
        //cc.log(str);
        if (num < 0) {
            return ("-" + str);
        }

        return str;
    }
    static roundNumber(num: number, precision: number, type: number) {
        if (precision < 0) precision = 0;
        let tmp = Math.pow(10, precision);
        if (type === 1)
            return parseInt(String(num * tmp)) / tmp;
        return Math.round(num * tmp) / tmp;
    }
    static convertTimeToText(duration) {
        let t = duration;
        let gio = Math.floor(t / 60 / 60);
        let hours: string = "0" + gio;
        t = t - (gio * 3600);
        let phut = Math.floor(t / 60);
        let minutes: string = "0" + phut;
        t = t - phut * 60;
        let giay = t;
        let seconds: string = "0" + giay;
        let formattedTime = "";
        if (phut > 0) {
            formattedTime = minutes.substr(-2) + ':' + seconds.substr(-2) + "";
        } else {
            formattedTime = "00:" + seconds.substr(-2) + "";
        }
        return formattedTime;
    }
    static getSecondInDay() {
        const date = new Date();
        return date.getHours() * 3600 + date.getMinutes() * 60;
    }

    static  shortenLargeNumber(num: number, digits: number): any {
        var units = ['K', 'M'],
            decimal: number;
        for (var i = units.length - 1; i >= 0; i--) {
            decimal = Math.pow(1000, i + 1);
            if (num <= -decimal || num >= decimal)
                return +(num / decimal).toFixed(digits) + units[i];
        }
        return num;
    }
}