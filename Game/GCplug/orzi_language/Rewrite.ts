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
