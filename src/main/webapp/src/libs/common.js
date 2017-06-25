;
'use strict';
/**
 * setting application context.
 */
var ctx = window['ctx'] || "";
/**
 * define the require configure.
 */
var requireConfig = {
	baseUrl : ctx + '/resource/framework/resource/modules',
	urlArgs : '_v=1.0.2',
	paths : {
		/**
		 * define require plugin.
		 */
		text : 'requirejs/text',
		css : 'requirejs/css',
		html : 'requirejs/html',

		/**
		 * define jquery
		 */
		jquery : 'jquery/jquery-1.11.1',
		ajaxForm : 'jquery/jquery.form',
		/**
		 * define custom js.
		 */
		qdp : 'qdp/qdp',
		encrypt : 'encrypt/jsencrypt',
		validall : "validate/messages_cn",
		validate : "validate/jquery.validate.min",
		validate_md : "validate/jquery.metadata",
		/**
		 * define the layer
		 */
		layer : "layer/3.0.1/layer",
		layercss : "layer/3.0.1/skin/default/layer",
		layui : "layui/layui.all",
		layuicss : "layui/css/layui",
		/**
		 * define ztree js.
		 */
		ztree : 'ztree/jquery.ztree.all-3.5.min',
		ztreecss : 'ztree/zTreeStyle',
		/**
		 * define bootstrap js.
		 */
		bootstrap : 'bootstrap/js/bootstrap.min',
		bootstrapcss : 'bootstrap/css/bootstrap.min',
		/**
		 * components template
		 */
		common_template : "coms/common_template",
		system_template : "coms/system_template",
		/**
		 * init
		 */
		qdpInit : 'coms/qdpInit',
		validInit : 'coms/validInit',
		encryptInit : 'coms/encryptInit',
		treeInit : 'coms/treeInit',
		/**
		 * table export
		 */
		fileSaver : 'export/FileSaver/FileSaver.min',
		tableExport : 'export/tableExport.min',
		xlsxExport : 'export/js-xlsx/xlsx.core.min',
		pdfExportCore : 'export/jsPDF/jspdf.min',
		pdfExport : 'export/jsPDF-AutoTable/jspdf.plugin.autotable',
		pngExport : 'export/html2canvas/html2canvas.min',
		/**
		 * common css
		 */
		commoncss : "common/common",
		pagecss : "common/page"
	},
	shim : {
		qdp : {
			deps : [ "jquery", "html!common_template", "html!system_template", "css!commoncss", "css!pagecss" ]
		},
		commoncss : {
			deps : [ "bootstrapcss" ]
		},
		ajaxForm : {
			deps : [ "jquery" ]
		},
		validall : {
			deps : [ "validate_md" ]
		},
		validate : {
			deps : [ "jquery" ]
		},
		validate_md : {
			deps : [ "validate" ]
		},
		layer : {
			deps : [ "css!layercss" ],/*use plugin to load css*/
			exports : "layer"
		},
		layer : {
			deps : [ "css!layercss" ],/*use plugin to load css*/
			exports : "layer"
		},
		layui : {
			deps : [ "css!layuicss" ],/*use plugin to load css*/
			exports : "layer"
		},
		ztree : {
			deps : [ "jquery", "css!ztreecss" ]
		},
		bootstrap : {
			deps : [ "jquery", "css!bootstrapcss" ]
		},
		qdpInit : {
			deps : [ "qdp" ]
		},
		validInit : {
			deps : [ "validall" ]
		},
		encryptInit : {
			deps : [ "encrypt" ]
		},
		tableExport : {
			deps : [ "jquery" ]
		},
		xlsxExport : {
			deps : [ "jquery" ]
		},
		pdfExport : {
			deps : [ "jquery", "pdfExportCore" ]
		},
		pngExport : {
			deps : [ "jquery" ]
		}

	}
};
/**
 * use the configuration.
 */
requirejs.config(requireConfig);
/**
 * loading the app.js file undering the html page directory.
 */
(function() {
	/**
	 * pathname without the query string.
	 * pathname=../xxx/xx/name.html.
	 */
	var href = window.location.pathname;
	if (href.charAt(href.length - 1) == "/") {
	} else if (href.lastIndexOf("/") > -1) {
		/**
		 * remove prefix
		 * name=name.html
		 */
		var name = href.substring(href.lastIndexOf("/") + 1);
		if (name.indexOf(".") > -1) {
			/**
			 * remove subfix
			 * name=name
			 */
			name = name.substring(0, name.indexOf("."));
		}
		require([ "./" + name + ".js" ]);
	} else {
		require([ "./index.js" ]);
	}
})();