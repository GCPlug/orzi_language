/**
 * Created by orzi on 2024-05-11 22:49:40.
 */
module CommandExecute {
    /**
     * 切换语言
     * @param commandPage 事件页
     * @param cmd 当前的事件命令
     * @param trigger 触发器
     * @param triggerPlayer 触发器对应的玩家
     * @param playerInput 玩家输入值，用于暂停执行该触发器事件并等待玩家输入后获得的值，执行完该函数后会被清空
     * @param p 自定义命令参数 1表示对应1号命令的参数
     */
    export function customCommand_15012(commandPage: CommandPage, cmd: Command, trigger: CommandTrigger, triggerPlayer: ClientPlayer, playerInput: any[], p: CustomCommandParams_15012): void {
        Orzi_Tools.Language.setLanguage(p.local as any);
    }

    /** 获取当前所有文本并保存 */
    export function customCommand_15017(commandPage: CommandPage, cmd: Command, trigger: CommandTrigger, triggerPlayer: ClientPlayer, playerInput: any[], p: CustomCommandParams_15017): void {
        Orzi_Tools.Language.getAllTextAndSave(1);
    }

    /** 备份语言 */
    export function customCommand_15018(commandPage: CommandPage, cmd: Command, trigger: CommandTrigger, triggerPlayer: ClientPlayer, playerInput: any[], p: CustomCommandParams_15018): void {
        Orzi_Tools.Language.backup();
    }
}
