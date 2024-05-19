/**
 * 该文件为GameCreator编辑器自动生成的代码，请勿修改
 */

/**
 * 1-标题界面 [BASE]
 */
class GUI_1 extends GUI_BASE {
   界面背景:UIBitmap;
   标题内容容器:UIRoot;
   装饰:UIBitmap;
   标题:UIString;
   标题装饰:UIString;
   白发女生立绘:UIStandAvatar;
   按钮功能容器:UIRoot;
   按钮装饰底色1:UIBitmap;
   按钮装饰底色2:UIBitmap;
   黑发女生立绘:UIStandAvatar;
   半透明顶部白色线条装饰:UIBitmap;
   半透明底部白色线条装饰:UIBitmap;
   开始游戏按钮:UIButton;
   读取存档按钮:UIButton;
   图片鉴赏按钮:UIButton;
   音乐鉴赏按钮:UIButton;
   系统设置按钮:UIButton;
   退出游戏按钮:UIButton;
   constructor(){
      super(1);
   }
}
class ListItem_1 extends UIListItemData {
   界面背景:string;
   装饰:string;
   标题:string;
   标题装饰:string;
   白发女生立绘:number;
   按钮装饰底色1:string;
   按钮装饰底色2:string;
   黑发女生立绘:number;
   半透明顶部白色线条装饰:string;
   半透明底部白色线条装饰:string;

}

/**
 * 2-读档界面 [BASE]
 */
class GUI_2 extends GUI_BASE {
   通用背景:GUI_15;
   读取存档标题容器:UIRoot;
   底色:UIBitmap;
   装饰图案:UIBitmap;
   读取存档标题:UIString;
   界面背景框:UIBitmap;
   list:UIList; // Item=1001
   关闭界面容器:UIRoot;
   图案:UIBitmap;
   关闭:UIString;
   constructor(){
      super(2);
   }
}
class ListItem_2 extends UIListItemData {
   通用背景:number;
   底色:string;
   装饰图案:string;
   读取存档标题:string;
   界面背景框:string;
   list:UIListItemData[];
   图案:string;
   关闭:string;
}

/**
 * 3-对话菜单 [BASE]
 */
class GUI_3 extends GUI_BASE {
   容器:UIRoot;
   历史回忆界面容器:UIRoot;
   历史回忆界面按钮:UIButton;
   图案:UIBitmap;
   隐藏对话界面:UIRoot;
   隐藏对话界面按钮:UIButton;
   自动播放容器:UIRoot;
   自动播放开关:UISwitch;
   悬停时出现高亮底色:UIBitmap;
   快进容器:UIRoot;
   快进开关:UISwitch;
   存档界面容器:UIRoot;
   存档界面按钮:UIButton;
   读档界面容器:UIRoot;
   读档界面按钮:UIButton;
   设置界面容器:UIRoot;
   设置界面按钮:UIButton;
   返回标题界面容器:UIRoot;
   返回标题界面按钮:UIButton;
   提示文本:UIString;
   constructor(){
      super(3);
   }
}
class ListItem_3 extends UIListItemData {
   图案:string;
   自动播放开关:number;
   悬停时出现高亮底色:string;
   快进开关:number;
   提示文本:string;
}

/**
 * 4-历史回忆 [BASE]
 */
class GUI_4 extends GUI_BASE {
   通用背景:GUI_15;
   历史回忆标题容器:UIRoot;
   底色:UIBitmap;
   装饰图案:UIBitmap;
   历史回忆标题:UIString;
   界面背景框:UIBitmap;
   档案背景:UIBitmap;
   dialogRecordList:UIList; // Item=1002
   关闭界面容器:UIRoot;
   图案:UIBitmap;
   关闭:UIString;
   constructor(){
      super(4);
   }
}
class ListItem_4 extends UIListItemData {
   通用背景:number;
   底色:string;
   装饰图案:string;
   历史回忆标题:string;
   界面背景框:string;
   档案背景:string;
   dialogRecordList:UIListItemData[];
   图案:string;
   关闭:string;
}

/**
 * 5-存档界面 [BASE]
 */
class GUI_5 extends GUI_BASE {
   通用背景:GUI_15;
   存入存档标题容器:UIRoot;
   底色:UIBitmap;
   装饰图案:UIBitmap;
   存入存档标题:UIString;
   界面背景框:UIBitmap;
   list:UIList; // Item=1001
   关闭界面容器:UIRoot;
   图案:UIBitmap;
   关闭:UIString;
   constructor(){
      super(5);
   }
}
class ListItem_5 extends UIListItemData {
   通用背景:number;
   底色:string;
   装饰图案:string;
   存入存档标题:string;
   界面背景框:string;
   list:UIListItemData[];
   图案:string;
   关闭:string;
}

/**
 * 6-系统设置 [BASE]
 */
class GUI_6 extends GUI_BASE {
   通用背景:GUI_15;
   系统设置标题容器:UIRoot;
   底色:UIBitmap;
   装饰图案:UIBitmap;
   系统设置标题:UIString;
   档案背景:UIBitmap;
   typeTab:UITabBox;
   常规:UIRoot;
   音量设置容器:UIRoot;
   背景音乐音量文本:UIString;
   bgmSlider:UISlider;
   环境音效音量文本:UIString;
   bgsSlider:UISlider;
   音效音量文本:UIString;
   seSlider:UISlider;
   语音音量文本:UIString;
   tsSlider:UISlider;
   其他设置容器:UIRoot;
   全屏勾选框:UISwitch;
   全屏文本:UIString;
   快进已读勾选框:UISwitch;
   快进已读文本:UIString;
   鼠标滚轮推进:UIString;
   文本框界面透明度容器_文本播放速度由玩家设置开启时出现:UIRoot;
   文本框界面透明度:UIString;
   文本框透明度拉条:UISlider;
   文本框图片:UIBitmap;
   文本:UIString;
   文本框界面透明度容器_文本播放速度由玩家设置关闭时出现:UIRoot;
   wordRoot:UIRoot;
   文本播放速度:UIString;
   wordPlaySpeedBar:UISlider;
   自动播放速度:UIString;
   wordAutoPlaySpeedBar:UISlider;
   previewWords:UIString;
   键盘控制:UIRoot;
   keyboardList:UIList; // Item=1018
   keyboardReset:UIButton;
   手柄控制:UIRoot;
   gamepadList:UIList; // Item=1019
   gamepadReset:UIButton;
   关闭界面容器:UIRoot;
   图案:UIBitmap;
   关闭:UIString;
   needInputKeyPanel:UIBitmap;
   needInputKeyLabel:UIString;
   保存所有文本按钮:UIButton;
   备份语言包按钮:UIButton;
   切换到中文按钮:UIButton;
   切换到英文按钮:UIButton;
   constructor(){
      super(6);
   }
}
class ListItem_6 extends UIListItemData {
   通用背景:number;
   底色:string;
   装饰图案:string;
   系统设置标题:string;
   档案背景:string;
   typeTab:string;
   背景音乐音量文本:string;
   bgmSlider:number;
   环境音效音量文本:string;
   bgsSlider:number;
   音效音量文本:string;
   seSlider:number;
   语音音量文本:string;
   tsSlider:number;
   全屏勾选框:number;
   全屏文本:string;
   快进已读勾选框:number;
   快进已读文本:string;
   鼠标滚轮推进:string;
   文本框界面透明度:string;
   文本框透明度拉条:number;
   文本框图片:string;
   文本:string;
   文本播放速度:string;
   wordPlaySpeedBar:number;
   自动播放速度:string;
   wordAutoPlaySpeedBar:number;
   previewWords:string;
   keyboardList:UIListItemData[];
   gamepadList:UIListItemData[];
   图案:string;
   关闭:string;
   needInputKeyPanel:string;
   needInputKeyLabel:string;

}

/**
 * 7-文本输入界面 [BASE]
 */
class GUI_7 extends GUI_BASE {
   界面背景:UIBitmap;
   输入框背景:UIBitmap;
   input:UIInput;
   提交文本输入按钮:UIButton;
   constructor(){
      super(7);
   }
}
class ListItem_7 extends UIListItemData {
   界面背景:string;
   输入框背景:string;
   input:string;

}

/**
 * 8-数字输入界面 [BASE]
 */
class GUI_8 extends GUI_BASE {
   界面背景:UIBitmap;
   输入框背景:UIBitmap;
   input:UIInput;
   提交数字输入按钮:UIButton;
   constructor(){
      super(8);
   }
}
class ListItem_8 extends UIListItemData {
   界面背景:string;
   输入框背景:string;
   input:string;

}

/**
 * 9-密码输入界面 [BASE]
 */
class GUI_9 extends GUI_BASE {
   界面背景:UIBitmap;
   输入框背景:UIBitmap;
   input:UIInput;
   提交密码输入按钮:UIButton;
   constructor(){
      super(9);
   }
}
class ListItem_9 extends UIListItemData {
   界面背景:string;
   输入框背景:string;
   input:string;

}

/**
 * 10-游戏结束界面 [BASE]
 */
class GUI_10 extends GUI_BASE {
   界面背景:UIBitmap;
   透明背景:UIBitmap;
   GameOver文本:UIString;
   constructor(){
      super(10);
   }
}
class ListItem_10 extends UIListItemData {
   界面背景:string;
   透明背景:string;
   GameOver文本:string;
}

/**
 * 11-CG鉴赏 [BASE]
 */
class GUI_11 extends GUI_BASE {
   通用背景:GUI_15;
   GC鉴赏标题容器:UIRoot;
   底色:UIBitmap;
   装饰图案:UIBitmap;
   CG鉴赏标题:UIString;
   界面背景框:UIBitmap;
   档案背景:UIBitmap;
   cgList:UIList; // Item=1003
   关闭界面容器:UIRoot;
   图案:UIBitmap;
   关闭:UIString;
   constructor(){
      super(11);
   }
}
class ListItem_11 extends UIListItemData {
   通用背景:number;
   底色:string;
   装饰图案:string;
   CG鉴赏标题:string;
   界面背景框:string;
   档案背景:string;
   cgList:UIListItemData[];
   图案:string;
   关闭:string;
}

/**
 * 12-CG鉴赏大图 [BASE]
 */
class GUI_12 extends GUI_BASE {
   界面背景:UIBitmap;
   透明背景:UIBitmap;
   bigCG:UIBitmap;
   关闭鉴赏大图按钮:UIButton;
   constructor(){
      super(12);
   }
}
class ListItem_12 extends UIListItemData {
   界面背景:string;
   透明背景:string;
   bigCG:string;

}

/**
 * 13-提示框 [BASE]
 */
class GUI_13 extends GUI_BASE {
   透明背景:UIBitmap;
   界面背景:UIBitmap;
   提示框标题文本:UIString;
   提示框内容文本:UIString;
   确定按钮:UIButton;
   取消按钮:UIButton;
   constructor(){
      super(13);
   }
}
class ListItem_13 extends UIListItemData {
   透明背景:string;
   界面背景:string;
   提示框标题文本:string;
   提示框内容文本:string;

}

/**
 * 14-音乐鉴赏 [BASE]
 */
class GUI_14 extends GUI_BASE {
   通用背景:GUI_15;
   立绘:UIStandAvatar;
   音乐鉴赏标题容器:UIRoot;
   底色:UIBitmap;
   装饰图案:UIBitmap;
   GC鉴赏标题:UIString;
   界面背景框:UIBitmap;
   musicList:UIList; // Item=1004
   播放进度条:UIRoot;
   timeProgress:UISlider;
   previousBtn:UIButton;
   playCheckBox:UICheckBox;
   timePosition:UIString;
   timeDuration:UIString;
   nextBtn:UIButton;
   关闭界面容器:UIRoot;
   图案:UIBitmap;
   关闭:UIString;
   constructor(){
      super(14);
   }
}
class ListItem_14 extends UIListItemData {
   通用背景:number;
   立绘:number;
   底色:string;
   装饰图案:string;
   GC鉴赏标题:string;
   界面背景框:string;
   musicList:UIListItemData[];
   timeProgress:number;
   playCheckBox:boolean;
   timePosition:string;
   timeDuration:string;
   图案:string;
   关闭:string;
}

/**
 * 15-通用背景 [BASE]
 */
class GUI_15 extends GUI_BASE {
   溢出隐藏容器:UIRoot;
   白色底色:UIBitmap;
   装饰背面底色1:UIBitmap;
   装饰背面底色2:UIBitmap;
   读取存档底色:UIBitmap;
   底部场景:UIBitmap;
   装饰背面线条:UIBitmap;
   装饰白色透明底色:UIBitmap;
   constructor(){
      super(15);
   }
}
class ListItem_15 extends UIListItemData {
   白色底色:string;
   装饰背面底色1:string;
   装饰背面底色2:string;
   读取存档底色:string;
   底部场景:string;
   装饰背面线条:string;
   装饰白色透明底色:string;
}

/**
 * 1001-档案Item [BASE]
 */
class GUI_1001 extends GUI_BASE {
   档案背景:UIBitmap;
   screenshotImg:UIBitmap;
   delBtn:UIButton;
   sceneName:UIString;
   dateStr:UIString;
   no:UIString;
   gameTimeStr:UIString;
   分割线:UIBitmap;
   constructor(){
      super(1001);
   }
}
class ListItem_1001 extends UIListItemData {
   档案背景:string;
   screenshotImg:string;
   sceneName:string;
   dateStr:string;
   no:string;
   gameTimeStr:string;
   分割线:string;
}

/**
 * 1002-历史回忆Item [BASE]
 */
class GUI_1002 extends GUI_BASE {
   tsBtn:UIButton;
   dialogName:UIString;
   dialogContent:UIString;
   constructor(){
      super(1002);
   }
}
class ListItem_1002 extends UIListItemData {
   dialogName:string;
   dialogContent:string;
}

/**
 * 1003-图片鉴赏Item [BASE]
 */
class GUI_1003 extends GUI_BASE {
   cg:UIBitmap;
   档案背景:UIBitmap;
   constructor(){
      super(1003);
   }
}
class ListItem_1003 extends UIListItemData {
   cg:string;
   档案背景:string;
}

/**
 * 1004-音乐鉴赏Item [BASE]
 */
class GUI_1004 extends GUI_BASE {
   music:UIString;
   musicSelected:UIString;
   constructor(){
      super(1004);
   }
}
class ListItem_1004 extends UIListItemData {
   music:string;
   musicSelected:string;
}

/**
 * 1005- [BASE]
 */
class GUI_1005 extends GUI_BASE {

   constructor(){
      super(1005);
   }
}
class ListItem_1005 extends UIListItemData {

}

/**
 * 1006- [BASE]
 */
class GUI_1006 extends GUI_BASE {

   constructor(){
      super(1006);
   }
}
class ListItem_1006 extends UIListItemData {

}

/**
 * 1007- [BASE]
 */
class GUI_1007 extends GUI_BASE {

   constructor(){
      super(1007);
   }
}
class ListItem_1007 extends UIListItemData {

}

/**
 * 1008-按钮选中效果样式1 [BASE]
 */
class GUI_1008 extends GUI_BASE {
   容器:UIRoot;
   target:UIBitmap;
   constructor(){
      super(1008);
   }
}
class ListItem_1008 extends UIListItemData {
   target:string;
}

/**
 * 1009-按钮选中效果样式2 [BASE]
 */
class GUI_1009 extends GUI_BASE {
   容器:UIRoot;
   target:UIBitmap;
   constructor(){
      super(1009);
   }
}
class ListItem_1009 extends UIListItemData {
   target:string;
}

/**
 * 1010-按钮选中效果样式3 [BASE]
 */
class GUI_1010 extends GUI_BASE {
   容器:UIRoot;
   target:UIBitmap;
   constructor(){
      super(1010);
   }
}
class ListItem_1010 extends UIListItemData {
   target:string;
}

/**
 * 1011- [BASE]
 */
class GUI_1011 extends GUI_BASE {

   constructor(){
      super(1011);
   }
}
class ListItem_1011 extends UIListItemData {

}

/**
 * 1012- [BASE]
 */
class GUI_1012 extends GUI_BASE {

   constructor(){
      super(1012);
   }
}
class ListItem_1012 extends UIListItemData {

}

/**
 * 1013- [BASE]
 */
class GUI_1013 extends GUI_BASE {

   constructor(){
      super(1013);
   }
}
class ListItem_1013 extends UIListItemData {

}

/**
 * 1014- [BASE]
 */
class GUI_1014 extends GUI_BASE {

   constructor(){
      super(1014);
   }
}
class ListItem_1014 extends UIListItemData {

}

/**
 * 1015- [BASE]
 */
class GUI_1015 extends GUI_BASE {

   constructor(){
      super(1015);
   }
}
class ListItem_1015 extends UIListItemData {

}

/**
 * 1016- [BASE]
 */
class GUI_1016 extends GUI_BASE {

   constructor(){
      super(1016);
   }
}
class ListItem_1016 extends UIListItemData {

}

/**
 * 1017- [BASE]
 */
class GUI_1017 extends GUI_BASE {

   constructor(){
      super(1017);
   }
}
class ListItem_1017 extends UIListItemData {

}

/**
 * 1018-设置_Item1 [BASE]
 */
class GUI_1018 extends GUI_BASE {
   项目背景:UIBitmap;
   keyName:UIString;
   key1:UIButton;
   key2:UIButton;
   key3:UIButton;
   key4:UIButton;
   constructor(){
      super(1018);
   }
}
class ListItem_1018 extends UIListItemData {
   项目背景:string;
   keyName:string;

}

/**
 * 1019-设置_Item2 [BASE]
 */
class GUI_1019 extends GUI_BASE {
   项目背景:UIBitmap;
   keyName:UIString;
   key1:UIButton;
   constructor(){
      super(1019);
   }
}
class ListItem_1019 extends UIListItemData {
   项目背景:string;
   keyName:string;

}

/**
 * 1020- [BASE]
 */
class GUI_1020 extends GUI_BASE {

   constructor(){
      super(1020);
   }
}
class ListItem_1020 extends UIListItemData {

}

/**
 * 2001-启动载入界面 [BASE]
 */
class GUI_2001 extends GUI_BASE {
   界面背景:UIBitmap;
   标题内容容器:UIRoot;
   装饰:UIBitmap;
   标题:UIString;
   标题装饰:UIString;
   loadingComp:UISlider;
   进度数值容器:UIRoot;
   进度数值:UIString;
   进度文本:UIString;
   constructor(){
      super(2001);
   }
}
class ListItem_2001 extends UIListItemData {
   界面背景:string;
   装饰:string;
   标题:string;
   标题装饰:string;
   loadingComp:number;
   进度文本:string;
}

/**
 * 2002-新游戏载入界面 [BASE]
 */
class GUI_2002 extends GUI_BASE {
   界面背景:UIBitmap;
   加载动画:UIAnimation;
   constructor(){
      super(2002);
   }
}
class ListItem_2002 extends UIListItemData {
   界面背景:string;
   加载动画:number;
}

/**
 * 2003-读档载入界面 [BASE]
 */
class GUI_2003 extends GUI_BASE {
   界面背景:UIBitmap;
   加载动画:UIAnimation;
   constructor(){
      super(2003);
   }
}
class ListItem_2003 extends UIListItemData {
   界面背景:string;
   加载动画:number;
}

/**
 * 2004-场景载入界面 [BASE]
 */
class GUI_2004 extends GUI_BASE {
   界面背景:UIBitmap;
   加载动画:UIAnimation;
   constructor(){
      super(2004);
   }
}
class ListItem_2004 extends UIListItemData {
   界面背景:string;
   加载动画:number;
}

/**
 * 2005-返回标题时过渡界面 [BASE]
 */
class GUI_2005 extends GUI_BASE {
   界面背景:UIBitmap;
   constructor(){
      super(2005);
   }
}
class ListItem_2005 extends UIListItemData {
   界面背景:string;
}

/**
 * 2006-打开界面载入 [BASE]
 */
class GUI_2006 extends GUI_BASE {
   loadingComp:UISlider;
   进度数值容器:UIRoot;
   进度数值:UIString;
   进度文本:UIString;
   constructor(){
      super(2006);
   }
}
class ListItem_2006 extends UIListItemData {
   loadingComp:number;
   进度文本:string;
}

/**
 * 3001-我的界面示例 [BASE]
 */
class GUI_3001 extends GUI_BASE {
   图片:UIBitmap;
   按钮:UIButton;
   文本:UIString;
   constructor(){
      super(3001);
   }
}
class ListItem_3001 extends UIListItemData {
   图片:string;
   文本:string;
}

/**
 * 3002- [BASE]
 */
class GUI_3002 extends GUI_BASE {

   constructor(){
      super(3002);
   }
}
class ListItem_3002 extends UIListItemData {

}

/**
 * 3003- [BASE]
 */
class GUI_3003 extends GUI_BASE {

   constructor(){
      super(3003);
   }
}
class ListItem_3003 extends UIListItemData {

}

/**
 * 3004- [BASE]
 */
class GUI_3004 extends GUI_BASE {

   constructor(){
      super(3004);
   }
}
class ListItem_3004 extends UIListItemData {

}

/**
 * 3005- [BASE]
 */
class GUI_3005 extends GUI_BASE {

   constructor(){
      super(3005);
   }
}
class ListItem_3005 extends UIListItemData {

}

/**
 * 15001- [BASE]
 */
class GUI_15001 extends GUI_BASE {

   constructor(){
      super(15001);
   }
}
class ListItem_15001 extends UIListItemData {

}
GameUI["__compCustomAttributes"] = {"UIRoot":["enabledLimitView","scrollShowType","hScrollBar","hScrollBg","vScrollBar","vScrollBg","scrollWidth","slowmotionType","enabledWheel","hScrollValue","vScrollValue"],"UIButton":["label","image1","grid9img1","image2","grid9img2","image3","grid9img3","fontSize","color","overColor","clickColor","bold","italic","smooth","align","valign","letterSpacing","font","textDx","textDy","textStroke","textStrokeColor"],"UIBitmap":["image","grid9","flip","isTile","pivotType"],"UIString":["text","fontSize","color","bold","italic","smooth","align","valign","leading","letterSpacing","font","wordWrap","overflow","shadowEnabled","shadowColor","shadowDx","shadowDy","stroke","strokeColor","onChangeFragEvent"],"UIVariable":["varID","fontSize","color","bold","italic","smooth","align","valign","leading","letterSpacing","font","wordWrap","overflow","shadowEnabled","shadowColor","shadowDx","shadowDy","stroke","strokeColor","onChangeFragEvent"],"UICustomGameNumber":["customData","previewNum","previewFixed","fontSize","color","bold","italic","smooth","align","valign","leading","letterSpacing","font","wordWrap","overflow","shadowEnabled","shadowColor","shadowDx","shadowDy","stroke","strokeColor"],"UICustomGameString":["customData","inEditorText","fontSize","color","bold","italic","smooth","align","valign","leading","letterSpacing","font","wordWrap","overflow","shadowEnabled","shadowColor","shadowDx","shadowDy","stroke","strokeColor"],"UIAvatar":["avatarID","scaleNumberX","scaleNumberY","orientationIndex","avatarFPS","playOnce","isPlay","avatarFrame","actionID","avatarHue"],"UIStandAvatar":["avatarID","actionID","scaleNumberX","scaleNumberY","flip","playOnce","isPlay","avatarFrame","avatarFPS","avatarHue"],"UIAnimation":["animationID","scaleNumberX","scaleNumberY","aniFrame","playFps","playType","showHitEffect","silentMode"],"UIInput":["text","fontSize","color","prompt","promptColor","bold","italic","smooth","align","leading","font","wordWrap","restrict","inputMode","maxChars","shadowEnabled","shadowColor","shadowDx","shadowDy","onInputFragEvent","onEnterFragEvent"],"UICheckBox":["selected","image1","grid9img1","image2","grid9img2","onChangeFragEvent"],"UISwitch":["selected","image1","grid9img1","image2","grid9img2","previewselected","onChangeFragEvent"],"UITabBox":["selectedIndex","itemImage1","grid9img1","itemImage2","grid9img2","itemWidth","itemHeight","items","rowMode","spacing","labelSize","labelColor","labelFont","labelBold","labelItalic","smooth","labelAlign","labelValign","labelLetterSpacing","labelSelectedColor","labelDx","labelDy","labelStroke","labelStrokeColor","onChangeFragEvent"],"UISlider":["image1","bgGrid9","image2","blockGrid9","image3","blockFillGrid9","step","min","max","value","transverseMode","blockFillMode","blockPosMode","fillStrething","isBindingVarID","bindingVarID","onChangeFragEvent"],"UIGUI":["guiID","instanceClassName"],"UIList":["itemModelGUI","previewSize","selectEnable","repeatX","itemWidth","itemHeight","spaceX","spaceY","scrollShowType","hScrollBar","hScrollBg","vScrollBar","vScrollBg","scrollWidth","selectImageURL","selectImageGrid9","selectedImageAlpha","selectedImageOnTop","overImageURL","overImageGrid9","overImageAlpha","overImageOnTop","overSelectMode","slowmotionType"],"UIComboBox":["itemLabels","selectedIndex","bgSkin","bgGrid9","fontSize","color","bold","italic","smooth","align","valign","letterSpacing","font","textDx","textStroke","textStrokeColor","displayItemSize","listScrollBg","listScrollBar","listAlpha","listBgColor","itemHeight","itemFontSize","itemColor","itemBold","itemItalic","itemAlign","itemValign","itemLetterSpacing","itemFont","itemOverColor","itemOverBgColor","itemTextDx","itemTextDy","itemTextStroke","itemTextStrokeColor","onChangeFragEvent"],"UIVideo":["videoURL","playType","volume","playbackRate","currentTime","muted","loop","pivotType","flip","onLoadedFragEvent","onErrorFragEvent","onCompleteFragEvent"]};
