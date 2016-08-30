(function() {
    // 'use strict';
    var Utils = (function() {
        var prefix = 'html5_reader_';
        var StorageGetter = function(key) {
            return localStorage.getItem(prefix + key);
        }
        var StorageSetter = function(key, val) {
            return localStorage.setItem(prefix + key, val);
        }
        var getJSONP = function(url, cb) {
            return $.jsonp({
                url: url,
                cache: true,
                callback: 'duokan_fiction_chapter',
                success: function(result) {
                    var data = $.base64.decode(result);
                    var json = decodeURIComponent(escape(data));
                    cb(json);
                }
            })
        }
        return {
            StorageGetter: StorageGetter,
            StorageSetter: StorageSetter,
            getJSONP: getJSONP
        }
    })();
    var DOM = {
        top_nav: $('#top-nav'),
        bottom_nav: $('.bottom-nav'),
        night: $('.night'),
    }
    var Win = $(window);
    var Doc = $(document);
    var RootContainer = $('#fiction_container');
    var initFontSize = Utils.StorageGetter('fontSize') || 14;
    RootContainer.css('fontSize', initFontSize + 'px');

    function main() {
        //入口函数
        EventHanlder();
        readerModel = ReaderModel();
        readerUI = ReaderBaseFrame(RootContainer);
        readerModel.init(function(data) {
            readerUI(data);
        });
    }

    function ReaderModel() {
        //实现和阅读器相关的数据交互。
        //1.获得章节信息，chapter。json
        //2.获得某一章节数据，获取的过程中要用到jsonp的util函数，取回来的数据与ui交互
        var Chapter_id;
        var Chapter_total;
        var init = function(cb) {
            getFictionInfo(function() {
                getCurChapterContent(Chapter_id, function(data) {
                    cb && cb(data);
                });
            })
            getFictionInfoPromise.then(function(d) {
                return getCurChapterContentPromise;
            }).then(function(d) {
                cb && cb(d);
            })
        }
        var getFictionInfo = function(callback) {
                $.get('data/chapter.json', function(data) {
                    Chapter_total = data.chapters.length;
                    Chapter_id = data.chapters[1].chapter_id;
                    callback && callback();
                }, 'json');
            }
            // var getFictionInfoPromise = function() {
            //     return new Promise(function(resolve, reject) {
            //         $.get('data/chapter.json', function(data) {
            //             if (data.result == 0) {
            //                 Chapter_total = data.chapters.length;
            //                 Chapter_id = data.chapters[1].chapter_id;
            //                 resolve();
            //             } else {
            //                 reject();
            //             }
            //         }, 'json');
            //     })
            // }
        var getCurChapterContent = function(chapter_id, callback) {
            $.get('data/data' + chapter_id + '.json', function(data) {
                if (data.result == 0) {
                    var url = data.jsonp;
                    Utils.getJSONP(url, function(data) {
                        callback && callback(data);
                    });
                }
            }, 'json')
        }
        // var getCurChapterContentPromise = function() {
        //     return new Promise(function(resolve, reject) {
        //         $.get('data/data' + chapter_id + '.json', function(data) {
        //             if (data.result == 0) {
        //                 var url = data.jsonp;
        //                 Utils.getJSONP(url, function(data) {
        //                     resolve(data);
        //                 });
        //             } else {
        //                 reject();
        //             }
        //         }, 'json')
        //     })
        // }
        var prevChapter = function(cb) {
            Chapter_id = parseInt(Chapter_id, 10);
            if (Chapter_id == 0) {
                return;
            }
            Chapter_id = Chapter_id - 1;
            getCurChapterContent(Chapter_id, cb)
        }
        var nextChapter = function(cb) {
            Chapter_id = parseInt(Chapter_id, 10);
            if (Chapter_id == Chapter_total) {
                return;
            }
            Chapter_id = Chapter_id + 1;
            getCurChapterContent(Chapter_id, cb)
        }
        return {
            init: init,
            prevChapter: prevChapter,
            nextChapter: nextChapter
        }
    }

    function ReaderBaseFrame(container) {
        //基本 的ui结构
        function parseChapterData(jsonData) {
            var jsonObj = JSON.parse(jsonData);
            var html = '<h4>' + jsonObj.t + '</h4>';
            for (var i = 0; i < jsonObj.p.length; i++) {
                html = html + '<p>' + jsonObj.p[i] + '</p>';
            }
            return html;
        }
        return function(data) {
            container.html(parseChapterData(data));
        }

    }

    function EventHanlder() {
        //交互的事件绑定
        $('#action-mid').click(function() {
            if (DOM.top_nav.css('display') == 'none') {
                DOM.bottom_nav.show();
                DOM.top_nav.show();
            } else {
                DOM.bottom_nav.hide();
                DOM.top_nav.hide();
            }
        });
        $('#large-font').click(function() {
            if (initFontSize < 22) {
                initFontSize++;
                RootContainer.css('fontSize', initFontSize + 'px');
                Utils.StorageSetter('fontSize', initFontSize);
            }
        });
        $('#small-font').click(function() {
            if (initFontSize > 12) {
                initFontSize--;
                RootContainer.css('fontSize', initFontSize + 'px');
                Utils.StorageSetter('fontSize', initFontSize);
            }
        });
        Win.scroll(function() {
            DOM.bottom_nav.hide();
            DOM.top_nav.hide();
        });
        $('#prev_button').click(function() {
            readerModel.prevChapter();
        });
        $('#next_button').click(function() {
            readerModel.nextChapter(function(data) {
                readerUI(data);
            });
        });
    }

    main();

})();