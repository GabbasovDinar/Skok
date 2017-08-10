(function () {
    'use strict';
    var website = openerp.website,
        qweb = openerp.qweb;
    qweb.add_template('/sync_uppercrust_theme/static/src/xml/templates.xml');
    website.editor.LinkDialog.include({
        start: function () {
            this._super();
            if(this.element.$['id'] == "video_link"){
                this.$el.find('.modal-title').text('Video');
                this.$el.find("label[for='link-external']").text('Youtube URL');
                this.$el.find("label[for='link-page']").parent().parent().hide();
                this.$el.find("label[for='link-text']").parent().parent().hide();
                this.$el.find("input.window-new").parent().hide();
                this.$el.find(".link-style").hide();
            }
            this.$el.find('form > div.form-horizontal.link-style:first ul.dropdown-menu:first').append(qweb.render("website.editor.dialog.link.st_primary", {}))
        }
    });

    function is_editing_host(element) {
        return element.getAttribute('contentEditable') === 'true';
    }

    function is_editable_node(element) {
        return !(element.data('oe-model') === 'ir.ui.view'
              || element.data('cke-realelement')
              || (is_editing_host(element) && element.getAttribute('attributeEditable') !== 'true')
              || element.isReadOnly());
    }

    website.snippet.options.carousel.include({
        start : function () {
            var self = this;
            this._super();   
            if (this.$target.hasClass('carousel_testimonial')){
                this.$el.find(".js_add").text('Add Testimonial');
                this.$el.find(".js_remove").text('Remove Testimonial');
            }
        },
        on_add_slide: function () {
            var self = this;
            var cycle = this.$inner.find('.item').length;
            var $active = this.$inner.find('.item.active, .item.prev, .item.next').first();
            var index = $active.index();
            this.$target.find('.carousel-control, .carousel-indicators').removeClass("hidden");
            this.$indicators.append('<li data-target="#' + this.id + '" data-slide-to="' + cycle + '"></li>');

            var $snippets = false;
            if (this.$target.hasClass('carousel_testimonial')){
                var $snippets = this.BuildingBlock.$snippets.find('.oe_snippet_body.carousel_testimonial');
            }else{
                var $snippets = this.BuildingBlock.$snippets.find('.oe_snippet_body.carousel');
            }   
            var point = 0;
            var selection;
            var className = _.compact(this.$target.attr("class").split(" "));
            $snippets.each(function () {
                var len = _.intersection(_.compact(this.className.split(" ")), className).length;
                if (len > point) {
                    point = len;
                    selection = this;
                }
            });
            var $clone = $(selection).find('.item:first').clone();
            $clone.removeClass('active').insertAfter($active);
            setTimeout(function() {
                self.$target.carousel().carousel(++index);
                self.rebind_event();
            },0);

            var bg = this.$target.data("snippet-option-ids").background;
            if (!bg) return $clone;

            var $styles = bg.$el.find("li[data-value]:not(.oe_custom_bg)");
            var styles_index = $styles.index($styles.filter(".active")[0]);
            $styles.removeClass("active");
            var $select = $($styles[styles_index >= $styles.length-1 ? 0 : styles_index]);
            $select.addClass("active");
            $clone.css("background-image", $select.data("src") ? "url('"+ $select.data("src") +"')" : "");
            $clone.addClass($select.data("value") || "");
            return $clone;
        }
    });
    
    website.editor.ImageDialog.include({
        start: function () {
            var self = this;
            var res = this._super();
            $(self.media.$).hasClass('magniflier') ? self.$el.find('.well').before('<p class="text-center text-danger">Magnify effect best viewed with image resolution 2200 x 1100 pixels.</p>') : false;
            return res;
        }
    });
    website.editor.ProgressbarDialog = website.editor.Dialog.extend({
        template: 'website.editor.dialog.progressbar',
        start: function () {
            var self = this;
            this._super()
            var res = self.get_data($(this.editor).find('div.progress-bar'));
            this.$el.find('input#pbar-color')[0].value = res['bg_color'];
            this.$el.find('input#pbar-perc')[0].value = res['perc_val'];
            this.$el.find('input#pbar-time')[0].value = res['pbar-time'];
        },
        save: function () {
            var self = this;
            var colorval = this.$el.find('input#pbar-color')[0].value;
            var percval = this.$el.find('input#pbar-perc')[0].value;
            var timeval = this.$el.find('input#pbar-time')[0].value;
            var pbar_el = $(this.editor).find('div.progress-bar');
            pbar_el.removeClass (function(index, css){ return (css.match (/\bbar-\S+/g) || []).join(' ') });
            pbar_el.attr({'data-pro-bar-percent': percval, 'data-pro-bar-delay': timeval, 'title': percval + "%"}).css({'background-color': colorval}).addClass('bar-' + percval);
            this.$el.modal('hide');
        },
        get_data: function(pbar){
            var result = {};
            result['perc_val'] = pbar.attr('data-pro-bar-percent');
            result['bg_color'] = pbar.css('background-color');
            result['pbar-time'] = pbar.attr('data-pro-bar-delay');
            return result;
        }
    });
    website.editor.CounterDialog = website.editor.Dialog.extend({
        template: 'website.editor.dialog.counter',
        start: function () {
            var self = this;
            this._super()
            var res = self.get_data($(this.editor));
            this.$el.find('input#stop-counter')[0].value = res['stop_counter'];
        },
        save: function () {
            var self = this;
            $(this.editor).attr({'stop-counter': this.$el.find('input#stop-counter')[0].value});
            this.$el.modal('hide');
        },
        get_data: function(counter){
            var result = {};
            result['stop_counter'] = counter.attr('stop-counter');
            return result;
        }
    });
    website.editor.RTEImageDialog.include({
        saved: function (data) {
            var self = this;
            this._super(data)
            var element = this.editor.element;
            if (element.getAttribute('data-toggle') == 'gallery') {
                element.setAttribute('style', '');
                var st_gallery = element.getParent().getParent();
                _.each(st_gallery.find('a').$, function(anchor){
                    $(anchor).attr('data-cke-saved-href', element.$.src);
                });
                _.each(st_gallery.find('img').$, function(img){
                    $(img).attr('data-cke-saved-src', element.$.src);
                });
            }
        }
    });
    website.EditorBar.include({
        make_hover_hr_style: function (editfn, stylefn) {
            var $div = $(openerp.qweb.render('website.editor.hoverhr.style', {}))
                .hide()
                .appendTo(document.body);
            $div.find('[data-toggle="dropdown"]').dropdown();
            $div.find('.dropdown-menu li.align ul li').click(function (e) {
                e.preventDefault();
                e.stopPropagation();
                return editfn.call(this, e);
            });
            $div.find('.dropdown-menu li.color ul li').click(function (e) {
                e.preventDefault();
                e.stopPropagation();
                return editfn.call(this, e);
            });
            return $div;
        },
        make_hover_progressbar_style: function (editfn, stylefn) {
            var self = this;
            var $div = $(openerp.qweb.render('website.editor.link.progressbar', {})).hide().appendTo(document.body);
            return $div;
        },
        make_hover_counter_style: function (editfn, stylefn) {
            var self = this;
            var $div = $(openerp.qweb.render('website.editor.link.counter', {})).hide().appendTo(document.body);
            return $div;
        },
        make_hover_tab_style: function (editfn, stylefn) {
            var self = this;
            $('a.add-tab').parent().show();
            var $div = $(openerp.qweb.render('website.editor.tab.manage', {})).hide().appendTo(document.body);
            return $div;
        },
        make_hover_tab_style2: function (editfn, stylefn) {
            var self = this;
            $('a.add-tab-2').parent().parent().show();
            var $div = $(openerp.qweb.render('website.editor.tab.manage', {})).hide().appendTo(document.body);
            return $div;
        },
        make_hover_gallery_style: function (editfn, stylefn) {
            var self = this;
            var $div = $(openerp.qweb.render('website.editor.gallery.style', {})).hide().appendTo(document.body);
            return $div;
        },
        setup_hover_buttons: function () {
            this._super();
            var editor = this.rte.editor;
            function is_icons_widget(element) {
                var w = editor.widgets.getByElement(element);
                return w && w.name === 'icons';
            }
            _.each($('.progress-bar'), function(pbar){$(pbar).removeClass(function(index, css){return(css.match(/(animated{0,8})/g) || []).join(' ')})});
            _.each($('.post.hidebefore'), function(animate_post){$(animate_post).removeClass('hidebefore')});
            var $hr_style = this.make_hover_hr_style(function () {
                var sel = new CKEDITOR.dom.element(previous_hr);
                if($(this).parent().parent().hasClass('align')){
                    sel.setAttribute("align", $(this).attr('data-value').split('-')[1]);
                    var previous_color = '';
                    if(sel.getAttribute('class')){
                        $.each(sel.getAttribute('class').split(/\s+/), function(i, name) {
                            if (name.indexOf('color') > -1) {
                                previous_color = name;
                                return false;
                            }
                        });
                    }
                    if(previous_color){
                        sel.setAttribute("class", $(this).attr('data-value'));
                        sel.addClass(previous_color);
                    }else{
                        sel.setAttribute("class", $(this).attr('data-value'));    
                    }
                }
                if($(this).parent().parent().hasClass('color')){
                    var previous_align = '';
                    if(sel.getAttribute('class')){
                        $.each(sel.getAttribute('class').split(/\s+/), function(i, name) {
                            if (name.indexOf('align') > -1) {
                                previous_align = name;
                                return false;
                            }
                        });
                    }
                    if(previous_align){
                        sel.setAttribute("class", $(this).attr('data-value'));
                        sel.addClass(previous_align);
                    }else{
                        sel.setAttribute("class", $(this).attr('data-value'));
                    }
                }
                $hr_style.hide();
                previous_hr = null;
            });
            var previous_hr;
            $(editor.element.$).on('mouseover', 'hr', function () {
                if (previous_hr && previous_hr === this) { return; }
                var selected = new CKEDITOR.dom.element(this);
                if (!(is_editable_node(selected) || is_icons_widget(selected))) {
                    return;
                }
                previous_hr = this;
                var $selected = $(this);
                var position = $selected.offset();
                $hr_style.show().offset({
                    top: $selected.outerHeight()
                            + position.top,
                    left: $selected.outerWidth() / 2
                            + position.left
                            - $hr_style.outerWidth() / 2
                })
            }).on('mouseleave', 'hr', function (e) {
                var current = document.elementFromPoint(e.clientX, e.clientY);
                if (current === $hr_style[0] || $(current).parent()[0] === $hr_style[0]) {
                    return;
                }
                $hr_style.hide();
                previous_hr = null;
            });

            var $pbar_style = this.make_hover_progressbar_style(function () {
                var sel = new CKEDITOR.dom.element(previous_pbar);
                $pbar_style.hide();
                previous_pbar = null;
            });
            var previous_pbar;
            $(editor.element.$).on('mouseover', '.st-progressbar', function () {
                if (previous_pbar && previous_pbar === this) { return; }
                var selected = new CKEDITOR.dom.element(this);
                if (!(is_editable_node(selected) || is_icons_widget(selected))) {
                    return;
                }
                previous_pbar = this;
                var $selected = $(this);
                var position = $selected.offset();
                $pbar_style.show().offset({
                    top: $selected.outerHeight()
                            + position.top,
                    left: $selected.outerWidth() / 2
                            + position.left
                            - $pbar_style.outerWidth() / 2
                })
                $pbar_style.find('a#customize_pbar').unbind('click').click(function(){
                    return new website.editor.ProgressbarDialog(previous_pbar).appendTo(document.body);
                });
            }).on('mouseleave', '.st-progressbar', function (e) {
                var current = document.elementFromPoint(e.clientX, e.clientY);
                if (current === $pbar_style[0] || $(current).parent()[0] === $pbar_style[0]) {
                    return;
                }
                $pbar_style.hide();
                previous_pbar = null;
            });

            var $counter_style = this.make_hover_counter_style(function () {
                var sel = new CKEDITOR.dom.element(previous_counter);
                $counter_style.hide();
                previous_counter = null;
            });
            var previous_counter;
            $(editor.element.$).on('mouseover', '#odometer', function () {
                if (previous_counter && previous_counter === this) { return; }
                var selected = new CKEDITOR.dom.element(this);
                if (!(is_editable_node(selected) || is_icons_widget(selected))) {
                    return;
                }
                previous_counter = this;
                var $selected = $(this);
                var position = $selected.offset();
                $counter_style.show().offset({
                    top: $selected.outerHeight()
                            + position.top,
                    left: $selected.outerWidth() / 2
                            + position.left
                            - $pbar_style.outerWidth() / 2
                })
                $counter_style.find('a#customize_counter').unbind('click').click(function(){
                    return new website.editor.CounterDialog(previous_counter).appendTo(document.body);
                });
            }).on('mouseleave', '#odometer', function (e) {
                var current = document.elementFromPoint(e.clientX, e.clientY);
                if (current === $counter_style[0] || $(current).parent()[0] === $counter_style[0]) {
                    return;
                }
                $counter_style.hide();
                previous_counter = null;
            });

            var $tab_style = this.make_hover_tab_style(function () {
                var sel = new CKEDITOR.dom.element(previous_tab);
                $tab_style.hide();
                previous_tab = null;
            });
            var previous_tab;
            $(editor.element.$).on('mouseover', ".st-tabs a[data-toggle*='tab']", function () {
                if (previous_tab && previous_tab === this) { return; }
                var selected = new CKEDITOR.dom.element(this);
                if (!(is_editable_node(selected) || is_icons_widget(selected))) {
                    return;
                }
                previous_tab = this;
                var $selected = $(this);
                var position = $selected.offset();
                $tab_style.show().offset({
                    top: $selected.outerHeight()
                            + position.top,
                    left: $selected.outerWidth() / 2
                            + position.left
                            - $tab_style.outerWidth() / 2
                })
                if ($selected.hasClass('add-tab')){
                    $tab_style.children('button#tab_add').removeClass('hidden');
                    $tab_style.children('button#tab_remove').addClass('hidden');
                }else{
                    $tab_style.children('button#tab_add').addClass('hidden');
                    $tab_style.children('button#tab_remove').removeClass('hidden');
                }
                $(previous_tab).parent().click(function(){
                    if ($(this).hasClass('active')){
                        var tabs = $(this).parent().parent();
                        tabs.find('div.tab-content > div.tab-pane.active').removeClass('active');
                        tabs.find('div.tab-content > div.tab-pane#' + $(this).children('a')[0].hash.split('#')[1]).addClass('active');
                    }
                });
                $tab_style.find('button').unbind('click').click(function(){
                    if($(this).attr('data-toggle') == 'add'){
                        var lists = $(previous_tab).parent().parent().children();
                        var tab_content = $(previous_tab).parents().eq(2).children('div.tab-content');
                        var tab_id = new Date().valueOf();
                        $(lists).last('li').before('<li><a data-toggle="tab" href="#tab_'+tab_id+'">New Tab</a></li>');         
                        $(tab_content).append('<div role="tabpanel" class="tab-pane" id="tab_'+tab_id+'"><p>Tab : Body </p></div>');
                    }else{
                        $($(previous_tab).attr('href')).remove();
                        $(previous_tab).parent().remove();
                        $(previous_tab).parents().eq(1).children('a').first().click();
                    }
                });
            }).on('mouseleave', ".st-tabs a[data-toggle*='tab']", function (e) {
                var current = document.elementFromPoint(e.clientX, e.clientY);
                if (current === $tab_style[0] || $(current).parent()[0] === $tab_style[0]) {
                    return;
                }
                $tab_style.hide();
                previous_tab = null;
            });

            var $tab_style2 = this.make_hover_tab_style2(function () {
                var sel = new CKEDITOR.dom.element(previous_tab2);
                $tab_style2.hide();
                previous_tab2 = null;
            });
            var previous_tab2;
            $(editor.element.$).on('click', ".st-tabs-2 a[data-toggle*='collapse']", function () {
                if (!$(this).parents().eq(2).children('.panel-collapse').hasClass('in')){
                    $(this).closest('.st-tabs-2').find('.panel-collapse.in').removeClass('in');
                    $(this).parents().eq(1).children('.panel-collapse').addClass('in');
                }
                else{
                    $(this).parents().eq(1).children('.panel-collapse').removeClass('in');
                }

            });

            $(editor.element.$).on('mouseover', ".st-tabs-2 a[data-toggle*='collapse']", function () {
                if (previous_tab2 && previous_tab2 === this) { return; }
                var selected = new CKEDITOR.dom.element(this);
                if (!(is_editable_node(selected) || is_icons_widget(selected))) {
                    return;
                }
                previous_tab2 = this;
                var $selected = $(this);
                var position = $selected.offset();
                $tab_style2.show().offset({
                    top: $selected.outerHeight()
                            + position.top,
                    left: $selected.outerWidth() / 2
                            + position.left
                            - $tab_style2.outerWidth() / 2
                })
                if ($selected.hasClass('add-tab-2')){
                    $tab_style2.children('button#tab_add').removeClass('hidden');
                    $tab_style2.children('button#tab_remove').addClass('hidden');
                }else{
                    $tab_style2.children('button#tab_add').addClass('hidden');
                    $tab_style2.children('button#tab_remove').removeClass('hidden');
                }
                $tab_style2.find('button').unbind('click').click(function(){
                    if($(this).attr('data-toggle') == 'add'){
                        var lists = $(previous_tab2).parent().parent().parent().children();
                        var tab_id = new Date().valueOf();
                        var options = {'action_href': '#collapse'+tab_id, 'action_id': 'collapse'+tab_id }
                        $(lists).last('div.panel.panel-default').before($(openerp.qweb.render('website.editor.tab.style2', {widget: options})));
                    }else{
                        $($(previous_tab2).attr('href')).remove();
                        $(previous_tab2).parents().eq(2).remove();
                    }
                });
            }).on('mouseleave', ".st-tabs-2 a[data-toggle*='collapse']", function (e) {
                var current = document.elementFromPoint(e.clientX, e.clientY);
                if (current === $tab_style2[0] || $(current).parent()[0] === $tab_style2[0]) {
                    return;
                }
                $tab_style2.hide();
                previous_tab2 = null;
            });

            var $gallery_style = this.make_hover_gallery_style(function () {
                var sel = new CKEDITOR.dom.element(previous_gallery);
                $gallery_style.hide();
                previous_gallery = null;
            });
            var previous_gallery;
            $(editor.element.$).on('mouseover', ".gallery", function () {
                if (previous_gallery && previous_gallery === this) { return; }
                var selected = new CKEDITOR.dom.element(this);
                if (!(is_editable_node(selected) || is_icons_widget(selected))) {
                    return;
                }
                previous_gallery = this;
                var $selected = $(this);
                var position = $selected.offset();
                $gallery_style.show().offset({
                    top: $selected.outerHeight()
                            + position.top,
                    left: $selected.outerWidth() / 2
                            + position.left
                            - $tab_style2.outerWidth() / 2
                })
                $gallery_style.unbind('click').click(function(){
                    $(previous_gallery).append($(openerp.qweb.render('website.editor.gallery.image', {})));
                });
            }).on('mouseleave', ".st-tabs-2 a[data-toggle*='collapse']", function (e) {
                var current = document.elementFromPoint(e.clientX, e.clientY);
                if (current === $tab_style2[0] || $(current).parent()[0] === $tab_style2[0]) {
                    return;
                }
                $gallery_style.hide();
                previous_gallery = null;
            });
        }
    });
    website.snippet.animationRegistry.video = website.snippet.Animation.extend({
        selector: ".st-video",
        start: function () {
            var self = this;
            var anchor_el = this.$el.find('a#video_link');
            if($('.js_editor_placeholder:visible').length > 0){
                anchor_el.attr('href', anchor_el.attr('data-url'));
                anchor_el.attr('data-cke-saved-href', anchor_el.attr('data-url'));
                this.$el.find('.video_container a').addClass('hideme');
            }else{
                if (anchor_el.length > 0 && self.check_str(anchor_el.attr('href'))){
                    var youtube_parser = self.youtube_parser(anchor_el.attr('href'));
                    anchor_el.attr('data-url', 'https://www.youtube.com/v/' + self.youtube_parser(anchor_el.attr('href')));
                    anchor_el.attr('href', '#video_modal');
                    anchor_el.attr('data-cke-saved-href', '#video_modal');
                }
                this.$el.find('.video_container a').removeClass('hideme');
            }
        },
        check_str: function(str) {
            var regexp = /(ftp|http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?/;
               return regexp.test(str);
        },
        youtube_parser: function(url) {
            var regExp = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#\&\?]*).*/;
            var match = url.match(regExp); 
            return (match&&match[7].length==11)? match[7] : false; 
        }
    });
})();

