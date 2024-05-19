/**
 * 游戏总控制器
 * Created by Karson.DS on 2024-03-13 00:33:04.
 */
class Controller {
    /** 控制器开启事件 */
    static EVENT_CONTROLLER_START: string = "ControllerEVENT_CONTROLLER_START";
    /** 控制器关闭事件 */
    static EVENT_CONTROLLER_STOP: string = "ControllerEVENT_CONTROLLER_STOP";
    /** 控制器启动状态 */
    static ctrlStart: boolean;
    /**
     * 启动控制器
     */
    static start(): void {
        // 调用一次清理
        this.stop();
        // 控制器启动状态
        Controller.ctrlStart = true;
        // 键盘控制器启动
        // KeyboardControl.start();
        // 手柄控制器启动
        GamepadControl.start();
        // 派发事件
        EventUtils.happen(Controller, Controller.EVENT_CONTROLLER_START);
    }
    /**
     * 停止控制
     */
    static stop(): void {
        // 控制器关闭状态
        Controller.ctrlStart = false;
        // 键盘控制器关闭
        // KeyboardControl.stop();
        // 手柄控制器关闭
        GamepadControl.stop();
        // 派发事件
        EventUtils.happen(Controller, Controller.EVENT_CONTROLLER_STOP);
    }
}