/**
 * CG图鉴界面
 * Created by 黑暗之神KDS on 2020-12-22 10:42:15.
 */
class GUI_CG extends GUI_11 {
    /**
     * 显示的CG图索引
     */
    private cgIndex: number;
    /**
     * 当前选中的CG鉴赏模块的数据
     */
    private currentCGData: Module_CG;
    /**
     * 构造函数
     */
    constructor() {
        super();
        GUI_Manager.standardList(this.cgList);
        this.on(EventObject.DISPLAY, this, this.onDisplay);
        this.cgList.on(UIList.ITEM_CLICK, this, this.onItemClick);
        this.cgList.on(EventObject.CHANGE, this, ___listSEPlay);
    }
    /**
     * 当界面显示时
     */
    private onDisplay() {
        let arr = [];
        let len = GameData.getLength(1, 1);
        for (let i = 1; i <= len; i++) {
            let cgID: number = i;
            let d = new ListItem_1003;
            arr.push(d);
            // 是否存在图鉴
            if (WorldData.myCG.indexOf(cgID) != -1) {
                let cgData: Module_CG = GameData.getModuleData(1, cgID);
                d.cg = cgData.CGs[0];
                d.data = cgData;
            }
        }
        this.cgList.items = arr;
    }
    /**
     * 当列表中的项显示对象点击时：显示大图
     */
    private onItemClick() {
        let bigCGUI: GUI_12 = GameUI.get(12) as any;
        if (GameUI.isOpened(12)) {
            this.onCGClick();
            return;
        }
        let selectedItem = this.cgList.selectedItem;
        if (!selectedItem) return;
        let cgData: Module_CG = selectedItem.data;
        if (!cgData) return;
        this.cgIndex = 0;
        bigCGUI = GameUI.show(12) as any;
        UIList.focus = null;
        bigCGUI.bigCG.off(EventObject.CLICK, this, this.onCGClick);
        bigCGUI.bigCG.on(EventObject.CLICK, this, this.onCGClick);
        bigCGUI.once(EventObject.UNDISPLAY, this, this.onBigCGUIClose);
        stage.on(EventObject.KEY_DOWN, this, this.onCGClick);
        bigCGUI.bigCG.image = cgData.CGs[0];
        this.currentCGData = cgData;
        bigCGUI.bigCG.visible = true;
    }
    /**
     * CG大图点击切换
     */
    private onCGClick(e: EventObject = null): void {
        if (e && e.type == EventObject.KEY_DOWN) {
            if (!GUI_Setting.IS_KEY(e.keyCode, GUI_Setting.KEY_BOARD.A)) {
                return;
            }
        }
        let bigCGUI: GUI_12 = GameUI.get(12) as any;
        this.cgIndex++;
        if (this.cgIndex >= this.currentCGData.CGs.length) {
            this.cgIndex = 0;
        }
        bigCGUI.bigCG.image = this.currentCGData.CGs[this.cgIndex];
    }
    /**
     * 关闭CG大图
     */
    private onBigCGUIClose(): void {
        UIList.focus = this.cgList;
        stage.off(EventObject.KEY_DOWN, this, this.onCGClick);
    }
}