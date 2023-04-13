import CreateScoreBubble from "../../../../component/pool/CreateScoreBubble";

const { ccclass, property } = cc._decorator;

@ccclass
export default class ScoreBubble extends cc.Component {

    @property(cc.Label)
    label: cc.Label = null;

    @property(cc.LabelOutline)
    labelOutline: cc.LabelOutline = null;
    setUp(score: number, index: number) {
        this.label.string = "+" + score;
        this.upDateColorScore(index);
        this.setPositionScore(index);
        this.aniScore();
    }
    aniScore() {
        var newPos = new cc.Vec3(this.node.position.x, this.node.position.y + 120, 0)
        cc.tween(this.node)
            .to(0.5, { position: newPos }, { easing: "cubicOut" })
            .call(() => {
                this.node.stopAllActions();
                CreateScoreBubble.instance().removeItem(this.node);
                // this.pooling.onScoreKilled(score)
            })
            .start();
        cc.tween(this.node)
            .to(0.5, { opacity: 0 }, { easing: "expoIn" })
            .start();
    }
    upDateColorScore(index: number) {
        switch (index) {
            case 0:
                this.node.color = new cc.Color(254, 245, 79, 255) // vang
                this.labelOutline.color = new cc.Color(126, 48, 0, 255)// vang
                break;
            case 1:
                this.node.color = new cc.Color(243, 130, 255, 255) // tim
                this.labelOutline.color = new cc.Color(91, 2, 114, 255) // tim
                break;
            case 2:
                this.node.color = new cc.Color(101, 245, 247, 255) //xanh duong
                this.labelOutline.color = new cc.Color(0, 61, 94, 255) //xanh duong
                break;
            case 3:
                this.node.color = new cc.Color(180, 246, 80, 255) // xanh la
                this.labelOutline.color = new cc.Color(40, 111, 0, 255) // xanh la
                break;
            case 4:
                this.node.color = new cc.Color(255, 126, 121, 255) // do
                this.labelOutline.color = new cc.Color(119, 8, 13, 255) // do
                break;

            default:
                break;
        }
    }
    setPositionScore(index: number) {
        switch (index) {
            case 0:
                this.node.setPosition(new cc.Vec3(-258.8, -24.4, 0))
                break;
            case 1:
                this.node.setPosition(new cc.Vec3(-129.943, -22.4, 0))
                break;
            case 2:
                this.node.setPosition(new cc.Vec3(-2.173, -22.4, 0))
                break;
            case 3:
                this.node.setPosition(new cc.Vec3(125.596, -22.4, 0))
                break;
            case 4:
                this.node.setPosition(new cc.Vec3(254.453, -22.4, 0))
                break;
            default:
                break;
        }
        // this.gameController.updateScore(this.listScoreHole[index]);
    }

    // update (dt) {}
}
