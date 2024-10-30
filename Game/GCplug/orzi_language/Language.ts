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
        /** 字体的语言包 */
        fontLocal: string;
        /** 语言包 */
        packages: Record<string, Record<string, string>> = {};
        /** 是否首次设置了语言包 */
        isInitialSetup: boolean = false;

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
                // let key = Object.keys(this.packages[p]).find(c => this.packages[p][c] === value || Language.clearSpan(this.packages[p][c]) === Language.clearSpan(value));
                let key = Object.keys(this.packages[p]).find(c => this.packages[p][c] === value || Language.clearSpan(this.packages[p][c]) === value);
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
            if (!key) return false;
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
            if (/^[0-9!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/? ]*$/.test(value)) return value;
            return Language.instance._getOriginText(value);
        }

        /**
         * 设置语言
         * @param cl 语言包名
         */
        static setLanguage(cl: string, isReload: boolean = false) {
            // 是否是首次设置
            let isFristSet = !Language.instance.isInitialSetup;
            // 初始化完成
            Language.instance.isInitialSetup = true;
            // 如果没有语言包，就去GC文件里面找一下
            if (!cl) {
                if ((Config as any).language === 1) cl = 'zhTW';
                else if ((Config as any).language === 2) cl = 'en';
                else cl = 'zhCN';
            }
            // 如果语言包不存在，就不切换
            if (!Language.instance.packages[cl]) {
                console.error('语言包不存在或未生成！', cl);
                return;
            }
            // 如果是同一个语言包，就不用切换了
            if (Language.instance.local === cl) return;
            // 设置当前的语言包
            Language.instance.local = cl;
            // 先保存语言包
            if (os.platform === 2) {
                FileUtils.save(cl, this.path + '_local.txt', Callback.New(() => {
                    trace('orzi_language_local is saved!', cl);
                    _resetText();
                }, this), true);
            } else {
                LocalStorage.setItem('__orzi_language_local__', cl);

                _resetText();
            }

            // 广播语言包更新事件
            function dispatchEvent() {
                EventUtils.happen(Orzi_Tools.Language.instance.packages, Orzi_Tools.Language.EVENT_ON_CHANGE_LANGUAGE);
                Language.__watcher.forEach((v) => { v() });
            }

            // 重新加载字体
            function _resetText() {
                if (isFristSet) {
                    // 是首次设置，那么直接发广播
                    dispatchEvent();
                } else {
                    // 如果不是首次设置，并且要刷新，就刷新
                    if (isReload) {
                        location.reload();
                        return;
                    }
                    if (WorldData.orzi_language_isReloadFont && Language.instance.fontLocal !== cl) {
                        // 如果要刷新字体
                        // @ts-ignore
                        FontLoadManager.fontFaceList = {};
                        // @ts-ignore
                        FontLoadManager.loadFontFile(Config.FONTS ? Config.FONTS : [], Callback.New(() => {
                            dispatchEvent();
                        }), Language);
                    } else {
                        // 不刷新字体，直接修改文本
                        dispatchEvent();
                    }
                }
            }
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
            let isHasSpan: boolean = false;
            if (Array.isArray(json)) {
                if (json.length === 8 && json[0] === 4 && typeof json[1] === 'string') {
                    // 大概率是选项文本，追加翻译
                    strs.add(this.ol2str(json[1]));
                }
                for (let i = 0; i < json.length; i++) {
                    let _isHasSpan = this.getAllText(json[i], strs, isClearHTML);
                    if (_isHasSpan) {
                        // 因为这里有span标签，所以可能是对话，那么把名字也加入
                        if (json[3] && typeof json[3] === 'string') strs.add(this.ol2str(json[3]));
                    }
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
                        isHasSpan = true;
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
                    isHasSpan = true;
                }
            }
            return isHasSpan;
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
