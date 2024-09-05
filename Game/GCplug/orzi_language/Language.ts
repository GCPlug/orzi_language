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

        static PLUGIN_MODULE_TYPE_OrziLanguage: number = 2

        static __watcher: Function[] = [];

        private static __isInit = false;

        /** 当前语言 */
        local: string;
        /** 语言包 */
        packages: Record<string, Record<string, string>> = {};

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
                if (msg) {
                    if (Language.hasText(Language.ol2str(msg))) msg = Language.getText(msg);
                    else {
                        msg = msg.replace(/<span([\s\S]*?)>([\s\S]*?)<\/span>/g, (match, p1, p2) => {
                            return `<span${p1}>${Language.getText(p2)}</span>`;
                        });
                    }
                }
                return _showDialogTemp.apply(this, arguments);
            };

            (GameDialog as any).showOption = function (dialogID, options, isShowOptionWithLastDialog, defaultIndex, cancelIndex, hideIndexs) {
                for (let i = 0; i < options.length; i++) {
                    options[i] = Language.getText(options[i]);
                }
                return _showOptionTemp.apply(this, arguments);
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

        private _getOriginText(value: string) {
            for (const p in this.packages) {
                // for (const c in this.packages[p]) {
                //     if (this.packages[p][c] === value || Language.clearSpan(this.packages[p][c]) === Language.clearSpan(value)) return c;
                // }
                let key = Object.keys(this.packages[p]).find(c => this.packages[p][c] === value || Language.clearSpan(this.packages[p][c]) === Language.clearSpan(value));
                if (key) return key;
            }
            return value;
        }

        /**
         * 当前语言包是否存在该值
         * @param key 文本key
         * @returns 
         */
        static hasText(key: string) {
            if (!Language.instance.packages[Language.instance.local]) return false;
            return Language.instance.packages[Language.instance.local][key] !== undefined;
        }

        /**
         * 获取翻译后的文本
         * @param key 准备翻译的值
         * @returns 
         */
        static getText(key: string) {
            if (!key) return '';
            // return Language.instance._getText(key);
            return Language.instance._getText(this.ol2str(key));
        }

        /**
         * 遍历找源文本
         * @param value 
         * @returns 
         */
        static getOriginText(value: string) {
            if (!value) return '';
            return Language.instance._getOriginText(value);
        }

        /**
         * 设置语言
         * @param cl 语言包名
         */
        static setLanguage(cl: string, isReload: boolean = false) {
            if (!cl) {
                if ((Config as any).language === 1) cl = 'zhTW';
                else if ((Config as any).language === 2) cl = 'en';
                else cl = 'zhCN';
            } else {
                if (!Language.instance.packages[cl]) {
                    console.error('语言包不存在或未生成！', cl);
                    return;
                }
            }
            if (Language.instance.local === cl) return;
            if (Language.instance.packages[cl] === undefined) cl = (WorldData.orzi_language_packages && WorldData.orzi_language_packages.length) ? GameData.getModuleData(Orzi_Tools.Language.PLUGIN_MODULE_TYPE_OrziLanguage, WorldData.orzi_language_packages[0]).name : 'zhCN';
            Language.instance.local = cl;
            EventUtils.happen(Orzi_Tools.Language.instance.packages, Orzi_Tools.Language.EVENT_ON_CHANGE_LANGUAGE);
            if (os.platform === 2) {
                FileUtils.save(cl, this.path + '_local.txt', Callback.New(() => {
                    trace('orzi_language_local is saved!', cl);

                    if (isReload) location.reload();
                }, this), true);
            } else {
                LocalStorage.setItem('__orzi_language_local__', cl);

                if (isReload) location.reload();
            }
            Language.__watcher.forEach((v) => { v() });
        }

        static getPackages() {

        }

        /** 重置语言包 */
        static resetPackages() {
            Language.instance.packages = {}; // 重置
            WorldData.orzi_language_packages.forEach(v => {
                const languageName = GameData.getModuleData(Orzi_Tools.Language.PLUGIN_MODULE_TYPE_OrziLanguage, v)?.name
                Language.instance.packages[languageName] = {};
                FileUtils.exists(this.path + languageName + '.json', Callback.New((is_exit) => {
                    if (is_exit) {
                        AssetManager.loadJson(this.path + languageName + '.json', Callback.New((data) => {
                            if (data) Language.instance.packages[languageName] = data;
                            AssetManager.disposeJson(this.path + languageName + '.json');
                            FileUtils.exists(this.path + languageName + '.csv', Callback.New((is_exit) => {
                                if (is_exit) {
                                    AssetManager.loadText(this.path + languageName + '.csv', Callback.New((csvData) => {
                                        if (csvData) Language.instance.packages[languageName] = Object.assign(Language.instance.packages[languageName] || {}, Language.getCsvJson(csvData));
                                        AssetManager.disposeText(this.path + languageName + '.csv');
                                    }, this))
                                }
                            }, this))
                        }, this))
                    } else {
                        FileUtils.exists(this.path + languageName + '.csv', Callback.New((is_exit) => {
                            if (is_exit) {
                                AssetManager.loadText(this.path + languageName + '.csv', Callback.New((csvData) => {
                                    if (csvData) Language.instance.packages[languageName] = Language.getCsvJson(csvData);
                                    AssetManager.disposeText(this.path + languageName + '.csv');
                                }, this))
                            }
                        }, this))
                    }
                }, this))
            })
        }

        /**
         * 获取所有文本
         * @param json json串
         * @param strs 语言包Set组
         */
        static getAllText(json: any, strs: Set<string>, isClearHTML: boolean = false) {
            if (Array.isArray(json)) {
                for (let i = 0; i < json.length; i++) {
                    this.getAllText(json[i], strs, isClearHTML)
                }
            } else if (typeof json === 'object') {
                if (json === null) return;
                if (json === undefined) return;
                for (let key in json) {
                    this.getAllText(json[key], strs, isClearHTML);
                }
            } else if (typeof json === 'string') {
                if (this.checkReg(json)) {
                    if (isClearHTML && this.checkHasSpan(json)) {
                        json.replace(/<span([\s\S]*?)>([\s\S]*?)<\/span>/g, (match, p1, p2) => {
                            let _a = p2.replace(/([\s\S]*?)\[(\@|\$)([\s\S]*?)\]/g, (match, _p1, _p2, _p3) => {
                                strs.add(this.ol2str(_p1));
                                return '';
                            })
                            strs.add(this.ol2str(_a));
                            return '';
                        });
                    } else strs.add(this.ol2str(json));
                }
                if (this.checkHasSpan(json)) {
                    if (isClearHTML) {
                        json.replace(/<span([\s\S]*?)>([\s\S]*?)<\/span>/g, (match, p1, p2) => {
                            // strs.add(this.ol2str(p2));
                            let _a = p2.replace(/([\s\S]*?)\[(\@|\$)([\s\S]*?)\]/g, (match, _p1, _p2, _p3) => {
                                strs.add(this.ol2str(_p1));
                                return '';
                            })
                            strs.add(this.ol2str(_a));
                            return '';
                        });
                    } else strs.add(this.ol2str(json));
                }
            }
            return;
        }

        /**
         * 检查是否携带标识符
         * @param str 匹配字符串
         * @returns 
         */
        static checkReg(str: string) {
            return /_ol\[\[([\s\S]*?)\]\]ol_/.test(str);
        }

        /**
         * 去除标识符
         * @param str 匹配字符串
         * @returns 
         */
        static ol2str(str: string) {
            // StringUtils.clearHtmlTag(content).replace(/\[p\d+\]|\[\.=\]|\[\.s\]/g, "");
            let a = str.replace(/_ol\[\[([\s\S]*?)\]\]ol_/g, '$1');
            a = a.replace(/_ol\[\[/g, '');
            a = a.replace(/\]\]ol_/g, '');
            return a;
        }

        /**
         * 检查是否携带span标签
         * @param str 匹配字符串
         * @returns
         */
        static checkHasSpan(str: string) {
            return /<span([\s\S]*?)<\/span>/.test(str);
        }

        /**
         * 去除span标签
         * @param str 匹配字符串
         */
        static clearSpan(str: string) {
            return str.replace(/<span([\s\S]*?)>([\s\S]*?)<\/span>/g, (match, p1, p2) => {
                return p2;
            });
        }

        /** 备份 */
        static backup() {
            return new Promise((resolve, reject) => {
                let _num = 0;
                let _date = new Date();
                let _time = [_date.getFullYear(), _date.getMonth() + 1, _date.getDate(), _date.getHours(), _date.getMinutes(), _date.getSeconds()].join('_');
                let _backupPath = Language.path + `backup/${_time}`;
                for (const c in Language.instance.packages) _num+=2; // json 和 csv 两个文件
                FileUtils.createDirectoryForce(_backupPath, Callback.New((success: boolean, path: string) => {
                    for (const c in Language.instance.packages) {
                        FileUtils.exists(Language.path + c + '.json', Callback.New(is_exit => {
                            if (is_exit) {
                                FileUtils.cloneFile(Language.path + c + '.json', _backupPath + '/' + c + '.json', Callback.New((success: boolean, fromPath: string, toPath: string) => {
                                    trace(`orzi_language:${c}.json is backuped! Save time: ${_time}`);
                                    _num--;
                                    if (_num <= 0) resolve(true);
                                }, this))
                            }
                            _num--;
                            if (_num <= 0) resolve(true);
                        }, this))
                        FileUtils.exists(Language.path + c + '.csv', Callback.New(is_exit => {
                            if (is_exit) {
                                FileUtils.cloneFile(Language.path + c + '.csv', _backupPath + '/' + c + '.csv', Callback.New((success: boolean, fromPath: string, toPath: string) => {
                                    trace(`orzi_language:${c}.csv is backuped! Save time: ${_time}`);
                                    _num--;
                                    if (_num <= 0) resolve(true);
                                }, this))
                            }
                            _num--;
                            if (_num <= 0) resolve(true);
                        }, this))
                    }
                }, this));
            });
        }

        /**
         * 保存
         * @param _arr 语言包Set组
         * @param type [type=0] 0 为 json 为 csv
         */
        static save(_arr: Set<string>, type: number = 0) {
            this.backup().then(() => {
                for (const c in Language.instance.packages) {
                    if (c === '__evIdx2') continue;
                    let _data = Language.instance.packages[c];
                    _arr.forEach(v => {
                        if (!_data[v]) {
                            _data[v] = v;
                        }
                    })
                    if (type === 1) {
                        // 保存为 csv
                        let _text = '';
                        for (const k in _data) {
                            if (k) _text += this.toCsvStr(k) + ',' + this.toCsvStr(_data[k]) + "\n";
                        }
                        (FileUtils.save as any)(_text, Language.path + c + '.csv', Callback.New(() => {
                            trace(`orzi_language:${c}.csv is saved!`)
                        }, this), false, false)
                    } else {
                        // 保存为 json
                        FileUtils.save(_data, Language.path + c + '.json', Callback.New(() => {
                            trace(`orzi_language:${c}.json is saved!`)
                        }, this), true)
                    }
                }
            })
        }

        static toCsvStr(str: string) {
            if (str.indexOf('"') > -1 || str.indexOf(",") > -1 || str.indexOf("\n") > -1 || str.indexOf("\r") > -1){
                str = `"${str.replace(/"/g, '""')}"`;
            }
            return str;
        }

        /** csv表格转json */
        static getCsvJson(csv: string) {
            let _data = {};
            let arr = this.getCsvStr(csv);
            for (let i = 0; i < arr.length; i++) {
                if (!arr[i][0]) continue;
                let _t = '';
                for (let k = 1; k < arr[i].length; k++) {
                    if (arr[i][k]) {
                        _t = arr[i][k];
                        break;
                    }
                }
                _data[arr[i][0]] = _t;
            }
            return _data;
        }

        static getCsvStr(str: string) {
            let _arr = [];
            if (typeof str != "string") { return _arr; }
            let tr = [];
            _arr.push(tr);
            let t = ""
            for (let i = 0; i < str.length; i++) {
                let c = str[i];
                if (c === '"') {
                    i += 1;
                    for (; i < str.length; i++) {
                        if (str[i] === '"') {
                            if (str[i + 1] == '"') {
                                t += '"';
                                i++;
                            } else {
                                i++;
                                break;
                            }
                        } else t += str[i];
                    }
                    tr.push(t);
                    t = "";
        
                    for (; i < str.length; i++) {
                        if (str[i] == " ") {
                        } else if (str[i] == ",") {
                            i -= 1;
                            break;
                        } else if (str[i] == "\n" || str[i] == "\r") {
                            i -= 1;
                            break;
                        } else {
                            console.log("Error");
                        }
                    }
                } else if (c === ",") {
                    tr.push(t);
                    t = "";
                } else if (c === "\n" || c === "\r") {
                    if (t != "") {
                        tr.push(t);
                        t = "";
                    }
                    for (; i < str.length; i++) {
                        if (str[i] === "\n" || str[i] === "\r") {
        
                        } else {
                            i--;
                            break;
                        }
                    }
                    _arr.push(tr = []);
                } else {
                    t += c;
                }
            }
            if (t !== "") tr.push(t);
            return _arr;
        }

        /**
         * 获取所有文件文本并保存
         * @param type 1 为 json, 0 为 csv
         */
        static getAllTextAndSave(type: number = 0, isClearHTML: boolean = false) {
            let _arr: Set<string> = new Set();
            FileUtils.getAllChildFiles('asset/json', Callback.New((list: Orzi_Tools.Language.FileObjectType[]) => {
                if (!list) return;
                let _num = list.length;
                list.forEach((v) => {
                    if (v.fileName.indexOf('.json') !== -1) {
                        AssetManager.loadJson(v.localPath, Callback.New((data) => {
                            if (data) Orzi_Tools.Language.getAllText(data, _arr, isClearHTML);
                            _num--;
                            AssetManager.disposeJson(v.localPath);
                            if (_num <= 0) Orzi_Tools.Language.save(_arr, type);
                        }, this))
                    } else _num--;
                })
                if (_num <= 0) Orzi_Tools.Language.save(_arr, type);
            }, this))
        }

        /** 获取是否为开发环境 */
        static getIsDev() {
            return Config.EDIT_MODE || !Config.RELEASE_GAME;
        }

    }

}

EventUtils.addEventListenerFunction(ClientWorld, ClientWorld.EVENT_INITED, () => {
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
        if (!Orzi_Tools.Language.hasText(this.__orzi_language_temp__)) this.__orzi_language_temp__ = Orzi_Tools.Language.getOriginText(this.__orzi_language_temp__);
        if (!Orzi_Tools.Language.hasText(this.__orzi_language_temp_prompt__)) this.__orzi_language_temp_prompt__ = Orzi_Tools.Language.getOriginText(this.__orzi_language_temp_prompt__);
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
    }

    /** 重写监听 */
    Object.defineProperty(UITabBox.prototype, "items", {
        get: function () {
            if (!this.__orzi_language_watching__) {
                this.__orzi_language_watching__ = true;
                EventUtils.addEventListenerFunction(Orzi_Tools.Language.instance.packages, Orzi_Tools.Language.EVENT_ON_CHANGE_LANGUAGE, () => {
                    this.items = Orzi_Tools.Language.getText(this.__orzi_language_temp__);
                }, this)
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

    /** 重写监听 */
    Object.defineProperty(UIComboBox.prototype, "itemLabels", {
        get: function () {

            if (!this.__orzi_language_watching__) {
                this.__orzi_language_watching__ = true;
                EventUtils.addEventListenerFunction(Orzi_Tools.Language.instance.packages, Orzi_Tools.Language.EVENT_ON_CHANGE_LANGUAGE, () => {
                    this._itemLabels = Orzi_Tools.Language.getText(this.__orzi_language_temp__);
                }, this)
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
}, null)
