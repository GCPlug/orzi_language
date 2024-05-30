/**
 * Created by Karson.DS on 2024-05-23 08:49:41.
 */
class GUI_AssetViewer extends GUI_14001 {
    /**
     * 该界面的编号
     */
    static PLUGIN_GUI_GUI_AssetViewer: number = 14001;
    /**
     * 定期输出资源日志的时间（秒）
     */
    static LOG_SAVE: boolean = true;
    static LOG_INTERVAL_TIME: number = 30 * 1000;
    /**
     * 缓存的图片资源
     */
    imagesOrderByName: DebugImageInfo[];
    imagesOrderBySize: DebugImageInfo[];
    imagesOrderByTimes: DebugImageInfo[];
    totalMemory: number;
    private lastSINGLE_FOCUS_MODE: boolean;
    allImageInfo: string;
    debugImages: { [url: string]: boolean } = {};
    //------------------------------------------------------------------------------------------------------
    // 静态方法
    //------------------------------------------------------------------------------------------------------
    /**
     * 储存日志
     */
    static saveLog(): void {
        let allImageInfo = ``;
        let totalMemory = 0;
        let pictureCount = 0;
        let arr = [];
        for (let url in AssetManager.assetCountMap) {
            let texture = AssetManager.getImage(url);
            if (texture && texture instanceof Texture) {
                let size = this.getTextureSize(texture);
                totalMemory += size;
                pictureCount++;
                arr.push({ url: url, size: size, texture: texture });
            }
        }
        arr.sort((a, b) => { return a.size > b.size ? -1 : 1; });
        for (var i = 0; i < arr.length; i++) {
            let o = arr[i];
            allImageInfo += `【${AssetManager.assetCountMap[o.url]}】${o.url} (${this.sizeToString(o.size)})（${o.texture.width}x${o.texture.height}）\n`;
        }
        allImageInfo = GUI_AssetViewer.getImageInfo(pictureCount, totalMemory, allImageInfo);
        let allImageInfoArr = allImageInfo.split(`\n`);
        FileUtils.save(allImageInfoArr, `log/assetViewwerLog.logbak`, Callback.New(() => {
            FileUtils.cloneFile(`log/assetViewwerLog.logbak`, `log/assetViewwerLog.log`, Callback.New(() => {
                FileUtils.deleteFile(`log/assetViewwerLog.logbak`, Callback.New(() => {

                }, this));
            }, this));
        }, this));
    }
    /**
     * 获取应用程序内存
     */
    static getAppMemory() {
        let process: any = gcTop[`process`];
        if (process && process.memoryUsage && typeof process.memoryUsage == `function`) {
            let p = process.memoryUsage();
            return p.rss + p.heapTotal + p.external;
        }
        return 0;
    }
    //------------------------------------------------------------------------------------------------------
    //  初始化
    //------------------------------------------------------------------------------------------------------
    /**
     * 构造函数
     */
    constructor() {
        super();
        this.list.optimizationMode = true;
        this.on(EventObject.DISPLAY, this, this.onDisplay);
        this.on(EventObject.UNDISPLAY, this, this.onUnDisplay);
        this.tab.on(EventObject.CHANGE, this, this.refreshImageList);
        this.refreshBtn.on(EventObject.CLICK, this, this.onRefresh);
        this.copyBtn.on(EventObject.MOUSE_DOWN, this, this.onCopy);
        this.list.on(UIList.ITEM_CREATE, this, this.onCreateItem);
        this.closeBtn.on(EventObject.CLICK, this, this.onClose);
        this.recordDebugImages();
        this.resize();
    }
    /**
     * 当显示时
     */
    private onDisplay(): void {
        this.init();
        this.refreshImageCount();
        this.refreshImageMemory();
        this.refreshAPPMemory();
        this.refreshImageList();
        this.lastSINGLE_FOCUS_MODE = UIList.SINGLE_FOCUS_MODE
        if (UIList.SINGLE_FOCUS_MODE) {
            UIList.SINGLE_FOCUS_MODE = false;
            this.list.mouseEnabled = true;
        }
    }
    private onUnDisplay(): void {
        UIList.SINGLE_FOCUS_MODE = this.lastSINGLE_FOCUS_MODE;
    }
    private init(): void {
        this.allImageInfo = ``;
        this.totalMemory = 0;
        let arr: DebugImageInfo[] = [];
        for (let url in AssetManager.assetCountMap) {
            // @ts-ignore
            let texture = loader.getRes(url); // 开放API
            if (texture && texture instanceof Texture) {
                let d = new DebugImageInfo;
                d.texture = texture;
                d.size = GUI_AssetViewer.getTextureSize(texture);
                d.sizeString = GUI_AssetViewer.sizeToString(d.size);
                this.totalMemory += d.size;
                d.url = url;
                d.times = AssetManager.assetCountMap[url];
                arr.push(d);
                this.allImageInfo += `【${d.times}】${d.url} (${d.sizeString})（${texture.width}x${texture.height}）\n`;
            }
        }
        this.allImageInfo = GUI_AssetViewer.getImageInfo(arr.length, this.totalMemory, this.allImageInfo);
        this.imagesOrderByName = arr.concat();
        this.imagesOrderBySize = arr.concat();
        this.imagesOrderByTimes = arr.concat();
        this.imagesOrderByName.sort((a, b) => { return a.url < b.url ? -1 : 1; });
        this.imagesOrderBySize.sort((a, b) => { return a.size > b.size ? -1 : 1; });
        this.imagesOrderByTimes.sort((a, b) => { return a.times > b.times ? -1 : 1; });
    }
    /**
     * 适配分辨率
     */
    private resize(): void {
        this.list.width = stage.width;
        this.website.y = stage.height - this.website.height;
        this.list.height = stage.height - this.website.height - this.list.y - 5;
    }
    private recordDebugImages(): void {
        this.debugImages[this.tab.itemImage1] = true;
        this.debugImages[this.tab.itemImage2] = true;
        this.debugImages[this.refreshBtn.image1] = true;
        this.debugImages[this.refreshBtn.image1] = true;
        this.debugImages[this.refreshBtn.image1] = true;
        this.debugImages[this.list.hScrollBar] = true;
        this.debugImages[this.list.vScrollBar] = true;
        this.debugImages[this.bg.image] = true;
    }
    //------------------------------------------------------------------------------------------------------
    //  刷新
    //------------------------------------------------------------------------------------------------------
    private onCreateItem(ui: GUI_14002, data: ListItem_14002, index: number): void {
        let info = data.data as DebugImageInfo;
        ui.imageSprite.data = info.texture;
        ui.imageSprite.graphics.clear();
        ui.imageSprite.graphics.drawTexture(info.texture, 0, 0, ui.imageSprite.width, ui.imageSprite.height);
    }
    /**
     * 刷新图片计数
     */
    private refreshImageCount(): void {
        this.pictures.text = this.imagesOrderByName.length.toString();
    }
    /**
     * 刷新图片总内存占用数目
     */
    private refreshImageMemory(): void {
        this.pictureMemory.text = GUI_AssetViewer.sizeToString(this.totalMemory);
    }
    /**
     * 刷新应用程序内存占用
     */
    private refreshAPPMemory(): void {
        let process: any = gcTop[`process`];
        if (process && process.memoryUsage && typeof process.memoryUsage == `function`) {
            let p = process.memoryUsage();
            this.appMemory.text = GUI_AssetViewer.sizeToString(p.rss + p.heapTotal + p.external);
        }
        else {
            this.appMemory.text = ``;
        }
    }
    /**
     * 刷新图片列表
     */
    private refreshImageList(): void {
        let orderType = this.tab.selectedIndex;
        let images = [this.imagesOrderByName, this.imagesOrderBySize, this.imagesOrderByTimes][orderType];
        let arr = [];
        for (var i = 0; i < images.length; i++) {
            let info = images[i];
            if (this.debugImages[info.url]) continue;
            let d = new ListItem_14002;
            d.data = info;
            // d.image = info.url;
            d.sizeText = info.sizeString + `（${info.texture.width}x${info.texture.height}）`;
            d.url = `【${info.times}】${GUI_AssetViewer.getDisplayURL(info.url)}`;
            arr.push(d);
        }
        this.list.items = arr;
        this.list.refresh();
    }
    //------------------------------------------------------------------------------------------------------
    //  内部实现 - 事件
    //------------------------------------------------------------------------------------------------------
    /**
     * 刷新
     */
    private onRefresh(): void {
        this.onDisplay();
    }
    /**
     * 复制
     */
    private onCopy(): void {
        // @ts-ignore
        if (typeof navigator == `undefined`) return;
        let navigatorx = os.platform == 0 ? navigator : gcTop[`navigator`];
        if (!navigatorx || !navigatorx.clipboard) return;
        navigatorx.clipboard
            .writeText(this.allImageInfo)
            .then(() => {
                alert(`copy success!`);
            })
            .catch((err) => {
                alert(`copy fail!`);
            });
    }
    /**
     * 关闭
     */
    private onClose(): void {
        GameUI.hide(this.guiID);
    }
    //------------------------------------------------------------------------------------------------------
    //  私有 - 静态方法
    //------------------------------------------------------------------------------------------------------
    /**
     * 获取贴图占用的内存/显存字节大小
     * @param tex 
     * @return [number] 
     */
    private static getTextureSize(tex: Texture): number {
        return tex.width * tex.height * 4;
    }
    /**
     * 格式化显示贴图占用的内存/显存字节大小
     * @param size 
     * @return [string] 
     */
    private static sizeToString(size: number): string {
        if (size < 1024) {
            return size + `Byte`;
        }
        else if (size < 1048576) {
            return (size / 1024).toFixed(2) + `KB`;
        }
        else if (size < 1073741824) {
            return (size / 1048576).toFixed(2) + `MB`;
        }
        else {
            return (size / 1073741824).toFixed(4) + `GB`;
        }
    }
    /**
     * 获取全信息
     * @param pictureCount 图片总数
     * @param totalMemory 图片总内存占用
     * @param allImageInfo 
     * @return [string] 
     */
    private static getImageInfo(pictureCount: number, totalMemory: number, allImageInfo: string): string {
        let d = new Date();
        let dStr = `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()} ${MathUtils.fixIntDigit(d.getHours(), 2)}:${MathUtils.fixIntDigit(d.getMinutes(), 2)}:${MathUtils.fixIntDigit(d.getSeconds(), 2)}`;
        return `GameCreator AssetViewer（www.gamecreator.com.cn）${dStr}:\npictures:${pictureCount} Picture Memory:${GUI_AssetViewer.sizeToString(totalMemory)} APP Memory:${GUI_AssetViewer.sizeToString(GUI_AssetViewer.getAppMemory())}\n` + allImageInfo;
    }
    /**
     * 获取可显示的URL
     * @param url 
     * @return [string] 
     */
    private static getDisplayURL(url: string): string {
        if (url.indexOf(`data:image/`) == 0) {
            return url.substr(0, 50);
        }
        return url;
    }
}
class DebugImageInfo {
    url: string;
    texture: Texture;
    size: number;
    times: number;
    sizeString: string;
}
// 
EventUtils.addEventListener(ClientWorld, ClientWorld.EVENT_INITED, Callback.New(() => {
    // 快捷键支持 ALT+CTRL+K 请勿删除，以便在正式项目中方便Debug
    stage.on(EventObject.KEY_DOWN, this, (e: EventObject) => {
        if (e.ctrlKey && e.altKey && e.keyCode == Keyboard.K) {
            if (GameUI.isOpened(GUI_AssetViewer.PLUGIN_GUI_GUI_AssetViewer)) {
                GameUI.hide(GUI_AssetViewer.PLUGIN_GUI_GUI_AssetViewer);
            }
            else {
                GameUI.show(GUI_AssetViewer.PLUGIN_GUI_GUI_AssetViewer);
            }
        }
    });
    // 定期输出日志
    if (GUI_AssetViewer.LOG_SAVE && FileUtils.hasFileOperationJurisdiction) {
        setInterval(() => { GUI_AssetViewer.saveLog(); }, GUI_AssetViewer.LOG_INTERVAL_TIME)
    }
}, this), true);