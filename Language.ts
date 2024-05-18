module Orzi_Tools {

    export module Language {

        export interface FileObjectType {
            fileName: string;
            localPath: string;
            isDirectory: boolean;
        }
    }

    export class Language {

        static path = 'asset/orzi/languages/';
        private static _language: Language;

        static EVENT_ON_CHANGE_LANGUAGE = 'change_language';

        static __watcher: Function[] = [];

        private static __isInit = false;

        /** 当前语言 */
        local: string;
        /** 语言包 */
        private packages: Record<string, Record<string, string>> = {};

        constructor() {
            if ((Config as any).language === 1) this.local = 'zhTW';
            else if ((Config as any).language === 2) this.local = 'en';
            else this.local = 'zhCN';
        }

        static init() {
            if (!this._language) {
                Language._language = new Language();
            }
            if (this.__isInit) return this._language;

            this.resetPackages();

            let _showDialogTemp = (GameDialog as any).showDialog;
            let _showOptionTemp = (GameDialog as any).showOption;

            /** 重写对话框 */
            (GameDialog as any).showDialog = function (dialogID, head, name, speed, comicSceneObjectIndex, msg, submitCallback, audio, exp, nameColor, changeData, dialogMaterialEnabled) {
                if (name) name = Language.getText(name);
                if (msg) msg = Language.getText(msg);
                _showDialogTemp.apply(this, arguments);
            };

            (GameDialog as any).showOption = function (dialogID, options, isShowOptionWithLastDialog, defaultIndex, cancelIndex, hideIndexs) {
                for (let i = 0; i < options.length; i++) {
                    options[i] = Language.getText(options[i]);
                }
                _showOptionTemp.apply(this, arguments);
            };

            this.__isInit = true;
            return this._language;
        }

        /** 单例 */
        static get instance(): Language {
            if (!this._language) {
                Language._language = new Language();
            }
            return this._language;
        }

        private _getText(key: string) {
            if (this.packages && this.packages[this.local] && this.packages[this.local][key]) {
                return this.packages[this.local][key];
            }
            return key;
        }

        static hasText(key: string) {
            return Language.instance.packages[Language.instance.local][key] !== undefined;
        }

        static getText(key: string) {
            if (!key) return '';
            // return Language.instance._getText(key);
            return Language.instance._getText(this.ol2str(key));
        }

        /** 设置语言 */
        static setLanguage(cl: string) {
            if (!cl) {
                if ((Config as any).language === 1) cl = 'zhTW';
                else if ((Config as any).language === 2) cl = 'en';
                else cl = 'zhCN';
            }
            if (Language.instance.packages[cl] === undefined) cl = (WorldData.orzi_language_packages && WorldData.orzi_language_packages.length) ? WorldData.orzi_language_packages[0] : 'zhCN';
            Language.instance.local = cl;
            (window as any).__orzi_language_local__ = cl;
            EventUtils.happen(Orzi_Tools.Language.instance, Orzi_Tools.Language.EVENT_ON_CHANGE_LANGUAGE);
            if (os.platform === 2) {
                FileUtils.save(cl, this.path + '_local.txt', Callback.New(() => {
                    console.log('orzi_language_local is saved!', cl);
                }, this), true);
            } else {
                LocalStorage.setItem('__orzi_language_local__', cl);
            }
            Language.__watcher.forEach((v) => {v()});
        }

        static getPackages() {
            
        }

        /** 重置语言包 */
        static resetPackages() {
            if (os.platform === 2) {
                FileUtils.getDirectoryListing(this.path, Callback.New((list: Orzi_Tools.Language.FileObjectType[]) => {
                    // Language.instance.packages = {zhCN: {}, en: {}}; // 重置
                    Language.instance.packages = {}; // 重置
                    WorldData.orzi_language_packages.forEach(v => {
                        Language.instance.packages[v] = {};
                    })
                    if (list) {
                        list.forEach((v) => {
                            if (v.fileName.indexOf('.json') != -1) {
                                let name = v.fileName.split('.')[0];
                                AssetManager.loadJson(v.localPath, Callback.New((data) => {
                                    if (data) Language.instance.packages[name] = data;
                                }, this))
                            }
                        })
                    }
                }, this))
            } else {
                Language.instance.packages = {}; // 重置
                WorldData.orzi_language_packages.forEach(v => {
                    FileUtils.exists(this.path + v + '.json', Callback.New((is_exit) => {
                        if (is_exit) {
                            AssetManager.loadJson(this.path + v + '.json', Callback.New((data) => {
                                if (data) Language.instance.packages[v] = data;
                            }, this))
                        }
                    }, this))
                })
            }
        }

        static getAllText(json: any, strs: Set<string>) {
            if (Array.isArray(json)) {
                for (let i = 0; i < json.length; i++) {
                    this.getAllText(json[i], strs)
                }
            } else if (typeof json === 'object') {
                if (json === null) return;
                if (json === undefined) return;
                for (let key in json) {
                    this.getAllText(json[key], strs);
                }
            } else if (typeof json === 'string') {
                if (this.checkReg(json)) strs.add(this.ol2str(json));
            }
            return;
        }

        static checkReg(str: string) {
            return /_ol\[\[([\s\S]*?)\]\]ol_/.test(str);
        }

        static ol2str(str: string) {
            // StringUtils.clearHtmlTag(content).replace(/\[p\d+\]|\[\.=\]|\[\.s\]/g, "");
            return str.replace(/_ol\[\[([\s\S]*?)\]\]ol_/g, '$1');
        }

        static save(_arr: Set<string>) {
            for (const c in Language.instance.packages) {
                let _data = Language.instance.packages[c];
                _arr.forEach(v => {
                    if (!_data[v]) {
                        _data[v] = v;
                    }
                })
                FileUtils.save(_data, Language.path + c + '.json', Callback.New(() => {
                    trace(`orzi_language:${c} is saved!`)
                }, this), true)
            }
        }

    }

}

EventUtils.addEventListenerFunction(ClientWorld, ClientWorld.EVENT_INITED, () => {
    Orzi_Tools.Language.init();
    console.log('orzi_language is running!', WorldData.orzi_language_packages, Orzi_Tools.Language.instance.local);
    if (os.platform === 2) {
        let _timer = setTimeout(() => {
            AssetManager.loadText(Orzi_Tools.Language.path + '_local.txt', Callback.New((data) => {
                if (data) Orzi_Tools.Language.setLanguage(JSON.parse(data));
            }, this));
            clearTimeout(_timer);
        }, 300);
    } else {
        // 网页端加载问题，延迟一下
        let _timer = setTimeout(() => {
            let _local = LocalStorage.getItem('__orzi_language_local__');
            if (_local) Orzi_Tools.Language.setLanguage(_local);
            clearTimeout(_timer);
        }, 300);
    }
    if (Config.EDIT_MODE || !Config.RELEASE_GAME) {
        let _arr: Set<string> = new Set();
        FileUtils.getAllChildFiles('asset/json', Callback.New((list: Orzi_Tools.Language.FileObjectType[]) => {
            if (!list) return;
            let _num = list.length;
            list.forEach((v) => {
                if (v.fileName.indexOf('.json') !== -1) {
                    AssetManager.loadJson(v.localPath, Callback.New((data) => {
                        if (data) Orzi_Tools.Language.getAllText(data, _arr);
                        _num--;
                        if (_num <= 0) Orzi_Tools.Language.save(_arr);
                    }, this))
                } else _num--;
            })
            if (_num <= 0) Orzi_Tools.Language.save(_arr);
        }, this))
    }

    /** 重写监听 */
    Object.defineProperty(UIString.prototype, "text", {
        get: function () {
            if (!this.__orzi_language_watching__) {
                Orzi_Tools.Language.__watcher.push(() => {
                    if (this._tf && GameUtils.getVarID(this.text) === 0) {
                        this.text = Orzi_Tools.Language.getText(this.__orzi_language_temp__);
                    } else this.text = this.__orzi_language_temp__;
                });
                this.__orzi_language_watching__ = true;
            }
            return this._tf.text;
        },
        set: function (v) {
            if (this.isDisposed)
                return;
            if (Config.EDIT_MODE) {
                var varID = GameUtils.getVarID(v);
                if (varID != 0) {
                    setText.call(this, v);
                    return;
                }
            }
            setText.call(this, v);
            if (!Config.EDIT_MODE) {
                var varID = GameUtils.getVarID(this.text);
                if (varID != 0) {
                    setText.call(this, "");
                    if (this._lastVarID != 0)
                        Game.player.removeListenerPlayerVariable(2, this._lastVarID, this._onVarChange);
                    if (this.displayedInStage)
                        Game.player.addListenerPlayerVariable(2, varID, this._onVarChange);
                    this._lastVarID = varID;
                }
            }
            function setText(v) {
                if (this.__forceChange) {
                    this._tf.changeText(v);
                }
                else {
                    this._tf.text = v;
                }
                if (this._shadowEnabled) {
                    if (this._tf.text && !this._tf2.stage)
                        this.addChildAt(this._tf2, 0);
                    this._tf2.color = this._shadowColor;
                    if (this.__forceChange) {
                        this._tf2.changeText(this._tf.text);
                    }
                    else {
                        this._tf2.text = this._tf.text;
                    }
                }
            }
            
            // 不是变量再操作
            if (GameUtils.getVarID(v) === 0) {
                // 文本变化，刷新缓存
                if ((this.__orzi_language_temp__ !== this.text) && (Orzi_Tools.Language.getText(this.__orzi_language_temp__) !== Orzi_Tools.Language.getText(this.text))) this.__orzi_language_temp__ = this.text;
                if (this.text !== Orzi_Tools.Language.getText(this.__orzi_language_temp__)) this.text = Orzi_Tools.Language.getText(this.__orzi_language_temp__);
            } else {
                this.__orzi_language_temp__ = v;
            }
        },
        enumerable: false,
        configurable: true
    });

    /** 重写监听 */
    Object.defineProperty(UITabBox.prototype, "items", {
        get: function () {
            if (!this.__orzi_language_watching__) {
                Orzi_Tools.Language.__watcher.push(() => {
                    this.items = Orzi_Tools.Language.getText(this.__orzi_language_temp__);
                });
                this.__orzi_language_watching__ = true;
            }
            return this._items;
        },
        set: function (v) {
            this._items = v;

            if ((this.__orzi_language_temp__ !== this.items) && (Orzi_Tools.Language.getText(this.__orzi_language_temp__) !== Orzi_Tools.Language.getText(this.items))) this.__orzi_language_temp__ = this.items;
            if (this.items !== Orzi_Tools.Language.getText(this.__orzi_language_temp__)) this.items = Orzi_Tools.Language.getText(this.__orzi_language_temp__);

            this.refreshItems();
        },
        enumerable: false,
        configurable: true
    });
}, null)
