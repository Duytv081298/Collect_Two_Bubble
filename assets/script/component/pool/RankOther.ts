const {ccclass, property} = cc._decorator;

@ccclass
export default class RankOther extends cc.Component {
    
    data = null;
    // LIFE-CYCLE CALLBACKS:
    // onLoad () {}

    setData(data:any)
    {
        this.data = data;
    }

    onHandlerChallenge(){
        this.node.emit("CHALLENGE", this.data);
    }
    // update (dt) {}
}
