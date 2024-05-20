/**
 * Created by orzi on 2024-05-20 20:45:37.
 */
module CustomCondition {
    /**
     * 自定义条件：1表示对应ID=1的自定义条件
     * @param trigger 事件触发器
     * @param p 自定义参数
     * @return [boolean] 
     */
    export function f5(trigger: CommandTrigger, p: CustomConditionParams_5): boolean {
        if (p.type === 0) return Orzi_Tools.Language.getIsDev();
        else if (p.type === 1) {
            return Orzi_Tools.Language.instance.local === GameData.getModuleData(Orzi_Tools.Language.PLUGIN_MODULE_TYPE_OrziLanguage, p.judgeLanguage).name as any;
        }
        return true;
    }
}
