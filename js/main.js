(function() {
	var Utils = (function() {
		var prefix = 'html5_reader_';
		var StorageGetter = function(key) {
			return localStorage.getItem(prefix + key);
		}
		var StorageSetter = function(key, val) {
			return localStorage.setItem(prefix + key, val);
		}
		return {
			StorageGetter: StorageGetter,
			StorageSetter: StorageSetter
		}
	})();
	var DOM = {
		top_nav: $('#top-nav'),
		bottom_nav: $('.bottom-nav')
	}
	var Win = $(window);
	var Doc = $(document);

	function main() {
		//入口函数
		EventHanlder();
	}

	function ReaderModel() {
		//实现和阅读器相关的数据交互。
	}

	function ReaderBaseFrame() {
		//基本 的ui结构
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
		Win.scroll(function() {
			DOM.bottom_nav.hide();
			DOM.top_nav.hide();
		})
	}

	main();

})();