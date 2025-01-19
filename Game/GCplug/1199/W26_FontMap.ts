/**
 * Created by woziji00226 on 2024-10-19 10:21:40.
 * 用于切换字体
 */

class W26_FontMapData {
    font: string;
    sizeDt: number;

    constructor(font, sizeDt) {
        this.font = font;
        this.sizeDt = sizeDt;
    }
}

class W26_FontMap {
    public static PLUGIN_MODULE_TYPE_FONTMAP: number = 3;

    private static _map: W26_FontMap;

    private _fontMap: Record<string, W26_FontMapData> = {};

    constructor() {

    }

    /**
     * 清理字体映射
     */
    public clear() {
        this._fontMap = {}
        this.reflushAllText();
    }

    /**
     * 设置当前的映射字体模块
     * @param moduleId 
     */
    public setCurrentMap(moduleId: number) {
        var _module = GameData.getModuleData(W26_FontMap.PLUGIN_MODULE_TYPE_FONTMAP, moduleId);
        if (_module == null) {
            console.error("切换失败,不能存在该模块 ", moduleId);
            return;
        }

        this._fontMap = {};

        _module.fontMap.forEach((element: DataStructure_W26_FontMap) => {
            this._fontMap[element.oriFont] = new W26_FontMapData(element.font, element.fontSizeDt);
        })

        this.reflushAllText();

    }

    /**
     * 刷新所有文本，显示的对象
     * 原理从stage开始查询所有显示对象进行修改，如果不在树里的就不修改了。得手动刷新，不然我也找不着
     */
    private reflushAllText() {
        var sprites = this.dfsIterative(stage);
        sprites.forEach((element: Sprite) => {
            var _tf = element["_tf"];
            if (_tf != null && _tf["text"] != null) {

                let oriText = _tf["text"];
                _tf["text"] = "";
                _tf["text"] = oriText;
            }
        })
    }

    /**
     * dfs
     * @param root 
     */
    private dfsIterative(root: TreeNode) {
        const stack = [root];
        const visited = new Set(); // 用于记录已访问的节点
        const result = [];

        while (stack.length > 0) {
            const node = stack.pop();

            if (node == null) {
                continue;
            }

            if (!visited.has(node)) {
                visited.add(node);
                result.push(node);

                if (node.numChildren > 0) {
                    for (let i = node.numChildren - 1; i >= 0; i--) {
                        stack.push(node.getChildAt(i));
                    }
                }
            }
        }

        return result;
    }


    /**
     * 获取映射的字体
     * @param font 
     * @return [string] 
     */
    public getFontData(font: string): W26_FontMapData {
        return this._fontMap[font];
    }

    public static get Map() {
        if (this._map == null) {
            this._map = new W26_FontMap();
        }
        return this._map;
    }
}

module CommandExecute {
    /**
     * 自定义命令执行 1表示对应1号命令
     * @param commandPage 事件页
     * @param cmd 当前的事件命令
     * @param trigger 触发器
     * @param triggerPlayer 触发器对应的玩家
     * @param playerInput 玩家输入值，用于暂停执行该触发器事件并等待玩家输入后获得的值，执行完该函数后会被清空
     * @param p 自定义命令参数 1表示对应1号命令的参数
     */
    export function customCommand_15003(commandPage: CommandPage, cmd: Command, trigger: CommandTrigger, triggerPlayer: ClientPlayer, playerInput: any[], p: CustomCommandParams_15003): void {
        //debugger;
        if (p.restoreOriFont) {
            W26_FontMap.Map.clear();
        }
        else {
            W26_FontMap.Map.setCurrentMap(p.fontMap);
        }
    }
}


(function () {
    /**
     * 该函数用于重写对话类。替换掉每句对话
     */
    if (!Config.BEHAVIOR_EDIT_MODE && !Config.EDIT_MODE) {
        EventUtils.addEventListenerFunction(ClientWorld, ClientWorld.EVENT_INITED, () => {

            //@ts-ignore
            laya.display.Text.prototype.setFontNoChange = function (value) {
                if (this._currBitmapFont) {
                    this._currBitmapFont = null;
                    this.scale(1, 1);
                }
                //@ts-ignore
                if (Text._bitmapFonts && Text._bitmapFonts[value]) {
                    //@ts-ignore
                    this._currBitmapFont = Text._bitmapFonts[value];
                }
                this._getCSSStyle().fontFamily = value;
                //this.isChanged = true;
            }

            //@ts-ignore
            laya.display.Text.prototype.setfontSizeNoChange = function (value) {
                this._getCSSStyle().fontSize = value;
                //this.isChanged = true;
            }

            //兼容下其他插件延迟启动重写 希望这个方法可行
            Callback.New(() => {

                //重写渲染字体
                //@ts-ignore
                var renderText = laya.display.Text.prototype.renderText;
                //@ts-ignore
                laya.display.Text.prototype.renderText = function (begin, visibleLineCount) {
                    //原字体
                    var oriFont = this.font;
                    var oriFontSize = this.fontSize;

                    //映射的字体文件
                    var fontData = W26_FontMap.Map.getFontData(this.font);
                    if (fontData != null) {
                        //切换到映射字体
                        this.setFontNoChange(fontData.font);
                        this.setfontSizeNoChange(fontData.sizeDt + oriFontSize);
                    }

                    renderText.apply(this, arguments);

                    if (fontData != null) {
                        //渲染完成再改回去
                        this.setFontNoChange(oriFont);
                        this.setfontSizeNoChange(oriFontSize);
                    }

                    fontData = null;
                }

                //重写输入框聚焦
                //@ts-ignore
                var _focusIn = laya.display.Input.prototype._focusIn;
                //@ts-ignore
                laya.display.Input.prototype._focusIn = function () {

                    //原字体
                    var oriFont = this.font;
                    var oriFontSize = this.fontSize;

                    //映射的字体文件
                    var fontData = W26_FontMap.Map.getFontData(this.font);
                    if (fontData != null) {
                        //切换到映射字体
                        this.setFontNoChange(fontData.font);
                        this.setfontSizeNoChange(fontData.sizeDt + oriFontSize);

                    }

                    _focusIn.apply(this, arguments)

                    if (fontData != null) {
                        //渲染完成再改回去
                        this.setFontNoChange(oriFont);
                        this.setfontSizeNoChange(oriFontSize);
                    }

                    fontData = null;
                }


            }, this).delayRun(5, setTimeout);

        }, this);
    }
})();


