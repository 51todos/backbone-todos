/**
 * User hefeng
 * Date 2017/1/11
 */
define([
	'require', 'exports', 'module', 'jquery'
], function(require, exports, module, $) {
	var $btn = $(':button');

	var attachEvents = function() {
		$btn.on('click', function() {
			console.log("button add");
		});
	};


	module.exports = {
		start: function() {
			attachEvents();

			console.log("App start...");
		}
	};
});
