/**
 * UI相关扩展
 * Created by 黑暗之神KDS on 2019-12-17 13:18:39.
 */
//------------------------------------------------------------------------------------------------------
// 界面组件扩展
//------------------------------------------------------------------------------------------------------
// 监听每个组件的构造事件（创建预设界面时才会派发，而自行创建的组件不会派发该事件）
EventUtils.addEventListener(UIBase, UIBase.EVENT_COMPONENT_CONSTRUCTOR_INIT, Callback.New(uiComponentInit, this, [false]));
/**
 * 组件初始化
 * @param isRoot 是否根容器（界面本体）
 * @param uiComp 组件
 */
function uiComponentInit(isRoot: boolean, uiComp: UIBase) {
    // 界面组件的自定义事件：可在菜单-自定义编辑器-触发事件类别-界面组件事件类别中设置
    let hasMouseEvent = false;
    let hasCommandName = isRoot ? "hasRootCommand" : "hasCommand";
    // 对应事件
    let allEvents = [
        EventObject.CLICK,
        EventObject.MOUSE_OVER,
        EventObject.MOUSE_OUT,
        EventObject.DISPLAY,
        EventObject.UNDISPLAY,
        EventObject.MOUSE_DOWN,
        EventObject.MOUSE_UP,
        EventObject.DOUBLE_CLICK,
        EventObject.MOUSE_MOVE,
        EventObject.RIGHT_MOUSE_DOWN,
        EventObject.RIGHT_MOUSE_UP,
        EventObject.RIGHT_CLICK
    ];
    // 遍历所有组件事件
    for (let i = 0; i < 12; i++) {
        let hasCommand = uiComp[hasCommandName][i];
        if (hasCommand) {
            // 除了显示事件和消失事件外表示存在鼠标事件，
            if (i != 3 && i != 4) {
                hasMouseEvent = true;
            }
            // 需要追加额外特殊效果的事件后面单独处理
            if (i == 1) continue;
            // 注册事件
            let evType = allEvents[i];
            uiComp.on(evType, uiComp, (uiComp: UIBase, i: number) => {
                if (i == 3 && !uiComp.visible) return;
                else if (i == 4 && !uiComp.visible) return;
                // 获取该组件绑定的玩家提交信息。主要用于绑定后将该信息提交到事件里面
                // 在事件页中可通过玩家输入值来获取（事件中的脚本则是：trigger.inputMessage）
                let commandInputMessage;
                if (uiComp.commandInputMessage instanceof Callback) {
                    commandInputMessage = (uiComp.commandInputMessage as Callback).run();
                }
                else {
                    commandInputMessage = uiComp.commandInputMessage;
                }
                // 开始执行界面组件事件
                GameCommand.startUICommand(uiComp, i, commandInputMessage);
            }, [uiComp, i]);
        }
    }
    // 向上开启允许鼠标响应的事件
    if (hasMouseEvent) {
        let p = uiComp;
        while (p) {
            p.mouseEnabled = true;
            if (p == uiComp.guiRoot) {
                break;
            }
            p = p.parent as any;
        }
    }
    // 注册悬停鼠标事件
    if (uiComp instanceof UIButton || uiComp[hasCommandName][1]) {
        uiComp.on(EventObject.MOUSE_OVER, uiComp, (uiComp: UIBase) => {
            // 按钮的情况：如果未能在焦点中的话就视为选中
            if (uiComp instanceof UIButton && FocusButtonsManager.inFocusState(uiComp) == 1) {
                GameAudio.playSE(ClientWorld.data.selectSE);
                FocusButtonsManager.setFocusButton(uiComp);
            }
            // 存在悬停可视化事件
            if (uiComp[hasCommandName][1]) {
                let commandInputMessage;
                if (uiComp.commandInputMessage instanceof Callback) {
                    commandInputMessage = (uiComp.commandInputMessage as Callback).run();
                }
                else {
                    commandInputMessage = uiComp.commandInputMessage;
                }
                GameCommand.startUICommand(uiComp, 1, commandInputMessage);
            }
        }, [uiComp]);
    }
    // 显示和消失事件
    if (uiComp[hasCommandName][3] || uiComp[hasCommandName][4]) {
        uiComp.on(UIBase.ON_VISIBLE_CHANGE, uiComp, () => {
            let commandInputMessage;
            if (uiComp.commandInputMessage instanceof Callback) {
                commandInputMessage = (uiComp.commandInputMessage as Callback).run();
            }
            else {
                commandInputMessage = uiComp.commandInputMessage;
            }
            if (uiComp[hasCommandName][3] && uiComp.visible) {
                GameCommand.startUICommand(uiComp, 3, commandInputMessage);
            }
            else if (uiComp[hasCommandName][4] && !uiComp.visible) {
                GameCommand.startUICommand(uiComp, 4, commandInputMessage);
            }
        });
    }
}
// 界面添加时处理
EventUtils.addEventListener(GameUI, GameUI.EVENT_CREATE_UI, Callback.New((ui: GUI_BASE) => {
    uiComponentInit.apply(ui, [true, ui]);
}, this));
//------------------------------------------------------------------------------------------------------
// 对话框扩展：
// -- 当关闭对话框时
//------------------------------------------------------------------------------------------------------
// 界面关闭时处理
EventUtils.addEventListener(GameUI, GameUI.EVENT_CLOSE_SYSTEM_UI, Callback.New((ui: GUI_BASE) => {
    // -- 按键焦点：关闭界面时如果焦点不存在或不在舞台上则重新回到可能存在的选项中
    if (WorldData.hotkeyEnabled && WorldData.hotKeyListEnabled) {
        if (GameDialog.isInDialog && GameDialog.lastDialog) {
            let optionList = GameDialog.lastDialog.optionList;
            if (optionList && optionList.stage) {
                if (!UIList.focus || !UIList.focus.stage) {
                    UIList.focus = optionList;
                }
            }
        }
    }
}, this));
// 监听对话框开启事件
let isPlayTS: boolean = false;
let ___lastListFocus: UIList;
let ___lastFocusIsList = false;
let ___lastButtonsFocus: FocusButtonsManager;
let ___isRecordFoucs = false;
/**
 * 监听恢复对话事件（若存档时正在对话中，则会恢复）
 */
let ___dialogFromSaveFileData = false;
EventUtils.addEventListener(GameDialog, GameDialog.EVENT_BEFORE_RECOVERY_DIALOG, Callback.New((isOption: boolean, content: string, options: string[], name: string, head: string | number, expression: number, audioURL: string, speed: number) => {
    ___dialogFromSaveFileData = true;
}, this));
/**
 * 对话开始时处理
 */
EventUtils.addEventListener(GameDialog, GameDialog.EVENT_DIALOG_START, Callback.New((isOption: boolean, content: string, options: string[], name: string, head: string | number, expression: number, audioURL: string, speed: number) => {
    // 记录上一个焦点
    if (!___isRecordFoucs) {
        if (UIList.focus) {
            ___lastListFocus = UIList.focus;
            UIList.focus = null;
            ___lastFocusIsList = true;
            ___isRecordFoucs = true;
        }
        else if (FocusButtonsManager.focus) {
            ___lastFocusIsList = false;
            ___isRecordFoucs = true;
            ___lastButtonsFocus = FocusButtonsManager.focus;
        }
    }
    // 对话框透明度
    Callback.CallLaterBeforeRender(() => {
        GameDialog.lastDialog.dialogBox.opacity = ClientWorld.variable.getVariable(15001);
    }, this);
    // 是否存在语音标识
    isPlayTS = audioURL ? true : false;
    // 追加进对话记录（非选项的情况下）
    if (!isOption && !___dialogFromSaveFileData) {
        let d = new DataStructure_dialogRecordInfo();
        d.tsURL = audioURL;
        d.dialogName = name;
        d.dialogContent = StringUtils.clearHtmlTag(content).replace(/\[p\d+\]|\[\.=\]|\[\.s\]/g, "");
        WorldData.dialogRecords.push(d);
    }
    ___dialogFromSaveFileData = false;
    // 执行对话开始事件
    GameCommand.startCommonCommand(14012);
}, this));
// 监听对话文本结束事件
let ___dialogRecordSaveT: any;
/**
 * 对话结束时处理
 */
EventUtils.addEventListener(GameDialog, GameDialog.EVENT_DIALOG_END, Callback.New((gameDialog: GameDialog) => {
    // 关闭的情况：恢复焦点
    if (___lastFocusIsList) {
        UIList.focus = ___lastListFocus;
        ___lastListFocus = null;
    }
    else {
        FocusButtonsManager.focus = ___lastButtonsFocus;
        ___lastButtonsFocus = null;
    }
    ___isRecordFoucs = false;
    //
    ___dialogRecord[GameDialog.fromCommandID] = true;
    // 延迟5秒后保存全局数据，5秒内有相同操作则会取消此前的请求
    if (___dialogRecordSaveT) clearTimeout(___dialogRecordSaveT);
    ___dialogRecordSaveT = setTimeout(() => { SinglePlayerGame.saveGlobalData(null); }, 5000);
}, this));
/**
 * 监听对话框关闭事件
 */
EventUtils.addEventListener(GameDialog, GameDialog.EVENT_DIALOG_CLOSE, Callback.New((gameDialog: GameDialog) => {
    GameCommand.startCommonCommand(14013);
}, this));
/**
 * 监听对话框播放文字事件
 */
EventUtils.addEventListener(GameDialog, GameDialog.EVENT_DIALOG_WORD_PLAY, Callback.New(() => {
    GameCommand.startCommonCommand(14014);
    if (ClientWorld.data.dialogSE) GameAudio.playSE(ClientWorld.data.dialogSE);
}, this));
/**
 * 监听对话框播放文本完成事件
 */
EventUtils.addEventListener(GameDialog, GameDialog.EVENT_DIALOG_WORD_PLAY_COMPLETE, Callback.New(() => {
    // 记录已读
    GameCommand.startCommonCommand(14015);
}, this));
/**
 * 监听对话框播放语音完成事件
 */
EventUtils.addEventListener(GameDialog, GameDialog.EVENT_TS_PLAY_COMPLETE, Callback.New(() => {
    GameCommand.startCommonCommand(14016);
}, this));
/**
 * 监听对话框播放文本时遇到等待玩家操作时或玩家操作完毕后
 */
EventUtils.addEventListener(GameDialog, GameDialog.EVENT_WAIT_PALYER_OPERATION, Callback.New((state: number) => {
    GameCommand.startCommonCommand(state == 0 ? 14017 : 14018);
}, this));
/**
 * 全局自定义数据：对话已读记录（与存档无关的全局数据）
 */
let ___dialogRecord = {};
// -- 当储存全局数据时追加记录自定义全局数据-「对话已读记录」
SinglePlayerGame.regSaveCustomGlobalData("___dialogRecord", Callback.New(() => {
    return ___dialogRecord;
}, this));
// -- 监听启用游戏完毕后读取自定义全局数据-「对话已读记录」
EventUtils.addEventListener(ClientWorld, ClientWorld.EVENT_INITED, Callback.New(() => {
    let saveDialogRecord = SinglePlayerGame.getSaveCustomGlobalData("___dialogRecord");
    if (saveDialogRecord) ___dialogRecord = saveDialogRecord;
}, this), true);
// 重写选项开启，设置overSelectMode属性
let ___lastSetOption = GameDialog.prototype["setOption"];
GameDialog.prototype["setOption"] = function (options: string[], defaultIndex: number = -1, cancelIndex: number = -1) {
    ___lastSetOption.apply(this, arguments);
    let optionList: UIList = this.optionList;
    if (optionList) {
        optionList.overSelectMode = true;
    }
}
//------------------------------------------------------------------------------------------------------
// UIList-音效：键盘操控和鼠标操控移动光标音效
//------------------------------------------------------------------------------------------------------
/**
 * 播放列表项选中时音效
 */
function ___listSEPlay(state: number) {
    if (state == 0 && WorldData.selectSE) {
        GameAudio.playSE(WorldData.selectSE);
    }
}
//------------------------------------------------------------------------------------------------------
// 对话框隐藏
//------------------------------------------------------------------------------------------------------
let ___dialogOnClick = GameDialog.prototype["onClick"];
GameDialog.prototype["onClick"] = function (e: EventObject, listItemClick: boolean = true, fromAutoPlaySkipSign: boolean = false): void {
    if (GUI_Manager.reShowDialogUI()) return;
    ___dialogOnClick.apply(this, arguments);
}
//------------------------------------------------------------------------------------------------------
// 对话框文本播放速度
//------------------------------------------------------------------------------------------------------
let ___dialogShowDialog = GameDialog["showDialog"];
let firstShowDialog: boolean = true;
GameDialog["showDialog"] = function (dialogID: number, head: string, name: string, speed: number, comicSceneObjectIndex: number, msg: string,
    submitCallback: Callback = null, audio: string, exp: number, nameColor: string, changeData: { id: number, atts: any[], time: number, transitionMode: string, nonTweenType: number, mode: number }, dialogMaterialEnabled: boolean = true): void {
    //第一次从读档中恢复对话框不设置播放速度
    if (WorldData.wordPlaySpeedFromSetting && (!firstShowDialog || GameGate.inNewSceneState != 2)) {
        // -- 自动播放
        if (Game.player.variable.getSwitch(15003)) {
            speed = Math.round(ClientWorld.variable.getVariable(15003));
        }
        // -- 普通播放
        else {
            speed = Math.round(ClientWorld.variable.getVariable(15002));
        }
    }
    firstShowDialog = false;
    return ___dialogShowDialog.apply(this, [dialogID, head, name, speed, comicSceneObjectIndex, msg, submitCallback, audio, exp, nameColor, changeData, dialogMaterialEnabled]);
}