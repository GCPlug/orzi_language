class WorldData {
    static readonly screenMode: number; // = 0; 移动端屏幕布局模式
    static readonly saveFileMax: number; // = 10; 存档总数
    static readonly bornScene: number; // = 0; 游戏初始场景
    static dialogRecords: DataStructure_dialogRecordInfo[]; // = [];
    static myCG: number[]; // = [];
    static myMusic: string[]; // = [];
    static readonly wordPlaySpeedFromSetting: boolean; // = false; 文本播放速度由玩家设置
    static readonly hotkeyEnabled: boolean; // = false; 启用按键
    static readonly selectSE: string; // = ""; 光标
    static readonly sureSE: string; // = ""; 确定
    static readonly cancelSE: string; // = ""; 取消
    static readonly disalbeSE: string; // = ""; 禁用
    static readonly dialogSE: string; // = ""; 文本播放音效
    static readonly fileReload: boolean; // = false; 读档时强制重启游戏
    static readonly disposeInterval: number; // = 60; 系统自动释放资源时间
    static readonly focusEnabled: boolean; // = false; 使用按钮焦点
    static readonly hotKeyListEnabled: boolean; // = false; 允许按键操作列表
    static readonly uiCompFocusAnimation: number; // = 0; 界面组件焦点动画
    static keyboards: DataStructure_gameKeyboard[]; // = [];
    static word_gamepadInput: string; // = ""; 请按下游戏手柄键位
    static word_keyboardInput: string; // = ""; 请输入键盘键位
    static orzi_language_packages: number[]; // = [];
    static orzi_language_isChangeAsset: boolean; // = false; 是否修改资源
    static orzi_language_isForceChange: boolean; // = false; 非电脑平台是否强制使用语言包地址
    static orzi_language_isReload: boolean; // = false; 切换语言是否刷新
}
class PlayerData {
    sceneObject: SceneObject;
}