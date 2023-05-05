const { ccclass, property, menu } = cc._decorator;
@ccclass
@menu("tool/list_optimize")
export default class OptimizeScrollViewEndGame extends cc.Component {
    onLoad() {
        if (!this.node.getComponent(cc.ScrollView)) {
            cc.error("khong co ScrollView!");
            return;
        }
        this.node.on("scrolling", this._event_update_opacity, this);
        this.node.getComponent(cc.ScrollView).content.on(cc.Node.EventType.CHILD_REMOVED, this._event_update_opacity, this);
        this.node.getComponent(cc.ScrollView).content.on(cc.Node.EventType.CHILD_REORDER, this._event_update_opacity, this);
    }
    private _get_bounding_box_to_world(node_o_: any): cc.Rect {
        let w_n: number = node_o_._contentSize.width;
        let h_n: number = node_o_._contentSize.height;
        let rect_o = cc.rect(
            -node_o_._anchorPoint.x * w_n,
            -node_o_._anchorPoint.y * h_n,
            w_n,
            h_n
        );
        node_o_._calculWorldMatrix();
        rect_o.transformMat4(rect_o, node_o_._worldMatrix);
        return rect_o;
    }
    private _check_collision(node_o_: cc.Node): boolean {
        let rect1_o = this._get_bounding_box_to_world(this.node.getComponent(cc.ScrollView).content.parent);
        let rect2_o = this._get_bounding_box_to_world(node_o_);
        rect1_o.width += rect1_o.width * 0.5;
        rect1_o.height += rect1_o.height * 0.5;
        rect1_o.x -= rect1_o.width * 0.25;
        rect1_o.y -= rect1_o.height * 0.25;
        return rect1_o.intersects(rect2_o);
    }
    private _event_update_opacity(): void {
        // this.node.getComponent(cc.ScrollView).content.children.forEach(v1_o => {
        //     v1_o.opacity = this._check_collision(v1_o) ? 255 : 0;
        // });

        let childrens = this.node.getComponent(cc.ScrollView).content.children
        for (let i = 0; i < childrens.length; i++) {
            const children = childrens[i];
            children.opacity = this._check_collision(children) ? 255 : 0;
            if (i == 0 || i == 1 || i == childrens.length - 1 || i == childrens.length - 2 || children.name == "user") children.opacity = 0;
        }
    }
}