EventUtils.addEventListenerFunction(ClientWorld, ClientWorld.EVENT_INITED, () => {
    // 重写资源加载
    // @ts-ignore
    let __orzi_language_url_formatURL_old__ = Laya.URL.formatURL;
    // @ts-ignore
    Laya.URL.formatURL = function (url, base) {
        url = __orzi_language_url_formatURL_old__(url, base);
        // 如果要修改资源
        if (WorldData.orzi_language_isChangeAsset && (os.platform === 2 || WorldData.orzi_language_isForceChange)) {
            let oldUrl = url;
            let arr: string[] = url.split("asset/");
            // 重写资源加载
            if (arr.length > 1) {
                // 资源包内的文件
                let top = arr.shift() + 'asset/orzi/languages/asset/'+Orzi_Tools.Language.instance.local+'/';
                url = top + arr.join('asset/');

                // 仅在电脑端检查是否有该资源
                if (os.platform === 2) {
                    // 检查文件是否存在，不存在则使用原地址
                    // @ts-ignore
                    if (typeof mainDomain_fs !== 'undefined') {
                        // @ts-ignore
                        if (!mainDomain_fs.existsSync(url)) url = oldUrl;
                    }
                }
            }
        }
        return url;
    }

}, null);

// 重写字体加载
// @ts-ignore
let __orzi_language_fontLoadManager_toLoadFontFile_old__ = FontLoadManager.toLoadFontFile;
// @ts-ignore
FontLoadManager.toLoadFontFile = function (font) {
    let url = font.path;

    // 先去除掉带有语言包的路径
    url = url.replace(/asset\/orzi\/languages\/asset\/(.*?)\/font/g, 'asset/font');
    
    // 字体直接修改
    let oldUrl = url;
    let arr: string[] = url.split("asset/");
    function loadFontFile(local) {
        // 资源包内的文件
        let top = arr.shift() + 'asset/orzi/languages/asset/'+local+'/';
        url = top + arr.join('asset/');

        // 检查是否有该资源
        FileUtils.exists(url, Callback.New((is_exit) => {
            if (!is_exit) url = oldUrl;

            // 加载语言包
            font.path = url;

            __orzi_language_fontLoadManager_toLoadFontFile_old__(font);
        }, this))
    }
    // 重写资源加载
    if (arr.length > 1) {

        // 获取当前的语言包
        let local = Orzi_Tools.Language.instance.local;

        // 检查是否初始化
        if (Orzi_Tools.Language.instance.isInit) {
            // 如果已经加载过了，直接使用
            loadFontFile(local);
        } else {
            // 未加载的话，就去文件中找
            if (os.platform === 2) {
                AssetManager.loadText(Orzi_Tools.Language.path + '_local.txt', Callback.New((data) => {
                    if (data) local = JSON.parse(data);
                    loadFontFile(local);
                }, this));
            } else {
                let _local = LocalStorage.getItem('__orzi_language_local__');
                if (_local) local = _local;
                loadFontFile(local);
            }
        }

    }

};
