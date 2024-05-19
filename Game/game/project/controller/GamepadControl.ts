/**
 * 游戏手柄控制器
 * Created by 黑暗之神KDS on 2020-03-26 03:50:18.
 */
class GamepadControl {
    //------------------------------------------------------------------------------------------------------
    // 启动和停止
    //------------------------------------------------------------------------------------------------------
    static init(): void {
        GCGamepad.pad1.on(GCGamepad.GAMEPAD_LEFT_JOY_DIR4_CHANGE, this, this.onGamepadMenuDirChange, [true]);
        GCGamepad.pad1.on(GCGamepad.GAMEPAD_LEFT_KEY_CHANGE, this, this.onGamepadMenuDirChange, [false]);
        GCGamepad.pad1.on(GCGamepad.GAMEPAD_KEY_DOWN, this, this.onGamepadKeyDown, [EventObject.KEY_DOWN]);
        GCGamepad.pad1.on(GCGamepad.GAMEPAD_KEY_UP, this, this.onGamepadKeyDown, [EventObject.KEY_UP]);
    }
    /**
     * 启动
     */
    static start(): void {

    }
    /**
     * 停止
     */
    static stop(): void {

    }
    //------------------------------------------------------------------------------------------------------
    // 手柄通用操作-内部实现
    //------------------------------------------------------------------------------------------------------
    /**
     * 当使用手柄控制菜单方向
     * @param isJoy 
     * @param dir 
     */
    private static onGamepadMenuDirChange(isJoy: boolean, dir: number) {
        ProjectUtils.fromGamePad = true;
        // if (!GUI_Manager.inMenu && !GameDialog.isInDialog) return;
        let m = {
            2: GUI_Setting.KEY_BOARD.DOWN.keys[0], 4: GUI_Setting.KEY_BOARD.LEFT.keys[0],
            6: GUI_Setting.KEY_BOARD.RIGHT.keys[0], 8: GUI_Setting.KEY_BOARD.UP.keys[0]
        };
        let transKeyCode = m[dir];
        if (transKeyCode) stage.event(EventObject.KEY_DOWN, [{ keyCode: transKeyCode }]);
    }
    /**
     * 手柄按键-映射成键盘按键功能
     * -- 菜单按键映射菜单按键（头部标识为MENU）
     * -- 非菜单按键映射成非菜单按键
     * @param keyCode 
     */
    private static onGamepadKeyDown(keyboardEventType: string, keyCode: number): void {
        ProjectUtils.fromGamePad = true;
        if (GUI_Setting.IS_INPUT_KEY_MODE) return;
        switch (keyCode) {
            case GCGamepad.leftKeyIndex:
                return this.onGamepadMenuDirChange(true, 4);
            case GCGamepad.rightKeyIndex:
                return this.onGamepadMenuDirChange(true, 6);
            case GCGamepad.downKeyIndex:
                return this.onGamepadMenuDirChange(true, 2);
            case GCGamepad.upKeyIndex:
                return this.onGamepadMenuDirChange(true, 8);
        }
        let mapping = {
            [GUI_Setting.GAMEPAD.X.key]: GUI_Setting.KEY_BOARD.X,
            [GUI_Setting.GAMEPAD.Y.key]: GUI_Setting.KEY_BOARD.Y,
            [GUI_Setting.GAMEPAD.A.key]: GUI_Setting.KEY_BOARD.A,
            [GUI_Setting.GAMEPAD.B.key]: GUI_Setting.KEY_BOARD.B,
            [GUI_Setting.GAMEPAD.L1.key]: GUI_Setting.KEY_BOARD.L1,
            [GUI_Setting.GAMEPAD.L2.key]: GUI_Setting.KEY_BOARD.L2,
            [GUI_Setting.GAMEPAD.R1.key]: GUI_Setting.KEY_BOARD.R1,
            [GUI_Setting.GAMEPAD.R2.key]: GUI_Setting.KEY_BOARD.R2,
            [GUI_Setting.GAMEPAD.BACK.key]: GUI_Setting.KEY_BOARD.BACK,
            [GUI_Setting.GAMEPAD.START.key]: GUI_Setting.KEY_BOARD.START,
            [GCGamepad.leftKeyIndex]: GUI_Setting.KEY_BOARD.LEFT,
            [GCGamepad.rightKeyIndex]: GUI_Setting.KEY_BOARD.RIGHT,
            [GCGamepad.downKeyIndex]: GUI_Setting.KEY_BOARD.DOWN,
            [GCGamepad.upKeyIndex]: GUI_Setting.KEY_BOARD.UP
        }
        let keyboardInfo = mapping[keyCode];
        if (!keyboardInfo) return;
        stage.event(keyboardEventType, [{ keyCode: keyboardInfo.keys[0] }]);
    }
}