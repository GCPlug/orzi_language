EventUtils.addEventListenerFunction(ClientWorld, ClientWorld.EVENT_INITED, () => {
    // 初始化语言包
    Orzi_Tools.Language.init();
    const languageName = WorldData.orzi_language_packages.map((v => GameData.getModuleData(Orzi_Tools.Language.PLUGIN_MODULE_TYPE_OrziLanguage, v)?.name))
    trace('orzi_language is running!', languageName, Orzi_Tools.Language.instance.local);

    // 加载顺序问题，延迟一下
    let _timer = setTimeout(() => {
        if (os.platform === 2) {
            AssetManager.loadText(Orzi_Tools.Language.path + '_local.txt', Callback.New((data) => {
                if (data) Orzi_Tools.Language.setLanguage(JSON.parse(data));
            }, this));
        } else {
            let _local = LocalStorage.getItem('__orzi_language_local__');
            if (_local) Orzi_Tools.Language.setLanguage(_local);
        }
        clearTimeout(_timer);
    }, 300);

    /** 重写监听 */
    // @ts-ignore
    const __orzi_text_lang_temp = Laya.Text.prototype.lang;
    // @ts-ignore
    Laya.Text.prototype.lang = function (text, arg1, arg2, arg3, arg4, arg5, arg6, arg7, arg8, arg9, arg10) {
        __orzi_text_lang_temp.apply(this, arguments);
        // 二者不相等，刷新缓存
        if (Orzi_Tools.Language.getText(this.__orzi_language_temp__) !== Orzi_Tools.Language.getText(this._text)) this.__orzi_language_temp__ = this._text;
        if (Orzi_Tools.Language.getText(this.__orzi_language_temp_prompt__) !== Orzi_Tools.Language.getText(this._prompt)) this.__orzi_language_temp_prompt__ = this._prompt;
        // 当前语言包没找到，就去找源文本
        // 历史文本可能需要查源
        // if (this.__orzi_language_temp__ && !Orzi_Tools.Language.hasText(this.__orzi_language_temp__)) this.__orzi_language_temp__ = Orzi_Tools.Language.getOriginText(this.__orzi_language_temp__);
        // if (this.__orzi_language_temp_prompt__ && !Orzi_Tools.Language.hasText(this.__orzi_language_temp_prompt__)) this.__orzi_language_temp_prompt__ = Orzi_Tools.Language.getOriginText(this.__orzi_language_temp_prompt__);
        if (!this.__orzi_language_watching__) {
            this.__orzi_language_watching__ = true;
            EventUtils.addEventListenerFunction(Orzi_Tools.Language.instance.packages, Orzi_Tools.Language.EVENT_ON_CHANGE_LANGUAGE, this.__orzi_language_watch_func__, this);
        }
        if (!this.text && this.prompt) {
            this.prompt = Orzi_Tools.Language.clearSpan(Orzi_Tools.Language.getText(this.__orzi_language_temp_prompt__));
        } else {
            this.text = Orzi_Tools.Language.clearSpan(Orzi_Tools.Language.getText(this.__orzi_language_temp__));
        }
    }
    // @ts-ignore
    const __orzi_text_destroy_temp = Laya.Text.prototype.destroy;
    // @ts-ignore
    Laya.Text.prototype.destroy = function (destroyChild) {
        __orzi_text_destroy_temp.apply(this, arguments);
        (destroyChild === void 0) && EventUtils.removeEventListenerFunction(Orzi_Tools.Language.instance.packages, Orzi_Tools.Language.EVENT_ON_CHANGE_LANGUAGE, this.__orzi_language_watch_func__, this);
    };
    // @ts-ignore
    Laya.Text.prototype.__orzi_language_watch_func__ = function () {
        if (!this.text && this.prompt) {
            this.prompt = Orzi_Tools.Language.getText(this.__orzi_language_temp_prompt__);
        } else {
            this.text = Orzi_Tools.Language.getText(this.__orzi_language_temp__);
        }
        // if (this._getCSSStyle()) {
        //     this._getCSSStyle().fontFamily = this._getCSSStyle().fontFamily;
        // }
    }

    /** 重写监听 */
    Object.defineProperty(UITabBox.prototype, "items", {
        get: function () {
            if (!this.__orzi_language_watching__) {
                this.__orzi_language_watching__ = true;
                EventUtils.addEventListenerFunction(Orzi_Tools.Language.instance.packages, Orzi_Tools.Language.EVENT_ON_CHANGE_LANGUAGE, this.__orzi_language_watch_func__, this)
            }
            return this._items;
        },
        set: function (v) {
            this._items = v;

            if ((this.__orzi_language_temp__ !== this.items) && (Orzi_Tools.Language.getText(this.__orzi_language_temp__) !== Orzi_Tools.Language.getText(this.items))) this.__orzi_language_temp__ = this.items;
            if (this.items !== Orzi_Tools.Language.getText(this.__orzi_language_temp__)) this.items = Orzi_Tools.Language.getText(this.__orzi_language_temp__);

            if (!this.isDisposed) return;
            this.refreshItems();
        },
        enumerable: false,
        configurable: true
    });
    const __orzi_UITabBox_dispose_temp = UITabBox.prototype.dispose;
    UITabBox.prototype.dispose = function () {
        if (this.__orzi_language_watching__) {
            EventUtils.removeEventListenerFunction(Orzi_Tools.Language.instance.packages, Orzi_Tools.Language.EVENT_ON_CHANGE_LANGUAGE, this.__orzi_language_watch_func__, this);
        }
        __orzi_UITabBox_dispose_temp.apply(this, arguments);
    };
    // @ts-ignore
    UITabBox.prototype.__orzi_language_watch_func__ = function () {
        this.items = Orzi_Tools.Language.getText(this.__orzi_language_temp__);
    }

    /** 重写监听 */
    Object.defineProperty(UIComboBox.prototype, "itemLabels", {
        get: function () {

            if (!this.__orzi_language_watching__) {
                this.__orzi_language_watching__ = true;
                EventUtils.addEventListenerFunction(Orzi_Tools.Language.instance.packages, Orzi_Tools.Language.EVENT_ON_CHANGE_LANGUAGE, this.__orzi_language_watch_func__, this)
            }

            return this._itemLabels;
        },
        set: function (v) {
            if (v == null)
                return;
            this._itemLabels = v;

            if ((this.__orzi_language_temp__ !== this._itemLabels) && (Orzi_Tools.Language.getText(this.__orzi_language_temp__) !== Orzi_Tools.Language.getText(this._itemLabels))) this.__orzi_language_temp__ = this._itemLabels;
            if (this._itemLabels !== Orzi_Tools.Language.getText(this.__orzi_language_temp__)) this._itemLabels = Orzi_Tools.Language.getText(this.__orzi_language_temp__);

            this._itemLabelArr = v.split(",");
            this.selectedIndex = this.selectedIndex;
        },
        enumerable: false,
        configurable: true
    });
    const __orzi_UIComboBox_dispose_temp = UIComboBox.prototype.dispose;
    UIComboBox.prototype.dispose = function () {
        if (this.__orzi_language_watching__) {
            EventUtils.removeEventListenerFunction(Orzi_Tools.Language.instance.packages, Orzi_Tools.Language.EVENT_ON_CHANGE_LANGUAGE, this.__orzi_language_watch_func__, this);
        }
        __orzi_UIComboBox_dispose_temp.apply(this, arguments);
    }
    // @ts-ignore
    UIComboBox.prototype.__orzi_language_watch_func__ = function () {
        this._itemLabels = Orzi_Tools.Language.getText(this.__orzi_language_temp__);
    }


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
                url = decodeURIComponent(url);

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


    // 重写获取字符串变量
    let __orzi_language_variable_margeDynamicText = Variable.margeDynamicText;
    Variable.margeDynamicText = function(texts: [number, string | number][], player?: Player, trigger?: CommandTrigger) {
        let _texts = ObjectUtils.depthClone(texts);
        // 先翻译一次文本
        _texts = _texts.map((item) => {
            if (typeof item[1] === 'string') {
                item[1] = Orzi_Tools.Language.getText(item[1]);
            }
            return item;
        });
        let _str = __orzi_language_variable_margeDynamicText(_texts, player, trigger);
        // 最后再翻译一次
        return Orzi_Tools.Language.getText(_str);
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
    // 加载字体文件
    function loadFontFile(local) {
        // 设置字体的当前语言包
        Orzi_Tools.Language.instance.fontLocal = local;

        // 资源包内的文件
        let top = arr.shift() + 'asset/orzi/languages/asset/'+local+'/';
        url = top + arr.join('asset/');
        if (os.platform === 2) {
            // 电脑端，直接修改
            // 检查是否有该资源
            FileUtils.exists(url, Callback.New((is_exit) => {
                if (!is_exit) url = oldUrl;
                // 加载语言包
                font.path = url;
                __orzi_language_fontLoadManager_toLoadFontFile_old__(font);
            }, this))
        } else {
            // 其他平台，直接加载
            fetch(url)
                .then(res => {
                    if (res.status === 200) {
                        // 加载成功
                        font.path = url;
                        __orzi_language_fontLoadManager_toLoadFontFile_old__(font);
                    } else {
                        // 加载失败
                        font.path = oldUrl;
                        __orzi_language_fontLoadManager_toLoadFontFile_old__(font);
                    }
                })
                .catch(err => {
                    font.path = oldUrl;
                    __orzi_language_fontLoadManager_toLoadFontFile_old__(font);
                })
        }
    }
    // 重写资源加载
    if (arr.length > 1) {
        // 获取当前的语言包
        let local = Orzi_Tools.Language.instance.local;
        // 检查首次设置了语言包
        if (Orzi_Tools.Language.instance.isInitialSetup) {
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
