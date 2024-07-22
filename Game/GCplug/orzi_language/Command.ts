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
    export function customCommand_15001(commandPage: CommandPage, cmd: Command, trigger: CommandTrigger, triggerPlayer: ClientPlayer, playerInput: any[], p: CustomCommandParams_15001): void {
        if (p.local && p.local > 0) {
            // 获取语言包内容
            let _data = GameData.getModuleData(Orzi_Tools.Language.PLUGIN_MODULE_TYPE_OrziLanguage, p.local);
            // 没有就不修改
            // if (!_data) return; // 不做兼容，没有就直接卡死，不然开发者不知道
            if (!_data) console.error('语言包设置错误！');
            Orzi_Tools.Language.setLanguage(_data.name as any, WorldData.orzi_language_isChangeAsset && WorldData.orzi_language_isReload);
        }
    }

    /** 调试指令 */
    export function customCommand_15002(commandPage: CommandPage, cmd: Command, trigger: CommandTrigger, triggerPlayer: ClientPlayer, playerInput: any[], p: CustomCommandParams_15002): void {
        if (Orzi_Tools.Language.getIsDev()) {
            if (p.type === 0) Orzi_Tools.Language.getAllTextAndSave(p.saveType === 1 ? 1 : 0, p.isClearHTML);
            else Orzi_Tools.Language.backup();
        }
    }

}
