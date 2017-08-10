(function () {
    'use strict';
    var website = openerp.website,
        qweb = openerp.qweb;
    // var address = $('#map_canvas p').text();
    // $.ajax({
    //     type: "GET",
    //     dataType: "json",
    //     url: "http://maps.googleapis.com/maps/api/geocode/json",
    //     data: {'address': address,'sensor':false},
    //     success: function(data){
    //         if(data.results.length){
    //             var latitude = data.results[0].geometry.location.lat;
    //             var longitude = data.results[0].geometry.location.lng;
    //             $('#map_canvas').mapit({'latitude': latitude, 'longitude': longitude, 'marker': {
    //                 'latitude': latitude,
    //                 'longitude': longitude,
    //                 'title': address,
    //                 'open': false,
    //                 'center': true
    //             }});
    //         }
    //     }
    // });
    $(window).bind('scroll', function () {
        var topbar_el = $('.navbar-static-top');
        var scrollTop = $(window).scrollTop();
        var top_height = $('.master_background:first').position().top + $('.master_background:first').height();
        if (!topbar_el.hasClass('fixed') && scrollTop > top_height){
            topbar_el.addClass('fixed');
            topbar_el.css({
                top: '-100px',
            }).animate({ 
                top: '0',
                }, 500, function() {    
            });
            $('.navbar-brand.logo img').addClass('clone_img');
            $('#top_menu li').addClass('clone_font');
            $('#top_menu').addClass('oe_cu_nev_back');
            $('#top_menu').css('margin-right', '0px');            
            $('.navbar .container').css('margin', '0px 0px 0px 78px');
            $('ul.dropdown-menu').css('background-color', '#eaeaea');
            $('ul.dropdown-menu li.clone_font').addClass('fixed-menu');

        } else {
            if(topbar_el.hasClass('fixed') && scrollTop < top_height){
                topbar_el.removeClass('fixed').css('top','0px');
                $('#top_menu').removeClass('oe_cu_nev_back');
                $('#top_menu').css('margin-right', '10px');
                $('.navbar-brand.logo img').removeClass('clone_img');
                $('#top_menu li').removeClass('clone_font');
                $('.navbar .container').css('margin', '25px 0px 0px 78px');
                $('ul.dropdown-menu').css('background-color', '#FFF');
                $('ul.dropdown-menu li.clone_font').removeClass('fixed-menu');
            }
        }
    });
	$('a.add-tab').parent().hide();
    $('a.add-tab-2').parent().parent().hide();
	$('.st-tabs li.active, .st-tabs .tab-pane.active').removeClass('active');
	_.each($('.st-tabs'), function(tab_el){$(tab_el).children().find('li:first, .tab-pane:first').addClass('active')});
	$('.st-tabs-2 .panel-heading a').click(function(){
        if (!$(this).parents().eq(2).children('.panel-collapse').hasClass('in')){
            $(this).closest('.st-tabs-2').find('.panel-collapse.in').removeClass('in');
            $(this).parent().children('.panel-collapse:first').addClass('in');
        }
        else{
            $(this).parent().children('.panel-collapse:first').removeClass('in');
        }           
	});
    _.each($('a#video_link'), function(video_el){$(video_el).attr('href', '#video_modal')});
    $("#video_modal").on('hide.bs.modal', function(){
        $("#inlineVideo").attr('src', '');
    });
    $("#video_modal").on('show.bs.modal', function(e){
       $("#inlineVideo").attr('src', $('#video_link')[0].attributes['data-url'].value);
    });
	$('.post').addClass("hidebefore").viewportChecker();
	$('.post-start').viewportChecker({
		callbackFunction: function(elem, action){
			setTimeout(function(){
				var odometer_el = $(elem).find('.odometer')
		    	odometer_el.html(odometer_el.attr('stop-counter'));
			}, 1000);
		}
	});
    $(".fader").click(function(){
        var st_gallery = $(this).parent().parent();
        st_gallery.gallerie();
        if ($('.gallerie-overlay').length > 1){
            $('.gallerie-overlay').css({'z-index': -10, 'top': '-1000px'});
            st_gallery.find('.gallerie-overlay').css({'z-index': 10, 'top': '0px'});
        }
    });
    $('.gallery .fader img').attr('style', '');
})();

$(document).ready(function() {
   $('#map_canvas').mapit();
    $('#accordion').collapse({hide: true});
});

document.write('<scr'+'ipt type="text/javascript" src="https://maps.googleapis.com/maps/api/js?sensor=false" ></scr'+'ipt>');

;(function($, window, undefined) {
    "use strict";
    $.fn.mapit = function(options) {
        var defaults = {
            latitude:    23.023369,
            longitude:   72.557293,
            zoom:            16,
            type:            'ROADMAP',
            marker: {
                latitude:   23.023369,
                longitude:  72.557293,
                icon:           'img/map/marker_red.png',
                title:          'The Company',
                open:           false,
                center:         true
            },
            styles: 'GRAYSCALE',
            origins: [
                ['37.936294', '23.947394'],
                ['37.975669', '23.733868']
            ]
        };
        var address = $('#map_canvas p').text();        
        var options = $.extend(defaults, options);
        var Geocoder = new google.maps.Geocoder();
        if (!options.latitude && !options.longitude) {
            Geocoder.geocode({'address': address}, function(results, status) {
                if (status === google.maps.GeocoderStatus.OK) {
                   var location = results[0].geometry.location;
                   google.maps.event.addListener(marker, 'click', onMarkerClick);
                   markers.push(marker);
               } else {
                   console.debug('Geocode was not successful for the following reason: ' + status);
               }
           });
        }

        $(this).each(function() {
            var $this = $(this);
            var directionsDisplay = new google.maps.DirectionsRenderer();
            var mapOptions = {
                scrollwheel: false,
                scaleControl: false,
                center: options.marker.center ? new google.maps.LatLng(options.marker.latitude, options.marker.longitude) : new google.maps.LatLng(options.latitude, options.longitude),
                zoom: options.zoom,
                mapTypeId: eval('google.maps.MapTypeId.' + options.type)
            };
            var map = new google.maps.Map(document.getElementById($this.attr('id')), mapOptions);
            directionsDisplay.setMap(map);

            $this.on ('route', function(event, origin) {
                var request = {
                    origin: new google.maps.LatLng(options.origins[origin][0], options.origins[origin][1]),
                    destination: new google.maps.LatLng(options.marker.latitude, options.marker.longitude),
                    travelMode: google.maps.TravelMode.DRIVING
                };
                
            });

            $this.on ('reset', function() {
                map.setCenter(new google.maps.LatLng(options.latitude, options.longitude), options.zoom);
            });             

        });
    };

    $(document).ready(function () { $('[data-toggle="mapit"]').mapit(); });

})(jQuery);
