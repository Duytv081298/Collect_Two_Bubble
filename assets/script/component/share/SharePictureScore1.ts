import FaceBook from "../package/FaceBook";

const yourWidth = 150;
const yourPOSY = 145;
const yourX = 307;

export default class SharePictureScore1 {

    private imgList: any = null;

    private loaderCount: number = 0;
    private callback: Function = null;
    protected score: number = 0;
    constructor(score: number, callback: Function) {
        console.log("SharePictureScore1");
        this.score = score;
        this.imgList = {};
        this.loaderCount = 0;
        this.callback = callback;
        this.imgLoader(FaceBook.getPhoto(), "avatar");
        this.imgLoader("images/shareScore.jpg", "bg")
    }

    imgLoader(texture: string, e: string) {
        var self = this, image = new Image;
        image.crossOrigin = "anonymous";
        image.src = texture;
        this.loaderCount += 1;
        image.onload = () => {
            self.imgList[e] = image;
            self.loadCallback();
        }
        image.onerror = () => {
            this.callback(null);
        }
    }

    loadCallback() {
        this.loaderCount -= 1;
        if (this.loaderCount === 0) {
            this.callback(this.makePic());
        }
    }

    makePic() {
        var canvas = document.createElement("canvas");
        canvas.width = 614, canvas.height = 320;
        var ctx = canvas.getContext("2d");
        this.drawBackground(ctx);
        this.drawAvatar(ctx);
        this.drawText(ctx);

        // console.log(canvas.toDataURL());
        return canvas.toDataURL();
    }

    drawBackground(ctx) {
        ctx.drawImage(this.imgList.bg, 0, 0, 614, 320);
        ctx.save();
    }

    drawAvatar(ctx) {
        ctx.arc(yourX, yourPOSY, yourWidth / 2, 0, 2 * Math.PI);
        // ctx.strokeStyle = "rgb(42, 50, 255)";
        // ctx.stroke();
        ctx.clip();
        ctx.drawImage(
            this.imgList.avatar,
            yourX - yourWidth / 2,
            yourPOSY - yourWidth / 2,
            yourWidth, yourWidth
        );
        ctx.restore();
    }
    drawText(ctx) {
        ctx.fillStyle = "white";
        ctx.textAlign = "center";
        ctx.font = "bold 50px Arial";
        ctx.fillText("SCORE: " + this.score, yourX, yourPOSY + yourWidth - 20);
        // ctx.strokeStyle  = "rgb(42, 50, 255)";  
        // ctx.stroke();       
    }
}
