/**
 * User hefeng
 * Date 2017/1/11
 */
define([
	'app/views/app-view'
], function(AppView) {

	return {
		start: function() {
			console.log("app start", new AppView);
		}
	};
});
