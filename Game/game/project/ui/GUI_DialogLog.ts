/**
 * 对话记录
 * Created by 黑暗之神KDS on 2020-12-22 09:45:56.
 */
class GUI_DialogLog extends GUI_4 {
    /**
     * 记录项参考
     */
    private testItemUI: GUI_1002;
    private testItemUIHeight: number;
    /**
     * 构造函数
     */
    constructor() {
        super();
        this.testItemUI = new GUI_1002;
        this.testItemUIHeight = this.testItemUI.dialogContent.height;
        this.dialogRecordList.optimizationMode = true;
        this.on(EventObject.DISPLAY, this, this.refreshList);
        this.dialogRecordList.onCreateItem = Callback.New(this.onCreateItem, this);
    }
    /**
     * 当创建项显示对象时
     * @param ui 项显示对象界面 
     * @param data 项数据
     * @param index 所在的索引
     */
    private onCreateItem(ui: GUI_1002, data: ListItem_1002, index: number) {
        let dialogRecordInfo: DataStructure_dialogRecordInfo = data.data;
        if (dialogRecordInfo && dialogRecordInfo.tsURL) {
            ui.tsBtn.visible = true;
            ui.tsBtn.on(EventObject.CLICK, this, () => {
                GameAudio.stopTS();
                GameAudio.playTS(dialogRecordInfo.tsURL);
            });
        }
        else {
            ui.tsBtn.visible = false;
        }
    }
    /**
     * 刷新列表
     */
    private refreshList() {
        // 获取对话记录
        let dialogRecords = WorldData.dialogRecords;
        if (!dialogRecords || dialogRecords.length == 0) {
            this.dialogRecordList.items = [];
            return;
        }
        // 文本和对话内容
        let a: ListItem_1002[] = [];
        for (let i = 0; i < dialogRecords.length; i++) {
            let item: ListItem_1002 = new ListItem_1002;
            let dialogRecordInfo = dialogRecords[i];
            item.dialogName = dialogRecordInfo.dialogName;
            item.dialogContent = dialogRecordInfo.dialogContent;
            item.data = dialogRecordInfo;
            a.push(item);
            // 测试高度，如果超出则设置为自定义模式，增加高度
            this.testItemUI.dialogContent.text = dialogRecordInfo.dialogContent;
            let realHeight = this.testItemUI.dialogContent.textHeight;
            if (this.testItemUIHeight < realHeight) {
                item.customSize = true;
                item.width = this.dialogRecordList.itemWidth;
                item.height = this.dialogRecordList.itemHeight + (realHeight - this.testItemUIHeight);
            }
        }
        this.dialogRecordList.items = a;
        // 滚动到最底下
        this.dialogRecordList.scrollTo(99999);
    }
}