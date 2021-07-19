// ==UserScript==
// @name         网盘资源搜索 提取码查询 等多功能综合脚本
// @namespace    http://tampermonkey.net/
// @version      4.0
// @description  功能概述：【[1]：[百度.蓝奏.天翼.阿里.慢慢增加]等网盘页面增加资源搜索平台的快捷方式】【[2]：在各个搜索平台页一路辅助跳转到目标网盘并直达文件页面】【[3]：访问过的分享链接和密码自动记忆】
// @author       【有意见或建议联系 gaoleicao@qq.com】
// @match        *://pan.baidu.com/*
// @match        *://yun.baidu.com/*
// @match        *://cloud.189.cn/*
// @match        *://h5.cloud.189.cn/*
// @match        *://*.woozooo.com/*
// @match        *://*.lanzou.com/*
// @match        *://*.lanzous.com/*
// @match        *://*.lanzoux.com/*
// @match        *://*.lanzoui.com/*
// @match        https://pan.xunlei.com/*
// @match        https://www.aliyundrive.com/*

// @match        *://yun.hei521.cn/*
// @match        *://qitablog.com/circle/*.html

// @match        *://www.dalipan.com/*
// @match        *://www.dashengpan.com/*
// @match        *://www.luomapan.com/*
// @match        *://www.xiaomapan.com/*
// @match        *://www.baimapan.com/*
// @match        *://www.feifeipan.com/*
// @match        *://www.feizhupan.com/*
// @match        *://www.yubaipan.com/*
// @match        *://www.jnzy.pro/*
// @match        *://www.iizhi.cn/resource/detail/*

// @match        https://www.xiaozhukuaipan.com/*
// @match        http://www.aiyoweia.com/*.shtml
// @match        http://www.zhaoyunpan.cn/shareinfo/*
// @match        https://pan.sov5.cn/res/*
// @match        https://www.quzhuanpan.com/*

// @match        http://www.panmeme.com/wenjian/*.html
// @match        http://www.pan58.com/f/*
// @match        http://www.vpansou.com/sfile/*
// @match        http://www.vpanso.com/vfile/*
// @match        http://www.dmpans.com/file/*.html
// @match        http://www.lele360.com/vd/*.html
// @match        http://www.kengso.com/file/*
// @match        http://www.repanso.com/f/*
// @match        http://www.xgsoso.com/share/*.html

// @match        http://www.panghaozi.com/pan/search/resource/*
// @match        http://www.sowp.cn/detail/*.html
// @match        http://www.51sopan.cn/*

// @match        https://www.58wangpan.com/s/*/
// @match        https://www.56wangpan.com/file/*
// @match        https://www.soupan8.com/file/*
// @match        http://www.baidupan.org/file/*
// @match        http://www.haogow.com/file/*
// @match        http://www.soupan.tv/file/*
// @match        http://www.rufengso.cc/file/*
// @match        https://aizhaomu.com/f/*/
// @match        http://uzi8.cn/file/*

// @match        https://www.xiaobaipan.com/file*
// @match        http://www.qiaomi.cn/b/*
// @match        http://www.lqkweb.com/*.html
// @match        http://www.panso.org/file/*.html
// @match        https://www.h2ero.com/baiduwangpan/*.html

// @match        http://www.slimego.cn/search.html?q=*
// @match        https://www.ttyunsou.cn/article-pid-*.html
// @match        https://www.dyroy.com/show/*.html
// @match        https://www.dyroy.com/downalbum/*.html
// @match        https://www.pantianxia.com/s/*
// @match        http://baiduyun.6miu.com/show-*.html
// @match        http://yun.java1234.com/article/*
// @match        http://*/*
// @match        https://*/*

// @connect      baidu.com
// @connect      fryaisjx.lc-cn-n1-shared.com
// @require      https://cdn.jsdelivr.net/npm/jquery@3/dist/jquery.min.js
// @grant        unsafeWindow
// @grant        GM_xmlhttpRequest
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_notification
// @grant        GM_setClipboard
// ==/UserScript==
(function() {
    'use strict';
    var $ = $ || window.$ || unsafeWindow.$;

    /*=====================================================================================================================*/
    var obj = {
        share_pwd: null,
        url: new URL(window.location.href)
    };

    obj.showTip = function(stx) {
        if (!unsafeWindow.sms) {
            $("body").prepend('<div id="sms"><span id="smsspan"></span></div>');
            var css = [
                "#sms{display:none;z-index:999999;text-align:center;position:fixed;top:40px;left:0px;right:0px;width:auto;height:30px;margin-left:auto;margin-right:auto;line-height:1.2em}",
                "#smsspan{padding:2px 5px;background:rgba(0,0,0,.7);color:#fff;font-size:14px;padding:5px 8px;border-radius:3px}"
            ];
            $("<style></style>").text(css.join("\n")).appendTo(document.head || document.documentElement);

            unsafeWindow.sms = function (stx) {
                document.getElementById("sms").style.display="none";
                $("#smsspan").text(stx);
                document.getElementById("sms").style.display="block";
                setTimeout(function(){ document.getElementById("sms").style.display="none"; }, 5000);
            }
        }

        unsafeWindow.sms(stx);
    };

    obj.showTipSuccess = function(stx) {
        obj.showTip(stx);
        $("#smsspan").css({background: "rgba(0,128,0,.7)"});
    };

    obj.showTipError = function(stx) {
        obj.showTip(stx);
        $("#smsspan").css({background: "rgba(255,0,0,.7)"});
    };

    obj.getParam = function(e, t) {
        var n = new RegExp("(?:^|\\?|#|&)" + e + "=([^&#]*)(?:$|&|#)", "i"),
            i = n.exec(t || location.href);
        return i ? i[1] : ""
    };

    obj.randString = function(length) {
        var possible = "abcdefghijklmnopqrstuvwxyz0123456789";
        var text = "";
        for (var i = 0; i < length; i++) {
            text += possible.charAt(Math.floor(Math.random() * possible.length));
        }
        return text;
    };

    obj.reload = function() {
        if (GM_getValue("reloadUrl") != obj.url.href) {
            location.reload();
            GM_setValue("reloadUrl", obj.url.href);
        }
    };

    obj.isInArray = function(arr, value) {
        var index = $.inArray(value, arr);
        if (index >= 0) {
            return true;
        }
        return false;
    };

    obj.getShareId = function (shareLink) {
        shareLink = shareLink || location.href;
        if (shareLink.indexOf("pan.baidu.com") > 0 || shareLink.indexOf("yun.baidu.com") > 0) {
            return (/baidu.com\/(?:s\/1|(?:share|wap)\/init\?surl=)([\w-]{5,25})/.exec(shareLink) || [])[1];
        }
        else if (shareLink.indexOf("cloud.189.cn") > 0) {
            return (/cloud\.189\.cn[a-z\d\/\?\.#]*(?:code=|\/t\/)([\w]{12})/.exec(shareLink) || [])[1];
        }
        else if (/[\w-]*\.?lanzou.?\.com/.test(shareLink)) {
            return (/lanzou[sxi]?\.com\/[\w]+\/([\w]+)/.exec(shareLink) || /lanzou[sxi]?\.com\/([\w]+)/.exec(shareLink) || [])[1];
        }
        else if (shareLink.indexOf("pan.xunlei.com") > 0) {
            return (/pan\.xunlei\.com\/s\/([\w-]+)/.exec(shareLink) || [])[1];
        }
        else if (shareLink.indexOf("aliyundrive.com") > 0) {
            return (/aliyundrive\.com\/s\/([a-zA-Z\d]+)/.exec(shareLink) || [])[1];
        }
        else {
            return "";
        }
    };

    obj.getSharePwdLocal = function(shareId) {
        if (/http/.test(shareId)) {
            shareId = obj.getShareId(shareId);
        }
        var shareList = GM_getValue("share_list") || {};
        return shareList[shareId];
    };

    obj.setSharePwdLocal = function(shareData) {
        if (shareData instanceof Object) {
            var shareList = GM_getValue("share_list") || {};
            var shareId = shareData.share_id;
            shareList[shareId] = shareData;
            GM_setValue("share_list", shareList);
        }
    };

    obj.removeSharePwdLocal = function (shareId) {
        var shareList = GM_getValue("share_list") || {};
        delete shareList[shareId];
        GM_setValue("share_list", shareList);
    };

    obj.matchShareAll = function (text, reg) {
        var resObj, results = [];
        while (resObj = reg.exec(text)) {
            results.push(resObj);
        }
        return results;
    };

    obj.checkShareFromInnerText = function () {
        var shareRegExp = {
            baidu: /(https?:\/\/(?:pan|yun)\.baidu\.com\/(?:s\/\d|(?:share|wap)\/init\?surl\=)([\w-]{5,25}))([^\w]*(?:提取|访问|查阅|授权|密\s*)码[^\w]*([\w]{4}))?/gim,
            lanzous: /(https?:\/\/[\w-]*\.?lanzou[sxi]?\.com\/([\w]{6,13}))([^\w]*(?:提取|访问|查阅|授权|密\s*)码[^\w]*([\w-]{4,12}))?/gim,
            ty189: /(https?:\/\/(?:h5\.)?cloud\.189\.cn\/(?:web\/share\?code|share\.html#)?(?:=|t\/)([\w]{12}))([^\w]*(?:提取|访问|查阅|授权|密\s*)码[^\w]*([\w]{4}))?/gim,
            xunlei: /(https?:\/\/pan\.xunlei\.com\/s\/([\w-]{26}))([&\w=]*[^\w]*(?:提取|密)码[^\w]*([\w]{4}))?/gim,
            aliyundrive: /(https?:\/\/www\.aliyundrive\.com\/s\/([a-z\d]{11}))([^\w]*(?:提取|密)码[^\w]*([\w]{4}))?/gim,
        };

        var innerText = document.body.innerText, shareList = [];
        Object.keys(shareRegExp).forEach(function (shareSource) {
            var allShare = obj.matchShareAll(innerText, shareRegExp[shareSource]);
            allShare.forEach(function (item) {
                var shareLink = item[1], shareId = item[2], sharePwd = item[4] || "";
                if (shareLink) {
                    var shareData = obj.getSharePwdLocal(shareId);
                    shareData = Object.assign(shareData || {}, {
                        share_source: shareSource,
                        share_id: shareId,
                        share_pwd: sharePwd,
                        share_url:shareLink,
                        origin_url: decodeURIComponent(location.href),
                        origin_title: document.title
                    });
                    shareData.share_pwd || (shareData.share_pwd = (/(?:访问码|提取码|密码)[^\w]*([\w]{4})/.exec(innerText) || [])[1]);
                    shareData.share_pwd && obj.setSharePwdLocal(shareData);
                    obj.showTipSuccess(shareSource + "：" + shareLink + (shareData.share_pwd ? "  提取码：" + shareData.share_pwd : ""));
                }
            });
        });
    };

    obj.ajax = function(option) {
        var details = {
            method: option.type || "get",
            url: option.url,
            responseType: option.dataType,
            onload: function(result) {
                if (!result.status || parseInt(result.status / 100) == 2) {
                    var response = result.response;
                    try {
                        response = JSON.parse(response);
                    } catch(a) {};
                    option.success && option.success(response);
                } else {
                    console.error("http返回错误", result);
                    option.error && option.error(result);
                }
            },
            onerror: function(result) {
                console.error("http请求错误", result);
                option.error && option.error(result.error);
            }
        };

        if (option.data instanceof Object) {
            details.data = Object.keys(option.data).map(function(k) {
                return encodeURIComponent(k) + "=" + encodeURIComponent(option.data[k]).replace("%20", "+");
            }).join("&");
        } else {
            details.data = option.data
        }

        if (option.type.toUpperCase() == "GET" && details.data) {
            details.url = option.url + "?" + details.data;
            details.data = "";
        }

        if (option.headers) {
            details.headers = option.headers;
        }

        if (option.timeout) {
            details.timeout = option.timeout;
        }

        GM_xmlhttpRequest(details);
    };

    obj.storeSharePwd = function(shareData, callback) {
        obj.ajax({
            type: "post",
            url: "https://fryaisjx.lc-cn-n1-shared.com/1.1/classes/".concat(shareData.share_source),
            data: JSON.stringify(shareData),
            headers: {
                "Content-Type": "application/json;charset=UTF-8",
                "X-LC-Id": "FrYaIsJxDFzqqgeaT6tHjAjo-gzGzoHsz",
                "X-LC-Key": "exPA65fcqUGqfbuRFIJIwNUU"
            },
            success: function (response) {
                callback && callback(response);
            },
            error: function () {
                callback && callback("");
            }
        });
    };

    obj.querySharePwd = function(shareSource, shareId, callback) {
        obj.ajax({
            type: "get",
            url: "https://fryaisjx.lc-cn-n1-shared.com/1.1/classes/".concat(shareSource, "?where=").concat(JSON.stringify({share_id: shareId})),
            headers: {
                "Content-Type": "application/json;charset=UTF-8",
                "X-LC-Id": "FrYaIsJxDFzqqgeaT6tHjAjo-gzGzoHsz",
                "X-LC-Key": "exPA65fcqUGqfbuRFIJIwNUU"
            },
            success: function (response) {
                if (response instanceof Object && Array.isArray(response.results)) {
                    callback && callback(response.results[0]);
                }
                else {
                    callback && callback("");
                }
            },
            error: function () {
                callback && callback("");
            }
        });
    };

    /*=====================================================================================================================*/
    var baidu = {};

    baidu.reloadPage = function() {
        var title = document.title;
        //alert("title："+ title);
        if ((title == "页面不存在") || title == ("404 Not Found")) {
            obj.reload();
        }
    };

    baidu.diskList = function() {
        return [
            {
                name: "小猪快盘",
                link: "https://www.xiaozhukuaipan.com/s/search?q=%sv%",
                type: 2,
            },
            {
                name: "哎呦喂啊",
                link: "http://www.aiyoweia.com/search/%sv%",
                type: 2,
            },
            {
                name: "找云盘",
                link: "http://www.zhaoyunpan.cn/share_search.php?key=%sv%&type=ALL",
                type: 2,
            },
            {
                name: "SoV5",
                link: "https://www.sov5.cn/search?q=%sv%",
                type: 2,
            },
            {
                name: "去转盘",
                link: "https://www.quzhuanpan.com/source/search.action?q=%sv%",
                type: 2,
            },
            {
                name: "盘么么",
                link: "http://www.panmeme.com/query?key=%sv%",
                type: 3,
            },
            {
                name: "Pan58",
                link: "http://www.pan58.com/s?wd=%sv%",
                type: 3,
            },
            {
                name: "V盘搜",
                link: "http://www.vpansou.com/query?wd=%sv%",
                type: 3,
            },
            {
                name: "微盘搜索",
                link: "http://www.vpanso.com/s?wd=%sv%",
                type: 3,
            },
            {
                name: "坑搜网",
                link: "http://www.kengso.com/s?wd=%sv%",
                type: 3,
            },
            {
                name: "热盘搜",
                link: "http://www.repanso.com/q?wd=%sv%",
                type: 3,
            },
            {
                name: "西瓜搜搜",
                link: "http://www.xgsoso.com/s?wd=%sv%",
                type: 3,
            },
            {
                name: "大漠盘搜",
                link: "http://www.dmpans.com/search?wd=%sv%",
                type: 3,
            },
            {
                name: "乐乐搜索",
                link: "http://www.lele360.com/search?word=%sv%",
                type: 3,
            },
            {
                name: "58网盘",
                link: "http://www.58wangpan.com/search/kw%sv%",
                type: 4,
            },
            {
                name: "56网盘",
                link: "http://www.56wangpan.com/search/kw%sv%",
                type: 4,
            },
            {
                name: "搜盘8",
                link: "https://www.soupan8.com/search/kw%sv%",
                type: 4,
            },
            {
                name: "aizhaomu",
                link: "https://aizhaomu.com/search/kw%sv%",
                type: 4,
            },
            {
                name: "百度盘搜",
                link: "http://www.baidupan.org/search/kw%sv%",
                type: 4,
            },
            {
                name: "搜盘网",
                link: "http://www.soupan.tv/search/kw%sv%",
                type: 4,
            },
            {
                name: "如风搜",
                link: "http://www.rufengso.cc/search/kw%sv%",
                type: 4,
            },
            {
                name: "好去网",
                link: "http://www.haogow.com/search/kw%sv%",
                type: 4,
            },
            {
                name: "Uzi8",
                link: "http://uzi8.cn/search/kw%sv%",
                type: 4,
            },
            {
                name: "胖浩子",
                link: "http://www.panghaozi.com/pan/search?keyword=%sv%",
                type: 5,
            },
            {
                name: "搜网盘",
                link: "http://www.sowp.cn/search?kw=%sv%",
                type: 5,
            },
            {
                name: "51搜盘",
                link: "http://www.51sopan.cn/search?keywords=%sv%",
                type: 5,
            },

            {
                name: "巧眯网",
                link: "http://www.qiaomi.cn/s/%sv%",
                type: 6,
            },
            {
                name: "小白盘",
                link: "https://www.xiaobaipan.com/list-%sv%.html",
                type: 6,
            },
            {
                name: "lqkweb",
                link: "http://www.lqkweb.com/list?q=%sv%",
                type: 6,
            },
            {
                name: "盘搜网",
                link: "http://www.panso.org/search?q=%sv%",
                type: 6,
            },
            {
                name: "咕咕云搜索",
                link: "https://www.h2ero.com/search?keywords=%sv%",
                type: 6,
            },

            {
                name: "天天云搜",
                link: "https://www.ttyunsou.cn/s?keyword=%sv%",
                type: 6,
            },
            {
                name: "乐伊分享",
                link: "https://www.dyroy.com/html/search.html?q=%sv%",
                type: 6,
            },
            {
                name: "盘天下",
                link: "https://www.pantianxia.com/zh/%sv%",
                type: 6,
            },
            {
                name: "6miu",
                link: "http://baiduyun.6miu.com/word.html?kw=%sv%",
                type: 6,
            },
            {
                name: "Java分享网",
                link: "http://yun.java1234.com/search?q=%sv%",
                type: 6,
            },
            // 《7》点击直达百度盘
            {
                name: "懒盘聚合",
                link: "https://disk.misiai.com/search?kw=%sv%&what=disk",
                type: 7,
            },
            {
                name: "优盘搜",
                link: "https://upanso.com/main/leftSearch?time=ALL&kw=%sv%&diskType=ALL",
                type: 7,
            },
            {
                name: "99搜索",
                link: "http://www.99baiduyun.com/baidu/%sv%",
                type: 7,
            },
            {
                name: "史莱姆",
                link: "http://www.slimego.cn/search.html?q=%sv%",
                type: 7,
            },
            {
                name: "文件搜",
                link: "http://wjsou.com/s2.jsp?q=%sv%",
                type: 7,
            },
            // 《8》不用扫码
            {
                name: "搜索盘",
                link: "https://www.sosuopan.cn/search?q=%sv%",
                type: 8,
            },
            {
                name: "盘131",
                link: "http://www.pan131.com/yun/%sv%/",
                type: 8,
            },
            {
                name: "盘搜搜",
                link: "https://www.pansoso.la/zh/%sv%",
                type: 8,
            },
            {
                name: "我搜云网盘",
                link: "https://www.wosouyun.com/wd/%sv%",
                type: 8,
            },
            {
                name: "xingtuhua",
                link: "http://wx.xingtuhua.com/so?keyword=%sv%",
                type: 8,
            },
            {
                name: "51网盘搜索",
                link: "https://m.51caichang.com/so?keyword=%sv%&page=1&url_path=so",
                type: 8,
            },

            {
                name: "盘搜大师",
                link: "http://chawangpan.com/paymentList.html?field=%sv%&pgtype=search&pg=1&type=1&btn=1&flag=1&ctype=1",
                type: 8,
            },
            {
                name: "云搜大师",
                link: "https://www.xxhh360.com/search?q=%sv%",
                type: 8,
            },
            {
                name: "十月搜索",
                link: "http://www.shiyue.org/s/%sv%",
                type: 8,
            },
            {
                name: "熊猫搜盘",
                link: "http://www.sopandas.com/s/%sv%",
                type: 8,
            },
            {
                name: "云铺子",
                link: "http://www.yunpz.net/all/s-%sv%.html",
                type: 8,
            },
            {
                name: "网盘007",
                link: "https://wp7.net/share/kw%sv%",
                type: 8,
            },
            {
                name: "度度搜",
                link: "http://www.lzyongda.cn/plus/search.php?q=%sv%",
                type: 8,
            },
            {
                name: "酷搜",
                link: "https://www.kolsou.com/search?q=%sv%&",
                type: 8,
            },
            {
                name: "搜网盘",
                link: "http://www.sowangpan.com/search/%sv%-0-全部-0.html",
                type: 8,
            },
            {
                name: "盘无尽",
                link: "http://panwujin.com/resources/q.html?q=%sv%",
                type: 8,
            },
            {
                name: "网盘之家",
                link: "https://www.45256.com/so/%sv%",
                type: 8,
            },
            {
                name: "网盘搜索",
                link: "http://www.kaclub.cn/search?q=%sv%",
                type: 8,
            },
            {
                name: "资源搜索",
                link: "http://www.olecn.com/?s=%sv%",
                type: 8,
            },
            {
                name: "小说搜搜",
                link: "https://www.xssousou.com/s/%sv%.html",
                type: 8,
            },
            {
                name: "搜度",
                link: "http://www.sodu123.com/sodu/so.php?q=%sv%",
                type: 8,
            },
            {
                name: "一个桔",
                link: "http://zhannei.baidu.com/cse/search?q=%sv%&s=8741474853775767192",
                type: 8,
            },
            {
                name: "bdY搜",
                link: "http://www.bdyso.com/",
                type: 8,
            },
            {
                name: "云盘狗",
                link: "http://www.yunpangou.com",
                type: 8,
            },
            {
                name: "盘满满",
                link: "https://www.panmanman.com/article/list/1",
                type: 8,
            },
            // 《9》需要扫码
            {
                name: "小马盘",
                link: "http://www.xiaomapan.com/#/main/search?kw=%sv%",
                type: 9,
            },
            {
                name: "大力盘",
                link: "http://www.dalipan.com/#/main/search?kw=%sv%",
                type: 9,
            },
            {
                name: "大圣盘",
                link: "http://www.dashengpan.com/#/main/search?kw=%sv%",
                type: 9,
            },
            {
                name: "白马盘",
                link: "https://www.baimapan.com/#/main/search?keyword=%sv%",
                type: 9,
            },
            {
                name: "玉白盘",
                link: "https://www.yubaipan.com/#/main/search?keyword=%sv%",
                type: 9,
            },
            {
                name: "飞飞盘",
                link: "http://www.feifeipan.com/#/main/search?kw=%sv%",
                type: 9,
            },
            {
                name: "飞猪盘",
                link: "http://www.feizhupan.com/#/main/search?keyword=%sv%",
                type: 9,
            },
            {
                name: "罗马盘",
                link: "https://www.luomapan.com/search?keyword=%sv%",
                type: 9,
            },
            {
                name: "毕方铺",
                link: "https://www.iizhi.cn/resource/search/%sv%",
                type: 9,
            },
            {
                name: "胶囊汁源",
                link: "https://www.jnzy.pro/result?keyword=%sv%",
                type: 9,
            },
            {
                name: "飞鱼盘搜",
                link: "http://feiyu100.cn/search",
                type: 10,
            },
            {
                name: "两仪鸟搜索",
                link: "http://www.baiduyunsousou.com/search?kw=%sv%",
                type: 10,
            },
            {
                name: "搜云盘",
                link: "https://www.soyunpan.com/search/%sv%-0-全部-0.html",
                type: 10,
            },
            {
                name: "Fastsoso",
                link: "https://www.fastsoso.cn/search?k=%sv%",
                type: 10,
            },
            {
                name: "兄弟盘",
                link: "https://www.xiongdipan.com/search?k=%sv%",
                type: 10,
            },
            {
                name: "嗨呀搜索",
                link: "http://hy.520mwx.com/search?kw=%sv%",
                type: 10,
            },
            {
                name: "猪猪盘",
                link: "http://www.zhuzhupan.com/paysuccess?id=%sv%||_||&_t=" + Date.parse(new Date()),
                type: 10,
            },
            {
                name: "面包树",
                link: "https://mianbaoshu.cc/search/%sv%",
                type: 10,
            },
            {
                name: "凌风云",
                link: "https://www.lingfengyun.com/search?wd=%sv%&so_token=38c730c6ceb4e98eff51c0775ee4ae5d&so_file=wang_pan&so_source=all_pan",
                type: 10,
            },
            {
                name: "盘多多",
                link: "http://www.panduoduo.top/",
                //http://www.panduoduo.online/
                type: 11,
            },
            {
                name: "众人搜索网",
                link: "http://wangpan.renrensousuo.com/jieguo?sa=%E7%BD%91%E7%9B%98%E6%90%9C%E7%B4%A2&q=%sv%",
                type: 11,
            },
            {
                name: "天天搜索",
                link: "http://www.daysou.com/s?q=%sv%&start=0&isget=1&tp=baipan&cl=0&line=4",
                type: 11,
            },
            {
                name: "verypan",
                link: "http://www.verypan.com/index/index/baidusearch?keyword=%sv%",
                type: 11,
            },
            {
                name: "微友搜索",
                link: "http://www.weiyoou8.com/",
                type: 11,
            },
            /*
            {
                name: "城通资源",
                link: "http://ct.vpan123.com/search/f-%sv%-1.html",
                type: 10,
            },
            {
                name: "蓝菊花搜索",
                link: "http://www.lanjuhua.com/",
                type: 10,
            },
            {
                name: "telegram",
                link: "http://www.sssoou.com/",
                type: 10,
            },
            {
                name: "熊猫搜书",
                link: "https://ebook.huzerui.com/#/",
                type: 10,
            },
            https://polished-sea-d9de.xfyz.workers.dev/
            {
                name: "云盘助手",
                link: "https://yunpanzhushou.com/?q=%sv%",
                type: 9,
            },
            */
        ];
    };

    baidu.getRandomColor = function() {
        return '#' + ('00000' + (Math.random() * 0x1000000 << 0).toString(16)).substr( - 6);
    };

    baidu.addSearchOptions = function() {
        var fatherHome = $(".nd-main-layout__body").get(0) || $(".frame-main").get(0) || $(".nd-main-layout__body").get(0) || $(".frame-all").get(0);
        if (!fatherHome) {
            return;
        }

        $(fatherHome).toggleClass("bseg_f_home", true).prepend('<span class="bseg_s"></span>');
        $(".bseg_s").append('<select class="bseg_select bseg_cursor_pointer"></select>'); //span节点再建【选择框】子节点
        $(".bseg_s").append('<input class="bseg_scont" id="scont" placeholder="请输入搜索关键字" autocomplete="off">'); //span节点再建【输入框】子节点
        $(".bseg_s").append('<div class="bseg_x_btnd bseg_cursor_pointer bseg_user_select">✖</div>'); //span节点再建【清除输入框】子节点
        $(".bseg_s").append('<button class="bseg_btn bseg_user_select bseg_cursor_pointer bseg_btn_bg_mouseleave">搜索</button>'); //span节点再建【搜索按钮】子节点
        var diskArr = baidu.diskList();
        console.log("diskArrLength", diskArr.length);
        diskArr.forEach(function(value, index) {
            $(".bseg_select").append('<option class="bseg_option bseg_option_' + value.type + ' bseg_cursor_pointer">' + value.name + '</option>'); //单个搜索盘插入选择框
        });

        var csss = [
            ".bseg_cursor_pointer {cursor:pointer}",
            ".bseg_user_select {-webkit-user-select:none;-moz-user-select:none;-ms-user-select:none;user-select:none}",
            ".bseg_s {font-family:Microsoft YaHei,arial,SimSun,宋体!important}",
            ".bseg_select {margin:0 0 0 5px;width:100px;outline:0;border:1px solid #a9a9a9;border-radius:0;background-color:#fff;color:#000;font-size:15px}",
            ".bseg_scont {box-sizing:content-box;margin:0;padding:2px;border-radius:0;font-family:Microsoft YaHei,arial,SimSun,宋体;cursor:text}",
            ".bseg_scont,.bseg_x_btnd {display:inline-block;outline:0;border-top:1px solid #a9a9a9;border-right:0;border-bottom:1px solid #a9a9a9;border-left:0;background-color:#fff;color:#000;font-size:15px}",
            ".bseg_x_btnd {padding:2px 0;width:20px;height:auto;text-align:center;line-height:24px}",
            ".bseg_btn {padding:0;width:60px;height:30px;border:1px solid #09aaff;border-radius:0 17px 17px 0;color:#fff;font-size:15px}",
            ".bseg_btn_bg_mouseleave {background-color:#06a7ff}",
            ".bseg_f_home {margin-left:0!important}",
            ".bseg_f_home>.bseg_s {margin:0 0 0 10px}",
            ".bseg_f_home>.bseg_s>.bseg_select {height:30px}",
            ".bseg_f_home>.bseg_s>.bseg_scont {width:264px;height:24px}",
            ".bseg_option {background-color:#fff;text-align:center;text-align-last:center}",
        ];
        for(var i = 1; i < 11; i++) {
            csss.push(".bseg_option_" + i + " {background-color:" + baidu.getRandomColor() + ";color:#000000;font-weight:900}");
        }
        $("<style></style>").text(csss.join(" ")).appendTo(document.head || document.documentElement);
    };

    baidu.addBindSearchEvent = function() {
        $("#scont").keydown(function(e) {
            //输入框回车事件
            if (e.keyCode == 13) {
                $(".bseg_btn").click();
            }
        });

        $(".bseg_x_btnd").click(function() {
            //删除按钮点击事件
            $("#scont").val("");
        });

        $(".bseg_btn").click(function() {
            //搜索按钮点击事件
            var inputVal = $("#scont").val(); //获得输入框数据
            if (!inputVal) {
                obj.showTipError("请先输入搜索关键字");
                return;
            }

            var optionIndex = $('.bseg_select').prop('selectedIndex');
            var diskArr = baidu.diskList();
            var searchLink = diskArr[optionIndex].link.replace("%sv%", inputVal);
            if (searchLink) {
                setTimeout(function() { window.open(searchLink); }, 500); // 延迟时间不能太短 否则会被浏览器拦截
            }
        });
    };

    baidu.initSearchInput = function() {
        baidu.addSearchOptions();

        baidu.addBindSearchEvent();
    };

    baidu.submitPwd = function(pwd) {
        $(".input-area input").val(pwd);
        $(".input-area .g-button-right").click();
    }

    baidu.registerStoreSharePwd = function() {
        unsafeWindow.require("base:widget/libs/jquerypacket.js")(document).ajaxComplete(function(event, xhr, options) {
            var requestUrl = options.url;
            if (requestUrl.indexOf("/share/verify") >= 0) {
                var response = xhr.responseJSON;
                if (!(response instanceof Object && response.errno == 0)) {
                    console.error("提取码错误");
                    return;
                }
                var sharePwd = (/pwd=([a-z\d]+)/i.exec(options.data) || [])[1];
                if (obj.share_pwd == sharePwd) {
                    return;
                }

                var shareId = obj.getShareId(location.href);
                var shareData = obj.getSharePwdLocal(shareId);
                shareData = Object.assign(shareData || {}, {
                    share_source: "baidu",
                    share_id: shareId,
                    share_pwd: sharePwd,
                    share_url:"https://pan.baidu.com/s/1" + shareId
                });
                obj.setSharePwdLocal(shareData);
            }
        });
    };

    baidu.autoPaddingPwd = function() {
        var title = document.title;
        if (title.indexOf("提取码") > 0) {
            baidu.registerStoreSharePwd();
            var shareId = obj.getShareId(location.href);
            obj.querySharePwd("baidu", shareId, function(response) {
                if (response instanceof Object) {
                    obj.setSharePwdLocal(response);
                    obj.share_pwd = response.share_pwd;
                    baidu.submitPwd(response.share_pwd);
                    obj.showTipSuccess("查询提取码成功");
                }
                else {
                    var shareData = obj.getSharePwdLocal(shareId);
                    if (shareData instanceof Object) {
                        baidu.submitPwd(shareData.share_pwd);
                        obj.showTipSuccess("本地回填密码成功");
                    }
                    else {
                        obj.showTipError("未找到密码");
                    }
                }
            });
        }
    };

    baidu.shareVerify = function(shareLink, sharePwd) {
        //绕过输入提取码环节，直跳文件界面
        var shareId, surl = obj.getShareId(shareLink),
            shareid = obj.getParam("shareid", shareLink),
            uk = obj.getParam("uk", shareLink),
            logid = window.btoa(obj.randString(32).toUpperCase() + ":FG=1");

        var url = "https://pan.baidu.com/share/verify";
        surl && (url += "?surl=" + surl, shareId = surl);
        shareid && uk && (url += "?shareid=" + shareid + "&uk=" + uk, shareId = "shareid=" + shareid + "&uk=" + uk);
        if (! shareId) {
            obj.showTipError("百度网盘-链接不合规范");
            return;
        }

        obj.ajax({
            type: "post",
            url: url + "&t=" + (new Date).getTime() + "&channel=chunlei&web=1&app_id=250528&bdstoken=null&logid=" + logid + "&clienttype=0",
            data: {
                pwd: sharePwd,
                vcode: "",
                vcode_str: ""
            },
            headers: {
                "Referer": "https://pan.baidu.com/share" + (surl ? "/init?surl=" + surl : "/link?shareid=" + shareid + "&uk=" + uk) + "&pwd=" + sharePwd
            },
            success: function(response) {
                if (response instanceof Object && response.errno == 0) {
                    var shareData = obj.getSharePwdLocal(shareId);
                    if (!(shareData instanceof Object && shareData.origin_title)) {
                        shareData = {
                            share_source: "baidu",
                            share_id: shareId,
                            share_pwd: sharePwd,
                            share_url:shareLink,
                            origin_url: decodeURIComponent(location.href),
                            origin_title: document.title
                        };
                        obj.setSharePwdLocal(shareData);
                    }
                }
                window.location.href = shareLink;
            },
            error: function(err) {
                console.error("百度提取码状态查询 error！", err);
                window.location.href = shareLink;
            }
        });
    };

    baidu.checkHtmlValid = function(htmlText, callback) {
        var strArr = ((/<title>\n?(.*)<\/title>/.exec(htmlText) || [])[1] || "").split("|");
        var title = strArr[1] || strArr[0];
        switch(title) {
            case "百度网盘 请输入提取码":
                obj.showTipSuccess("百度网盘-请输入提取码");
                callback && callback(2);
                break;
            case "百度网盘-分享无限制":
                obj.showTipSuccess("百度网盘-分享无限制");
                callback && callback(1);
                break;
            case "页面不存在":
                obj.showTipError("百度网盘-页面不存在");
                callback && callback(-1);
                break;
            case "百度网盘-链接不存在":
                obj.showTipError("百度网盘-链接不存在");
                callback && callback(-1);
                break;
            default:
                console.error("百度网盘-有效性未知", htmlText);
                obj.showTipError("百度网盘-链接有效性未知");
                callback && callback(0);
        }
    };

    baidu.checkUrlValid = function(shareLink, sharePwd) {
        //console.log("shareLink", shareLink);
        var surl = obj.getShareId(shareLink),
            shareid = obj.getParam("shareid", shareLink),
            uk = obj.getParam("uk", shareLink);
        if (! (surl || (shareid && uk))) {
            obj.showTipError("百度网盘-链接不合规范");
            return;
        }

        obj.ajax({
            type: "get",
            url: shareLink,
            headers: { Referer: "https://pan.baidu.com/" },
            success: function(response) {
                baidu.checkHtmlValid(response, function(state) {
                    if (state == 2) {
                        if (GM_getValue("shareLinkVerify") == shareLink) {
                            if (sharePwd) {
                                baidu.shareVerify(shareLink, sharePwd);
                            }
                            else {
                                window.location.href = shareLink;
                            }
                        }
                        else {
                            GM_setValue("shareLinkVerify", shareLink);
                            baidu.checkUrlValid(shareLink, sharePwd);
                        }
                    }
                    else if (state == 1 || state == 0) {
                        window.location.href = shareLink;
                    }
                })
            },
            error: function() {
                console.error("百度网盘-链接已失效", shareLink);
                obj.showTipError("百度网盘-链接已失效");
            }
        });
    };

    baidu.jumpLinkToPanLink = function(jumpLink, sharePwd) {
        obj.ajax({
            type: "get",
            url: jumpLink,
            headers: {
                Referer: location.href
            },
            success: function(response) {
                var shareLink, shareId, sharePwd = sharePwd || (/码.*?>([\w]{4})<\//.exec(response) || [])[1];
                //console.log("sharePwd", sharePwd);
                var surl = obj.getShareId(response),
                    shareid = obj.getParam("shareid", response),
                    uk = obj.getParam("uk", response);
                if (surl || (shareid && uk)) {
                    shareLink = "https://pan.baidu.com";
                    surl && (shareLink += "/s/1" + surl);
                    shareid && uk && (shareLink += "/share/link?shareid=" + shareid + "&uk=" + uk);
                    baidu.checkUrlValid(shareLink, sharePwd);
                }
                else {
                    baidu.checkHtmlValid(response, function(state) {
                        if (state == 2) {
                            baidu.shareVerify(jumpLink, sharePwd);
                        }
                        else {
                            window.location.href = jumpLink;
                        }
                    })
                }
            },
            error: function() {
                console.error("该链接已失效", jumpLink);
                obj.showTipError("该链接已失效，网盘文件不存在");
            }
        })
    };

    baidu.run = function() {
        var panArr = ["pan.baidu.com", "yun.baidu.com", ]

        var hostname = obj.url.hostname;
        if (obj.isInArray(panArr, hostname)) {
            var pathname = obj.url.pathname;
            if (pathname == "/disk/main" || pathname == "/disk/home") {
                baidu.initSearchInput();
                return true;
            }
            else if (pathname == "/share/init" || pathname == "/wap/init" || pathname == "/share/link") {
                baidu.reloadPage();
                baidu.autoPaddingPwd();
                return true;
            }
            else if (pathname.indexOf("/s/") == 0) {
                baidu.reloadPage();
                var shareId = obj.getShareId(location.href);
                if (shareId && !(/(?:链接|页面)不存在/.test(document.title))) {
                    var shareData = obj.getSharePwdLocal(shareId);
                    if (shareData instanceof Object && ! shareData.share_name) {
                        shareData.share_name = document.title.split("_")[0];
                        obj.setSharePwdLocal(shareData);
                        obj.storeSharePwd(shareData);
                    }
                }
                return true;
            }
        }

        return false;
    };

    /*=====================================================================================================================*/
    var ty189 = {};

    ty189.submitPwd = function(pwd) {
        var $Vue = (document.querySelector(".get-file-container") || document.querySelector(".verify-panel-container")).__vue__;
        $Vue.accessCode = pwd;
        $Vue.checkAccessCode();
    };

    ty189.registerStoreSharePwd = function() {
        var origOpen = XMLHttpRequest.prototype.open;
        XMLHttpRequest.prototype.open = function() {
            this.addEventListener("load", function() {
                var responseURL = this.responseURL;
                if (responseURL.indexOf("listShareDir.action") > 0) {
                    var response = this.response;
                    if (response.success == false) {
                        return;
                    }
                    var sharePwd = (responseURL.match(/accessCode=([\w]{4})/) || [])[1];
                    if (!sharePwd || obj.share_pwd == sharePwd) {
                        return;
                    }

                    var shareLink = location.href;
                    var shareId = obj.getShareId(shareLink);
                    var shareData = obj.getSharePwdLocal(shareId);
                    shareData = Object.assign(shareData || {}, {
                        share_source: "ty189",
                        share_id: shareId,
                        share_pwd: sharePwd,
                        share_url:shareLink,
                        share_name: document.title.split("|")[0].replace("免费高速下载", "").trim()
                    });
                    obj.setSharePwdLocal(shareData);
                    obj.storeSharePwd(shareData);
                }
                else if (responseURL.indexOf("/portal/listFiles.action") > 0) {
                    ty189.addSearchWebsite();
                }
            });
            origOpen.apply(this, arguments);
        };
    };

    ty189.autoPaddingPwd = function() {
        var $node = document.querySelector(".get-file-container") || document.querySelector(".outlink-wrapper");
        if ($node && $node.__vue__) {
            var $Vue = $node.__vue__;
            var shareInfo = $Vue.fileDetail || $Vue.shareFileInfo;
            if (shareInfo.shareMode > 0) {
                if (shareInfo.shareMode == 1) {
                    shareInfo.shareId || (shareInfo.shareId = $Vue.shareId);
                    var getCookie = unsafeWindow._ux21cn.cookie.get;
                    var shareIdCookie = getCookie("share_" + shareInfo.shareId) || getCookie("shareId_" + shareInfo.shareId);
                    if (! shareIdCookie) {
                        ty189.registerStoreSharePwd();
                        var shareId = obj.getShareId(location.href);
                        obj.querySharePwd("ty189", shareId, function(response) {
                            if (response instanceof Object) {
                                obj.share_pwd = response.share_pwd;
                                ty189.submitPwd(response.share_pwd);
                                obj.showTipSuccess("查询提取码成功");
                            }
                            else {
                                var shareData = obj.getSharePwdLocal(shareId);
                                if (shareData instanceof Object) {
                                    ty189.submitPwd(shareData.share_pwd);
                                    obj.showTipSuccess("本地回填密码成功");
                                }
                                else {
                                    obj.showTipError("未找到密码");
                                }
                            }
                        });
                    }
                }
            }
            else {
                setTimeout(ty189.autoPaddingPwd, 500)
            }
        }
        else {
            setTimeout(ty189.autoPaddingPwd, 500)
        }
    };

    ty189.diskList = function() {
        return [
            {
                name: "天翼小站",
                link: "https://yun.hei521.cn/",
                type: 1,
            },
            {
                name: "奇它博客",
                link: "https://qitablog.com/circle/tianyiyun",
                type: 1,
            },
        ]
    };

    ty189.addSearchSharePage = function() {
        $(document).on("DOMNodeInserted", ".outlink-box-b", function(event) {
            if ($(".title-mysearch").length == 0) {
                var diskArr = ty189.diskList();
                diskArr.forEach(function(value, index) {
                    $(".file-info").prepend('<a data-v-04783a2e="" href=' + value.link + ' target="_blank" class="btn btn-download title-mysearch" style="margin: 0px;">' + value.name + '</a>');
                });
            }
        });
    };

    ty189.addSearchHomePage = function() {
        $(document).on("DOMNodeInserted", ".p-web", function(event) {
            if ($(".title-mysearch").length == 0) {
                var diskArr = ty189.diskList();
                diskArr.forEach(function(value, index) {
                    $("ul.title").append('<li data-v-0cb079ce="" class="title-link title-return title-mysearch"><a href=' + value.link + ' target="_blank" ><i data-v-0cb079ce=""></i><span data-v-0cb079ce="" class="tab-icon img-myshare FileHead_icon-search-left_3z3Uw"></span><span data-v-0cb079ce="" class="tab-name">' + value.name + '</span></a></li>');
                });
            }
        });
    };

    ty189.run = function() {
        var panArr = ["cloud.189.cn", "h5.cloud.189.cn"]

        var hostname = obj.url.hostname;
        if (obj.isInArray(panArr, hostname)) {
            var url = window.location.href;
            if (url.indexOf("/web/share") > 0 || url.indexOf("/share.html") > 0) {
                ty189.autoPaddingPwd();
                ty189.addSearchSharePage();
                return true;
            }
            else if (url.indexOf("/web/main/") > 0) {
                ty189.addSearchHomePage();
                return true;
            }
        }

        return false;
    };

    /*=====================================================================================================================*/
    var lanzous = {};

    lanzous.submitPwd = function(pwd) {
        var $pwd = $("#pwd");
        $pwd.val(pwd);
        $("#sub").click();
        $(".passwddiv-btn").click();
    };

    lanzous.registerStoreSharePwd = function() {
        unsafeWindow.$(document).ajaxComplete(function (event, xhr, options) {
            var requestUrl = options.url;
            if (requestUrl.indexOf("/ajaxm.php") >= 0 || requestUrl.indexOf("/filemoreajax.php") >= 0) {
                var response = {};
                try { response = JSON.parse(xhr.response); } catch (e) {};
                if (response && response.zt == 1) {
                    var sharePwd = decodeURIComponent((options.data.match(/&pwd=([^&]+)/) || options.data.match(/&p=([^&]+)/) || [])[1] || "");
                    if (obj.share_pwd == sharePwd) {
                        return;
                    }
                    var shareLink = location.href;
                    var shareId = obj.getShareId(shareLink);
                    var shareData = obj.getSharePwdLocal(shareId);
                    shareData = Object.assign(shareData || {}, {
                        share_source: "lanzous",
                        share_id: shareId,
                        share_pwd: sharePwd,
                        share_url:shareLink,
                        share_name: document.title
                    });
                    obj.setSharePwdLocal(shareData);
                    obj.storeSharePwd(shareData);
                }
            }
        });
    };

    lanzous.autoPaddingPwd = function() {
        if ($("#pwd").length) {
            lanzous.registerStoreSharePwd();
            var shareId = obj.getShareId(location.href);
            obj.querySharePwd("lanzous", shareId, function (response) {
                if (response instanceof Object) {
                    obj.share_pwd = response.share_pwd;
                    lanzous.submitPwd(response.share_pwd);
                    obj.showTipSuccess("查询密码成功");
                }
                else {
                    var shareData = obj.getSharePwdLocal(shareId);
                    if (shareData instanceof Object) {
                        lanzous.submitPwd(shareData.share_pwd);
                        obj.showTipSuccess("本地回填密码成功");
                    }
                    else {
                        obj.showTipError("未找到密码");
                    }
                }
            });
        }
    };

    lanzous.diskList = function() {
        return [
            {
                name: "蓝瘦网页版",
                link: "https://www.sixyin.com/disk-search",
                type: 1,
            },
            {
                name: "熊崩",
                link: "https://www.xiongbeng.com/",
                type: 1,
            },
        ]
    };

    lanzous.addSearchSharePage = function() {
        var diskArr = lanzous.diskList();
        if ($(".d").length) {
            diskArr.forEach(function(value, index) {
                $(".d").prepend('<a href=' + value.link + ' target="_blank";><span class="txt" style="margin: 1px;">' + value.name + '</span></a>');
            });
        }
        else if ($("body").children("#file").length) {
            var $n_hd = $("body").children("#file").find(".n_hd");
            diskArr.forEach(function(value, index) {
                $n_hd.append('<a class="n_login" href=' + value.link + ' target="_blank"><span class="user-name">' + value.name + '</span></a>');
            });
        }
    };

    lanzous.addSearchHomePage = function() {
        var $aside_nav = $(".mydisk_nav ul");
        if ($aside_nav.length) {
            var diskArr = lanzous.diskList();
            diskArr.forEach(function(value, index) {
                $aside_nav.append('<li><a href=' + value.link + ' target="_blank" >' + value.name + '</a></li>');
            });
        }
    };

    lanzous.run = function() {
        var url = location.href;
        if (/[\w-]*\.?lanzou.?\.com/.test(url)) {
            lanzous.autoPaddingPwd();
            lanzous.addSearchSharePage();
            return true;
        }
        else if (/woozooo\.com/.test(url)) {
            lanzous.addSearchHomePage();
            return true;
        }

        return false;
    };

    /*=====================================================================================================================*/
    var xunlei = {};

    xunlei.submitPwd = function(pwd) {
        var $Vue = document.querySelector(".pan-share-web").__vue__;
        if ($Vue) {
            $Vue.passCode = pwd;

            var button = document.querySelector(".td-button");
            button && button.click();
        }
    };

    xunlei.registerStoreSharePwd = function () {
        $(document.body).one("DOMNodeInserted", ".share-file-list", function () {
            var shareId = obj.getShareId(shareLink);
            var sharePwd = localStorage["share_passcode_" + shareId];
            if (!sharePwd || sharePwd == obj.share_pwd) {
                return;
            }

            var shareLink = location.href;
            var shareData = obj.getSharePwdLocal(shareId);
            shareData = Object.assign(shareData || {}, {
                share_source: "xunlei",
                share_id: shareId,
                share_pwd: sharePwd,
                share_url:"https://pan.xunlei.com/s/" + shareId,
                share_name: $(this).find("a:first").text()
            });
            obj.setSharePwdLocal(shareData);
            obj.storeSharePwd(shareData);
        })
    };

    xunlei.autoPaddingPwd = function() {
        $(document).one("DOMNodeInserted", ".pass-body", function () {
            xunlei.registerStoreSharePwd();
            var shareId = obj.getShareId(location.href);
            obj.querySharePwd("xunlei", shareId, function(response) {
                if (response instanceof Object) {
                    obj.share_pwd = response.share_pwd;
                    xunlei.submitPwd(response.share_pwd);
                    obj.showTipSuccess("查询提取码成功");
                }
                else {
                    var shareData = obj.getSharePwdLocal(shareId);
                    if (shareData instanceof Object) {
                        xunlei.submitPwd(shareData.share_pwd);
                        obj.showTipSuccess("本地回填密码成功");
                    }
                    else {
                        obj.showTipError("未找到密码");
                    }
                }
            });
        });
    };

    xunlei.run = function() {
        var url = location.href;
        if (url.indexOf("pan.xunlei.com/s/") > 0) {
            xunlei.autoPaddingPwd();
            return true;
        }

        return false;
    };

    /*=====================================================================================================================*/
    var aliyundrive = {};

    aliyundrive.submitPwd = function(pwd) {
        var input = document.querySelector("#root input");
        var event = new Event("input", {
            bubbles: true,
        });
        var lastValue = input.value;
        input.value = pwd;
        var tracker = input._valueTracker;
        if (tracker) { tracker.setValue(lastValue) };
        input.dispatchEvent(event);

        var $button = document.querySelector("#root button");
        $button && $button.click();
    };

    aliyundrive.registerStoreSharePwd = function () {
        var origOpen = XMLHttpRequest.prototype.open;
        XMLHttpRequest.prototype.open = function() {
            this.addEventListener("load", function() {
                if (!(this.readyState == 4 && this.status == 200)) {
                    return;
                }
                var that = this;
                var responseURL = this.responseURL;
                if (responseURL.indexOf("/share_link/get_share_token") > 0) {
                    var sharePwd = JSON.parse(this.sendParams[0]).share_pwd;
                    if (!sharePwd || sharePwd == obj.share_pwd) {
                        return;
                    }
                    obj.share_pwd = sharePwd;
                }
                if (responseURL.indexOf("/file/list") > 0) {
                    var shareLink = location.href;
                    var shareId = obj.getShareId(shareLink);
                    var shareData = obj.getSharePwdLocal(shareId);
                    shareData = Object.assign(shareData || {}, {
                        share_source: "aliyundrive",
                        share_id: shareId,
                        share_pwd: obj.share_pwd,
                        share_url:shareLink,
                        share_name:JSON.parse(that.response).items[0].name
                    });
                    obj.setSharePwdLocal(shareData);
                    obj.storeSharePwd(shareData);
                }
            });
            origOpen.apply(this, arguments);
        };
    };

    aliyundrive.autoPaddingPwd = function() {
        if ($("#root input").length) {
            aliyundrive.registerStoreSharePwd();
            var shareId = obj.getShareId(location.href);
            obj.querySharePwd("aliyundrive", shareId, function(response) {
                if (response instanceof Object) {
                    obj.share_pwd = response.share_pwd;
                    aliyundrive.submitPwd(response.share_pwd);
                    obj.showTipSuccess("查询提取码成功");
                }
                else {
                    var shareData = obj.getSharePwdLocal(shareId);
                    if (shareData instanceof Object) {
                        aliyundrive.submitPwd(shareData.share_pwd);
                        obj.showTipSuccess("本地回填密码成功");
                    }
                    else {
                        obj.showTipError("未找到密码");
                    }
                }
            });
        }
        else if ($("#root header").length) {
        }
        else {
            setTimeout(aliyundrive.autoPaddingPwd, 500);
        }
    };

    aliyundrive.diskList = function() {
        return [
            {
                name: "AliYunPanSo",
                link: "http://aliyunpanso.cn:88/",
                type: 1,
            },
            {
                name: "阿里资源论坛",
                link: "http://www.yunpan123.com/",
                type: 1,
            },
        ]
    };

    aliyundrive.addSearchSharePage = function() {
        $(document).one("DOMNodeInserted", ".page--3indT", function(event) {
            var $banner = $(".content--1lEZP");
            $banner.empty();
            var diskArr = aliyundrive.diskList();
            diskArr.forEach(function(value, index) {
                $banner.append('<span>&nbsp;🎉&nbsp;' + value.name + '&nbsp;<a href=' + value.link + ' target="_blank" rel="noreferrer" style="color: rgb(255, 255, 255); font-weight: 500; text-decoration: underline;" data-spm-anchor-id="aliyundrive.drive.0.0">点击前往</a></span>');
            });
        });
    };

    aliyundrive.addSearchHomePage = function() {
        $(document).one("DOMNodeInserted", ".body--1vs9o", function(event) {
            var $banner = $(".container--CIvrv");
            $banner.empty();
            var diskArr = aliyundrive.diskList();
            diskArr.forEach(function(value, index) {
                $banner.append('<span>&nbsp;🎉&nbsp;' + value.name + '&nbsp;<a href=' + value.link + ' target="_blank" rel="noreferrer" style="color: rgb(255, 255, 255); font-weight: 500; text-decoration: underline;" data-spm-anchor-id="aliyundrive.drive.0.0">点击前往</a></span>');
            });
        });
    };

    aliyundrive.run = function() {
        var url = location.href;
        if (url.indexOf(".aliyundrive.com/s/") > 0) {
            aliyundrive.autoPaddingPwd();
            aliyundrive.addSearchSharePage();
            return true;
        }
        else if (url.indexOf(".aliyundrive.com/drive") > 0) {
            aliyundrive.addSearchHomePage();
            return true;
        }
        return false;
    };

    /*=====================================================================================================================*/
    var target = {};

    target.setTargetAttribute = function() {
        var staticClass = {
            "www.51sopan.cn": ".entry-title",
            "www.slimego.cn": ".link",
            "yun.hei521.cn": ".list-group",
        } [obj.url.hostname];

        var originalClass = $(staticClass + " a:not([target])");
        if (originalClass.length) {
            originalClass.attr("target", "_blank");
            console.log("修改target 属性", originalClass.length);
        }
    };

    target.run = function() {
        var panArr = ["www.51sopan.cn", "www.slimego.cn", "yun.hei521.cn", ];

        var hostname = obj.url.hostname;
        if (obj.isInArray(panArr, hostname)) {
            target.setTargetAttribute();
        }
    };

    /*=====================================================================================================================*/
    var nuxt = {};

    nuxt.getUrl = function(id, callback) {
        var url = obj.url.origin.replace("www", "api");
        $.ajax({
            type: "get",
            url: obj.url.origin.replace("www", "api") + "/api/v1/pan/url",
            data: {
                t: Date.now(),
                id: id
            },
            headers: {
                "X-Authorization": localStorage.getItem("token") || ""
            },
            success: function(response) {
                callback && callback(response);
            },
            error: function(error) {
                console.error("getUrl获取链接 出错", error);
                callback && callback("");
            }
        })
    };

    nuxt.getDetail = function(id, callback) {
        $.ajax({
            type: "get",
            url: obj.url.origin.replace("www", "api") + "/api/v1/pan/detail",
            data: {
                t: Date.now(),
                id: id,
                size: 15
            },
            headers: {
                "X-Authorization": localStorage.getItem("token") || ""
            },
            success: function(response) {
                callback && callback(response);
            },
            error: function() {
                callback && callback("");
            }
        })
    };

    nuxt.apiJumpLink = function() {
        var id = ((/[a-z\d]{32}/.exec(location.href) || [])[0]) || "";
        if (!id) {
            obj.showTipError("无法获取ID参数");
            return;
        }

        nuxt.getUrl(id, function(response) {
            if (response instanceof Object && response.code == 0 && response.data) {
                var shareLink = response.data;

                nuxt.getDetail(id, function(response) {
                    if (response instanceof Object) {
                        baidu.checkUrlValid(shareLink, response.pwd);
                    }
                    else {
                        window.location.href = shareLink;
                    }
                })
            }
            else {
                obj.showTipError("链接已失效");
            }
        })
    };

    nuxt.run = function() {
        var panArr = [
            "www.dalipan.com",
            "www.dashengpan.com",
            "www.xiaomapan.com",
            "www.baimapan.com",
            "www.yubaipan.com",
            "www.feifeipan.com",
            "www.feizhupan.com",
            /*"www.luomapan.com",
            "www.iizhi.cn",
            "www.jnzy.pro",*/
        ];

        var hostname = obj.url.hostname;
        if (obj.isInArray(panArr, hostname)) {
            var hash = location.hash;
            if (hash.indexOf("#/main/search") == 0) {
                if (!localStorage.getItem("token")) {
                    obj.showTipError("请先登录");
                }
                return true;
            }
            else if (hash.indexOf("#/main/detail") == 0) {
                if (document.readyState === "complete") {
                    nuxt.apiJumpLink();
                    return true;
                }
                else {
                    setTimeout(nuxt.run, 500);
                }
            }
            else { }
        }
        else {
            return false;
        }

    };

    /*=====================================================================================================================*/
    var b64Node = {};

    b64Node.decodeUnicode = function(str) {
        try {
            return decodeURIComponent(atob(str).split("").map(function(c) {
                return "%" + ("00" + c.charCodeAt(0).toString(16)).slice( - 2)
            }).join(""));
        } catch(e) {
            console.error(e.name + " :" + e.message);
            return "";
        }
    };

    b64Node.addDirectURL = function() {
        var staticClass = ".media-heading a";
        try {
            $(staticClass).each(function(index) {
                var $this = $(this);
                var shorturl = $this.attr("data-shorturl");
                /^1/.test(shorturl) && $this.append('<div style="margin:10px;"></div><button><a href="https://pan.baidu.com/s/' + shorturl + '" target="_blank"><span style="color:#d418a3;">点我直接打开</span></a></button>');
            })
        } catch(err) {
            console.error("修改节点错误", err);
        }
    }

    b64Node.jumpLink = function() {
        var staticClass = {
            "www.xiaozhukuaipan.com": {
                id: "#downloadHandler",
                href: "data-downloadurl",
            },
            "www.aiyoweia.com": {
                id: ".panurl:eq(1) a",
                href: "href",
            },
            "www.zhaoyunpan.cn": {
                id: ".f-ext span:eq(2) a",
                href: "href",
            },
            "pan.sov5.cn": {
                id: ".super.special.button",
                href: "href",
            },
        } [obj.url.hostname];

        var shareLink, sharePwd, b64Link = (/aHR0c.+/.exec($(staticClass.id).attr(staticClass.href)) || [])[0];
        console.log("b64Link：", b64Link);
        if (b64Link) {
            if (obj.url.hostname == "pan.sov5.cn") {
                b64Link = b64Link.replace(/\/item_redirect\?q=/, "").replace(/!/g, "d"); //兼容https://www.sov5.cn/
                sharePwd = (/密码: ([\w]{4})/.exec($(staticClass.id).parent().next().text()) || [])[1];
                if (!sharePwd) {
                    GM_xmlhttpRequest({
                        method: "GET",
                        url: location.href,
                        headers: {
                            Cookie: "traid=f90ba4dae1ce49e2a5d601220ae0d9c3"
                        },
                        onload: function(response) {
                            sharePwd = (/密码: ([\w]{4})/.exec(response.responseText) || [])[1];
                        }
                    });
                }
            };

            shareLink = decodeURIComponent(b64Node.decodeUnicode(b64Link));
            if (shareLink) {
                baidu.checkUrlValid(shareLink, sharePwd);
            }
            else {
                console.error("跳转链接解码失败", );
                obj.showTipError("跳转链接解码失败");
            }
        }
        else {
            console.error(obj.url.hostname + "：无法获取链接");
            obj.showTipError("无法获取链接");
        }
    };

    b64Node.run = function() {
        var panArr = ["www.xiaozhukuaipan.com", "www.aiyoweia.com", "www.zhaoyunpan.cn", "pan.sov5.cn", "www.quzhuanpan.com", ];

        var hostname = obj.url.hostname;
        if (obj.isInArray(panArr, hostname)) {
            if (/(xiaozhukuaipan)/.test(hostname)) {
                if (/search/.test(location.href)) {
                    b64Node.addDirectURL();
                } else if (/(download|info)/.test(location.href)) {
                    b64Node.jumpLink();
                }

                return true;
            }

            b64Node.jumpLink();
            return true;
        }

        return false;
    };

    /*=====================================================================================================================*/
    var funcNode = {};

    funcNode.getCookie = function (name){
        var arr,reg=new RegExp("(^| )"+name+"=([^;]*)(;|$)");
        if(arr=document.cookie.match(reg)){
            return unescape(arr[2]);
        }else{
            return null;
        }
    }

    funcNode.getUrlmd5 = function(callback) {
        var pathname = obj.url.pathname;
        var [_, f, m] = pathname.replace(".html", "").split("/");
        if (typeof(m) == "string" && m.length == 32) {
            callback && callback(m);
            return;
        }

        $.get(pathname.replace(f, f + "2"), function(result) {
            if (result) {
                callback && callback((/var cur_urlmd5=\"([a-z\d]+)\"\;/.exec(result) || [])[1]);
            }
            else {
                callback && callback("")
            }
        });
    };

    funcNode.getShare = function(urlmd5) {
        var data = {urlmd5: urlmd5, sign: 123};
        if (/panmeme/.test(obj.url.href)) {
            var token = funcNode.getCookie("guanzhu_flag_1");
            if (! token) {
                window.alert("脚本提示：此网站需要扫码登录，请扫码后重试 或 访问其他网站");
                return;
            }
            data = {
                urlmd5: urlmd5,
                token: token
            };
        }
        $.get("http://share.panmeme.com/share/get", data, function(result) {
            //console.log(".panmeme", urlmd5, result);
            if (result.code == 1) {
                if (result.data.status == 1) {
                    if (result.data.unzippwd != null && result.data.unzippwd != "") {
                        GM_setClipboard(result.data.unzippwd);
                        obj.showTipSuccess("解压密码：" + result.data.unzippwd + "\n已复制到剪贴板");
                    }
                    baidu.checkUrlValid(result.data.url, result.data.password);
                }
                else {
                    obj.showTipError("此资源已经失效！");
                }
            }
            else if (result.code == 12) {
                window.alert("请求失败，请关闭浏览器云加速或本机ip代理!");
            }
            else {
                window.alert("请求异常，请切换本机网络或明天再来试试!");
            }
        }, "json");
    };

    funcNode.jumpLink = function() {
        funcNode.getUrlmd5(function(result) {
            if (result) {
                funcNode.getShare(result);
            }
            else {
                console.error("funcJumpLink 无法获取cur_urlmd5参数！");
                obj.showTipError("无法获取链接！");
            }
        });
    };

    funcNode.run = function() {
        var panArr = [
            "www.panmeme.com",
            "www.pan58.com",
            "www.vpansou.com",
            "www.vpanso.com",
            "www.dmpans.com",
            "www.lele360.com",
            "www.kengso.com",
            "www.repanso.com",
            "www.xgsoso.com",
        ];

        var hostname = obj.url.hostname;
        if (obj.isInArray(panArr, hostname)) {
            funcNode.jumpLink();
            return true;
        }

        return false;
    };

    /*=====================================================================================================================*/
    var dialog_fileId = {};

    dialog_fileId.jumpLink = function() {
        if (unsafeWindow.dialog_fileId) {
            var dialog_url = '/redirect/file?id=' + unsafeWindow.dialog_fileId;
            var jumpLink = obj.url.origin + dialog_url;
            console.log("jumpLink:" + jumpLink);

            baidu.jumpLinkToPanLink(jumpLink);
        }
        else {
            console.error("无法获取链接");
            obj.showTipError("无法获取链接");
        }
    };

    dialog_fileId.run = function() {
        var panArr = ["www.58wangpan.com", "www.56wangpan.com", "www.soupan8.com", "www.baidupan.org", "www.haogow.com", "www.soupan.tv", "www.rufengso.cc", "aizhaomu.com", "uzi8.cn", ];

        var hostname = obj.url.hostname;
        if (obj.isInArray(panArr, hostname)) {
            dialog_fileId.jumpLink();
            return true;
        }

        return false;
    };

    /*=====================================================================================================================*/
    var winUrl = {};

    winUrl.jumpLink = function() {
        var panSite = {
            "www.panghaozi.com": {
                panLink: unsafeWindow.url || "",
                password: ".password"
            },
            "www.sowp.cn": {
                panLink: unsafeWindow.url,
            },
            "www.51sopan.cn": {
                panLink: unsafeWindow.baiduurl,
                password: ".meta-item.copy-item"
            },
        } [obj.url.hostname];

        if (panSite.panLink) {
            console.log("panSite.panLink", panSite.panLink);
            var password = $(panSite.password || "").text();
            baidu.checkUrlValid(panSite.panLink, password);
        }
        else {
            console.error("winUrl 无法获取链接", panSite.panLink);
            obj.showTipError("无法获取链接");
        }
    };

    winUrl.run = function() {
        var panArr = ["www.panghaozi.com", "www.sowp.cn", "www.51sopan.cn", ];

        var hostname = obj.url.hostname;
        if (obj.isInArray(panArr, hostname)) {
            if (hostname == "www.51sopan.cn") {
                var pathname = obj.url.pathname,
                    s = pathname.split("/");
                if (s[1] == "article") {
                    window.location.href = "http://www.51sopan.cn/file/file-" + s[2] + ".html";
                    console.log("51sopan article 跳转详情页面");
                    return true;
                } else if (s[1] != "file") {
                    return false;
                }
            }

            winUrl.jumpLink();
            return true;
        }

        return false;
    };

    /*=====================================================================================================================*/
    var node = {};

    node.jumpLink = function() {
        var staticClass = {
            "www.xiaobaipan.com": {
                linkId: "#rel-url a",
                passId: "",
            },
            "www.qiaomi.cn": {
                linkId: "#openid",
                passId: "#btn2",
            },
            "www.lqkweb.com": {
                linkId: ".btn.btn-primary:last",
                passId: ".modal-footer span",
            },
            "www.panso.org": {
                linkId: ".search-item p a:last",
                passId: ".search-item span:last",
            },
            "www.h2ero.com": {
                linkId: ".go-btn.btn.btn-success",
                passId: ".topic-content.center",
            },
            /*
            ↑以上破解扫码后跳转↑↓以下不用扫码直接跳转↓
            */
            "www.pantianxia.com": {
                linkId: ".ui-button.ui-button-primary",
                passId: "",
            },
            "www.ttyunsou.cn": {
                linkId: ".bdylink",
                passId: "",
            },
            "www.dyroy.com": {
                linkId: ".col-xs-6.pannopand:eq(1) a:eq(2)",
                passId: "",
            },
            "baiduyun.6miu.com": {
                linkId: ".downbutton.center a",
                passId: "",
            },
            "yun.java1234.com": {
                linkId: "#bar a",
                passId: "#bar font:eq(1)",
            },
        } [obj.url.hostname];

        var href = $(staticClass.linkId).attr("href");
        console.log("href", href);
        if (href) {
            var sharePwd = (/[码|：: ]*([\w]{4})/.exec($(staticClass.passId || "").text()) || [])[1];
            console.log("sharePwd", sharePwd);

            var surl = obj.getShareId(href),
                shareid = obj.getParam("shareid", href),
                uk = obj.getParam("uk", href);
            if (surl || (shareid && uk)) {
                var shareLink = "https://pan.baidu.com";
                surl && (shareLink += "/s/1" + surl);
                shareid && uk && (shareLink += "/share/link?shareid=" + shareid + "&uk=" + uk);
                if (shareLink != "https://pan.baidu.com/share") {
                    baidu.checkUrlValid(shareLink, sharePwd);
                }
            }
            else {
                var jumpLink = href.indexOf(obj.url.origin) >= 0 ? href: obj.url.origin + href;
                console.log("jumpLink", jumpLink);
                baidu.jumpLinkToPanLink(jumpLink, sharePwd);
            }
        }
        else{
            console.error(obj.url.hostname, "无法获取链接");
            obj.showTipError("无法获取链接");
        }
    };

    node.run = function() {
        var panArr = ["www.xiaobaipan.com", "www.qiaomi.cn", "www.lqkweb.com", "www.panso.org", "www.h2ero.com",

                      "www.pantianxia.com", "www.ttyunsou.cn", "www.dyroy.com", "baiduyun.6miu.com", "yun.java1234.com", ];

        var hostname = obj.url.hostname;
        if (obj.isInArray(panArr, hostname)) {
            node.jumpLink();
            return true;
        }

        return false;
    };

    /*=====================================================================================================================*/

    obj.run = (function() {
        console.log("URL", obj.url);

        if (baidu.run()) {
            console.log("baidu 执行完成");
            return true;
        }
        else if (ty189.run()) {
            console.log("ty189 执行完成");
            return true;
        }
        else if (lanzous.run()) {
            console.log("lanzous 执行完成");
            return true;
        }
        else if (xunlei.run()) {
            console.log("xunlei 执行完成");
            return true;
        }
        else if (aliyundrive.run()) {
            console.log("aliyundrive 执行完成");
            return true;
        }
        else if (target.run()) {
            console.log("target 执行完成");
            return true;
        }
        else if (nuxt.run()) {
            console.log("nuxt 执行完成");
            return true;
        }
        else if (b64Node.run()) {
            console.log("b64Node 执行完成");
            return true;
        }
        else if (funcNode.run()) {
            console.log("funcNode 执行完成");
            return true;
        }
        else if (dialog_fileId.run()) {
            console.log("dialog_fileId 执行完成");
            return true;
        }
        else if (winUrl.run()) {
            console.log("winUrl 执行完成");
            return true;
        }
        else if (node.run()) {
            console.log("node 执行完成");
            return true;
        }
        else {
            obj.checkShareFromInnerText();
            console.log("寻找分享链接 完成");
            return true;
        }

        return false;
    })();

    // Your code here...
})();
