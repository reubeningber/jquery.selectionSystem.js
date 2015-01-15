/**
* @author Reuben Ingber 
*/

 ;(function($) {

    'use strict';

    var pluginName = 'selectionSystem', 
        namespace = 'plugin_' + pluginName;

        /*-------------------------------------------- */
        /** Plugin Defaults */
        /*-------------------------------------------- */
        
        var defaults = {
            /**
            * The selected container class 
            */
            selectedClass: 'is-selected',
            /**
            * The not-selected container class 
            */
            notSelectedClass: 'not-selected',
            /**
            * The select button class 
            */
            selectButton: 'select-btn',
            /**
            * The deselect button class 
            */
            deselectButton: 'deselect-btn', 
            /**
            * Selected Callback 
            */
            onSelected: $.noop,
            /**
            * Deselected Callback 
            */
            onDeselected: $.noop
        };

        /*-------------------------------------------- */
        /** Plugin Constructor */
        /*-------------------------------------------- */
        
        /**
        * The Plugin constructor
        * @constructor
        * @param {HTMLElement} element The element that will be monitored
        * @param {object} options The plugin options
        */

        function Plugin(el, options) {
            this.options = $.extend({}, defaults, options);

            this.el = el;
            this.$el = $(el);
            this.$selectButton = this.$el.find(this.options.selectButton);
            this.$deselectButton = this.$el.find(this.options.deselectButton);

            this.isSelected = false;

            this.$el.addClass(this.options.notSelectedClass);

            this._addListeners(); 
        }

        $.extend(Plugin.prototype, {
            _addListeners: function() {
                var self = this; 

                this.$selectButton.on('click', function(e) {
                    e.preventDefault();
                    self._select();
                });

                this.$deselectButton.on('click', function(e) {
                    e.preventDefault();
                    self._deselect();
                });
            },

            _select: function() {

                if (this.isSelected) return;

                if (Plugin.selectedItem) {
                    Plugin.selectedItem._deselect();
                }

                Plugin.selectedItem = this;  

                this.$el.addClass(this.options.selectedClass);
                this.$el.removeClass(this.options.notSelectedClass);

                this.isSelected = true;

                this.options.onSelected(this.el);

                this.$el.trigger('selectionSystem.selected');
            },

            _deselect: function() {

                if (!this.isSelected) return;

                this.$el.removeClass(this.options.selectedClass);
                this.$el.addClass(this.options.notSelectedClass);
                
                this.isSelected = false; 

                this.options.onDeselected(this.el);

                this.$el.trigger('selectionSystem.deselected');
            }
        });  

        /*-------------------------------------------- */
        /** Plugin Definitions */
        /*-------------------------------------------- */

        $.fn[pluginName] = function(options) {
            return this.each(function() {

                var plugin = $.data(this, namespace);

                if (!plugin) {
                    $.data(this, namespace, new Plugin(this, options));
                }
            });
        };
})(jQuery);