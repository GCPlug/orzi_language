module Orzi_Tools {

    export class Statistics {

        static text: string = '';
        static names: Record<string, number> = {};

        private static saveTexts: string[] = [];

        /**
         * 初始化统计数据
         */
        static init() {
            this.text = '';
            this.names = {};
            this.saveTexts = [];
        }
        /**
         * 去除文本中的所有常规符号
         * @param text 文本
         */
        static clearText(text: string) {
            return text.replace(/[\s\.\,\?\!，。、？！……「」~·：（）\(\)]/g, '');
        }

        /**
         * 显示统计数据
         */
        static show() {
            let lines = 0;
            for (let key in this.names) {
                lines += this.names[key];
            }
            this.addShowLine('============对话数据统计============');
            this.addShowLine('当前总对话条数：', lines);
            this.addShowLine('----------------------');
            this.addShowLine('其中:');
            for (let key in this.names) {
                this.addShowLine(key + '：', this.names[key]);
            }
            this.addShowLine('----------------------');
            this.addShowLine('总对话字数：', this.text.length);
            this.addShowLine('去除符号字数：', this.clearText(this.text).length);
            this.addShowLine('============对话数据统计============');
            this.save();
        }

        /**
         * 添加统计数据
         * @param text 文本
         */
        private static addShowLine(...text: any[]) {
            trace(...text);
            this.saveTexts.push(text.join(' '));
        }

        /**
         * 保存统计数据
         */
        private static save() {
            if (os.platform === 2) {
                FileUtils.save(this.saveTexts.join('\n'), Orzi_Tools.Language.path + '_statistics.txt', Callback.New(() => {
                    trace('orzi_language_statistics is saved!');
                    this.init();
                // @ts-ignore
                }, this), true, false);
            }
        }

    }
}