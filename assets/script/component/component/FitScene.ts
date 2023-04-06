// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

const {ccclass, property} = cc._decorator;

@ccclass
export default class FitScene extends cc.Component {

    onLoad () {
        cc.view.setResizeCallback( () =>{
            this.setFit();
        });
    }

    setFit() {
        let viewport = cc.view.getViewportRect();
        let viewportGame = this.node.getComponent(cc.Canvas).designResolution;
       // //cc.log("viewport: ", viewport);
       // //cc.log("viewportGame: ", viewportGame);
        let scaleX = viewport.width / viewportGame.width;
        let scaleY = viewport.height / viewportGame.height;

        if (scaleX < scaleY) {
            this.node.getComponent(cc.Canvas).fitWidth = true;
            this.node.getComponent(cc.Canvas).fitHeight = false;
        } else {
            this.node.getComponent(cc.Canvas).fitWidth = false;
            this.node.getComponent(cc.Canvas).fitHeight = true;
        }
        cc.view.setOrientation(cc.macro.ORIENTATION_PORTRAIT);
    }
    start() {
        this.setFit();
    }

    // update (dt) {}
}
