
define(['backbone.paginator'], function() {
	var RepairAmtCollection = Backbone.PageableCollection.extend({


		initialize: function(models,options){
			this.url = options.url;
		},

		// Initial pagination states
		state: {
			//这里设置的参数都要根据 PageableCollection 定义的字段名
			//真正传出去的参数名就在 queryParams 里面映射
			firstPage: 0,
			pageSize: 10 //这个值要跟模板中每页显示select对应，后期改成jsstorage取
		},

		queryParams: {



			currentPage: "number",
			pageSize: "size",
			totalRecords: null,
			totalPages: null,
			sortKey: null,
			order: null
		},

		//设置startDate、endDate
		setQueryOptions: function(options){
			return this;
		},


		applyState: function(state) {
			$.extend(this.state, state);
		},


		parseState: function(resp, queryParams, state, options) {
			console.log('parseState');
			/*
			 PageableCollection 刚好用到 firstPage 和 lastPage 作为第一页和最后一页的索引
			 所以把后台使用的"是否第一页"和"是否最后一页"的标识，在前台这边转化一下
			 */
			var pageBean = resp.pageBean;
			var pageSize = parseInt(pageBean.size, 10);
			var totalRecords = parseInt(pageBean.totalElements, 10);
			return {
				lastPage: totalRecords == 0 ? 0 : (Math.ceil(totalRecords / pageSize) - 1),
				isFirstPage: pageBean.firstPage,
				isLastPage: pageBean.lastPage,
				currentPage: parseInt(pageBean.number, 10),
				numberOfElements: parseInt(pageBean.numberOfElements, 10),
				pageSize: pageSize,
				sort: pageBean.sort,
				totalRecords: totalRecords,
				totalPages: parseInt(pageBean.totalPages, 10)
			};
		},

		// get the actual records
		parseRecords: function(resp, options) {
			return resp.pageBean.content;
		}
	});

	return RepairAmtCollection;

});