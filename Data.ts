/**
 * Created by orzi on 2024-05-02 22:43:13.
 */

module CustomGameString {
    /**
     * 自定义游戏字符串
     * @param trigger 触发器，可能为空
     * @param p 自定义数值参数 
     */
    export function f9(trigger: CommandTrigger, p: CustomGameStringParams_9): string {
        return Orzi_Tools.Language.instance.local || '';
    }
}