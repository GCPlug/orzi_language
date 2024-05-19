/**
 * Created by 黑暗之神KDS on 2021-03-11 10:24:08.
 */
module CustomGameString {
    /**
     * 场景
     * @param trigger 触发器，可能为空
     * @param p 自定义数值参数 
     */
    export function f1(trigger: CommandTrigger, p: CustomGameStringParams_1): string {
        switch (p.type) {
            case 0:
                return Game.currentScene.name;
        }
        return "";
    }
    /**
     * 界面
     * @param trigger 触发器，可能为空
     * @param p 自定义数值参数 
     */
    export function f2(trigger: CommandTrigger, p: CustomGameStringParams_2): string {
        // 获取界面
        let uiID = p.uiComp.uiID;
        // 界面ID
        let ui: GUI_BASE = GameUI.get(uiID) as any;
        if (!ui) return "";
        // 根据组件唯一ID找到该组件
        let comp = ui.compsIDInfo[p.uiComp.compID];
        if (!comp) return "";
        let value = comp[p.uiComp.varName];
        return value == null ? "" : value.toString();
    }
    /**
     * 模块 - 字符串
     * @param trigger 触发器，可能为空
     * @param p 自定义数值参数 
     */
    export function f3(trigger: CommandTrigger, p: CustomGameStringParams_3): string {
        let moduleID = p.modelData.moduleID;
        let dataID: number;
        if (p.modelData.dataIsUseVar) {
            dataID = Game.player.variable.getVariable(p.modelData.dataVarID);
        }
        else {
            dataID = p.modelData.dataID;
        }
        let moduleData = GameData.getModuleData(moduleID, dataID);
        if (!moduleData) return "";
        //获取设置的名称
        let varName: string;
        if (p.modelData.selectMode == 1) {
            let mode = p.modelData.inputModeInfo.mode;
            let constName = p.modelData.inputModeInfo.constName;
            let varNameIndex = p.modelData.inputModeInfo.varNameIndex;
            varName = mode == 0 ? constName : Game.player.variable.getString(varNameIndex);
        }
        else {
            varName = p.modelData.varName;
        }
        if (moduleData[varName] == undefined || moduleData[varName] == null) return "";
        return moduleData[varName].toString();
    }
    /**
     * 世界 - 字符串
     * @param trigger 触发器，可能为空
     * @param p 自定义数值参数 
     */
    export function f4(trigger: CommandTrigger, p: CustomGameStringParams_4): string {
        //获取设置的名称
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
        if (WorldData[varName] == undefined || WorldData[varName] == null) return "";
        return WorldData[varName].toString();
    }
    /**
     * 系统
     * @param trigger 触发器，可能为空
     * @param p 自定义数值参数 
     */
    export function f5(trigger: CommandTrigger, p: CustomGameStringParams_5): string {
        switch (p.type) {
            case 0:
                return `${GameAudio.lastBgmURL},${GameAudio.lastBGMVolume},${GameAudio.lastBGMPitch}`
            case 1:
                return `${GameAudio.lastBgsURL},${GameAudio.lastBGSVolume},${GameAudio.lastBGSPitch}`
        }
    }
}