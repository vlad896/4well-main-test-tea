(function ($) {
    var pluginName = 'Search',
    namespace = 'plugin_' + pluginName;

    function Plugin(element) {
        this.headerSearch = $(element);
        this.headerInput = this.headerSearch.find('.search-form__input');
        this.headerSearchResults = this.headerSearch.find('.search-form__ajax');
        this.searchResultsTemplate = Template7.compile($('#search-results-template').html());
        this.PopularProducts = this.headerSearch.find(".search-form__product--1");
        this.searchMode = "product";
        this.trending = $(".search-form__trending");
        this.searchWrapper = this.headerSearch.find('.search-form__results');

        this.headerInput.focus(function(e){
            e.stopPropagation();
            
            $(this).closest('.search-form').find('.search-form__results').addClass('is-open');
        });

        $(document).on('click', event => {
            if (this.searchWrapper.hasClass('is-open')) {
                if (($(event.target).closest(this.searchWrapper).length === 0) && ($(event.target).closest(this.headerInput).length === 0)) {
                    this.searchWrapper.removeClass('is-open');
                }
            }
        });

        this.headerInput.on('focusin', $.proxy(this._focusin, this));


        this.headerInput.on('keyup', $.proxy(this._initSearch, this));
    };

    function checkNeedToConvertCurrency() {
        return (window.show_multiple_currencies && Currency.currentCurrency != shopCurrency) || window.show_auto_currency;
    };

    Plugin.prototype._initSearch = function(event) {
        var target = $(event.currentTarget);

        if ((event.keyCode ? event.keyCode : event.which) != 13) {
            clearTimeout(target.data('timeout'));
            target.data('timeout', setTimeout($.proxy(this._doSearch, this), 250));
        }
    };

    Plugin.prototype._doSearch = function(event) {

        if (this.headerInput.val().trim() === '') {
            this.headerSearchResults.empty();

            this.searchWrapper.addClass('is-open');
            // this.searchWrapper.show();
            this.trending.show();
            this.PopularProducts.show();
            return; 
        }
        else {
            this.headerSearchResults.html(this.searchResultsTemplate({is_loading: true}));
        }

        if (this.headerInput.val().length > 2) {
            this.searchWrapper.removeClass('is-open');
            // this.searchWrapper.hide();
            this._doCompleteSearch();
        }
        else {
            this.headerSearchResults.html(this.searchResultsTemplate({is_show: false}));
            
            this.searchWrapper.addClass('is-open');
            // this.searchWrapper.show();
            this.trending.show();
            this.PopularProducts.show();
        }
    };

    Plugin.prototype._doCompleteSearch = function(event) {
        var self = this;

        $.ajax({
            method: 'GET',
            url: window.router + '/search?view=json',
            dataType: 'json',
            data: {
                q: this.headerInput.val() + '*',
                type: this.searchMode
            }
        }).then(function(data) {

            self.headerSearchResults.html(self.searchResultsTemplate({
                is_show: true,
                is_loading: false,
                results: data['results'],
                has_results: (data['results'].length > 0),
                results_count: data['results_count'],
                results_label: data['results_label'],
                results_url: (data['url'] + '&type=' + self.searchMode)
            }));

            self.PopularProducts.hide();
            self.trending.hide();
            // self.searchWrapper.show();
            self.searchWrapper.addClass('is-open');

            if (checkNeedToConvertCurrency()) {
                Currency.convertAll(window.shop_currency, $('#currencies .active').attr('data-currency'), 'span.money', 'money_format');
            }
        });
    };

    $.fn[pluginName] = function(options) {
        var method = false,
        methodArgs = arguments;

        if (typeof options == 'string') {
            method = options;
        }

        return this.each(function() {
            var plugin = $.data(this, namespace);

            if (!plugin && !method) {
                $.data(this, namespace, new Plugin(this, options));
            } else if (method) {
                callMethod(plugin, method, Array.prototype.slice.call(methodArgs, 1));
            }
        });
    };
}(jQuery));

$(function() {
    $('[data-ajax-search]').Search();
});