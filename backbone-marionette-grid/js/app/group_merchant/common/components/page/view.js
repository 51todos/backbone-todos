/**
 * User hefeng
 * Date 2016/5/9
 * Components page
 */

define([
    'app/group_merchant/common/components/search/view',
    'app/group_merchant/common/components/grid/view',
    'app/group_merchant/common/components/toolbar/view',
    'tpl!app/group_merchant/common/components/page/templates/page.tpl'
], function(SearchView, GridView, ToolbarView, pageTplFn) {

    return Marionette.Layout.extend({
        caption: '',

        className: 'container page-view',

        template: pageTplFn,

        ui: {},

        regions: {
            searchRegion: '.region-search',
            gridRegion: '.region-grid',
            pagebarRegion: '.region-pagebar',
            toolbarRegion: '.region-toolbar'
        },

        toolbar: [],

        grid: {},

        serializeData: function() {
            return {
                caption: this.caption
            }
        },

        onRender: function() {
            if(this.toolbar.length > 0) {
                var toolbarView = this.toolbarView = this.toolbarView? this.toolbarView : new ToolbarView(this.toolbar, {pageable:true, context:this});
                this.toolbarRegion.show(toolbarView);
            }

            if(!_.isEmpty(this.grid)) {
                var searchView = this.searchView = this.searchView? this.searchView : new SearchView(this.grid, {context:this});
                var gridView = this.gridView = this.gridView? this.gridView : new GridView(this.grid, {context:this});

                this.searchRegion.show(searchView);
                this.gridRegion.show(gridView);

            }
        }
    })
});