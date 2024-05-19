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
                if (msg) msg = Language.getText(msg);
                return _showDialogTemp.apply(this, arguments);
            };

            (GameDialog as any).showOption = function (dialogID, options, isShowOptionWithLastDialog, defaultIndex, cancelIndex, hideIndexs) {
                for (let i = 0; i < options.length; i++) {
                    options[i] = Language.getText(options[i]);
                }
                return _showOptionTemp.apply(this, arguments);
            };

            /** 重写UI显示 */
            let _gameUIShowTemp = GameUI.show;
            GameUI.show = function (uiID, ...args) {
                let ui = _gameUIShowTemp.apply(this, arguments);
                // 显示前先刷新语言
                Orzi_Tools.Language.refreshShowLanguage();
                return ui;
            }

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
            EventUtils.happen(Orzi_Tools.Language.instance.packages, Orzi_Tools.Language.EVENT_ON_CHANGE_LANGUAGE);
            if (os.platform === 2) {
                FileUtils.save(cl, this.path + '_local.txt', Callback.New(() => {
                    trace('orzi_language_local is saved!', cl);
                }, this), true);
            } else {
                LocalStorage.setItem('__orzi_language_local__', cl);
            }
            Language.refreshShowLanguage();
            Language.__watcher.forEach((v) => {v()});
        }

        /** 刷新语言 */
        static refreshShowLanguage() {
            const allUIs = GameUI.getAllSystemGroupUIs();
            for (const uiID in allUIs) {
                const ui = allUIs[uiID];
                const components = GameUI.getAllCompChildren(ui, true);
                for (const compID in components.keyValue) {
                    const component = components.keyValue[compID];
                    if (component.type === 'UITabBox') {
                        if ((component.__orzi_language_temp__ !== component.items) && (Orzi_Tools.Language.getText(component.__orzi_language_temp__) !== Orzi_Tools.Language.getText(component.items))) component.__orzi_language_temp__ = component.items;
                        if (component.items !== Orzi_Tools.Language.getText(component.__orzi_language_temp__)) component.items = Orzi_Tools.Language.getText(component.__orzi_language_temp__);
                    }
                    if (component.type === 'UIButton') {
                        if ((component.__orzi_language_temp__ !== component.label) && (Orzi_Tools.Language.getText(component.__orzi_language_temp__) !== Orzi_Tools.Language.getText(component.label))) component.__orzi_language_temp__ = component.label;
                        if (component.label !== Orzi_Tools.Language.getText(component.__orzi_language_temp__)) component.label = Orzi_Tools.Language.getText(component.__orzi_language_temp__);
                    }
                    if (component.type === 'UIString') {
                        if ((component.__orzi_language_temp__ !== component.text) && (Orzi_Tools.Language.getText(component.__orzi_language_temp__) !== Orzi_Tools.Language.getText(component.text))) component.__orzi_language_temp__ = component.text;
                        if (component.text !== Orzi_Tools.Language.getText(component.__orzi_language_temp__)) component.text = Orzi_Tools.Language.getText(component.__orzi_language_temp__);
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
                Language.instance.packages[v] = {};
                FileUtils.exists(this.path + v + '.json', Callback.New((is_exit) => {
                    if (is_exit) {
                        AssetManager.loadJson(this.path + v + '.json', Callback.New((data) => {
                            if (data) Language.instance.packages[v] = data;
                        }, this))
                    }
                }, this))
            })
        }

        /** 获取所有文本 */
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

        /** 备份 */
        static backup() {
            return new Promise((resolve, reject) => {
                let _num = 0;
                let _date = new Date();
                let _time = [_date.getFullYear(), _date.getMonth()+1, _date.getDate(), _date.getHours(), _date.getMinutes(), _date.getSeconds()].join('_');
                let _backupPath = Language.path + `backup/${_time}`;
                for (const c in Language.instance.packages) _num ++;
                FileUtils.createDirectoryForce(_backupPath, Callback.New((success: boolean, path: string) => {
                    for (const c in Language.instance.packages) {
                        FileUtils.exists(Language.path + c + '.json', Callback.New(is_exit => {
                            if (is_exit) {
                                FileUtils.cloneFile(Language.path + c + '.json', _backupPath + '/' + c + '.json', Callback.New((success: boolean, fromPath: string, toPath: string) => {
                                    trace(`orzi_language:${c} is backuped! Save time: ${_time}`);
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

        /** 保存 */
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
                        // 保存为 json
                        FileUtils.save(_data, Language.path + c + '.json', Callback.New(() => {
                            trace(`orzi_language:${c} is saved!`)
                        }, this), true)
                    } else {
                        // 保存为 csv
                        let _text = '';
                        for (const k in _data) {
                            _text += k + "\t" + _data[k] + "\n";
                        }
                        FileUtils.save(_text, Language.path + c + '.csv', Callback.New(() => {
                            trace(`orzi_language:${c} is saved!`)
                        }, this), true)
                    }
                }
            })
        }

        /**
         * 获取所有文件文本并保存
         * @param type 0 为 csv， 1 为 json
         */
        static getAllTextAndSave(type: number = 0) {
            type = 1;
            let _arr: Set<string> = new Set();
            FileUtils.getAllChildFiles('asset/json', Callback.New((list: Orzi_Tools.Language.FileObjectType[]) => {
                if (!list) return;
                let _num = list.length;
                list.forEach((v) => {
                    if (v.fileName.indexOf('.json') !== -1) {
                        AssetManager.loadJson(v.localPath, Callback.New((data) => {
                            if (data) Orzi_Tools.Language.getAllText(data, _arr);
                            _num--;
                            if (_num <= 0) Orzi_Tools.Language.save(_arr, type);
                        }, this))
                    } else _num--;
                })
                if (_num <= 0) Orzi_Tools.Language.save(_arr, type);
            }, this))
        }

        /** 获取是否为开发环境 */
        static getIsDev() {
            return (Config.EDIT_MODE || !Config.RELEASE_GAME) ? 1 : 0;
        }

    }

}

EventUtils.addEventListenerFunction(ClientWorld, ClientWorld.EVENT_INITED, () => {
    Orzi_Tools.Language.init();
    trace('orzi_language is running!', WorldData.orzi_language_packages, Orzi_Tools.Language.instance.local);
    
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
}, null)
