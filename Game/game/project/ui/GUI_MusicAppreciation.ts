/**
 * 音乐鉴赏界面
 * Created by 黑暗之神KDS on 2022-02-05 19:59:50.
 */
class GUI_MusicAppreciation extends GUI_14 {
    /**
     * 播放中状态
     */
    private isPlaying: boolean;
    /**
     * 记录当前的播放时间（秒）
     */
    private currentTime: number = 0;
    /**
     * 记录当前播放的BGM索引
     */
    private currentBGMIndex: number = -1;
    /**
     * 是否拖拽进度条中
     */
    private dragingTimeProgress: boolean;
    /**
     * 构造函数
     */
    constructor() {
        super();
        // 标准化list
        GUI_Manager.standardList(this.musicList);
        this.on(EventObject.DISPLAY, this, this.onDisplay);
        this.on(EventObject.UNDISPLAY, this, this.onUndisplay);
        this.musicList.on(EventObject.DOUBLE_CLICK, this, this.onItemClick);
        this.musicList.on(EventObject.CHANGE, this, this.onMusicListItemChange);
        this.musicList.on(UIList.ITEM_CREATE, this, this.onListItemCreate);
        this.musicList.on(UIList.ITEM_CLICK, this, this.onItemClick);
        this.playCheckBox.on(EventObject.CHANGE, this, this.onPlayBtnClick);
        this.nextBtn.on(EventObject.CLICK, this, this.onNext);
        this.previousBtn.on(EventObject.CLICK, this, this.onPrevious);
        this.timeProgress.on(EventObject.CHANGE, this, this.onChangeMusicProgress);
    }
    //------------------------------------------------------------------------------------------------------
    //  事件
    //------------------------------------------------------------------------------------------------------
    /**
     * 当界面消失时
     */
    private onUndisplay(): void {
        this.stop();
    }
    /**
     * 当界面显示时
     */
    private onDisplay() {
        this.stop();
        let arr = [];
        let len = WorldData.myMusic.length;
        for (let i = 0; i < len; i++) {
            let musicURL: string = WorldData.myMusic[i];
            let musicName = musicURL ? musicURL.split(",")[0].split("/").pop() : "";
            let d = new ListItem_1004;
            arr.push(d);
            d.music = musicName;
            d.musicSelected = musicName;
            d.data = musicURL;
        }
        this.musicList.items = arr;
    }
    /**
     * 当列表项创建时的
     */
    private onListItemCreate(ui: GUI_1004, data: ListItem_1004, index: number): void {
        ui.music.visible = true;
        ui.musicSelected.visible = false;
    }
    /**
     * 当播放按钮点击时
     * @param e 
     */
    private onPlayBtnClick(e: EventObject): void {
        // 如果已不是相同的音乐则重新播放
        if (this.currentBGMIndex != this.musicList.selectedIndex) {
            this.play(this.musicList.selectedIndex);
            return;
        }
        // 否则暂停或继续播放
        if (!this.playCheckBox.selected) {
            this.pause();
        }
        else {
            this.continuie();
        }
    }
    /**
     * 当曲目列表项选中发生改变时的处理
     * @param state 0=选中改变 1=悬停改变
     */
    private onMusicListItemChange(state: number): void {
        ___listSEPlay(state);
        if (state == 0) this.musicList.scrollTo(this.musicList.selectedIndex, true, true, 200);
    }
    /**
     * 当列表中的项显示对象点击时：显示大图
     */
    private onItemClick() {
        let selectedIndex = this.musicList.selectedIndex;
        if (selectedIndex < 0) return;
        // 全部取消选中效果
        for (let i = 0; i < this.musicList.items.length; i++) {
            let itemUI = (this.musicList.getItemUI(i) as GUI_1004);
            itemUI.music.visible = true;
            itemUI.musicSelected.visible = false;
        }
        // 选中当前
        let selItemUI = this.musicList.getItemUI(this.musicList.selectedIndex) as GUI_1004;
        selItemUI.music.visible = false;
        selItemUI.musicSelected.visible = true;
        // 播放
        this.play(selectedIndex);
    }
    /**
     * 播放每帧刷新的处理
     */
    private onPlayUpdate(): void {
        let sc: SoundChannel = GameAudio.lastBgmSoundChannel;
        if (sc && sc.position && sc.duration) {
            let positionStr = this.fomatTime(sc.position);
            let durationStr = this.fomatTime(sc.duration);
            if (!this.dragingTimeProgress) {
                this.timePosition.text = positionStr;
                this.timeDuration.text = durationStr;
                this.timeProgress.setValueForce(sc.position * 100 / sc.duration);
            }
            this.currentTime = sc.position;
        }
    }
    /**
     * 当点击下一首按钮时的处理
     */
    private onNext(e: EventObject): void {
        let index = this.musicList.selectedIndex + 1;
        if (index >= this.musicList.items.length) {
            index = 0;
        }
        this.musicList.selectedIndex = index;
        this.play(index);
    }
    /**
     * 当点击上一首按钮时的处理
     */
    private onPrevious(e: EventObject): void {
        let index = this.musicList.selectedIndex - 1;
        if (index < 0) {
            index = this.musicList.items.length - 1;
        }
        this.musicList.selectedIndex = index;
        this.play(index);
    }
    /**
     * 当进度条的进度改变时的处理
     */
    private onChangeMusicProgress() {
        if (!this.dragingTimeProgress) {
            stage.off(EventObject.MOUSE_UP, this, this.onUpMusicProgress);
            stage.once(EventObject.MOUSE_UP, this, this.onUpMusicProgress);
            this.dragingTimeProgress = true;
        }
        let sc: SoundChannel = GameAudio.lastBgmSoundChannel;
        if (sc) {
            let position = sc.duration * this.timeProgress.value / 100
            let positionStr = this.fomatTime(position);
            let durationStr = this.fomatTime(sc.duration);
            this.timePosition.text = positionStr;
            this.timeDuration.text = durationStr;
        }
    }
    /**
     * 当鼠标在进度条中弹起时的处理
     */
    private onUpMusicProgress() {
        let sc: SoundChannel = GameAudio.lastBgmSoundChannel;
        if (sc) {
            this.currentTime = sc.startTime = this.timeProgress.value * sc.duration / 100;
            if (this.isPlaying) {
                sc.play();
            }
        }
        this.dragingTimeProgress = false;
    }
    //------------------------------------------------------------------------------------------------------
    //  功能
    //------------------------------------------------------------------------------------------------------
    /**
     * 停止播放
     */
    private stop(): void {
        this.isPlaying = false;
        GameAudio.stopBGM();
        os.remove_ENTERFRAME(this.onPlayUpdate, this);
        this.timePosition.text = `00:00`;
        this.timeDuration.text = `00:00`;
        this.timeProgress.setValueForce(0);
        this.playCheckBox.setSelectedForce(false);
        this.currentBGMIndex = -1;
    }
    /**
     * 播放
     * @param musicIndex 音乐索引位置
     */
    private play(musicIndex: number): void {
        if (musicIndex < 0) return;
        let item = this.musicList.items[musicIndex] as ListItem_1004;
        if (!item) return;
        this.stop();
        let url = item.data;
        GameAudio.playBGM(url);
        this.isPlaying = true;
        this.currentBGMIndex = musicIndex;
        this.playCheckBox.setSelectedForce(true);
        this.setSelectedIndexEffect(musicIndex);
        os.add_ENTERFRAME(this.onPlayUpdate, this);
        this.onPlayUpdate();
    }
    /**
     * 继续
     */
    private continuie(): void {
        let sc: SoundChannel = GameAudio.lastBgmSoundChannel;
        if (sc) {
            this.isPlaying = true;
            sc.startTime = this.currentTime;
            sc.play();
            os.add_ENTERFRAME(this.onPlayUpdate, this);
        }
        else {
            this.play(this.musicList.selectedIndex);
        }
    }
    /**
     * 暂停
     */
    private pause(): void {
        let sc: SoundChannel = GameAudio.lastBgmSoundChannel;
        if (sc) {
            this.isPlaying = false;
            sc.pause();
            os.remove_ENTERFRAME(this.onPlayUpdate, this);
        }
    }
    //------------------------------------------------------------------------------------------------------
    //  通用
    //------------------------------------------------------------------------------------------------------
    /**
     * 选中的条目
     */
    private setSelectedIndexEffect(index: number) {
        // 全部取消选中效果
        for (let i = 0; i < this.musicList.items.length; i++) {
            let itemUI = (this.musicList.getItemUI(i) as GUI_1004);
            itemUI.music.visible = true;
            itemUI.musicSelected.visible = false;
        }
        // 选中当前
        if (index >= 0) {
            let selItemUI = this.musicList.getItemUI(index) as GUI_1004;
            selItemUI.music.visible = false;
            selItemUI.musicSelected.visible = true;
        }
    }
    /**
     * 格式化时间显示
     * @param second 总秒数
     * @return [string] 
     */
    private fomatTime(second: number): string {
        let minuteStr = MathUtils.fixIntDigit(Math.floor(second / 60), 2);
        let secondStr = MathUtils.fixIntDigit(Math.floor(second % 60), 2);
        return `${minuteStr}:${secondStr}`;
    }
}