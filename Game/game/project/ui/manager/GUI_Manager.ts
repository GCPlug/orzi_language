/**
 * UI界面管理器
 * Created by 黑暗之神KDS on 2022-02-25 08:59:52.
 */
class GUI_Manager {
    //------------------------------------------------------------------------------------------------------
    // 标准化组件
    //------------------------------------------------------------------------------------------------------
    /**
     * 标准化列表LIST
     * -- 键位滚动至可见区域
     */
    static standardList(list: UIList, useItemClickSe: boolean = true): void {
        list.on(EventObject.CHANGE, this, (list: UIList, state: number) => {
            if (state == 0) list.scrollTo(list.selectedIndex, true, true, 300, Ease.strongOut);
        }, [list]);
        if (useItemClickSe) {
            list.on(UIList.ITEM_CLICK, this, (list: UIList) => {
                GameAudio.playSE(ClientWorld.data.sureSE);
            }, [list]);
        }
    }
    /**
     * 标准化标签栏
     * -- 快捷键
     * @param tab 
     */
    static standardTab(tab: UITabBox): void {
        stage.on(EventObject.KEY_DOWN, tab, GUI_Manager.onStandardTabKeyDown, [tab]);
        tab["__lastIdx"] = tab.selectedIndex;
        tab.on(EventObject.CHANGE, this, (tab: UITabBox) => {
            let lastIndex = tab["__lastIdx"];
            if (lastIndex >= 0) {
                GameAudio.playSE(ClientWorld.data.selectSE);
            }
            tab["__lastIdx"] = tab.selectedIndex;
        }, [tab]);
    }
    /**
     * 注册鼠标点击区域后激活指定的列表
     * @param area 区域 
     * @param list 列表
     * @param playSureSE [可选] 默认值=true 是否播放确认音效
     * @param onFocus [可选] 默认值=null 当产生焦点时回调
     * @param thisPtr [可选] 默认值=null 当产生焦点时回调的作用域
     */
    static regHitAreaFocusList(area: UIBase, list: UIList, playSureSE: boolean = true, onFocus: Function = null, thisPtr: any = null): void {
        list.on(UIList.ITEM_CREATE, this, hitAreaFocusListCallback);
        function hitAreaFocusListCallback(ui: UIRoot, data: UIListItemData, index: number) {
            ui.on(EventObject.MOUSE_DOWN, this, (e: EventObject) => { e.stopPropagation(); })
        }
        area.on(EventObject.MOUSE_DOWN, GUI_Manager, (list: UIList, playSureSE: boolean) => {
            onFocus && onFocus.apply(thisPtr);
            GUI_Manager.focusList(list, playSureSE);
        }, [list, playSureSE]);
    }
    /**
     * 激活List并选中
     * @param list 列表
     * @param playSureSE [可选] 默认值=true 是否播放确认音效
     */
    private static focusList(list: UIList, playSureSE: boolean = true): void {
        if (UIList.focus == list) return;
        UIList.focus = list;
        for (let i = 0; i < list.length; i++) {
            let itemBox = list.getItemUI(i);
            if (itemBox.mouseX >= 0 && itemBox.mouseX <= list.itemWidth && itemBox.mouseY >= 0 && itemBox.mouseY <= list.itemHeight) {
                list.selectedIndex = i;
                break;
            }
        }
        if (playSureSE) GameAudio.playSE(WorldData.sureSE);
    }
    //------------------------------------------------------------------------------------------------------
    //  对话框功能扩展
    //------------------------------------------------------------------------------------------------------
    /**
     * 隐藏对话框界面
     * @return [boolean] 是否成功
     */
    static hideDialogUI(): boolean {
        let gameDialog = GameDialog.lastDialog;
        if (gameDialog && gameDialog.visible) {
            let dialogBtnsUI = GameUI.get(3);
            // -- 对话功能按钮在最前方显示的话才允许隐藏，因为可能打开了其他的界面
            if (dialogBtnsUI != Game.layer.uiLayer.getChildAt(Game.layer.uiLayer.numChildren - 1)) {
                return;
            }
            gameDialog.visible = false;
            if (dialogBtnsUI) dialogBtnsUI.visible = false;
            return true;
        }
        return false;
    }
    /**
     * 重新显示隐藏的对话框界面
     * @return [boolean] 是否成功
     */
    static reShowDialogUI(): boolean {
        let gameDialog = GameDialog.lastDialog;
        if (gameDialog && !gameDialog.visible) {
            let dialogBtnsUI = GameUI.get(3);
            // -- 对话功能按钮在最前方显示的话才允许重新显示，因为可能打开了其他的界面
            if (dialogBtnsUI != Game.layer.uiLayer.getChildAt(Game.layer.uiLayer.numChildren - 1)) {
                return;
            }
            gameDialog.visible = true;
            if (dialogBtnsUI) dialogBtnsUI.visible = true;
            return true;
        }
        return false;
    }
    /**
     * 隐藏或显示对话框界面
     */
    static hideOrShowDialogUI(): void {
        let gameDialog = GameDialog.lastDialog;
        if (gameDialog) {
            if (gameDialog.visible) {
                GUI_Manager.hideDialogUI();
            }
            else {
                GUI_Manager.reShowDialogUI();
            }
        }
    }
    //------------------------------------------------------------------------------------------------------
    // 标准化标签栏-内部实现
    //------------------------------------------------------------------------------------------------------
    /**
     * 按键更改标签索引
     */
    private static onStandardTabKeyDown(tab: UITabBox, e: EventObject): void {
        if (!tab.stage || !tab.mouseEnabled) {
            return;
        }
        let keyCode: number = e.keyCode
        let index = tab.selectedIndex;
        if (GUI_Setting.IS_KEY(keyCode, GUI_Setting.KEY_BOARD.L1)) {
            index--;
        }
        else if ((GUI_Setting.IS_KEY(keyCode, GUI_Setting.KEY_BOARD.R1))) {
            index++;
        }
        else {
            return;
        }
        index = Math.min(tab.length - 1, Math.max(index, 0));
        tab.selectedIndex = index;
    }
}