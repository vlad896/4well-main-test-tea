window.theme = window.theme || {};

/* ================ SLATE ================ */
window.theme = window.theme || {};

theme.Sections = function Sections() {
    this.constructors = {};
    this.instances = [];

    $(document)
        .on('shopify:section:load', this._onSectionLoad.bind(this))
        .on('shopify:section:unload', this._onSectionUnload.bind(this))
        .on('shopify:section:select', this._onSelect.bind(this))
        .on('shopify:section:deselect', this._onDeselect.bind(this))
        .on('shopify:block:select', this._onBlockSelect.bind(this))
        .on('shopify:block:deselect', this._onBlockDeselect.bind(this));
};

theme.Sections.prototype = _.assignIn({}, theme.Sections.prototype, {
    _createInstance: function(container, constructor) {
        var $container = $(container);
        var id = $container.attr('data-section-id');
        var type = $container.attr('data-section-type');

        constructor = constructor || this.constructors[type];

        if (_.isUndefined(constructor)) {
            return;
        }

        var instance = _.assignIn(new constructor(container), {
            id: id,
            type: type,
            container: container
        });

        this.instances.push(instance);
    },

    _onSectionLoad: function(evt) {
        var container = $('[data-section-id]', evt.target)[0];
        if (container) {
            this._createInstance(container);
        }
    },

    _onSectionUnload: function(evt) {
        this.instances = _.filter(this.instances, function(instance) {
            var isEventInstance = instance.id === evt.detail.sectionId;

            if (isEventInstance) {
                if (_.isFunction(instance.onUnload)) {
                    instance.onUnload(evt);
                }
            }

            return !isEventInstance;
        });
    },

    _onSelect: function(evt) {
        // eslint-disable-next-line no-shadow
        var instance = _.find(this.instances, function(instance) {
            return instance.id === evt.detail.sectionId;
        });

        if (!_.isUndefined(instance) && _.isFunction(instance.onSelect)) {
            instance.onSelect(evt);
        }
    },

    _onDeselect: function(evt) {
        // eslint-disable-next-line no-shadow
        var instance = _.find(this.instances, function(instance) {
            return instance.id === evt.detail.sectionId;
        });

        if (!_.isUndefined(instance) && _.isFunction(instance.onDeselect)) {
            instance.onDeselect(evt);
        }
    },

    _onBlockSelect: function(evt) {
        // eslint-disable-next-line no-shadow
        var instance = _.find(this.instances, function(instance) {
            return instance.id === evt.detail.sectionId;
        });

        if (!_.isUndefined(instance) && _.isFunction(instance.onBlockSelect)) {
            instance.onBlockSelect(evt);
        }
    },

    _onBlockDeselect: function(evt) {
        // eslint-disable-next-line no-shadow
        var instance = _.find(this.instances, function(instance) {
            return instance.id === evt.detail.sectionId;
        });

        if (!_.isUndefined(instance) && _.isFunction(instance.onBlockDeselect)) {
            instance.onBlockDeselect(evt);
        }
    },

    register: function(type, constructor) {
        this.constructors[type] = constructor;

        $('[data-section-type=' + type + ']').each(
            function(index, container) {
                this._createInstance(container, constructor);
            }.bind(this)
        );
    }
});

window.slate = window.slate || {};

/**
 * Slate utilities
 * -----------------------------------------------------------------------------
 * A collection of useful utilities to help build your theme
 *
 *
 * @namespace utils
 */

slate.utils = {
    /**
     * Get the query params in a Url
     * Ex
     * https://mysite.com/search?q=noodles&b
     * getParameterByName('q') = "noodles"
     * getParameterByName('b') = "" (empty value)
     * getParameterByName('test') = null (absent)
     */
    getParameterByName: function(name, url) {
        if (!url) url = window.location.href;
        name = name.replace(/[[\]]/g, '\\$&');
        var regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)'),
            results = regex.exec(url);
        if (!results) return null;
        if (!results[2]) return '';
        return decodeURIComponent(results[2].replace(/\+/g, ' '));
    },

    keyboardKeys: {
        TAB: 9,
        ENTER: 13,
        ESCAPE: 27,
        LEFTARROW: 37,
        RIGHTARROW: 39
    }
};

window.slate = window.slate || {};

/**
 * iFrames
 * -----------------------------------------------------------------------------
 * Wrap videos in div to force responsive layout.
 *
 * @namespace iframes
 */

slate.rte = {
    /**
     * Wrap tables in a container div to make them scrollable when needed
     *
     * @param {object} options - Options to be used
     * @param {jquery} options.$tables - jquery object(s) of the table(s) to wrap
     * @param {string} options.tableWrapperClass - table wrapper class name
     */
    wrapTable: function(options) {
        options.$tables.wrap(
            '<div class="' + options.tableWrapperClass + '"></div>'
        );
    },

    /**
     * Wrap iframes in a container div to make them responsive
     *
     * @param {object} options - Options to be used
     * @param {jquery} options.$iframes - jquery object(s) of the iframe(s) to wrap
     * @param {string} options.iframeWrapperClass - class name used on the wrapping div
     */
    wrapIframe: function(options) {
        options.$iframes.each(function() {
            // Add wrapper to make video responsive
            $(this).wrap('<div class="' + options.iframeWrapperClass + '"></div>');

            // Re-set the src attribute on each iframe after page load
            // for Chrome's "incorrect iFrame content on 'back'" bug.
            // https://code.google.com/p/chromium/issues/detail?id=395791
            // Need to specifically target video and admin bar
            this.src = this.src;
        });
    }
};

window.slate = window.slate || {};

/**
 * A11y Helpers
 * -----------------------------------------------------------------------------
 * A collection of useful functions that help make your theme more accessible
 * to users with visual impairments.
 *
 *
 * @namespace a11y
 */

slate.a11y = {
    /**
     * For use when focus shifts to a container rather than a link
     * eg for In-page links, after scroll, focus shifts to content area so that
     * next `tab` is where user expects if focusing a link, just $link.focus();
     *
     * @param {JQuery} $element - The element to be acted upon
     */
    pageLinkFocus: function($element) {
        var focusClass = 'js-focus-hidden';

        $element
            .first()
            .attr('tabIndex', '-1')
            .focus()
            .addClass(focusClass)
            .one('blur', callback);

        function callback() {
            $element
                .first()
                .removeClass(focusClass)
                .removeAttr('tabindex');
        }
    },

    /**
     * If there's a hash in the url, focus the appropriate element
     */
    focusHash: function() {
        var hash = window.location.hash;

        // is there a hash in the url? is it an element on the page?
        if (hash && document.getElementById(hash.slice(1))) {
            this.pageLinkFocus($(hash));
        }
    },

    /**
     * When an in-page (url w/hash) link is clicked, focus the appropriate element
     */
    bindInPageLinks: function() {
        $('a[href*=#]').on(
            'click',
            function(evt) {
                this.pageLinkFocus($(evt.currentTarget.hash));
            }.bind(this)
        );
    },

    /**
     * Traps the focus in a particular container
     *
     * @param {object} options - Options to be used
     * @param {jQuery} options.$container - Container to trap focus within
     * @param {jQuery} options.$elementToFocus - Element to be focused when focus leaves container
     * @param {string} options.namespace - Namespace used for new focus event handler
     */
    trapFocus: function(options) {
        var eventsName = {
            focusin: options.namespace ? 'focusin.' + options.namespace : 'focusin',
            focusout: options.namespace
                ? 'focusout.' + options.namespace
                : 'focusout',
            keydown: options.namespace
                ? 'keydown.' + options.namespace
                : 'keydown.handleFocus'
        };

        /**
         * Get every possible visible focusable element
         */
        var $focusableElements = options.$container.find(
            $(
                'button, [href], input, select, textarea, [tabindex]:not([tabindex^="-"])'
            ).filter(':visible')
        );
        var firstFocusable = $focusableElements[0];
        var lastFocusable = $focusableElements[$focusableElements.length - 1];

        if (!options.$elementToFocus) {
            options.$elementToFocus = options.$container;
        }

        function _manageFocus(evt) {
            if (evt.keyCode !== slate.utils.keyboardKeys.TAB) return;

            /**
             * On the last focusable element and tab forward,
             * focus the first element.
             */
            if (evt.target === lastFocusable && !evt.shiftKey) {
                evt.preventDefault();
                firstFocusable.focus();
            }
            /**
             * On the first focusable element and tab backward,
             * focus the last element.
             */
            if (evt.target === firstFocusable && evt.shiftKey) {
                evt.preventDefault();
                lastFocusable.focus();
            }
        }

        options.$container.attr('tabindex', '-1');
        options.$elementToFocus.focus();

        $(document).off('focusin');

        $(document).on(eventsName.focusout, function() {
            $(document).off(eventsName.keydown);
        });

        $(document).on(eventsName.focusin, function(evt) {
            if (evt.target !== lastFocusable && evt.target !== firstFocusable) return;

            $(document).on(eventsName.keydown, function(evt) {
                _manageFocus(evt);
            });
        });
    },

    /**
     * Removes the trap of focus in a particular container
     *
     * @param {object} options - Options to be used
     * @param {jQuery} options.$container - Container to trap focus within
     * @param {string} options.namespace - Namespace used for new focus event handler
     */
    removeTrapFocus: function(options) {
        var eventName = options.namespace
            ? 'focusin.' + options.namespace
            : 'focusin';

        if (options.$container && options.$container.length) {
            options.$container.removeAttr('tabindex');
        }

        $(document).off(eventName);
    },

    /**
     * Add aria-describedby attribute to external and new window links
     *
     * @param {object} options - Options to be used
     * @param {object} options.messages - Custom messages to be used
     * @param {jQuery} options.$links - Specific links to be targeted
     */
    accessibleLinks: function(options) {
        var body = document.querySelector('body');

        var idSelectors = {
            newWindow: 'a11y-new-window-message',
            external: 'a11y-external-message',
            newWindowExternal: 'a11y-new-window-external-message'
        };

        if (options.$links === undefined || !options.$links.jquery) {
            options.$links = $('a[href]:not([aria-describedby])');
        }

        function generateHTML(customMessages) {
            if (typeof customMessages !== 'object') {
                customMessages = {};
            }

            var messages = $.extend(
                {
                    newWindow: 'Opens in a new window.',
                    external: 'Opens external website.',
                    newWindowExternal: 'Opens external website in a new window.'
                },
                customMessages
            );

            var container = document.createElement('ul');
            var htmlMessages = '';

            for (var message in messages) {
                htmlMessages +=
                    '<li id=' + idSelectors[message] + '>' + messages[message] + '</li>';
            }

            container.setAttribute('hidden', true);
            container.innerHTML = htmlMessages;

            body.appendChild(container);
        }

        function _externalSite($link) {
            var hostname = window.location.hostname;

            return $link[0].hostname !== hostname;
        }

        $.each(options.$links, function() {
            var $link = $(this);
            var target = $link.attr('target');
            var rel = $link.attr('rel');
            var isExternal = _externalSite($link);
            var isTargetBlank = target === '_blank';

            if (isExternal) {
                $link.attr('aria-describedby', idSelectors.external);
            }
            if (isTargetBlank) {
                if (rel === undefined || rel.indexOf('noopener') === -1) {
                    $link.attr('rel', function(i, val) {
                        var relValue = val === undefined ? '' : val + ' ';
                        return relValue + 'noopener';
                    });
                }
                $link.attr('aria-describedby', idSelectors.newWindow);
            }
            if (isExternal && isTargetBlank) {
                $link.attr('aria-describedby', idSelectors.newWindowExternal);
            }
        });

        generateHTML(options.messages);
    }
};

/**
 * Image Helper Functions
 * -----------------------------------------------------------------------------
 * A collection of functions that help with basic image operations.
 *
 */

theme.Images = (function() {
    /**
     * Preloads an image in memory and uses the browsers cache to store it until needed.
     *
     * @param {Array} images - A list of image urls
     * @param {String} size - A shopify image size attribute
     */

    function preload(images, size) {
        if (typeof images === 'string') {
            images = [images];
        }

        for (var i = 0; i < images.length; i++) {
            var image = images[i];
            this.loadImage(this.getSizedImageUrl(image, size));
        }
    }

    /**
     * Loads and caches an image in the browsers cache.
     * @param {string} path - An image url
     */
    function loadImage(path) {
        new Image().src = path;
    }

    /**
     * Swaps the src of an image for another OR returns the imageURL to the callback function
     * @param image
     * @param element
     * @param callback
     */
    function switchImage(image, element, callback) {
        var size = this.imageSize(element.src);
        var imageUrl = this.getSizedImageUrl(image.src, size);

        if (callback) {
            callback(imageUrl, image, element); // eslint-disable-line callback-return
        } else {
            element.src = imageUrl;
        }
    }

    /**
     * +++ Useful
     * Find the Shopify image attribute size
     *
     * @param {string} src
     * @returns {null}
     */
    function imageSize(src) {
        var match = src.match(
            /.+_((?:pico|icon|thumb|small|compact|medium|large|grande)|\d{1,4}x\d{0,4}|x\d{1,4})[_\\.@]/
        );

        if (match !== null) {
            if (match[2] !== undefined) {
                return match[1] + match[2];
            } else {
                return match[1];
            }
        } else {
            return null;
        }
    }

    /**
     * +++ Useful
     * Adds a Shopify size attribute to a URL
     *
     * @param src
     * @param size
     * @returns {*}
     */
    function getSizedImageUrl(src, size) {
        if (size === null) {
            return src;
        }

        if (size === 'master') {
            return this.removeProtocol(src);
        }

        var match = src.match(
            /\.(jpg|jpeg|gif|png|bmp|bitmap|tiff|tif)(\?v=\d+)?$/i
        );

        if (match !== null) {
            var prefix = src.split(match[0]);
            var suffix = match[0];

            return this.removeProtocol(prefix[0] + '_' + size + suffix);
        }

        return null;
    }

    function removeProtocol(path) {
        return path.replace(/http(s)?:/, '');
    }

    return {
        preload: preload,
        loadImage: loadImage,
        switchImage: switchImage,
        imageSize: imageSize,
        getSizedImageUrl: getSizedImageUrl,
        removeProtocol: removeProtocol
    };
})();

/**
 * Currency Helpers
 * -----------------------------------------------------------------------------
 * A collection of useful functions that help with currency formatting
 *
 * Current contents
 * - formatMoney - Takes an amount in cents and returns it as a formatted dollar value.
 *
 * Alternatives
 * - Accounting.js - http://openexchangerates.github.io/accounting.js/
 *
 */

theme.Currency = (function() {
    var moneyFormat = theme.moneyFormat; // eslint-disable-line camelcase

    function formatMoney(cents, format) {
        if (typeof cents === 'string') {
            cents = cents.replace('.', '');
        }
        var value = '';
        var placeholderRegex = /\{\{\s*(\w+)\s*\}\}/;
        var formatString = format || moneyFormat;

        function formatWithDelimiters(number, precision, thousands, decimal) {
            thousands = thousands || ',';
            decimal = decimal || '.';

            if (isNaN(number) || number === null) {
                return 0;
            }

            number = (number / 100.0).toFixed(precision);

            var parts = number.split('.');
            var dollarsAmount = parts[0].replace(
                /(\d)(?=(\d\d\d)+(?!\d))/g,
                '$1' + thousands
            );
            var centsAmount = parts[1] ? decimal + parts[1] : '';

            return dollarsAmount + centsAmount;
        }

        switch (formatString.match(placeholderRegex)[1]) {
            case 'amount':
                value = formatWithDelimiters(cents, 2);
                break;
            case 'amount_no_decimals':
                value = formatWithDelimiters(cents, 0);
                break;
            case 'amount_with_comma_separator':
                value = formatWithDelimiters(cents, 2, '.', ',');
                break;
            case 'amount_no_decimals_with_comma_separator':
                value = formatWithDelimiters(cents, 0, '.', ',');
                break;
            case 'amount_no_decimals_with_space_separator':
                value = formatWithDelimiters(cents, 0, ' ');
                break;
            case 'amount_with_apostrophe_separator':
                value = formatWithDelimiters(cents, 2, "'");
                break;
        }

        return formatString.replace(placeholderRegex, value);
    }

    return {
        formatMoney: formatMoney
    };
})();

/**
 * Variant Selection scripts
 * ------------------------------------------------------------------------------
 *
 * Handles change events from the variant inputs in any `cart/add` forms that may
 * exist.  Also updates the master select and triggers updates when the variants
 * price or image changes.
 *
 * @namespace variants
 */

slate.Variants = (function() {
    /**
     * Variant constructor
     *
     * @param {object} options - Settings from `product.js`
     */
    function Variants(options) {
        this.$container = options.$container;
        this.product = options.product;
        this.singleOptionSelector = options.singleOptionSelector;
        this.productCardOptionSelector = options.productCardOptionSelector;
        this.originalSelectorId = options.originalSelectorId;
        this.enableHistoryState = options.enableHistoryState;
        this.currentVariant = this._getVariantFromOptions();
        this._firstupdateVariant(this.currentVariant);

        $(this.singleOptionSelector, this.$container).on(
            'change',
            this._onSelectChange.bind(this)
        );


        this.productCard_atc = $(this.productCardOptionSelector).find('a');
        $(this.productCard_atc, this.product).on(
            'click',
            this._onSelectChange2.bind(this)
        );
    }

    Variants.prototype = _.assignIn({}, Variants.prototype, {
        /**
         * Get the currently selected options from add-to-cart form. Works with all
         * form input elements.
         *
         * @return {array} options - Values of currently selected variants
         */
        _getCurrentOptions: function() {
            var currentOptions = _.map(
                $(this.singleOptionSelector, this.$container),
                function(element) {
                    var $element = $(element);
                    var type = $element.attr('type');
                    var currentOption = {};

                    if (type === 'radio' || type === 'checkbox') {
                        if ($element[0].checked) {
                            currentOption.value = $element.val();
                            currentOption.index = $element.data('index');

                            return currentOption;
                        } else {
                            return false;
                        }
                    } else {
                        currentOption.value = $element.val();
                        currentOption.index = $element.data('index');

                        return currentOption;
                    }
                }
            );

            // remove any unchecked input values if using radio buttons or checkboxes
            currentOptions = _.compact(currentOptions);
            
            return currentOptions;
        },

        _getCurrentOptions2: function() {
            var currentOptions = $(this.productCardOptionSelector).find('.active').data('title');
            return currentOptions;
        },

        /**
         * Find variant based on selected values.
         *
         * @param  {array} selectedValues - Values of variant inputs
         * @return {object || undefined} found - Variant object from product.variants
         */
        _getVariantFromOptions: function() {
            var selectedValues = this._getCurrentOptions();
            var variants = this.product.variants;
            var selectedOption1;
            var selectedOption2;
            var selectedOption3;
            var check_swatch_option = false;

            if ($('.selector-wrapper-1', this.$container).hasClass('swatch')) {
                check_swatch_option = true;
            }
            
            var found = _.find(variants, function(variant) {
                return selectedValues.every(function(values) {
                    return _.isEqual(variant[values.index], values.value);
                });
            });

            if (found == undefined) {

                if (check_swatch_option == true) {
                    selectedOption1 = $('.selector-wrapper-1', this.$container).find('input:checked').val();
                    selectedOption2 = $('.selector-wrapper-2', this.$container).find('input:checked').val();
                    selectedOption3 = $('.selector-wrapper-3', this.$container).find('input:checked').val();

                    $('.selector-wrapper-3 .swatch-element', this.$container).each(function(){
                        var swatchVal = $(this).data('value');
                        var optionSoldout = variants.find(function(variant){
                            return variant.option1 == selectedOption1 && variant.option2 == selectedOption2 && variant.option3 == swatchVal && variant.available;
                        });
                        var optionUnavailable = variants.find(function(variant){
                            return variant.option1 == selectedOption1 && variant.option2 == selectedOption2 && variant.option3 == swatchVal;
                        });

                        if(optionSoldout == undefined){
                            if (optionUnavailable == undefined) {
                                $(this).addClass('unavailable');
                                $(this).removeClass('soldout');
                                $(this).find(':radio').prop('checked',false);
                            } else {
                                $(this).addClass('soldout');
                                $(this).removeClass('unavailable');
                                $(this).find(':radio').prop('disabled',false);
                                $(this).find(':radio').prop('checked',true);
                            }
                            // $(this).find(':radio').prop('disabled',true);
                        } else {
                            $(this).removeClass('soldout');
                            $(this).removeClass('unavailable');
                            $(this).find(':radio').prop('disabled',false);
                            $(this).find(':radio').prop('checked',true);
                            $('.label-value-3', this.$container).html(optionSoldout.option3);
                        }
                    })

                    selectedValues = this._getCurrentOptions();
                    found = _.find(variants, function(variant) {
                        return selectedValues.every(function(values) {
                            return _.isEqual(variant[values.index], values.value);
                        });
                    });

                    if (found == undefined) {
                        $('.selector-wrapper-3 .swatch-element', this.$container).each(function(){
                            var swatchVal = $(this).data('value');
                            var optionSoldout = variants.find(function(variant){
                                return variant.option1 == selectedOption1 && variant.option3 == swatchVal && variant.available;
                            });

                            var optionUnavailable = variants.find(function(variant){
                                return variant.option1 == selectedOption1 && variant.option3 == swatchVal;
                            });

                            if(optionSoldout == undefined){
                                if (optionUnavailable == undefined) {
                                    $(this).addClass('unavailable');
                                    $(this).removeClass('soldout');
                                    $(this).find(':radio').prop('checked',false);
                                } else {
                                    $(this).addClass('soldout');
                                    $(this).removeClass('unavailable');
                                    $(this).find(':radio').prop('disabled',false);
                                    $(this).find(':radio').prop('checked',true);
                                }
                                // $(this).find(':radio').prop('disabled',true);
                            } else {
                                $(this).removeClass('soldout');
                                $(this).removeClass('unavailable');
                                $(this).find(':radio').prop('disabled',false);
                                $(this).find(':radio').prop('checked',true);
                                $('.label-value-3', this.$container).html(optionSoldout.option3);
                            }
                        })

                        selectedOption3 = $('.selector-wrapper-3', this.$container).find('input:checked').val();

                        $('.selector-wrapper-2 .swatch-element', this.$container).each(function(){
                            var swatchVal = $(this).data('value');
                            var optionSoldout = variants.find(function(variant){
                                return variant.option1 == selectedOption1 && variant.option3 == selectedOption3 && variant.option2 == swatchVal && variant.available;
                            });

                            var optionUnavailable = variants.find(function(variant){
                                return variant.option1 == selectedOption1 && variant.option3 == selectedOption3 && variant.option2 == swatchVal;
                            });

                            if(optionSoldout == undefined){
                                if (optionUnavailable == undefined) {
                                    $(this).addClass('unavailable');
                                    $(this).removeClass('soldout');
                                    $(this).find(':radio').prop('checked',false);
                                } else {
                                    $(this).addClass('soldout');
                                    $(this).removeClass('unavailable');
                                    $(this).find(':radio').prop('disabled',false);
                                    $(this).find(':radio').prop('checked',true);
                                }
                                // $(this).find(':radio').prop('disabled',true);
                            } else {
                                $(this).removeClass('soldout');
                                $(this).removeClass('unavailable');
                                $(this).find(':radio').prop('disabled',false);
                                $(this).find(':radio').prop('checked',true);
                                $('.label-value-2', this.$container).html(optionSoldout.option2);
                            } 
                        })

                        selectedValues = this._getCurrentOptions();
                        found = _.find(variants, function(variant) {
                            return selectedValues.every(function(values) {
                                return _.isEqual(variant[values.index], values.value);
                            });
                        });
                    }
                } else {
                    selectedOption1 = $('.selector-wrapper-1', this.$container).find('option:selected').val();
                    selectedOption2 = $('.selector-wrapper-2', this.$container).find('option:selected').val();
                    selectedOption3 = $('.selector-wrapper-3', this.$container).find('option:selected').val();

                    $('.selector-wrapper-3 .single-option-selector option', this.$container).each(function(){
                        var swatchVal = $(this).val();
                        var optionSoldout = variants.find(function(variant){
                            return variant.option1 == selectedOption1 && variant.option2 == selectedOption2 && variant.option3 == swatchVal && variant.available;
                        });

                        if(optionSoldout == undefined){
                            // $(this).attr('disabled','disabled').removeAttr('selected','selected').prop('selected', false);
                            var optionUnavailable = variants.find(function(variant){
                                return variant.option1 == selectedOption1 && variant.option2 == selectedOption2 && variant.option3 == swatchVal;
                            });
                            if (optionUnavailable == undefined) {
                                $(this).addClass('unavailable');
                                $(this).removeClass('soldOut');
                                $(this).attr('disabled','disabled').removeAttr('selected','selected').prop('selected', false);
                            } else {
                                $(this).addClass('soldOut');
                                $(this).removeClass('unavailable');
                                $(this).removeAttr('disabled','disabled').attr('selected','selected').prop('selected', true);
                            }
                        } else {
                            $(this).removeAttr('disabled','disabled').attr('selected','selected').prop('selected', true);
                            $('.label-value-3', this.$container).html(optionSoldout.option3);
                            $(this).removeClass('soldOut');
                            $(this).removeClass('unavailable');
                        }
                    })

                    selectedValues = this._getCurrentOptions();
                    found = _.find(variants, function(variant) {
                        return selectedValues.every(function(values) {
                            return _.isEqual(variant[values.index], values.value);
                        });
                    });

                    if (found == undefined) {

                        $('.selector-wrapper-3 .single-option-selector option', this.$container).each(function(){
                            var swatchVal = $(this).val();
                            var optionSoldout = variants.find(function(variant){
                                return variant.option1 == selectedOption1 && variant.option3 == swatchVal && variant.available;
                            });

                            if(optionSoldout == undefined){
                                // $(this).attr('disabled','disabled').removeAttr('selected','selected').prop('selected', false);
                                var optionUnavailable = variants.find(function(variant){
                                    return variant.option1 == selectedOption1 && variant.option3 == swatchVal;
                                });
                                if (optionUnavailable == undefined) {
                                    $(this).addClass('unavailable');
                                    $(this).removeClass('soldOut');
                                    $(this).attr('disabled','disabled').removeAttr('selected','selected').prop('selected', false);
                                } else {
                                    $(this).addClass('soldOut');
                                    $(this).removeClass('unavailable');
                                    $(this).removeAttr('disabled','disabled').attr('selected','selected').prop('selected', true);
                                }
                            } else {
                                $(this).removeAttr('disabled','disabled').attr('selected','selected').prop('selected', true);
                                $('.label-value-3', this.$container).html(optionSoldout.option3);
                                $(this).removeClass('soldOut');
                                $(this).removeClass('unavailable');
                            }
                        })

                        selectedOption3 = $('.selector-wrapper-3', this.$container).find('option:selected').val();


                        $('.selector-wrapper-2 .single-option-selector option', this.$container).each(function(){
                            var swatchVal = $(this).val();
                            var optionSoldout = variants.find(function(variant){
                                return variant.option1 == selectedOption1 && variant.option3 == selectedOption3 && variant.option2 == swatchVal && variant.available;
                            });

                            if(optionSoldout == undefined){
                                // $(this).attr('disabled','disabled').removeAttr('selected','selected').prop('selected', false);
                                var optionUnavailable = variants.find(function(variant){
                                    return variant.option1 == selectedOption1 && variant.option3 == selectedOption3 && variant.option2 == swatchVal;
                                });
                                if (optionUnavailable == undefined) {
                                    $(this).addClass('unavailable');
                                    $(this).removeClass('soldOut');
                                    $(this).attr('disabled','disabled').removeAttr('selected','selected').prop('selected', false);
                                } else {
                                    $(this).addClass('soldOut');
                                    $(this).removeClass('unavailable');
                                    $(this).removeAttr('disabled','disabled').attr('selected','selected').prop('selected', true);
                                }
                            } else {
                                $(this).removeAttr('disabled','disabled').attr('selected','selected').prop('selected', true);
                                $('.label-value-2', this.$container).html(optionSoldout.option2);
                                $(this).removeClass('soldOut');
                            }
                        })

                        selectedValues = this._getCurrentOptions();
                        found = _.find(variants, function(variant) {
                            return selectedValues.every(function(values) {
                                return _.isEqual(variant[values.index], values.value);
                            });
                        });
                    }
                }
            }

            return found;
        },


        _getVariantFromOptions2: function() {
            var selectedValues = this._getCurrentOptions2();
            var variants = this.product.variants;

            var found = _.find(variants, function(variant) {
                return _.isEqual(variant.title, selectedValues);
            });

            return found;
        },

        /**
         * Event handler for when a variant input changes.
         */
        _onSelectChange: function() {
            var variant = this._getVariantFromOptions();

            this.$container.trigger({
                type: 'variantChange',
                variant: variant
            });

            if (!variant) {
                return;
            }

            this._updateMasterSelect(variant);
            this._updateImages(variant);
            this._updatePrice(variant);
            this._updateSKU(variant);
            this._updateVariant(variant);
            this.currentVariant = variant;

            if (this.enableHistoryState) {
                this._updateHistoryState(variant);
            }
        },

        _onSelectChange2: function(e) {
            var variant = this._getVariantFromOptions2();

            this.$container.trigger({
                type: 'variantChange',
                variant: variant
            });

            if (!variant) {
                return;
            }

            this._updateMasterSelect(variant);
        },

        /**
         * Trigger event when variant image changes
         *
         * @param  {object} variant - Currently selected variant
         * @return {event}  variantImageChange
         */
        _updateImages: function(variant) {
            var variantImage = variant.featured_image || {};
            var currentVariantImage = this.currentVariant.featured_image || {};

            if ( !variant.featured_image || variantImage.src === currentVariantImage.src ) {
                return;
            }

            this.$container.trigger({
                type: 'variantImageChange',
                variant: variant
            });
        },

        /**
         * Trigger event when variant price changes.
         *
         * @param  {object} variant - Currently selected variant
         * @return {event} variantPriceChange
         */
        _updatePrice: function(variant) {
            if (
                variant.price === this.currentVariant.price &&
                variant.compare_at_price === this.currentVariant.compare_at_price
            ) {
                return;
            }

            this.$container.trigger({
                type: 'variantPriceChange',
                variant: variant
            });
        },

        /**
         * Trigger event when variant sku changes.
         *
         * @param  {object} variant - Currently selected variant
         * @return {event} variantSKUChange
         */
        _updateSKU: function(variant) {
            if (variant.sku === this.currentVariant.sku) {
                return;
            }

            this.$container.trigger({
                type: 'variantSKUChange',
                variant: variant
            });
        },

        /**
         * Update history state for product deeplinking
         *
         * @param  {variant} variant - Currently selected variant
         * @return {k}         [description]
         */
        _updateHistoryState: function(variant) {
            if (!history.replaceState || !variant) {
                return;
            }

            var newurl =
                window.location.protocol +
                '//' +
                window.location.host +
                window.location.pathname +
                '?variant=' +
                variant.id;
            window.history.replaceState({ path: newurl }, '', newurl);
        },

        _firstupdateVariant: function(_variant){
            var self = this;
            var check_swatch_option = false;

            if ($('.selector-wrapper-1', this.$container).hasClass('swatch')) {
                check_swatch_option = true;
            }

            if (_variant) {
                if (check_swatch_option == true) {
                    var variants = this.product.variants;
                    var options = $('.selector-wrapper', this.$container);
                    var selectedOption1 = $('.selector-wrapper-1', this.$container).find('input:checked').val();
                    var selectedOption2 = $('.selector-wrapper-2', this.$container).find('input:checked').val();
                    var selectedOption3 = $('.selector-wrapper-3', this.$container).find('input:checked').val();

                    options.each(function(){
                        var optionIndex = $(this).data('option-index');
                        var swatch = $(this).find('.swatch-element');
                        switch (optionIndex) {
                            case 1:
                                swatch.each(function(){
                                    var swatchVal = $(this).data('value');
                                    var optionSoldout = variants.find(function(variant){
                                        return variant.option1 == swatchVal && variant.available;
                                    });
                                    if(optionSoldout == undefined){
                                        var optionUnavailable = variants.find(function(variant){
                                            return variant.option1 == swatchVal;
                                        });
                                        if (optionUnavailable == undefined) {
                                            $(this).addClass('unavailable');
                                            $(this).removeClass('soldout');
                                            $(this).find(':radio').prop('disabled',true);
                                        } else {
                                            $(this).addClass('soldout');
                                            $(this).removeClass('unavailable');
                                            $(this).find(':radio').prop('disabled',false);
                                        }
                                        // $(this).find(':radio').prop('disabled',true);
                                    } else {
                                        $(this).removeClass('soldout');
                                        $(this).removeClass('unavailable');
                                        $(this).find(':radio').prop('disabled',false);
                                    }
                                })
                                break;
                            case 2:
                                swatch.each(function(){
                                    var swatchVal = $(this).data('value');
                                    var optionSoldout = variants.find(function(variant){
                                        return variant.option1 == selectedOption1 && variant.option2 == swatchVal && variant.available;
                                    });
                                    if(optionSoldout == undefined){
                                        var optionUnavailable = variants.find(function(variant){
                                            return variant.option1 == selectedOption1 && variant.option2 == swatchVal;
                                        });
                                        if (optionUnavailable == undefined) {
                                            $(this).addClass('unavailable');
                                            $(this).removeClass('soldout');
                                            $(this).find(':radio').prop('disabled',true);
                                        } else {
                                            $(this).addClass('soldout');
                                            $(this).removeClass('unavailable');
                                            $(this).find(':radio').prop('disabled',false);
                                        }
                                        // $(this).find(':radio').prop('disabled',true);
                                    } else {
                                        $(this).removeClass('soldout');
                                        $(this).removeClass('unavailable');
                                        $(this).find(':radio').prop('disabled',false);
                                    }
                                })
                                break;
                            case 3:
                                swatch.each(function(){
                                    var swatchVal = $(this).data('value');
                                    var optionSoldout = variants.find(function(variant){
                                        return variant.option1 == selectedOption1 && variant.option2 == selectedOption2 && variant.option3 == swatchVal && variant.available;
                                    });
                                    if(optionSoldout == undefined){
                                        var optionUnavailable = variants.find(function(variant){
                                            return variant.option1 == selectedOption1 && variant.option2 == selectedOption2 && variant.option3 == swatchVal;
                                        });
                                        if (optionUnavailable == undefined) {
                                            $(this).addClass('unavailable');
                                            $(this).removeClass('soldout');
                                            $(this).find(':radio').prop('disabled',true);
                                        } else {
                                            $(this).addClass('soldout');
                                            $(this).removeClass('unavailable');
                                            $(this).find(':radio').prop('disabled',false);
                                        }
                                        // $(this).find(':radio').prop('disabled',true);
                                    } else {
                                        $(this).removeClass('soldout');
                                        $(this).removeClass('unavailable');
                                        $(this).find(':radio').prop('disabled',false);
                                    }
                                })
                                break;
                        }
                    });
                } else {
                    var variants = this.product.variants;
                    var options = $('.selector-wrapper', this.$container);
                    var selectedOption1 = $('.selector-wrapper-1', this.$container).find('option:selected').val();
                    var selectedOption2 = $('.selector-wrapper-2', this.$container).find('option:selected').val();
                    var selectedOption3 = $('.selector-wrapper-3', this.$container).find('option:selected').val();

                    options.each(function(){
                        var optionIndex = $(this).data('option-index');
                        var option = $(this).find('option');
                        switch (optionIndex) {
                            case 1:
                                option.each(function(){
                                    var optionVal = $(this).val();
                                    var optionSoldout = variants.find(function(variant){
                                        return variant.option1 == optionVal && variant.available;
                                    });
                                    if(optionSoldout == undefined){
                                        // $(this).attr('disabled','disabled');
                                        var optionUnavailable = variants.find(function(variant){
                                            return variant.option1 == optionVal;
                                        });
                                        if (optionUnavailable == undefined) {
                                            $(this).addClass('unavailable');
                                            $(this).removeClass('soldOut');
                                            $(this).attr('disabled','disabled');
                                        } else {
                                            $(this).addClass('soldOut');
                                            $(this).removeClass('unavailable');
                                            $(this).removeAttr('disabled','disabled');
                                        }
                                    } else {
                                        $(this).removeAttr('disabled','disabled');
                                        $(this).removeClass('soldOut');
                                        $(this).removeClass('unavailable');
                                    }
                                })
                                break;
                            case 2:
                                option.each(function(){
                                    var optionVal = $(this).val();
                                    var optionSoldout = variants.find(function(variant){
                                        return variant.option1 == selectedOption1 && variant.option2 == optionVal && variant.available;
                                    });
                                    if(optionSoldout == undefined){
                                        // $(this).attr('disabled','disabled');
                                        var optionUnavailable = variants.find(function(variant){
                                            return variant.option1 == selectedOption1 && variant.option2 == optionVal;
                                        });
                                        if (optionUnavailable == undefined) {
                                            $(this).addClass('unavailable');
                                            $(this).removeClass('soldOut');
                                            $(this).attr('disabled','disabled');
                                        } else {
                                            $(this).addClass('soldOut');
                                            $(this).removeClass('unavailable');
                                            $(this).removeAttr('disabled','disabled');
                                        }
                                    } else {
                                        $(this).removeAttr('disabled','disabled');
                                        $(this).removeClass('soldOut');
                                        $(this).removeClass('unavailable');
                                    }
                                })
                                break;
                            case 3:
                                option.each(function(){
                                    var optionVal = $(this).val();
                                    var optionSoldout = variants.find(function(variant){
                                        return variant.option1 == selectedOption1 && variant.option2 == selectedOption2 && variant.option3 == optionVal && variant.available;
                                    });
                                    if(optionSoldout == undefined){
                                        // $(this).attr('disabled','disabled');
                                        var optionUnavailable = variants.find(function(variant){
                                            return variant.option1 == selectedOption1 && variant.option2 == selectedOption2 && variant.option3 == optionVal;
                                        });
                                        if (optionUnavailable == undefined) {
                                            $(this).addClass('unavailable');
                                            $(this).removeClass('soldOut');
                                            $(this).attr('disabled','disabled');
                                        } else {
                                            $(this).addClass('soldOut');
                                            $(this).removeClass('unavailable');
                                            $(this).removeAttr('disabled','disabled');
                                        }
                                    } else {
                                        $(this).removeAttr('disabled','disabled');
                                        $(this).removeClass('soldOut');
                                        $(this).removeClass('unavailable');
                                    }
                                })
                                break;
                        }
                    });
                }
            }
        },

        _updateVariant: function(_variant) {
            var self = this;
            var check_swatch_option = false;

            if ($('.selector-wrapper-1', this.$container).hasClass('swatch')) {
                check_swatch_option = true;
            }

            if (_variant) {

                var option1 = _variant.option1;
                var option2 = _variant.option2;
                var option3 = _variant.option3;
                var option_change = '';
                var option_value = '';

                if(this.currentVariant.option1 != option1){
                    option_value = option1;
                    option_change = 'option1';
                    $('.label-value-1', this.$container).html(option_value);
                }
                else if(this.currentVariant.option2 != option2){
                    option_value = option2;
                    option_change = 'option2';
                    $('.label-value-2', this.$container).html(option_value);
                }
                else if(this.currentVariant.option3 != option3){
                    option_value = option3;
                    option_change = 'option3';
                    $('.label-value-3', this.$container).html(option_value);
                }
                
                if (check_swatch_option == true) {
                    var variants = this.product.variants;
                    var options = $('.selector-wrapper', this.$container);
                    var selectedOption1 = $('.selector-wrapper-1', this.$container).find('input:checked').val();
                    var selectedOption2 = $('.selector-wrapper-2', this.$container).find('input:checked').val();
                    var selectedOption3 = $('.selector-wrapper-3', this.$container).find('input:checked').val();

                    options.each(function(){
                        var optionIndex = $(this).data('option-index');
                        var swatch = $(this).find('.swatch-element');
                        switch (optionIndex) {
                            case 1:
                                swatch.each(function(){
                                    var swatchVal = $(this).data('value');
                                    var optionSoldout = variants.find(function(variant){
                                        return variant.option1 == swatchVal && variant.available;
                                    });
                                    if(optionSoldout == undefined){
                                        var optionUnavailable = variants.find(function(variant){
                                            return variant.option1 == swatchVal;
                                        });
                                        if (optionUnavailable == undefined) {
                                            $(this).addClass('unavailable');
                                            $(this).removeClass('soldout');
                                            $(this).find(':radio').prop('disabled',true);
                                        } else {
                                            $(this).addClass('soldout');
                                            $(this).removeClass('unavailable');
                                            $(this).find(':radio').prop('disabled',false);
                                        }
                                        // $(this).find(':radio').prop('disabled',true);
                                    } else {
                                        $(this).removeClass('soldout');
                                        $(this).removeClass('unavailable');
                                        $(this).find(':radio').prop('disabled',false);
                                    }
                                })
                                break;
                            case 2:
                                swatch.each(function(){
                                    var swatchVal = $(this).data('value');
                                    var optionSoldout = variants.find(function(variant){
                                        return variant.option1 == selectedOption1 && variant.option2 == swatchVal && variant.available;
                                    });
                                    if(optionSoldout == undefined){
                                        var optionUnavailable = variants.find(function(variant){
                                            return variant.option1 == selectedOption1 && variant.option2 == swatchVal;
                                        });
                                        if (optionUnavailable == undefined) {
                                            $(this).addClass('unavailable');
                                            $(this).removeClass('soldout');
                                            $(this).find(':radio').prop('disabled',true);
                                        } else {
                                            $(this).addClass('soldout');
                                            $(this).removeClass('unavailable');
                                            $(this).find(':radio').prop('disabled',false);
                                        }
                                        // $(this).find(':radio').prop('disabled',true);
                                    } else {
                                        $(this).removeClass('soldout');
                                        $(this).removeClass('unavailable');
                                        $(this).find(':radio').prop('disabled',false);
                                    }
                                })
                                break;
                            case 3:
                                swatch.each(function(){
                                    var swatchVal = $(this).data('value');
                                    var optionSoldout = variants.find(function(variant){
                                        return variant.option1 == selectedOption1 && variant.option2 == selectedOption2 && variant.option3 == swatchVal && variant.available;
                                    });
                                    if(optionSoldout == undefined){
                                        var optionUnavailable = variants.find(function(variant){
                                            return variant.option1 == selectedOption1 && variant.option2 == selectedOption2 && variant.option3 == swatchVal;
                                        });
                                        if (optionUnavailable == undefined) {
                                            $(this).addClass('unavailable');
                                            $(this).removeClass('soldout');
                                            $(this).find(':radio').prop('disabled',true);
                                        } else {
                                            $(this).addClass('soldout');
                                            $(this).removeClass('unavailable');
                                            $(this).find(':radio').prop('disabled',false);
                                        }
                                        // $(this).find(':radio').prop('disabled',true);
                                    } else {
                                        $(this).removeClass('soldout');
                                        $(this).removeClass('unavailable');
                                        $(this).find(':radio').prop('disabled',false);
                                    }
                                })
                                break;
                        }
                    });
                } else {
                    var variants = this.product.variants;
                    var options = $('.selector-wrapper', this.$container);
                    var selectedOption1 = $('.selector-wrapper-1', this.$container).find('option:selected').val();
                    var selectedOption2 = $('.selector-wrapper-2', this.$container).find('option:selected').val();
                    var selectedOption3 = $('.selector-wrapper-3', this.$container).find('option:selected').val();

                    options.each(function(){
                        var optionIndex = $(this).data('option-index');
                        var option = $(this).find('option');
                        switch (optionIndex) {
                            case 1:
                                option.each(function(){
                                    var optionVal = $(this).val();
                                    var optionSoldout = variants.find(function(variant){
                                        return variant.option1 == optionVal && variant.available;
                                    });
                                    if(optionSoldout == undefined){
                                        // $(this).attr('disabled','disabled');
                                        var optionUnavailable = variants.find(function(variant){
                                            return variant.option1 == optionVal;
                                        });
                                        if (optionUnavailable == undefined) {
                                            $(this).addClass('unavailable');
                                            $(this).removeClass('soldOut');
                                            $(this).attr('disabled','disabled');
                                        } else {
                                            $(this).addClass('soldOut');
                                            $(this).removeClass('unavailable');
                                            $(this).removeAttr('disabled','disabled');
                                        }
                                    } else {
                                        $(this).removeAttr('disabled','disabled');
                                        $(this).removeClass('soldOut');
                                        $(this).removeClass('unavailable');
                                    }
                                })
                                break;
                            case 2:
                                option.each(function(){
                                    var optionVal = $(this).val();
                                    var optionSoldout = variants.find(function(variant){
                                        return variant.option1 == selectedOption1 && variant.option2 == optionVal && variant.available;
                                    });
                                    if(optionSoldout == undefined){
                                        // $(this).attr('disabled','disabled');
                                        var optionUnavailable = variants.find(function(variant){
                                            return variant.option1 == selectedOption1 && variant.option2 == optionVal;
                                        });
                                        if (optionUnavailable == undefined) {
                                            $(this).addClass('unavailable');
                                            $(this).removeClass('soldOut');
                                            $(this).attr('disabled','disabled');
                                        } else {
                                            $(this).addClass('soldOut');
                                            $(this).removeClass('unavailable');
                                            $(this).removeAttr('disabled','disabled');
                                        }
                                    } else {
                                        $(this).removeAttr('disabled','disabled');
                                        $(this).removeClass('soldOut');
                                        $(this).removeClass('unavailable');
                                    }
                                })
                                break;
                            case 3:
                                option.each(function(){
                                    var optionVal = $(this).val();
                                    var optionSoldout = variants.find(function(variant){
                                        return variant.option1 == selectedOption1 && variant.option2 == selectedOption2 && variant.option3 == optionVal && variant.available;
                                    });
                                    
                                    if(optionSoldout == undefined){
                                        // $(this).attr('disabled','disabled');
                                        var optionUnavailable = variants.find(function(variant){
                                            return variant.option1 == selectedOption1 && variant.option2 == selectedOption2 && variant.option3 == optionVal;
                                        });
                                        if (optionUnavailable == undefined) {
                                            $(this).addClass('unavailable');
                                            $(this).removeClass('soldOut');
                                            $(this).attr('disabled','disabled');
                                        } else {
                                            $(this).addClass('soldOut');
                                            $(this).removeClass('unavailable');
                                            $(this).removeAttr('disabled','disabled');
                                        }
                                    } else {
                                        $(this).removeAttr('disabled','disabled');
                                        $(this).removeClass('soldOut');
                                        $(this).removeClass('unavailable');
                                    }
                                })
                                break;
                        }
                    });
                }
            }
        },

        /**
         * Update hidden master select of variant change
         *
         * @param  {variant} variant - Currently selected variant
         */
        _updateMasterSelect: function(variant) {
            $(this.originalSelectorId, this.$container).val(variant.id);
        }
    });

    return Variants;
})();

slate.Variants2 = (function() {
    /**
     * Variant constructor
     *
     * @param {object} options - Settings from `product.js`
     */
    function Variants2(options) {
        this.$container = options.$container;
        this.product = options.product;
        this.singleOptionSelector = options.singleOptionSelector;
        this.originalSelectorId = options.originalSelectorId;
        this.enableHistoryState = options.enableHistoryState;
        this.currentVariant = this._getVariantFromOptions();
        this._firstupdateVariant(this.currentVariant);

        $(this.singleOptionSelector, this.$container).on(
            'change',
            this._onSelectChange.bind(this)
        );
    }

    Variants2.prototype = _.assignIn({}, Variants2.prototype, {
        /**
         * Get the currently selected options from add-to-cart form. Works with all
         * form input elements.
         *
         * @return {array} options - Values of currently selected variants
         */
        _getCurrentOptions: function() {
            var currentOptions = _.map(
                $(this.singleOptionSelector, this.$container),
                function(element) {
                    var $element = $(element);
                    var type = $element.attr('type');
                    var currentOption = {};

                    if (type === 'radio' || type === 'checkbox') {
                        if ($element[0].checked) {
                            currentOption.value = $element.val();
                            currentOption.index = $element.data('index');

                            return currentOption;
                        } else {
                            return false;
                        }
                    } else {
                        currentOption.value = $element.val();
                        currentOption.index = $element.data('index');

                        return currentOption;
                    }
                }
            );

            // remove any unchecked input values if using radio buttons or checkboxes
            currentOptions = _.compact(currentOptions);

            return currentOptions;
        },

        /**
         * Find variant based on selected values.
         *
         * @param  {array} selectedValues - Values of variant inputs
         * @return {object || undefined} found - Variant object from product.variants
         */
        _getVariantFromOptions: function() {
            var selectedValues = this._getCurrentOptions();
            var variants = this.product.variants;
            var selectedOption1;
            var selectedOption2;
            var selectedOption3;
            var check_swatch_option = false;

            if ($('.selector-wrapper-1', this.$container).hasClass('swatch')) {
                check_swatch_option = true;
            }
            
            var found = _.find(variants, function(variant) {
                return selectedValues.every(function(values) {
                    return _.isEqual(variant[values.index], values.value);
                });
            });

            if (found == undefined) {

                if (check_swatch_option == true) {
                    selectedOption1 = $('.selector-wrapper-1', this.$container).find('input:checked').val();
                    selectedOption2 = $('.selector-wrapper-2', this.$container).find('input:checked').val();
                    selectedOption3 = $('.selector-wrapper-3', this.$container).find('input:checked').val();

                    $('.selector-wrapper-3 .swatch-element', this.$container).each(function(){
                        var swatchVal = $(this).data('value');
                        var optionSoldout = variants.find(function(variant){
                            return variant.option1 == selectedOption1 && variant.option2 == selectedOption2 && variant.option3 == swatchVal && variant.available;
                        });
                        var optionUnavailable = variants.find(function(variant){
                            return variant.option1 == selectedOption1 && variant.option2 == selectedOption2 && variant.option3 == swatchVal;
                        });

                        if(optionSoldout == undefined){
                            if (optionUnavailable == undefined) {
                                $(this).addClass('unavailable');
                                $(this).removeClass('soldout');
                                $(this).find(':radio').prop('checked',false);
                            } else {
                                $(this).addClass('soldout');
                                $(this).removeClass('unavailable');
                                $(this).find(':radio').prop('disabled',false);
                                $(this).find(':radio').prop('checked',true);
                            }
                            // $(this).find(':radio').prop('disabled',true);
                        } else {
                            $(this).removeClass('soldout');
                            $(this).removeClass('unavailable');
                            $(this).find(':radio').prop('disabled',false);
                            $(this).find(':radio').prop('checked',true);
                            $('.label-value-3', this.$container).html(optionSoldout.option3);
                        }
                    })

                    selectedValues = this._getCurrentOptions();
                    found = _.find(variants, function(variant) {
                        return selectedValues.every(function(values) {
                            return _.isEqual(variant[values.index], values.value);
                        });
                    });

                    if (found == undefined) {
                        $('.selector-wrapper-3 .swatch-element', this.$container).each(function(){
                            var swatchVal = $(this).data('value');
                            var optionSoldout = variants.find(function(variant){
                                return variant.option1 == selectedOption1 && variant.option3 == swatchVal && variant.available;
                            });

                            var optionUnavailable = variants.find(function(variant){
                                return variant.option1 == selectedOption1 && variant.option3 == swatchVal;
                            });

                            if(optionSoldout == undefined){
                                if (optionUnavailable == undefined) {
                                    $(this).addClass('unavailable');
                                    $(this).removeClass('soldout');
                                    $(this).find(':radio').prop('checked',false);
                                } else {
                                    $(this).addClass('soldout');
                                    $(this).removeClass('unavailable');
                                    $(this).find(':radio').prop('disabled',false);
                                    $(this).find(':radio').prop('checked',true);
                                }
                                // $(this).find(':radio').prop('disabled',true);
                            } else {
                                $(this).removeClass('soldout');
                                $(this).removeClass('unavailable');
                                $(this).find(':radio').prop('disabled',false);
                                $(this).find(':radio').prop('checked',true);
                                $('.label-value-3', this.$container).html(optionSoldout.option3);
                            }
                        })

                        selectedOption3 = $('.selector-wrapper-3', this.$container).find('input:checked').val();

                        $('.selector-wrapper-2 .swatch-element', this.$container).each(function(){
                            var swatchVal = $(this).data('value');
                            var optionSoldout = variants.find(function(variant){
                                return variant.option1 == selectedOption1 && variant.option3 == selectedOption3 && variant.option2 == swatchVal && variant.available;
                            });

                            var optionUnavailable = variants.find(function(variant){
                                return variant.option1 == selectedOption1 && variant.option3 == selectedOption3 && variant.option2 == swatchVal;
                            });

                            if(optionSoldout == undefined){
                                if (optionUnavailable == undefined) {
                                    $(this).addClass('unavailable');
                                    $(this).removeClass('soldout');
                                    $(this).find(':radio').prop('checked',false);
                                } else {
                                    $(this).addClass('soldout');
                                    $(this).removeClass('unavailable');
                                    $(this).find(':radio').prop('disabled',false);
                                    $(this).find(':radio').prop('checked',true);
                                }
                                // $(this).find(':radio').prop('disabled',true);
                            } else {
                                $(this).removeClass('soldout');
                                $(this).removeClass('unavailable');
                                $(this).find(':radio').prop('disabled',false);
                                $(this).find(':radio').prop('checked',true);
                                $('.label-value-2', this.$container).html(optionSoldout.option2);
                            } 
                        })

                        selectedValues = this._getCurrentOptions();
                        found = _.find(variants, function(variant) {
                            return selectedValues.every(function(values) {
                                return _.isEqual(variant[values.index], values.value);
                            });
                        });
                    }
                } else {
                    selectedOption1 = $('.selector-wrapper-1', this.$container).find('option:selected').val();
                    selectedOption2 = $('.selector-wrapper-2', this.$container).find('option:selected').val();
                    selectedOption3 = $('.selector-wrapper-3', this.$container).find('option:selected').val();

                    $('.selector-wrapper-3 .single-option-selector option', this.$container).each(function(){
                        var swatchVal = $(this).val();
                        var optionSoldout = variants.find(function(variant){
                            return variant.option1 == selectedOption1 && variant.option2 == selectedOption2 && variant.option3 == swatchVal && variant.available;
                        });

                        if(optionSoldout == undefined){
                            // $(this).attr('disabled','disabled').removeAttr('selected','selected').prop('selected', false);
                            var optionUnavailable = variants.find(function(variant){
                                return variant.option1 == selectedOption1 && variant.option2 == selectedOption2 && variant.option3 == swatchVal;
                            });
                            if (optionUnavailable == undefined) {
                                $(this).addClass('unavailable');
                                $(this).removeClass('soldOut');
                                $(this).attr('disabled','disabled').removeAttr('selected','selected').prop('selected', false);
                            } else {
                                $(this).addClass('soldOut');
                                $(this).removeClass('unavailable');
                                $(this).removeAttr('disabled','disabled').attr('selected','selected').prop('selected', true);
                            }
                        } else {
                            $(this).removeAttr('disabled','disabled').attr('selected','selected').prop('selected', true);
                            $('.label-value-3', this.$container).html(optionSoldout.option3);
                            $(this).removeClass('soldOut');
                            $(this).removeClass('unavailable');
                        }
                    })

                    selectedValues = this._getCurrentOptions();
                    found = _.find(variants, function(variant) {
                        return selectedValues.every(function(values) {
                            return _.isEqual(variant[values.index], values.value);
                        });
                    });

                    if (found == undefined) {

                        $('.selector-wrapper-3 .single-option-selector option', this.$container).each(function(){
                            var swatchVal = $(this).val();
                            var optionSoldout = variants.find(function(variant){
                                return variant.option1 == selectedOption1 && variant.option3 == swatchVal && variant.available;
                            });

                            if(optionSoldout == undefined){
                                // $(this).attr('disabled','disabled').removeAttr('selected','selected').prop('selected', false);
                                var optionUnavailable = variants.find(function(variant){
                                    return variant.option1 == selectedOption1 && variant.option3 == swatchVal;
                                });
                                if (optionUnavailable == undefined) {
                                    $(this).addClass('unavailable');
                                    $(this).removeClass('soldOut');
                                    $(this).attr('disabled','disabled').removeAttr('selected','selected').prop('selected', false);
                                } else {
                                    $(this).addClass('soldOut');
                                    $(this).removeClass('unavailable');
                                    $(this).removeAttr('disabled','disabled').attr('selected','selected').prop('selected', true);
                                }
                            } else {
                                $(this).removeAttr('disabled','disabled').attr('selected','selected').prop('selected', true);
                                $('.label-value-3', this.$container).html(optionSoldout.option3);
                                $(this).removeClass('soldOut');
                                $(this).removeClass('unavailable');
                            }
                        })

                        selectedOption3 = $('.selector-wrapper-3', this.$container).find('option:selected').val();


                        $('.selector-wrapper-2 .single-option-selector option', this.$container).each(function(){
                            var swatchVal = $(this).val();
                            var optionSoldout = variants.find(function(variant){
                                return variant.option1 == selectedOption1 && variant.option3 == selectedOption3 && variant.option2 == swatchVal && variant.available;
                            });

                            if(optionSoldout == undefined){
                                // $(this).attr('disabled','disabled').removeAttr('selected','selected').prop('selected', false);
                                var optionUnavailable = variants.find(function(variant){
                                    return variant.option1 == selectedOption1 && variant.option3 == selectedOption3 && variant.option2 == swatchVal;
                                });
                                if (optionUnavailable == undefined) {
                                    $(this).addClass('unavailable');
                                    $(this).removeClass('soldOut');
                                    $(this).attr('disabled','disabled').removeAttr('selected','selected').prop('selected', false);
                                } else {
                                    $(this).addClass('soldOut');
                                    $(this).removeClass('unavailable');
                                    $(this).removeAttr('disabled','disabled').attr('selected','selected').prop('selected', true);
                                }
                            } else {
                                $(this).removeAttr('disabled','disabled').attr('selected','selected').prop('selected', true);
                                $('.label-value-2', this.$container).html(optionSoldout.option2);
                                $(this).removeClass('soldOut');
                            }
                        })

                        selectedValues = this._getCurrentOptions();
                        found = _.find(variants, function(variant) {
                            return selectedValues.every(function(values) {
                                return _.isEqual(variant[values.index], values.value);
                            });
                        });
                    }
                }
            }

            return found;
        },

        /**
         * Event handler for when a variant input changes.
         */
        _onSelectChange: function() {
            var variant = this._getVariantFromOptions();
            this.$container.trigger({
                type: 'variantChange',
                variant: variant
            });

            if (!variant) {
                return;
            }

            this._updateMasterSelect(variant);
            this._updateImages(variant);
            this._updatePrice(variant);
            this._updateSKU(variant);
            this._updateVariant(variant);
            this.currentVariant = variant;

            if (this.enableHistoryState) {
                this._updateHistoryState(variant);
            }
        },

        /**
         * Trigger event when variant image changes
         *
         * @param  {object} variant - Currently selected variant
         * @return {event}  variantImageChange
         */
        _updateImages: function(variant) {
            var variantImage = variant.featured_image || {};
            var currentVariantImage = this.currentVariant.featured_image || {};

            if (
                !variant.featured_image ||
                variantImage.src === currentVariantImage.src
            ) {
                return;
            }

            this.$container.trigger({
                type: 'variantImageChange',
                variant: variant
            });
        },

        /**
         * Trigger event when variant price changes.
         *
         * @param  {object} variant - Currently selected variant
         * @return {event} variantPriceChange
         */
        _updatePrice: function(variant) {
            if (
                variant.price === this.currentVariant.price &&
                variant.compare_at_price === this.currentVariant.compare_at_price
            ) {
                return;
            }

            this.$container.trigger({
                type: 'variantPriceChange',
                variant: variant
            });
        },

        /**
         * Trigger event when variant sku changes.
         *
         * @param  {object} variant - Currently selected variant
         * @return {event} variantSKUChange
         */
        _updateSKU: function(variant) {
            if (variant.sku === this.currentVariant.sku) {
                return;
            }

            this.$container.trigger({
                type: 'variantSKUChange',
                variant: variant
            });
        },

        /**
         * Update history state for product deeplinking
         *
         * @param  {variant} variant - Currently selected variant
         * @return {k}         [description]
         */
        _updateHistoryState: function(variant) {
            if (!history.replaceState || !variant) {
                return;
            }

            var newurl =
                window.location.protocol +
                '//' +
                window.location.host +
                window.location.pathname;
            window.history.replaceState({ path: newurl }, '', newurl);
        },

        _firstupdateVariant: function(_variant){
            var self = this;
            var check_swatch_option = false;

            if ($('.selector-wrapper-1', this.$container).hasClass('swatch')) {
                check_swatch_option = true;
            }

            if (_variant) {
                if (check_swatch_option == true) {
                    var variants = this.product.variants;
                    var options = $('.selector-wrapper', this.$container);
                    var selectedOption1 = $('.selector-wrapper-1', this.$container).find('input:checked').val();
                    var selectedOption2 = $('.selector-wrapper-2', this.$container).find('input:checked').val();
                    var selectedOption3 = $('.selector-wrapper-3', this.$container).find('input:checked').val();

                    options.each(function(){
                        var optionIndex = $(this).data('option-index');
                        var swatch = $(this).find('.swatch-element');
                        switch (optionIndex) {
                            case 1:
                                swatch.each(function(){
                                    var swatchVal = $(this).data('value');
                                    var optionSoldout = variants.find(function(variant){
                                        return variant.option1 == swatchVal && variant.available;
                                    });
                                    if(optionSoldout == undefined){
                                        var optionUnavailable = variants.find(function(variant){
                                            return variant.option1 == swatchVal;
                                        });
                                        if (optionUnavailable == undefined) {
                                            $(this).addClass('unavailable');
                                            $(this).removeClass('soldout');
                                            $(this).find(':radio').prop('disabled',true);
                                        } else {
                                            $(this).addClass('soldout');
                                            $(this).removeClass('unavailable');
                                            $(this).find(':radio').prop('disabled',false);
                                        }
                                        // $(this).find(':radio').prop('disabled',true);
                                    } else {
                                        $(this).removeClass('soldout');
                                        $(this).removeClass('unavailable');
                                        $(this).find(':radio').prop('disabled',false);
                                    }
                                })
                                break;
                            case 2:
                                swatch.each(function(){
                                    var swatchVal = $(this).data('value');
                                    var optionSoldout = variants.find(function(variant){
                                        return variant.option1 == selectedOption1 && variant.option2 == swatchVal && variant.available;
                                    });
                                    if(optionSoldout == undefined){
                                        var optionUnavailable = variants.find(function(variant){
                                            return variant.option1 == selectedOption1 && variant.option2 == swatchVal;
                                        });
                                        if (optionUnavailable == undefined) {
                                            $(this).addClass('unavailable');
                                            $(this).removeClass('soldout');
                                            $(this).find(':radio').prop('disabled',true);
                                        } else {
                                            $(this).addClass('soldout');
                                            $(this).removeClass('unavailable');
                                            $(this).find(':radio').prop('disabled',false);
                                        }
                                        // $(this).find(':radio').prop('disabled',true);
                                    } else {
                                        $(this).removeClass('soldout');
                                        $(this).removeClass('unavailable');
                                        $(this).find(':radio').prop('disabled',false);
                                    }
                                })
                                break;
                            case 3:
                                swatch.each(function(){
                                    var swatchVal = $(this).data('value');
                                    var optionSoldout = variants.find(function(variant){
                                        return variant.option1 == selectedOption1 && variant.option2 == selectedOption2 && variant.option3 == swatchVal && variant.available;
                                    });
                                    if(optionSoldout == undefined){
                                        var optionUnavailable = variants.find(function(variant){
                                            return variant.option1 == selectedOption1 && variant.option2 == selectedOption2 && variant.option3 == swatchVal;
                                        });
                                        if (optionUnavailable == undefined) {
                                            $(this).addClass('unavailable');
                                            $(this).removeClass('soldout');
                                            $(this).find(':radio').prop('disabled',true);
                                        } else {
                                            $(this).addClass('soldout');
                                            $(this).removeClass('unavailable');
                                            $(this).find(':radio').prop('disabled',false);
                                        }
                                        // $(this).find(':radio').prop('disabled',true);
                                    } else {
                                        $(this).removeClass('soldout');
                                        $(this).removeClass('unavailable');
                                        $(this).find(':radio').prop('disabled',false);
                                    }
                                })
                                break;
                        }
                    });
                } else {
                    var variants = this.product.variants;
                    var options = $('.selector-wrapper', this.$container);
                    var selectedOption1 = $('.selector-wrapper-1', this.$container).find('option:selected').val();
                    var selectedOption2 = $('.selector-wrapper-2', this.$container).find('option:selected').val();
                    var selectedOption3 = $('.selector-wrapper-3', this.$container).find('option:selected').val();

                    options.each(function(){
                        var optionIndex = $(this).data('option-index');
                        var option = $(this).find('option');
                        switch (optionIndex) {
                            case 1:
                                option.each(function(){
                                    var optionVal = $(this).val();
                                    var optionSoldout = variants.find(function(variant){
                                        return variant.option1 == optionVal && variant.available;
                                    });
                                    if(optionSoldout == undefined){
                                        // $(this).attr('disabled','disabled');
                                        var optionUnavailable = variants.find(function(variant){
                                            return variant.option1 == optionVal;
                                        });
                                        if (optionUnavailable == undefined) {
                                            $(this).addClass('unavailable');
                                            $(this).removeClass('soldOut');
                                            $(this).attr('disabled','disabled');
                                        } else {
                                            $(this).addClass('soldOut');
                                            $(this).removeClass('unavailable');
                                            $(this).removeAttr('disabled','disabled');
                                        }
                                    } else {
                                        $(this).removeAttr('disabled','disabled');
                                        $(this).removeClass('soldOut');
                                        $(this).removeClass('unavailable');
                                    }
                                })
                                break;
                            case 2:
                                option.each(function(){
                                    var optionVal = $(this).val();
                                    var optionSoldout = variants.find(function(variant){
                                        return variant.option1 == selectedOption1 && variant.option2 == optionVal && variant.available;
                                    });
                                    if(optionSoldout == undefined){
                                        // $(this).attr('disabled','disabled');
                                        var optionUnavailable = variants.find(function(variant){
                                            return variant.option1 == selectedOption1 && variant.option2 == optionVal;
                                        });
                                        if (optionUnavailable == undefined) {
                                            $(this).addClass('unavailable');
                                            $(this).removeClass('soldOut');
                                            $(this).attr('disabled','disabled');
                                        } else {
                                            $(this).addClass('soldOut');
                                            $(this).removeClass('unavailable');
                                            $(this).removeAttr('disabled','disabled');
                                        }
                                    } else {
                                        $(this).removeAttr('disabled','disabled');
                                        $(this).removeClass('soldOut');
                                        $(this).removeClass('unavailable');
                                    }
                                })
                                break;
                            case 3:
                                option.each(function(){
                                    var optionVal = $(this).val();
                                    var optionSoldout = variants.find(function(variant){
                                        return variant.option1 == selectedOption1 && variant.option2 == selectedOption2 && variant.option3 == optionVal && variant.available;
                                    });
                                    if(optionSoldout == undefined){
                                        // $(this).attr('disabled','disabled');
                                        var optionUnavailable = variants.find(function(variant){
                                            return variant.option1 == selectedOption1 && variant.option2 == selectedOption2 && variant.option3 == optionVal;
                                        });
                                        if (optionUnavailable == undefined) {
                                            $(this).addClass('unavailable');
                                            $(this).removeClass('soldOut');
                                            $(this).attr('disabled','disabled');
                                        } else {
                                            $(this).addClass('soldOut');
                                            $(this).removeClass('unavailable');
                                            $(this).removeAttr('disabled','disabled');
                                        }
                                    } else {
                                        $(this).removeAttr('disabled','disabled');
                                        $(this).removeClass('soldOut');
                                        $(this).removeClass('unavailable');
                                    }
                                })
                                break;
                        }
                    });
                }
            }
        },

        _updateVariant: function(_variant) {
            var self = this;
            var check_swatch_option = false;

            if ($('.selector-wrapper-1', this.$container).hasClass('swatch')) {
                check_swatch_option = true;
            }

            if (_variant) {

                var option1 = _variant.option1;
                var option2 = _variant.option2;
                var option3 = _variant.option3;
                var option_change = '';
                var option_value = '';

                if(this.currentVariant.option1 != option1){
                    option_value = option1;
                    option_change = 'option1';
                    $('.label-value-1', this.$container).html(option_value);
                }
                else if(this.currentVariant.option2 != option2){
                    option_value = option2;
                    option_change = 'option2';
                    $('.label-value-2', this.$container).html(option_value);
                }
                else if(this.currentVariant.option3 != option3){
                    option_value = option3;
                    option_change = 'option3';
                    $('.label-value-3', this.$container).html(option_value);
                }
                
                if (check_swatch_option == true) {
                    var variants = this.product.variants;
                    var options = $('.selector-wrapper', this.$container);
                    var selectedOption1 = $('.selector-wrapper-1', this.$container).find('input:checked').val();
                    var selectedOption2 = $('.selector-wrapper-2', this.$container).find('input:checked').val();
                    var selectedOption3 = $('.selector-wrapper-3', this.$container).find('input:checked').val();

                    options.each(function(){
                        var optionIndex = $(this).data('option-index');
                        var swatch = $(this).find('.swatch-element');
                        switch (optionIndex) {
                            case 1:
                                swatch.each(function(){
                                    var swatchVal = $(this).data('value');
                                    var optionSoldout = variants.find(function(variant){
                                        return variant.option1 == swatchVal && variant.available;
                                    });
                                    if(optionSoldout == undefined){
                                        var optionUnavailable = variants.find(function(variant){
                                            return variant.option1 == swatchVal;
                                        });
                                        if (optionUnavailable == undefined) {
                                            $(this).addClass('unavailable');
                                            $(this).removeClass('soldout');
                                            $(this).find(':radio').prop('disabled',true);
                                        } else {
                                            $(this).addClass('soldout');
                                            $(this).removeClass('unavailable');
                                            $(this).find(':radio').prop('disabled',false);
                                        }
                                        // $(this).find(':radio').prop('disabled',true);
                                    } else {
                                        $(this).removeClass('soldout');
                                        $(this).removeClass('unavailable');
                                        $(this).find(':radio').prop('disabled',false);
                                    }
                                })
                                break;
                            case 2:
                                swatch.each(function(){
                                    var swatchVal = $(this).data('value');
                                    var optionSoldout = variants.find(function(variant){
                                        return variant.option1 == selectedOption1 && variant.option2 == swatchVal && variant.available;
                                    });
                                    if(optionSoldout == undefined){
                                        var optionUnavailable = variants.find(function(variant){
                                            return variant.option1 == selectedOption1 && variant.option2 == swatchVal;
                                        });
                                        if (optionUnavailable == undefined) {
                                            $(this).addClass('unavailable');
                                            $(this).removeClass('soldout');
                                            $(this).find(':radio').prop('disabled',true);
                                        } else {
                                            $(this).addClass('soldout');
                                            $(this).removeClass('unavailable');
                                            $(this).find(':radio').prop('disabled',false);
                                        }
                                        // $(this).find(':radio').prop('disabled',true);
                                    } else {
                                        $(this).removeClass('soldout');
                                        $(this).removeClass('unavailable');
                                        $(this).find(':radio').prop('disabled',false);
                                    }
                                })
                                break;
                            case 3:
                                swatch.each(function(){
                                    var swatchVal = $(this).data('value');
                                    var optionSoldout = variants.find(function(variant){
                                        return variant.option1 == selectedOption1 && variant.option2 == selectedOption2 && variant.option3 == swatchVal && variant.available;
                                    });
                                    if(optionSoldout == undefined){
                                        var optionUnavailable = variants.find(function(variant){
                                            return variant.option1 == selectedOption1 && variant.option2 == selectedOption2 && variant.option3 == swatchVal;
                                        });
                                        if (optionUnavailable == undefined) {
                                            $(this).addClass('unavailable');
                                            $(this).removeClass('soldout');
                                            $(this).find(':radio').prop('disabled',true);
                                        } else {
                                            $(this).addClass('soldout');
                                            $(this).removeClass('unavailable');
                                            $(this).find(':radio').prop('disabled',false);
                                        }
                                        // $(this).find(':radio').prop('disabled',true);
                                    } else {
                                        $(this).removeClass('soldout');
                                        $(this).removeClass('unavailable');
                                        $(this).find(':radio').prop('disabled',false);
                                    }
                                })
                                break;
                        }
                    });
                } else {
                    var variants = this.product.variants;
                    var options = $('.selector-wrapper', this.$container);
                    var selectedOption1 = $('.selector-wrapper-1', this.$container).find('option:selected').val();
                    var selectedOption2 = $('.selector-wrapper-2', this.$container).find('option:selected').val();
                    var selectedOption3 = $('.selector-wrapper-3', this.$container).find('option:selected').val();

                    options.each(function(){
                        var optionIndex = $(this).data('option-index');
                        var option = $(this).find('option');
                        switch (optionIndex) {
                            case 1:
                                option.each(function(){
                                    var optionVal = $(this).val();
                                    var optionSoldout = variants.find(function(variant){
                                        return variant.option1 == optionVal && variant.available;
                                    });
                                    if(optionSoldout == undefined){
                                        // $(this).attr('disabled','disabled');
                                        var optionUnavailable = variants.find(function(variant){
                                            return variant.option1 == optionVal;
                                        });
                                        if (optionUnavailable == undefined) {
                                            $(this).addClass('unavailable');
                                            $(this).removeClass('soldOut');
                                            $(this).attr('disabled','disabled');
                                        } else {
                                            $(this).addClass('soldOut');
                                            $(this).removeClass('unavailable');
                                            $(this).removeAttr('disabled','disabled');
                                        }
                                    } else {
                                        $(this).removeAttr('disabled','disabled');
                                        $(this).removeClass('soldOut');
                                        $(this).removeClass('unavailable');
                                    }
                                })
                                break;
                            case 2:
                                option.each(function(){
                                    var optionVal = $(this).val();
                                    var optionSoldout = variants.find(function(variant){
                                        return variant.option1 == selectedOption1 && variant.option2 == optionVal && variant.available;
                                    });
                                    if(optionSoldout == undefined){
                                        // $(this).attr('disabled','disabled');
                                        var optionUnavailable = variants.find(function(variant){
                                            return variant.option1 == selectedOption1 && variant.option2 == optionVal;
                                        });
                                        if (optionUnavailable == undefined) {
                                            $(this).addClass('unavailable');
                                            $(this).removeClass('soldOut');
                                            $(this).attr('disabled','disabled');
                                        } else {
                                            $(this).addClass('soldOut');
                                            $(this).removeClass('unavailable');
                                            $(this).removeAttr('disabled','disabled');
                                        }
                                    } else {
                                        $(this).removeAttr('disabled','disabled');
                                        $(this).removeClass('soldOut');
                                        $(this).removeClass('unavailable');
                                    }
                                })
                                break;
                            case 3:
                                option.each(function(){
                                    var optionVal = $(this).val();
                                    var optionSoldout = variants.find(function(variant){
                                        return variant.option1 == selectedOption1 && variant.option2 == selectedOption2 && variant.option3 == optionVal && variant.available;
                                    });
                                    
                                    if(optionSoldout == undefined){
                                        // $(this).attr('disabled','disabled');
                                        var optionUnavailable = variants.find(function(variant){
                                            return variant.option1 == selectedOption1 && variant.option2 == selectedOption2 && variant.option3 == optionVal;
                                        });
                                        if (optionUnavailable == undefined) {
                                            $(this).addClass('unavailable');
                                            $(this).removeClass('soldOut');
                                            $(this).attr('disabled','disabled');
                                        } else {
                                            $(this).addClass('soldOut');
                                            $(this).removeClass('unavailable');
                                            $(this).removeAttr('disabled','disabled');
                                        }
                                    } else {
                                        $(this).removeAttr('disabled','disabled');
                                        $(this).removeClass('soldOut');
                                        $(this).removeClass('unavailable');
                                    }
                                })
                                break;
                        }
                    });
                }
            }
        },

        /**
         * Update hidden master select of variant change
         *
         * @param  {variant} variant - Currently selected variant
         */
        _updateMasterSelect: function(variant) {
            $(this.originalSelectorId, this.$container).val(variant.id);
        }
    });

    return Variants2;
})();

/* ================ GLOBAL ================ */

/*============================================================================
    Drawer modules
==============================================================================*/
theme.Drawers = (function() {
    function Drawer(id, position, options) {
        var defaults = {
            close: '.js-drawer-close',
            open: '.js-drawer-open-' + position,
            openClass: 'js-drawer-open',
            dirOpenClass: 'js-drawer-open-' + position
        };

        this.nodes = {
            $parent: $('html').add('body'),
            $page: $('#PageContainer')
        };

        this.config = $.extend(defaults, options);
        this.position = position;

        this.$drawer = $('#' + id);

        if (!this.$drawer.length) {
            return false;
        }

        this.drawerIsOpen = false;
        this.init();
    }

    Drawer.prototype.init = function() {
        $(this.config.open).on('click', $.proxy(this.open, this));
        this.$drawer.on('click', this.config.close, $.proxy(this.close, this));
    };

    Drawer.prototype.open = function(evt) {
        // Keep track if drawer was opened from a click, or called by another function
        var externalCall = false;

        // Prevent following href if link is clicked
        if (evt) {
            evt.preventDefault();
        } else {
            externalCall = true;
        }

        // Without this, the drawer opens, the click event bubbles up to nodes.$page
        // which closes the drawer.
        if (evt && evt.stopPropagation) {
            evt.stopPropagation();
            // save the source of the click, we'll focus to this on close
            this.$activeSource = $(evt.currentTarget);
        }

        if (this.drawerIsOpen && !externalCall) {
            return this.close();
        }

        // Add is-transitioning class to moved elements on open so drawer can have
        // transition for close animation
        this.$drawer.prepareTransition();

        this.nodes.$parent.addClass(
            this.config.openClass + ' ' + this.config.dirOpenClass
        );
        this.drawerIsOpen = true;

        // Set focus on drawer
        slate.a11y.trapFocus({
            $container: this.$drawer,
            namespace: 'drawer_focus'
        });

        // Run function when draw opens if set
        if (
            this.config.onDrawerOpen &&
            typeof this.config.onDrawerOpen === 'function'
        ) {
            if (!externalCall) {
                this.config.onDrawerOpen();
            }
        }

        if (this.$activeSource && this.$activeSource.attr('aria-expanded')) {
            this.$activeSource.attr('aria-expanded', 'true');
        }

        this.bindEvents();

        return this;
    };

    Drawer.prototype.close = function() {
        if (!this.drawerIsOpen) {
            // don't close a closed drawer
            return;
        }

        // deselect any focused form elements
        $(document.activeElement).trigger('blur');

        // Ensure closing transition is applied to moved elements, like the nav
        this.$drawer.prepareTransition();

        this.nodes.$parent.removeClass(
            this.config.dirOpenClass + ' ' + this.config.openClass
        );

        if (this.$activeSource && this.$activeSource.attr('aria-expanded')) {
            this.$activeSource.attr('aria-expanded', 'false');
        }

        this.drawerIsOpen = false;

        // Remove focus on drawer
        slate.a11y.removeTrapFocus({
            $container: this.$drawer,
            namespace: 'drawer_focus'
        });

        this.unbindEvents();

        // Run function when draw closes if set
        if (
            this.config.onDrawerClose &&
            typeof this.config.onDrawerClose === 'function'
        ) {
            this.config.onDrawerClose();
        }
    };

    Drawer.prototype.bindEvents = function() {
        this.nodes.$parent.on(
            'keyup.drawer',
            $.proxy(function(evt) {
                // close on 'esc' keypress
                if (evt.keyCode === 27) {
                    this.close();
                    return false;
                } else {
                    return true;
                }
            }, this)
        );

        // Lock scrolling on mobile
        this.nodes.$page.on('touchmove.drawer', function() {
            return false;
        });

        this.nodes.$page.on(
            'click.drawer',
            $.proxy(function() {
                this.close();
                return false;
            }, this)
        );
    };

    Drawer.prototype.unbindEvents = function() {
        this.nodes.$page.off('.drawer');
        this.nodes.$parent.off('.drawer');
    };

    return Drawer;
})();


/* ================ MODULES ================ */

window.theme = window.theme || {};

theme.Header = (function() {

    function init() {
        // header_menu();
        header_sticky();
    }

    function header_scroll(header_position, header_height) {
        $(window).on('scroll load', function(event) {
            var scroll = $(window).scrollTop();
            if (scroll > header_height) {
                $('.header-sticky').addClass('is-sticky');
                $('body').css('padding-top', header_height);
                $('.search-form-wrapper').addClass('custom');
            } else {
                $('.header-sticky').removeClass('is-sticky');
                $('body').css('padding-top', 0);
                $('.search-form-wrapper').removeClass('custom');
            }
        });
        
        window.onload = function() {
            if ($(window).scrollTop() > header_position) {
                $('.header-sticky').addClass('is-sticky');
                $('.search-form-wrapper').addClass('custom');
            }
        };
    }

    function header_sticky() {
        if ($('.header-sticky').length) {
            var header_position, header_height;
            if ($(window).width() > 1024) {
                header_height = $('.header-sticky .header-PC').height();
                header_position = $('.page-container').offset();
                header_scroll(header_position.top, header_height);
            }
            else {
                header_height = $('.header-sticky .header-mobile').height();
                header_position = $('.page-container').offset();
                header_scroll(header_position.top, header_height);
            }
        }
    }

    function header_menu() {
        if (!$('#site-nav').length)
            return;

        $('[data-mobile-menu]').on('click', function(event) {
            event.preventDefault();
            const $target = $(event.currentTarget);
            if ($target.hasClass('is-open')) {
                $target.removeClass('is-open');
                $('body').removeClass('open_menu');
                reset_menu();
            } else {
                $target.addClass('is-open');
                $('body').addClass('open_menu');
            }
        });

        $('#navigation-mobile .close_menu').on('click', function(event) {
            event.preventDefault();
            $('body').removeClass('open_menu');
            $('[data-mobile-menu]').removeClass('is-open');
            reset_menu();
        });

        $(document).on('click', function(event) {
            if ($('body').hasClass('open_menu') && ($(event.target).closest('#navigation-mobile').length === 0) && ($(event.target).closest('[data-mobile-menu]').length === 0)) {
                $('body').removeClass('open_menu');
                $('[data-mobile-menu]').removeClass('is-open');
                reset_menu();
            }
        });
    }

    return {
        init: init
    };
})();

window.theme = window.theme || {};

theme.HeaderSection = (function() {
    function Header() {
        theme.Header.init();
    }

    Header.prototype = _.assignIn({}, Header.prototype, {
        onUnload: function() {
            theme.Header.unload();
        }
    });

    return Header;
})();

window.theme = window.theme || {};

theme.Footer = (function() {
    function init() {
        footer_sticky();
    }

    function footer_sticky() {
        if ($('.footer-sticky').length) {
            var footer_position, footer_height;
            if ($(window).width() > 1024) {
                footer_height = $('.footer-sticky').outerHeight();
                $('.page-container').css('margin-bottom', footer_height + 9);
                $('.page-container').addClass('page-container--sticky');
            }
            else {
                footer_height = 0;
                $('.page-container').css('margin-bottom', footer_height);
                $('.page-container').removeClass('page-container--sticky');
            }
        }
    }

    return {
        init: init
    };
})();

window.theme = window.theme || {};

theme.FooterSection = (function() {
    function Footer() {
        theme.Footer.init();
    }

    Footer.prototype = _.assignIn({}, Footer.prototype, {
        onUnload: function() {
            theme.Footer.unload();
        }
    });

    return Footer;
})();

theme.HeaderFooter_mobile = (function() {
    function header_logo() {
        if ($('.logo-wrapper').length) {
            if ($(window).width() > 1024) {
                if ($('.header-mobile .logo-wrapper').length) {
                    $('.header-mobile .logo-wrapper').appendTo('.header-PC .header-middle__left');
                }
            }
            else {
                if ($('.header-PC .logo-wrapper').length) {
                    $('.header-PC .logo-wrapper').appendTo('.header-mobile .item__mobile--logo');
                }
            }
        }
        if ($(window).width() < 1025) {
            $('.header-middle__item .cart-quickview_content').appendTo($('#cart-mobile .popup-sidebar__wrapper'));
            $('.header-middle__search .search-form-wrapper').appendTo($('#searchbar_mobile'));
        } else {
            $('.header-middle__item--cart .cart-quickview_content').appendTo($('.popup-sidebar__wrapper .cart-quickview_content'));
        }
    }

    function header_account() {
        if ($('.login-form').length) {
            if ($(window).width() > 1024) {
                if ($('#login-form-mobile .login-form').length) {
                    $('#login-form-mobile .login-form').appendTo('.header-middle__item--account');
                }
            }
            else {
                if ($('.header-middle__item--account .login-form').length) {
                    $('.header-middle__item--account .login-form').appendTo('#login-form-mobile .popup-sidebar__wrapper');
                }
            }
        }
    }

    function header_navigation() {
        if ($('#site-nav').length) {
            if ($(window).width() > 1024) {
                $('body').removeClass('open_menu');
                if ($('#navigation-mobile #site-nav').length) {
                    $('#navigation-mobile #site-nav').appendTo('.header-PC .header-middle__navigation');
                    document.getElementById('site-nav').className = "site-nav";
                }
            } else {
                if (!$('#navigation-mobile #site-nav').length) {
                    $('.header-PC #site-nav').prependTo('#navigation-mobile .popup-sidebar__wrapper');
                    document.getElementById('site-nav').className = "site-nav-mobile";
                }
            }
        }
    }

    function header_navigation_toggle() {
        $(document).on('click', '.site-nav-mobile .nav-action', function(event) {
            const $openAction = $(event.target).parent();
            const $parentSiblings = $openAction.siblings();
            const $checkTitle = $openAction.closest('.site-nav-dropdown');
            const $closestTitle = $checkTitle.siblings();
            if (!$(event.target).hasClass('nav-action--end')) {
                if (!$(event.target).hasClass('link')) {
                    $openAction.addClass('is-open');
                    if ($openAction.hasClass('is-open')) {
                        $parentSiblings.addClass('is-hidden');
                    }
                    if ( $checkTitle.length ) {
                        $closestTitle.addClass('is-hidden');
                    }
                }
            }
        });

        $(document).on('click', '.site-nav-mobile .nav-title-mobile', function(event) {
            const $closestAction = $(event.target).closest('.dropdown');
            const $parentSiblings2 = $closestAction.siblings();
            const $openTitle = $(event.target).closest('.site-nav-dropdown').siblings();

            $closestAction.removeClass('is-open');
            $parentSiblings2.removeClass('is-hidden');
            $openTitle.removeClass('is-hidden');
        });
    }

    function header_carousel() {
        if (!$('.dropdown-megamenu--carousel').length) {
            return
        }

        $('.dropdown-megamenu--carousel').each(function() {
            if (!$(this).hasClass('slick-slider')) {
                var row = false,
                    arrow = true,
                    dot = false;
                if ($(this).hasClass('has-row')) {
                    row = 2;
                    arrow = false;
                    dot = true;
                }
                $(this).slick({
                    infinite: true,
                    slidesToShow: 1,
                    slidesToScroll: 1,
                    dots: dot,
                    autoplay: false,
                    arrows: arrow,
                    rows: row,
                    prevArrow: "<div class='slick-prev slick-arrow'><svg class='icon'><use xlink:href='#icon-chevron-left' /></svg></div>", 
                    nextArrow: "<div class='slick-next slick-arrow'><svg class='icon'><use xlink:href='#icon-chevron-right' /></svg></div>",
                    responsive: [
                        {
                            breakpoint: 1500,
                            settings: {
                                slidesToShow: 1,
                                slidesToScroll: 1
                            }
                        }
                    ]
                })
            } else {
                $(this).slick('slickGoTo', 0);
            }
        })

        $(".site-nav > li").mouseover(function() {
            var self = $(this);
            if (self.find('.dropdown-megamenu--carousel').length) {
                self.find('.dropdown-megamenu--carousel').get(0).slick.setPosition();
            }
        });

        $(document).on("click", ".site-nav-mobile > li > .nav-action", function() {
            $(this).parent().find('.dropdown-megamenu--carousel').slick('slickGoTo', 0);
        });
    }

    function showTime(time){
        if(time < 10){
            return "<span class='num'>0"+time+"</span>";
        }
        return "<span class='num'>"+time+"</span>";
    }

    function countdown_mega() {
        if (!$('[data-countdown-mega]').length) {
            return;
        }

        $('[data-countdown-mega]').each(function () {

            var self = $(this),
                countDownDate = new Date( self.attr('data-countdown-value')).getTime();
            // Update the count down every 1 second
            var countdownfunction = setInterval(function() {

                // Get todays date and time
                var now = new Date().getTime();
        
                // Find the distance between now an the count down date
                var distance = countDownDate - now;
        
                // If the count down is over, write some text 
                if (distance < 0) {
                    clearInterval(countdownfunction);
                    self.parent().remove();
                } else {
                    // Time calculations for days, hours, minutes and seconds
                    var days = Math.floor(distance / (1000 * 60 * 60 * 24));
                    var hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
                    var minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
                    var seconds = Math.floor((distance % (1000 * 60)) / 1000);
                    var strCountDown = "<span class='countdown--item'>"+ showTime(days) + "D</span> : <span class='countdown--item'>"+ showTime(hours) + "H</span> : <span class='countdown--item'>" + showTime(minutes) + "M</span> : <span class='countdown--item'>" + showTime(seconds) + "S</span>";
                    self.html(strCountDown);
                }
            }, 500);
        });
    }

    function menu_ajax() {

        if (!$('#site-nav').length)
            return;
        if ($(window).width() < 1025) {
            var chk = false;
            window.addEventListener('load', function(){ // on page load
                document.body.addEventListener('touchstart', function(e){
                    if (chk == false) {
                        chk = true;
                        $.ajax({
                            url: '/search?view=mega',
                            beforeSend: function () {
                                // theme.HaloAddOn.loadingPopup();
                            },
                            success: function (data) {
                                var curMega = $('#site-nav'),
                                    newMega = $(data).find('#site-nav');
                                    $(curMega).replaceWith(newMega);
                                    document.getElementById('site-nav').className = "site-nav-mobile";
                                    header_carousel();
                                    // countdown_mega();
                            },

                            error: function (xhr, text) {
                                alert($.parseJSON(xhr.responseText).description);
                            },

                            complete: function () {
                                // theme.HaloAddOn.removeLoadingPopup();
                            }
                        })
                    }
                }, false)
            }, false);
            $('[data-mobile-menu]').on('click', function(event) {
                if (chk == false) {
                    chk = true;
                    $.ajax({
                        url: '/search?view=mega',
                        beforeSend: function () {
                            // theme.HaloAddOn.loadingPopup();
                        },
                        success: function (data) {
                            var curMega = $('#site-nav'),
                                newMega = $(data).find('#site-nav');
                                $(curMega).replaceWith(newMega);
                                document.getElementById('site-nav').className = "site-nav-mobile";
                                header_carousel();
                                // countdown_mega();
                        },

                        error: function (xhr, text) {
                            alert($.parseJSON(xhr.responseText).description);
                        },

                        complete: function () {
                            // theme.HaloAddOn.removeLoadingPopup();
                        }
                    })
                }
            })
        } else {
            var chk = false;
            // $('#site-nav, body').on('mouseleave').on('mouseenter', function(){
            $(document).mousemove(function(){
                if (chk == false) {
                    chk = true;
                    $.ajax({
                        url: '/search?view=mega',
                        beforeSend: function () {
                            // theme.HaloAddOn.loadingPopup();
                        },
                        success: function (data) {
                            var curMega = $('#site-nav'),
                                newMega = $(data).find('#site-nav');
                                curMega.replaceWith(newMega);
                                document.getElementById('site-nav').className = "site-nav";
                                header_carousel();
                                countdown_mega();
                            $('.header-PC .site-nav .menu-lv-1.dropdown').mouseenter(function() {
                                $('body').addClass('open_menu_pc');
                            })
                            .mouseleave(function() {
                                $('body').removeClass('open_menu_pc');
                            });
                        },

                        error: function (xhr, text) {
                            alert($.parseJSON(xhr.responseText).description);
                        },

                        complete: function () {
                            // theme.HaloAddOn.removeLoadingPopup();
                        }
                    })
                }
            });
        }
    }

    function footer_mobile() {
        if ($(window).width() <= 767) {
            if(!$('.footer-row').hasClass('footerMobile')) {
                $('.footer-row').addClass('footerMobile');
                $('.footer-row__item--mobile .footer-list').css('display', 'none');
            }
        } else {
            $('.footer-row').removeClass('footerMobile');
            $('.footer-row__item--mobile').removeClass('open-dropdown');
            $('.footer-row__item--mobile .footer-list').css('display', 'block');
        }
    }

    function language_curency() {

        if ($('.header--language--currency').length) {
            if ($(window).width() < 1025) {
                if (!$('#navigation-mobile #currencies').length) {
                    $('.header--language--currency #currencies').appendTo('#navigation-mobile .site-nav-mobile.three');
                }

                if (!$('#navigation-mobile #lang-switcher').length) {
                    $('.header--language--currency #lang-switcher').appendTo('#navigation-mobile .site-nav-mobile.three');
                }
            }
        }

        if ($('.header--language--currency').length) {
            $(document).off('click', '.header--language--currency .dropdown-toggle').on('click', '.header--language--currency .dropdown-toggle', function(e) {
                $('.header--language--currency').toggleClass('show');
                var currency = $('#currencies'),
                    language = $('#lang-switcher');
                if (currency.length) {
                    $('.dropdown-language-currency').append(currency);
                }
                if (language.length) {
                    $('.dropdown-language-currency').append(language);
                }
            });

            $(document).on('click', '.header--language--currency .dropdown-menu .dropdown-item', function(e) {
                $('.header--language--currency').removeClass('show');
            });

            $(document).on('click', function(event) {
                if ($('.header--language--currency').hasClass('show') && ($(event.target).closest('.header--language--currency').length === 0)) {
                    $('.header--language--currency').removeClass('show');
                }
            });
        }

    }

    function sortByProduct() {
        if($('[data-sort-product]').length) {
            if ($(window).width() <= 1024) {
                $('[data-sort-product]').appendTo('.filters-toolbar__mobile');
            } else {
                $('.collection-sortBy--viewProduct [data-sort-product]').appendTo('.filters-toolbar__item-wrapper');
            }
        }
        var wrapper = $('.collection-toolbar');
        if ($(window).width() < 1025 && wrapper.length) {
            var top = wrapper.offset().top;
            $(window).scroll(function () {
                if ($(this).scrollTop() > top) {
                    wrapper.addClass("toolbar-fix");
                }
                else {
                    wrapper.removeClass("toolbar-fix");
                }
            });
        } else {
            wrapper.removeClass("toolbar-fix");
        }
    }

    function beforeLoadSite() {
        var check = false;
        var url = $('#before-load-js').data('url');
        $(document).mousemove(function(){
            if (check == false) {
                var preloadedScript = document.createElement("script");
                preloadedScript.src = url;
                document.body.appendChild(preloadedScript);
                check = true;
                $('#before-load-js').remove();
            }
        });
        if ($(window).width() < 1025) {
            // window.addEventListener('load', function(){ // on page load
            //     document.body.addEventListener('touchmove', function(e){
            //         if (check == false) {
            //             var preloadedScript = document.createElement("script");
            //             preloadedScript.src = url;
            //             document.body.appendChild(preloadedScript);
            //             check = true;
            //             $('#before-load-js').remove();
            //         }
            //     }, false)
            // }, false);
            // $(document).on( "vmousemove", "body", function() {
            //     if (check == false) {
            //         var preloadedScript = document.createElement("script");
            //         preloadedScript.src = url;
            //         document.body.appendChild(preloadedScript);
            //         check = true;
            //         $('#before-load-js').remove();
            //     }
            // });
            $(document).bind('touchmove',function(e){
                if (check == false) {
                    var preloadedScript = document.createElement("script");
                    preloadedScript.src = url;
                    document.body.appendChild(preloadedScript);
                    check = true;
                    $('#before-load-js').remove();
                }
            });
        }
    }

    function init() {
        header_logo();
        header_account();
        header_carousel();
        header_navigation();
        header_navigation_toggle();
        footer_mobile();
        language_curency();
        menu_ajax();
        beforeLoadSite();
        if ($('.template-collection').length) {
            sortByProduct();
        }
    }

    return {
        init: init
    };
})();

/*================ HALO ADD ON =================*/

theme.HaloAddOn = (function() {
    function modal_open(modal, name) {
        var classes = {
            open: 'open_' + name,
            openClass: 'modal--is-active'
        };

        $(modal).fadeIn('fast');
        $(modal).addClass(classes.openClass);
        $('body').addClass(classes.open);
    }

    function modal_close(modal, name) {

        var classes = {
            open: 'open_' + name,
            openClass: 'modal--is-active'
        };

        $(modal).fadeOut('fast');
        $(modal).removeClass(classes.openClass);
        $('body').removeClass(classes.open);
    }

    return {
        init: function() {
            this.gdpr_cookie();
            this.someonePurchased();
            this.newsLetterPopup();
            this.progressBarShipping();
            this.beforeYouLeave();
            this.recentlyViewed();
            this.changeImageVariant();
        },

        gdpr_cookie: function() {
            var $gdpr = $('#gdpr'),
                $gdpr_close = $gdpr.find('.close'),
                $accept = $('[data-accept-cookie]'),
                $noexcept = $('[data-noexcept-cookie]');

            if (!$gdpr.length) {
                return;
            }

            if ($.cookie('gdprMessage') == 'closed') {
                $gdpr.remove();
            } else {
                $gdpr.removeClass('hide');
            }

            $accept.on('click', function(event) {
                event.preventDefault();
                modal_close("#gdpr-modal", 'gdpr-modal');
                $gdpr.remove();
                $.cookie('gdprMessage', 'closed', {expires: 1, path:'/'});
                // if ($('.someone-purchased-modal').length) {
                //     $('.someone-purchased-modal').css('bottom', 0);
                // }
            });
        },

        toggleSomething: function() {
            var timeText = $('.product-notification .time-text span:visible').text();
            
            if($('.product-notification').hasClass('active')){
                $('.product-notification').removeClass('active')
            }
            else {     
                var number=$('.data-product').length,
                    i = Math.floor(Math.random() * number),         
                    images = $('.product-notification .data-product:eq('+i+')').data('image'),
                    title = $('.product-notification .data-product:eq('+i+')').data('title'),
                    url = $('.product-notification .data-product:eq('+i+')').data('url'),
                    local =  $('.product-notification .data-product:eq('+i+')').data('local');

                $('.product-notification').addClass('active');
                $('.product-notification .product-image').find('img').attr('src', images );
                $('.product-notification .product-name').attr('href', url );
                $('.product-notification .product-name').text(title);
                $('.product-notification .product-image').attr('href', url );
                $('.product-notification .time-text').text(local);
            }
        },

        someonePurchased: function() {
            var $someonePurchased = $('#someone-purchased-modal'),
                $Close = $someonePurchased.find('.close');
                $product = $someonePurchased.find('.product-notification');
                $rotateSpeed = $someonePurchased.find('.product-notification').data('time');

            if(!$someonePurchased.length) {
                return;
            }

            

            if ($.cookie('someonePurchasedMessage') == 'closed') {
                $product.remove();
            }

            $Close.on('click', function(event) {
                event.preventDefault();
                $product.remove();
                $.cookie('someonePurchasedMessage', 'closed', {expires:1, path:'/'});
            });

            setTimeout(function () {
                var timer = setInterval(function() {
                    theme.HaloAddOn.toggleSomething();
                }, $rotateSpeed);
            }, $rotateSpeed);
        },

        progressBarShipping: function() {
            if ($('.cart__progress_bar.hide').length) {
                $(this).removeClass('hide');
            }
            if ($('.cart__progress_bar').length) {
                var $priceFreeShip = parseInt(theme.strings.priceFreeShipping) * 100;
                $.getJSON( window.router + '/cart.js').then(
                    function(cart) {
                        var $cartTotalPrice =  cart.total_price,
                            $differencePrice = $priceFreeShip - $cartTotalPrice,
                            $percent = Math.floor(($cartTotalPrice * 100) / $priceFreeShip);

                        if($percent > 100)
                           $percent = 100;

                        if ($percent == 100) {
                            var progress = '<div class="progress"><div class="progress-bar progress-bar-striped bg-success progress-bar-animated" role="progressbar" style="width:'+ $percent +'%" aria-valuenow="'+ $percent +'" aria-valuemin="0" aria-valuemax="100">'+$percent+'%</div></div><span class="percent">'+$percent+'%</span>';
                            $('.progress_bar_shipping').addClass('success');
                            $('.progress_bar_shipping').html(progress);
                            $('.progress_bar_shipping_message').html( theme.strings.freeShipping )
                        } else {
                            if ($percent < 50) {
                                var progress = '<div class="progress"><div class="progress-bar progress-bar-striped bg-danger progress-bar-animated" role="progressbar" style="width:'+ $percent +'%" aria-valuenow="'+ $percent +'" aria-valuemin="0" aria-valuemax="100">'+$percent+'%</div></div><span class="percent">'+$percent+'%</span>';
                            } else {
                                var progress = '<div class="progress"><div class="progress-bar progress-bar-striped bg-warning progress-bar-animated" role="progressbar" style="width:'+ $percent +'%" aria-valuenow="'+ $percent +'" aria-valuemin="0" aria-valuemax="100">'+$percent+'%</div></div><span class="percent">'+$percent+'%</span>';
                            }
                            var $price = theme.Currency.formatMoney($differencePrice, theme.moneyFormat);
                            $('.progress_bar_shipping').removeClass('success');
                            $('.progress_bar_shipping').html(progress);
                            $('.progress_bar_shipping_message').html( theme.strings.shippingMessage.replace('[price]', $price))
                        }

                        if (theme.HaloAddOn.checkNeedToConvertCurrency()) {
                            Currency.convertAll(window.shop_currency, $('#currencies .active').attr('data-currency'), 'span.money', 'money_format');
                        }
                    }
                );
                
            }
        },

        newsLetterPopup: function() {
            var $newsLetter = $('#popup_newsletter'),
                $Close = $newsLetter.find('.close'),
                $newsLetterContent = $newsLetter.find('.modal-newsletter'),
                $delay = parseInt($newsLetterContent.data('delay')),
                $expire = parseInt($newsLetterContent.data('expire'));

            if (!$newsLetter.length) {
                return;
            }

            if ($.cookie('newsLetterPopup') == 'closed') {
                // modal_close("#popup_newsletter", 'popup_newsletter');
            } else {
                setTimeout(function () {
                    modal_open("#popup_newsletter", 'popup_newsletter');
                }, $delay);
            }

            $Close.on('click', function (event) {
                event.preventDefault();
                modal_close("#popup_newsletter", 'popup_newsletter');
                var $inputChecked = $newsLetter.find('input[name="dismiss"]').prop('checked');
                if ($inputChecked || !$newsLetter.find('input[name="dismiss"]').length)
                    $.cookie('newsLetterPopup', 'closed', {expires: $expire, path: '/'});
            });

            $newsLetter.on('click', function (event) {
                if (($newsLetter.hasClass('modal--is-active')) && ($(event.target).closest($newsLetterContent).length === 0)){
                    event.preventDefault();
                    modal_close("#popup_newsletter", 'popup_newsletter');
                }
            });
        },

        editCartPopup: function() {
            
            var $editCart = '#cart-edit-modal',
                $Close = $($editCart).find('.close'),
                $editCartContent = $($editCart).find('.cart-edit-modal');

            if (!$($editCart).length) {
                return;
            }

            modal_open($editCart, 'popup_editCart');

            $Close.on('click', function (event) {
                event.preventDefault();
                modal_close($editCart, 'popup_editCart');
            });

            $($editCart).on('click', function (event) {
                if (($($editCart).hasClass('modal--is-active')) && ($(event.target).closest($editCartContent).length === 0)){
                    event.preventDefault();
                    modal_close($editCart, 'popup_editCart');
                }
            });
        },

        sizeChartPopup: function() {
            var $sizeChartModal = '#sizeChart-modal',
                $Close = $($sizeChartModal).find('.close'),
                $sizeChartModalContent = $($sizeChartModal).find('.modal-content');

            if (!$($sizeChartModal).length) {
                return;
            }

            modal_open($sizeChartModal, 'popup_sizeChart');

            $Close.on('click', function (event) {
                event.preventDefault();
                modal_close($sizeChartModal, 'popup_sizeChart');
            });

            $($sizeChartModal).on('click', function (event) {
                if (($($sizeChartModal).hasClass('modal--is-active')) && ($(event.target).closest($sizeChartModalContent).length === 0)){
                    event.preventDefault();
                    modal_close($sizeChartModal, 'popup_sizeChart');
                }
            });
        },

        productQuickviewPopup: function() {
            var $productQuickviewPopup = '#product-quickview',
                $Close = $($productQuickviewPopup).find('.close'),
                $productQuickviewPopupContent = $($productQuickviewPopup).find('.modal-content');

            if (!$($productQuickviewPopup).length) {
                return;
            }
            modal_open($productQuickviewPopup, 'popup_productQuickview');

            $Close.on('click', function (event) {
                event.preventDefault();
                modal_close($productQuickviewPopup, 'popup_productQuickview');
                $productQuickviewPopupContent.find('.modal-body').html("");
            });

            $($productQuickviewPopup).on('click', function (event) {
                if (($($productQuickviewPopup).hasClass('modal--is-active')) && ($(event.target).closest($productQuickviewPopupContent).length === 0)){
                    event.preventDefault();
                    modal_close($productQuickviewPopup, 'popup_productQuickview');
                    $productQuickviewPopupContent.find('.modal-body').html("");
                }
            });
        },

        removeProductQuickviewPopup: function() {
            var $productQuickviewPopup = '#product-quickview',
                $productQuickviewPopupContent = $($productQuickviewPopup).find('.modal-content');
            modal_close($productQuickviewPopup, 'popup_productQuickview');
            $productQuickviewPopupContent.find('.modal-body').html("");
        },

        productComparePopup: function() {
            
            var $productCompare = '#product-compare-modal',
                $Close = $($productCompare).find('.close'),
                $productCompareContent = $($productCompare).find('.modal-content');

            if (!$($productCompare).length) {
                return;
            }

            modal_open($productCompare, 'popup_productCompare');

            $Close.on('click', function (event) {
                event.preventDefault();
                modal_close($productCompare, 'popup_productCompare');
            });

            $($productCompare).on('click', function (event) {
                if (($($productCompare).hasClass('modal--is-active')) && ($(event.target).closest($productCompareContent).length === 0)){
                    event.preventDefault();
                    modal_close($productCompare, 'popup_productCompare');
                }
            });
        },

        loadingPopup: function() {
            var $loading = '#loading-modal';
            modal_open($loading, 'popup_loading');
        },

        removeLoadingPopup: function() {
            var $loading = '#loading-modal';
            modal_close($loading, 'popup_loading');
        },

        beforeYouLeave: function() {
            var $beforeYouLeave = '#before-you-leave',
                $beforeYouLeave_close = $($beforeYouLeave).find('.close'),
                $beforeYouLeave_close2 = $($beforeYouLeave).find('.before-you-leave__bg .btn'),
                $beforeYouLeave_search = $($beforeYouLeave).find('.search'),
                $beforeYouLeave_time = $($beforeYouLeave).find('.before-you-leave__wrapper').data('time');

            if (!$($beforeYouLeave).length) {
                return;
            }

            var idleTime = 0;

            $(document).ready(function () {
                var idleInterval = setInterval(timerIncrement, $beforeYouLeave_time);
            });

            $(document)
            .on('mousemove', resetTimer)
            .on('keydown', resetTimer)
            .on('scroll', resetTimer);

            function timerIncrement() {
                idleTime = idleTime + 1;
                if (idleTime >= 1 && !$('body.open_beforeYouLeave').length ) {
                    $('body').addClass('open_beforeYouLeave');
                }
                $(window).unbind('click');
            }

            function resetTimer() {
                idleTime = 0;
            }

            $beforeYouLeave_close2.on('click', function(event) {
                event.preventDefault();
                $('body').removeClass('open_beforeYouLeave');
            });

            $(document).on('click', function(event) {
                if ($('body').hasClass('open_beforeYouLeave') && ($(event.target).closest($beforeYouLeave).length === 0)  && ($(event.target).closest('.search-form-wrapper').length === 0) ) {
                    $('body').removeClass('open_beforeYouLeave');
                }
            });
        },

        backToTop: function() {
            $('body,html').animate({
                scrollTop: 0
            }, 1500);
        },

        recentlyViewed: function() {
            if (!$('.lst-seen-widget').length) 
                return;

            var $lst_seen_widget = $(".lst-seen-widget"),
                $wrap_icons = $(".wrap-icons");


            if ($(window).width() < 768) {
                $lst_seen_widget.removeClass("is-show-widget");
                $wrap_icons.addClass("collapsed");
            } else {
                $lst_seen_widget.addClass("is-show-widget");
                $wrap_icons.removeClass("collapsed");
            }

            $(document).on("click",".lst-seen-widget .collapse-icon", function(){
                $lst_seen_widget.removeClass("is-show-widget");
                $wrap_icons.addClass("collapsed");
            });

            $(document).on("click",".wrap-icons .expand", function(){
                $lst_seen_widget.addClass("is-show-widget");
                $wrap_icons.removeClass("collapsed");
            });

            $(window).scroll(function() {
                if ($(this).scrollTop() > 200) {
                    $('#back-top').fadeIn();
                } else {
                    $('#back-top').fadeOut();
                }
            });

            $(document).on("click", ".backtoTop", function() {
                theme.HaloAddOn.backToTop();
            });

            $('#recently-viewed-products-list').on('mouseenter', '.slick-slide', function (e) {
                e.preventDefault();
                var $currTarget = $(e.currentTarget), 
                index = $currTarget.index('#recently-viewed-products-list .slick-active'),
                margin_top = index * $('#recently-viewed-products-list .product-info').outerHeight();
                
                $("#recently-viewed-products-list .product-info").html( $(this).find(".second-info").html() ).css("margin-top",margin_top).show();
            });

            $('#recently-viewed-products-list').on('mouseenter', '.slick-arrow', function (e) {
                $("#recently-viewed-products-list .product-info").hide();
            });
        },

        changeImageVariant: function() {
            if (!$('.product-card__variant').length) {
                return;
            }

            $(document).on('click', '.product-card__variant .product-card__variant--item label', function() {
                var self = $(this),
                    $product = self.parents('.product-card'),
                    $variantImage = self.data('image');

                $product.find('.product-card__variant--item label').removeClass('active');
                self.addClass('active');

                $product.find('.product-card__link').removeClass('product-card__switchImage');
                if ($variantImage != '') {
                    $product.find('.product-card__img').attr('srcset', $variantImage );
                }
            });
        },

        checkNeedToConvertCurrency: function () {
            return (window.show_multiple_currencies && Currency.currentCurrency != shopCurrency) || window.show_auto_currency;
        }
    }
})();

$(document).ready(function() {
    var sections = new theme.Sections();

    sections.register('header', theme.HeaderSection);
    sections.register('footer', theme.FooterSection);
    
    theme.HaloAddOn.init();
    
    theme.HeaderFooter_mobile.init();

    $(window).resize(function() {
        theme.HeaderFooter_mobile.init();
    });
});

theme.init = function() {
    // theme.customerTemplates.init();

    // Theme-specific selectors to make tables scrollable
    var tableSelectors = '.rte table,' + '.custom__item-inner--html table';

    slate.rte.wrapTable({
        $tables: $(tableSelectors),
        tableWrapperClass: 'scrollable-wrapper'
    });

    // Common a11y fixes
    slate.a11y.pageLinkFocus($(window.location.hash));

    $('.in-page-link').on('click', function(evt) {
        slate.a11y.pageLinkFocus($(evt.currentTarget.hash));
    });

    $('a[href="#"]').on('click', function(evt) {
        evt.preventDefault();
    });

    slate.a11y.accessibleLinks({
        messages: {
            newWindow: theme.strings.newWindow,
            external: theme.strings.external,
            newWindowExternal: theme.strings.newWindowExternal
        },
        $links: $('a[href]:not([aria-describedby], .product-single__thumbnail)')
    });

    // theme.FormStatus.init();

    var selectors = {
        image: '[data-image]',
        imagePlaceholder: '[data-image-placeholder]',
        imageWithPlaceholderWrapper: '[data-image-with-placeholder-wrapper]',
        lazyloaded: '.lazyloaded'
    };

    var classes = {
        hidden: 'hide'
    };

    $(document).on('lazyloaded', function(e) {
        var $target = $(e.target);

        if ($target.data('bgset')) {
            var $image = $target.find(selectors.lazyloaded);
            if ($image) {
                if ($target.data('bg')) {
                    $image.attr('src', $target.data('bg'));
                }
                if ($target.data('alt')) {
                    $image.attr('alt', $target.data('alt'));
                }
            }
        }

        if (!$target.is(selectors.image)) {
            return;
        }

        $target
            .closest(selectors.imageWithPlaceholderWrapper)
            .find(selectors.imagePlaceholder)
            .addClass(classes.hidden);
    });

    // When the theme loads, lazysizes might load images before the "lazyloaded"
    // event listener has been attached. When this happens, the following function
    // hides the loading placeholders.
    function onLoadHideLazysizesAnimation() {
        $(selectors.image + '.lazyloaded')
            .closest(selectors.imageWithPlaceholderWrapper)
            .find(selectors.imagePlaceholder)
            .addClass(classes.hidden);
    }

    onLoadHideLazysizesAnimation();

    // Do the injection svg
    var mySVGsToInject = document.querySelectorAll('svg[data-src]');

    SVGInjector(mySVGsToInject);

};

$(theme.init);
