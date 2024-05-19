/**
 * 项目层游戏管理器实现类
 * -- 为了让系统API属性的类别直接指向项目层的实现类
 *    游戏内会经常用到Game.player以及Game.currentScene，实现此类可指向项目层自定义的「玩家类」和「场景类」
 *    
 * 
 * Created by 黑暗之神KDS on 2020-09-08 17:00:46.
 */
class ProjectGame extends GameBase {
    /**
     * 游戏开始时间（新游戏时记录，读档后记录档案的时间会计算差值以便获得游戏总游玩时间）
     */
    static gameStartTime: Date;
    /**
    * 当前的场景对象：重写，以便类别能够对应项目层自定义的子类
    */
    declare currentScene: ClientScene;
    /**
     * 玩家对象：重写，便类别能够对应项目层自定义的子类
     */
    declare player: ProjectPlayer;
    /**
     * 构造函数
     */
    constructor() {
        super();
        EventUtils.addEventListener(GameGate, GameGate.EVENT_IN_SCENE_STATE_CHANGE, Callback.New(this.onInSceneStateChange, this));
    }
    /**
     * 初始化
     */
    init() {
        // 创建的玩家是这个项目层自定义类的实例
        this.player = new ProjectPlayer();
    }
    //------------------------------------------------------------------------------------------------------
    // 私有实现
    //------------------------------------------------------------------------------------------------------
    private onInSceneStateChange(inNewSceneState: number) {
        // 新游戏的话：记录当前时间为启动时间
        if (inNewSceneState == 1) {
            ProjectGame.gameStartTime = new Date();
        }
        // 读取存档的情况：以当前的时间减去已游戏时间来记录
        else if (inNewSceneState == 2) {
            ProjectGame.gameStartTime = new Date((Date.now() - GUI_SaveFileManager.currentSveFileIndexInfo.indexInfo.gameTime));
        }
    }
}