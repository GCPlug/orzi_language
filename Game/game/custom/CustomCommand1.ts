/**
 * 自定义事件命令
 * Created by 黑暗之神KDS on 2020-09-09 19:47:24.
 */
module CommandExecute {
    //------------------------------------------------------------------------------------------------------
    // 交互
    //------------------------------------------------------------------------------------------------------
    /**
     * 预加载
     * @param commandPage 事件页
     * @param cmd 当前的事件命令
     * @param trigger 触发器
     * @param triggerPlayer 触发器对应的玩家
     * @param playerInput 玩家输入值（如有）
     * @param p 自定义命令参数
     */
    export function customCommand_1(commandPage: CommandPage, cmd: Command, trigger: CommandTrigger, triggerPlayer: ClientPlayer, playerInput: any[], p: CustomCommandParams_1): void {
        // 如果不存在预加载则忽略掉
        if (p.preloadAssets.length == 0) return;
        // 暂停当前触发线的事件推进，当加载资源完毕时再继续执行
        trigger.pause = true;
        // 推进一行，以便下次执行时执行下一行事件
        trigger.offset(1);
        let g = getAssetValues;
        // 图集
        let imageArr = g(0);
        // 判断是否存在字体加载
        let fontArr = g(7);
        let hasFont: boolean;
        if (fontArr.length > 0) {
            hasFont = true;
        }
        // CG鉴赏
        let cgArr = g(8);
        if (cgArr.length > 0) {
            for (let i = 0; i < WorldData.myCG.length; i++) {
                let cgID = WorldData.myCG[i];
                let cgData: Module_CG = GameData.getModuleData(1, cgID);
                if (cgData && cgData.CGs.length > 0) {
                    imageArr = imageArr.concat(cgData.CGs);
                }
            }
        }
        // 如果需要显示加载界面的话则打开界面
        if (p.isShowLoadingUI && p.bindingUI && p.bindingUI.uiID) {
            // 该界面本身要加载（使用了自动释放模式的预载入，所以会自动清空此次预加载的引用）
            AssetManager.preLoadUIAsset(p.bindingUI.uiID, Callback.New(() => {
                let loadingUI = GameUI.show(p.bindingUI.uiID)
                doLoadAsset.apply(this, [loadingUI]);
            }, this), true, true, true);
        }
        else {
            doLoadAsset.apply(this);
        }
        // 加载完毕时处理
        function onLoadComplete(displayProgressComp: UIBase) {
            setProgressUI.apply(this, [displayProgressComp, 100]);
            Callback.New(() => {
                if (p.isShowLoadingUI && p.bindingUI) GameUI.dispose(p.bindingUI.uiID);
                CommandPage.executeEvent(trigger);
            }, this).delayRun(100);
        }
        // 加载资源
        function doLoadAsset(loadingUI: UIRoot) {
            // 如果存在需要显示加载进度效果的话则准备显示
            let displayProgressComp: UIBase = null;
            if (loadingUI && p.bindingUI && p.bindingUI.uiID && p.bindingUI.compName && p.bindingUI.varName) {
                displayProgressComp = loadingUI[p.bindingUI.compName];
                if (!displayProgressComp) {
                    trace(`预载入事件参数错误，找不到组件：${p.bindingUI.compName}`);
                }
            }
            // 加载资源
            AssetManager.batchPreLoadAsset(Callback.New(() => {
                if (hasFont) {
                    AssetManager.preloadFonts(Callback.New(onLoadComplete, this, [displayProgressComp]));
                }
                else {
                    onLoadComplete.apply(this, [displayProgressComp]);
                }
            }, this, [1, true]),
                Callback.New((current: number, count: number) => {
                    // 若存在字体文件
                    if (hasFont) count += 1;
                    // 显示加载进度效果
                    let progressStr = Math.floor(current * 100 / count).toString();
                    setProgressUI.apply(this, [displayProgressComp, progressStr]);
                }, this), imageArr, [], g(2), g(3), g(4), g(5), [], g(1), g(6));
        }
        // 根据资源类别筛选数组
        function getAssetValues(assetType: number): any[] {
            // -- 筛选对应assetType的资源组，如获取所有需要预加载的图像组DataStructure格式数据
            let dsArr: DataStructure_preloadAsset[] = ArrayUtils.matchAttributes(p.preloadAssets, { assetType: assetType }, false);
            // -- 获取DataStructure格式数组内对象的资源属性值重新组成一个新的数组
            return ArrayUtils.getChildAttributeToCreateArray(dsArr, "asset" + assetType);
        }
        // 进度条
        function setProgressUI(displayProgressComp: UIBase, v: number) {
            if (!displayProgressComp) return;
            v = MathUtils.int(v);
            Tween.clearAll(displayProgressComp);
            let attrObj = {};
            attrObj[p.bindingUI.varName] = v;
            Tween.to(displayProgressComp, attrObj, 100);
        }
    }
    /**
     * 等待玩家输入文本
     */
    export function customCommand_2(commandPage: CommandPage, cmd: Command, trigger: CommandTrigger, triggerPlayer: ClientPlayer, playerInput: any[], p: CustomCommandParams_2): void {
        if (p.inputUI == 0) return;
        let inputUI: GUI_BASE = GameUI.show(p.inputUI);
        let inputText: UIInput = inputUI["input"];
        if (inputText) {
            inputText.setTextForce(p.useVar == 1 ? Game.player.variable.getString(p.defTextVarID) : p.defText);
            inputText.focus = true;
            inputText.off(EventObject.ENTER, inputText, ____onInputEnter);
            inputText.on(EventObject.ENTER, inputText, ____onInputEnter, [p.inputUI]);
        }
        trigger.pause = true;
        inputUI.once(EventObject.REMOVED, this, () => {
            trigger.offset(1);
            Callback.CallLaterBeforeRender(() => {
                //@ts-ignore
                CommandPage.executeEvent.apply(this, arguments);
            }, CommandPage, [trigger, [inputText ? inputText.text : ""]]);
        }, []);
    }
    function ____onInputEnter(uiID: number) {
        GameUI.hide(uiID);
    }
    /**
     * 按键事件
     */
    let keyEventSigns: { [key: string]: { typeEvent: string, thisPtr: any, func: Function } } = {}
    export function customCommand_3(commandPage: CommandPage, cmd: Command, trigger: CommandTrigger, triggerPlayer: ClientPlayer, playerInput: any[], p: CustomCommandParams_3): void {
        // 永久,执行一次,调用该命令时执行的事件完毕为止
        let evType = (p.isMulKey == 1 || p.isMulKey == 3) ? p.evType2 : p.evType;
        let typeEvent = evType != 1 ? EventObject.KEY_DOWN : EventObject.KEY_UP;
        let sign: string;
        // 根据执行一次与否决定使用on或once
        let f = (p: CustomCommandParams_3, trigger: CommandTrigger, sign: string, e: EventObject) => {
            let bool = false;
            // 普通单按键
            if (p.isMulKey == 0) {
                bool = e.keyCode == p.key;
            }
            // 普通多按键
            else if (p.isMulKey == 1) {
                bool = p.keys.indexOf(e.keyCode) != -1;
            }
            // 系统单按键
            else if (p.isMulKey == 2) {
                let systemKeyName = GUI_Setting.SYSTEM_KEYS[p.systemKey];
                let systemKeyboardInfo: { index: number, name: string, keys: number[] } = GUI_Setting.KEY_BOARD[systemKeyName];
                bool = systemKeyboardInfo.keys.indexOf(e.keyCode) != -1;
            }
            // 系统多按键
            else {
                bool = false;
                for (let i = 0; i < p.systemKeys.length; i++) {
                    let systemKeyName = GUI_Setting.SYSTEM_KEYS[p.systemKeys[i]];
                    let systemKeyboardInfo: { index: number, name: string, keys: number[] } = GUI_Setting.KEY_BOARD[systemKeyName];
                    bool = systemKeyboardInfo.keys.indexOf(e.keyCode) != -1;
                    if (bool) break;
                }
            }
            // 组合键判定
            if (p.isMulKey <= 1) {
                if (((p.CTRL && !e.ctrlKey) || (!p.CTRL && e.ctrlKey)) && e.keyCode != Keyboard.CONTROL) bool = false;
                if (((p.SHIFT && !e.shiftKey) || (!p.SHIFT && e.shiftKey)) && e.keyCode != Keyboard.SHIFT) bool = false;
                if (((p.ALT && !e.altKey) || (!p.ALT && e.altKey)) && e.keyCode != Keyboard.ALTERNATE) bool = false;
            }
            // 是否未按下的模式
            let isNotKeyDown = (!(p.isMulKey == 1 || p.isMulKey == 3) && p.evType == 2);
            // 未按下模式下未按下或满足按下条件
            if ((isNotKeyDown && !bool) || (!isNotKeyDown && bool)) {
                if (p.type == 1) {
                    // @ts-ignore
                    stage.off(typeEvent, trigger, arguments.callee);
                    if (sign) delete keyEventSigns[sign];
                }
                CommandPage.startTriggerFragmentEvent(p.eventPage, Game.player.sceneObject, Game.player.sceneObject);
            }
        };
        // 记录按键标识
        if (p.recordListen && p.recordListenVar > 0) {
            sign = ObjectUtils.getRandID();
            keyEventSigns[sign] = { typeEvent: typeEvent, thisPtr: trigger, func: f };
            Game.player.variable.setString(p.recordListenVar, sign);
        }
        // 注册按键事件
        stage.on(typeEvent, trigger, f, [p, trigger, sign]);
        // 调用该命令时执行的事件完毕为止：监听当前事件完毕，完毕则清除掉该次按键事件
        if (p.type == 2) {
            EventUtils.addEventListener(trigger, CommandTrigger.EVENT_OVER, Callback.New((typeEvent: string, trigger: CommandTrigger, f: Function, sign: string) => {
                stage.off(typeEvent, trigger, f);
                if (sign) delete keyEventSigns[sign];
            }, this, [typeEvent, trigger, f, sign]), true);
        }
    }
    /**
     * 鼠标事件
     */
    let mouseEvents = [EventObject.MOUSE_DOWN, EventObject.MOUSE_UP, EventObject.CLICK, EventObject.DOUBLE_CLICK, EventObject.RIGHT_MOUSE_DOWN, EventObject.RIGHT_MOUSE_UP, EventObject.RIGHT_CLICK, EventObject.MOUSE_WHEEL, EventObject.MOUSE_MOVE];
    let mouseEventSigns: { [key: string]: { typeEvent: string, thisPtr: any, func: Function } } = {}
    export function customCommand_4(commandPage: CommandPage, cmd: Command, trigger: CommandTrigger, triggerPlayer: ClientPlayer, playerInput: any[], p: CustomCommandParams_4): void {
        // 永久,执行一次,调用该命令时执行的事件完毕为止
        let typeEvent = mouseEvents[p.mouseType];
        // 根据执行一次与否决定使用on或once
        let f = (typeEvent: string, p: CustomCommandParams_4, trigger: CommandTrigger, sign: string, e: EventObject) => {
            if (e.type == typeEvent) {
                if (p.type == 1) {
                    //@ts-ignore
                    stage.off(typeEvent, trigger, arguments.callee);
                    if (sign) delete mouseEventSigns[sign];
                }
                CommandPage.startTriggerFragmentEvent(p.eventPage, Game.player.sceneObject, Game.player.sceneObject);
            }
        };
        // 记录鼠标标识
        let sign: string;
        if (p.recordListen && p.recordListenVar > 0) {
            sign = ObjectUtils.getRandID();
            mouseEventSigns[sign] = { typeEvent: typeEvent, thisPtr: trigger, func: f };
            Game.player.variable.setString(p.recordListenVar, sign);
        }
        // 根据执行一次与否决定使用on或once
        stage.on(typeEvent, trigger, f, [typeEvent, p, trigger, sign]);
        // 调用该命令时执行的事件完毕为止：监听当前事件完毕，完毕则清除掉该次按键事件
        if (p.type == 2) {
            EventUtils.addEventListener(trigger, CommandTrigger.EVENT_OVER, Callback.New((typeEvent: string, trigger: CommandTrigger, f: Function, sign: string) => {
                stage.off(typeEvent, trigger, f);
                if (sign) delete mouseEventSigns[sign];
            }, this, [typeEvent, trigger, f, sign]), true);
        }
    }
    /**
     * 取消按键事件
     */
    export function customCommand_5(commandPage: CommandPage, cmd: Command, trigger: CommandTrigger, triggerPlayer: ClientPlayer, playerInput: any[], p: CustomCommandParams_5): void {
        let sign = Game.player.variable.getString(p.recordListenVar);
        if (sign) {
            let keyInfo = keyEventSigns[sign];
            if (keyInfo) {
                stage.off(keyInfo.typeEvent, keyInfo.thisPtr, keyInfo.func);
            }
        }
    }
    /**
     * 取消鼠标事件
     */
    export function customCommand_6(commandPage: CommandPage, cmd: Command, trigger: CommandTrigger, triggerPlayer: ClientPlayer, playerInput: any[], p: CustomCommandParams_6): void {
        let sign = Game.player.variable.getString(p.recordListenVar);
        if (sign) {
            let mouseInfo = mouseEventSigns[sign];
            if (mouseInfo) {
                stage.off(mouseInfo.typeEvent, mouseInfo.thisPtr, mouseInfo.func);
            }
        }
    }
    /**
     * CG图集
     */
    export function customCommand_7(commandPage: CommandPage, cmd: Command, trigger: CommandTrigger, triggerPlayer: ClientPlayer, playerInput: any[], p: CustomCommandParams_7): void {
        // 存在该CG设定的话，加入至库存
        if (GameData.getModuleData(1, p.cg)) {
            if (WorldData.myCG.indexOf(p.cg) == -1) WorldData.myCG.push(p.cg);
            // 立刻储存全局数据（与存档无关）
            SinglePlayerGame.saveGlobalData(null);
        }
    }
    // -- 注册CG图鉴的全局数据
    SinglePlayerGame.regSaveCustomGlobalData("___myCG", Callback.New(() => {
        return WorldData.myCG;
    }, null));
    /**
     * 获得音乐鉴赏的音乐
     */
    export function customCommand_8(commandPage: CommandPage, cmd: Command, trigger: CommandTrigger, triggerPlayer: ClientPlayer, playerInput: any[], p: CustomCommandParams_8): void {
        let bgmURL = p.bgm.split(",")[0];
        // 如果不存在该音乐则添加入库
        if (WorldData.myMusic.indexOf(bgmURL) == -1) WorldData.myMusic.push(bgmURL);
        // 立刻储存全局数据（与存档无关）
        SinglePlayerGame.saveGlobalData(null);
    }
    // -- 注册音乐图鉴的全局数据
    SinglePlayerGame.regSaveCustomGlobalData("___myMusic", Callback.New(() => {
        return WorldData.myMusic;
    }, null));
    // -- 监听游戏初始化同步自定义数据
    EventUtils.addEventListener(ClientWorld, ClientWorld.EVENT_INITED, Callback.New(snycCustomGlobalData, null), true);
    // -- 监听读档后同步自定义数据
    EventUtils.addEventListener(SinglePlayerGame, SinglePlayerGame.EVENT_ON_AFTER_RECOVERY_DATA, Callback.New(snycCustomGlobalData, null), false);
    function snycCustomGlobalData() {
        let myCG = SinglePlayerGame.getSaveCustomGlobalData("___myCG");
        if (myCG) WorldData.myCG = myCG;
        let myMusic = SinglePlayerGame.getSaveCustomGlobalData("___myMusic");
        if (myMusic) WorldData.myMusic = myMusic;
    }
    /**
     * 模拟按键
     */
    export function customCommand_10(commandPage: CommandPage, cmd: Command, trigger: CommandTrigger, triggerPlayer: ClientPlayer, playerInput: any[], p: CustomCommandParams_10): void {
        // 键盘按键
        if (p.isMulKey == 0) {
            simulateKey(p.key);
        }
        // 系统按键
        else {
            let systemKeyName = GUI_Setting.SYSTEM_KEYS[p.systemKey];
            let systemKeyboardInfo: { index: number, name: string, keys: number[] } = GUI_Setting.KEY_BOARD[systemKeyName];
            let realKeyCode = systemKeyboardInfo.keys[0];
            if (!realKeyCode) return;
            simulateKey(realKeyCode);
        }
        // 模拟按键
        function simulateKey(key: number) {
            // -- 按下/弹起
            if (p.evType <= 1) {
                let e = new EventObject;
                e.type = [EventObject.KEY_DOWN, EventObject.KEY_UP][p.evType];
                let oe: KeyboardEvent = new KeyboardEvent(e.type, { ctrlKey: p.CTRL, shiftKey: p.SHIFT, altKey: p.ALT }) as any;
                e.nativeEvent = oe;
                e.keyCode = key;
                stage.event(e.type, [e]);
            }
            // -- 按下并弹起
            else if (p.evType == 2) {
                let e = new EventObject;
                e.type = EventObject.KEY_DOWN;
                let oe: KeyboardEvent = new KeyboardEvent(e.type, { ctrlKey: p.CTRL, shiftKey: p.SHIFT, altKey: p.ALT }) as any;
                e.nativeEvent = oe;
                e.keyCode = key;
                stage.event(EventObject.KEY_DOWN, [e]);
                setTimeout(() => {
                    let e = new EventObject;
                    e.type = EventObject.KEY_UP;
                    let oe: KeyboardEvent = new KeyboardEvent(e.type, { ctrlKey: p.CTRL, shiftKey: p.SHIFT, altKey: p.ALT }) as any;
                    e.nativeEvent = oe;
                    e.keyCode = key;
                    stage.event(e.type, [e]);
                }, p.interval);
            }
        }
    }
    /**
     * 提交信息
     */
    export function customCommand_11(commandPage: CommandPage, cmd: Command, trigger: CommandTrigger, triggerPlayer: ClientPlayer, playerInput: any[], p: CustomCommandParams_11): void {
        let inputMessages = [];
        for (let i = 0; i < p.messages.length; i++) {
            let d = p.messages[i];
            let f: Function;
            let v: any;
            if (d.type == 0) {
                f = CustomGameNumber["f" + d.numberValue[0]];
                v = f ? f(null, d.numberValue[1]) : null;
                inputMessages.push(v);
            }
            else if (d.type == 1) {
                f = CustomCondition["f" + d.booleanValue[0]];
                v = f ? f(null, d.booleanValue[1]) : null;
                inputMessages.push(v);
            }
            else if (d.type == 2) {
                f = CustomGameString["f" + d.stringValue[0]];
                v = f ? f(null, d.stringValue[1]) : null;
                inputMessages.push(v);
            }
        }
        GameCommand.inputMessageAndContinueExecute(inputMessages);
    }
    /**
     * 按钮按键焦点设置
     */
    let ____uiButtonFocus: { [sign: string]: FocusButtonsManager } = {};
    export function customCommand_12(commandPage: CommandPage, cmd: Command, trigger: CommandTrigger, triggerPlayer: ClientPlayer, playerInput: any[], p: CustomCommandParams_12): void {
        let uiID = p.useVar ? Game.player.variable.getVariable(p.uiIDVarID) : p.uiID;
        let ui = GameUI.get(uiID);
        if (!ui || !ui.stage) return;
        // 根据参数记录标识
        let sign = "";
        sign += uiID + "_";
        sign += p.isAutoFocus ? "1_" : "0_";
        sign += p.isAddButton ? "1_" : "0_";
        sign += p.isExcludeButton ? "1_" : "0_";
        if (p.isAddButton) {
            sign += p.addButtons.join("+");
        }
        if (p.isExcludeButton) {
            sign += p.excludeButtons.join("-");
        }
        sign += p.selEffectUI + "_";
        sign += p.useFocusAnimation ? "1_" : "0_";
        // 获取
        let btnFocusManager = ____uiButtonFocus[sign];
        if (btnFocusManager) {
            btnFocusManager.shortcutKeyExit = p.shortcutKeyExit;
            btnFocusManager.whenExitBackLastFocus = p.whenExitBackLastFocus;
            btnFocusManager.whenExitEvent = p.whenExitEvent;
        }
        else {
            btnFocusManager = ____uiButtonFocus[sign] = new FocusButtonsManager(ui, p.isAutoFocus, p.isAddButton ? p.addButtons : [], p.isExcludeButton ? p.excludeButtons : [], p.selEffectUI, p.useFocusAnimation, p.shortcutKeyExit, p.whenExitBackLastFocus);
            btnFocusManager.whenExitEvent = p.whenExitEvent;
            // 监听销毁事件，如果界面被销毁则此处也清理掉引用记录
            ui.once(GameSprite.ON_DISPOSE, this, (sign: string, btnFocusManager: FocusButtonsManager) => {
                delete ____uiButtonFocus[sign];
                btnFocusManager.dispose();
            }, [sign, btnFocusManager]);
        }
        if (btnFocusManager.buttons.length == 0) return;
        // 设置焦点
        FocusButtonsManager.focus = btnFocusManager;
        // 设置焦点索引
        if (p.setSelectedIndex && FocusButtonsManager.focus) {
            FocusButtonsManager.focus.selectedIndex = p.selectedIndex;
        }
    }
    /**
     * 关闭界面焦点
     */
    export function customCommand_13(commandPage: CommandPage, cmd: Command, trigger: CommandTrigger, triggerPlayer: ClientPlayer, playerInput: any[], p: CustomCommandParams_13): void {
        if (p.focusType == 0 || p.focusType == 2) {
            FocusButtonsManager.focus = null;
        }
        if (p.focusType == 1 || p.focusType == 2) {
            UIList.focus = null;
        }
    }
    /**
     * 选中列表焦点
     */
    export function customCommand_14(commandPage: CommandPage, cmd: Command, trigger: CommandTrigger, triggerPlayer: ClientPlayer, playerInput: any[], p: CustomCommandParams_14): void {
        let uiListInfo = p.list;
        if (!uiListInfo) return;
        let ui = GameUI.get(uiListInfo.uiID)
        if (!ui) return;
        let uiList: UIList = ui[uiListInfo.compName];
        if (!uiList || !(uiList instanceof UIList)) return;
        UIList.focus = uiList;
    }
    //------------------------------------------------------------------------------------------------------
    // 
    //------------------------------------------------------------------------------------------------------
    export function customCommand_1001(commandPage: CommandPage, cmd: Command, trigger: CommandTrigger, triggerPlayer: ClientPlayer, playerInput: any[], p: CustomCommandParams_1001): void {
        if (GameDialog.isInDialog && !GameDialog.isPlaying) {
            let dialogBtnsUI = GameUI.get(3);
            if (dialogBtnsUI != Game.layer.uiLayer.getChildAt(Game.layer.uiLayer.numChildren - 1)) return;
            GameDialog.skip();
        }
    }
    export function customCommand_1002(commandPage: CommandPage, cmd: Command, trigger: CommandTrigger, triggerPlayer: ClientPlayer, playerInput: any[], p: CustomCommandParams_1002): void {
        if (GameDialog.isInDialog && GameDialog.isPlaying) {
            let dialogBtnsUI = GameUI.get(3);
            if (dialogBtnsUI != Game.layer.uiLayer.getChildAt(Game.layer.uiLayer.numChildren - 1)) return;
            GameDialog.showall();
        }
    }
    export function customCommand_1003(commandPage: CommandPage, cmd: Command, trigger: CommandTrigger, triggerPlayer: ClientPlayer, playerInput: any[], p: CustomCommandParams_1003): void {
        let dialogBtnsUI = GameUI.get(3);
        if (dialogBtnsUI != Game.layer.uiLayer.getChildAt(Game.layer.uiLayer.numChildren - 1)) return;
        GameDialog.skipWaitPlayerOperation();
    }
    //------------------------------------------------------------------------------------------------------
    // 系统
    //------------------------------------------------------------------------------------------------------
    export function customCommand_4001(commandPage: CommandPage, cmd: Command, trigger: CommandTrigger, triggerPlayer: ClientPlayer, playerInput: any[], p: CustomCommandParams_4001): void {
        os.fullscreen = p.fullScreen;
    }
    /**
     * 隐藏对话功能菜单
     */
    export function customCommand_4002(commandPage: CommandPage, cmd: Command, trigger: CommandTrigger, triggerPlayer: ClientPlayer, playerInput: any[], p: CustomCommandParams_4002): void {
        ClientWorld.variable.setSwitch(15004, p.displayDialogBtns == 0 ? 0 : 1);
    }
    /**
     * 开始游戏
     */
    let callNewGame = false;
    export function customCommand_4005(commandPage: CommandPage, cmd: Command, trigger: CommandTrigger, triggerPlayer: ClientPlayer, playerInput: any[], p: CustomCommandParams_4005): void {
        if (callNewGame) return;
        callNewGame = true;
        SinglePlayerGame.newGame();
    }
    /**
     * 存档
     */
    export function customCommand_4006(commandPage: CommandPage, cmd: Command, trigger: CommandTrigger, triggerPlayer: ClientPlayer, playerInput: any[], p: CustomCommandParams_4006): void {
        if (p.saveType == 0) {
            trigger.pause = true;
            trigger.offset(1);
            SinglePlayerGame.saveGlobalData(Callback.New(() => {
                CommandPage.executeEvent(trigger);
            }, this));
        }
        else if (p.saveType == 1) {
            if (GUI_SaveFileManager.currentSveFileIndexInfo) {
                // 命令偏移一行，以便下次恢复执行时执行下一行而不是本行
                trigger.offset(1);
                GUI_SaveFileManager.saveFile(GUI_SaveFileManager.currentSveFileIndexInfo.id, p.silenceMode ? false : true, Callback.New(() => {
                    CommandPage.executeEvent(trigger);
                }, this), true);
                // 暂停必须放在存档后面，否则存档将正在执行的该事件暂停状态也一起保存了
                trigger.pause = true;
            }
        }
        else {
            let saveID = p.saveID;
            // 命令偏移一行，以便下次恢复执行时执行下一行而不是本行
            trigger.offset(1);
            GUI_SaveFileManager.saveFile(saveID, p.silenceMode ? false : true, Callback.New(() => {
                CommandPage.executeEvent(trigger);
            }, this), true);
            // 暂停必须放在存档后面，否则存档将正在执行的该事件暂停状态也一起保存了
            trigger.pause = true;
        }
    }
    /**
     *  返回标题
     */
    export function customCommand_4008(commandPage: CommandPage, cmd: Command, trigger: CommandTrigger, triggerPlayer: ClientPlayer, playerInput: any[], p: CustomCommandParams_4008): void {
        window.location.reload();
    }
    /**
     *  关闭窗口
     */
    export function customCommand_4011(commandPage: CommandPage, cmd: Command, trigger: CommandTrigger, triggerPlayer: ClientPlayer, playerInput: any[], p: CustomCommandParams_4011): void {
        os.closeWindow();
    }
    /**
     *  设置世界属性
     */
    export function customCommand_4012(commandPage: CommandPage, cmd: Command, trigger: CommandTrigger, triggerPlayer: ClientPlayer, playerInput: any[], p: CustomCommandParams_4012): void {
        let varName: string;
        if (p.worldData.selectMode == 1) {
            let mode = p.worldData.inputModeInfo.mode;
            let constName = p.worldData.inputModeInfo.constName;
            let varNameIndex = p.worldData.inputModeInfo.varNameIndex;
            varName = mode == 0 ? constName : Game.player.variable.getString(varNameIndex);
        }
        else {
            varName = p.worldData.varName;
        }
        if (WorldData[varName] == undefined) return;
        let count = (oldValue: number, value: number) => {
            if (typeof oldValue != "number" || typeof value != "number") return value;
            let v: number;
            //@ts-ignore
            if (!p.worldData.operationType) v = value;
            //@ts-ignore
            switch (p.worldData.operationType) {
                case 1: v = oldValue + value; break;//加
                case 2: v = oldValue - value; break;//减
                case 3: v = oldValue * value; break;//乘
                case 4: v = oldValue / value; break;//除
                case 5: v = oldValue % value; break;//余
                case 6: v = Math.pow(oldValue, value); break;//幂
            }
            //@ts-ignore
            return p.worldData.isRounded ? MathUtils.int(v) : v;
        }
        if (p.worldData.valueType == 0) {
            let v = p.worldData.value;
            if (v) {
                //object类型
                if (p.worldData.selectMode == 1 && p.worldData.inputModeInfo.typeIndex == 3) {
                    try {
                        v.value = JSON.parse(v.value as any);
                    } catch (e) {
                        (v.value as any) = {};
                    }
                }
                WorldData[varName] = count(WorldData[varName], v.value);
            }
        }
        else {
            let v = p.worldData.value;
            if (v && v.value) {
                let varID: number = v.value;
                switch (v.varType) {
                    case 0:
                        WorldData[varName] = count(WorldData[varName], Game.player.variable.getVariable(varID));
                        break;
                    case 1:
                        WorldData[p.worldData.varName] = Game.player.variable.getString(varID);
                        break;
                    case 2:
                        WorldData[p.worldData.varName] = Game.player.variable.getSwitch(varID);
                        break;
                }
            }
        }
    }
}