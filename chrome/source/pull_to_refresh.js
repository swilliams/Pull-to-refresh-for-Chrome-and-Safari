(function(){
 
    var special = jQuery.event.special,
        uid1 = 'D' + (+new Date()),
        uid2 = 'D' + (+new Date() + 1);
 
    special.scrollstop = {
        latency: 300,
        setup: function() {
 
            var timer,
                    handler = function(evt) {
 
                    var _self = this,
                        _args = arguments;
 
                    if (timer) {
                        clearTimeout(timer);
                    }
 
                    timer = setTimeout( function(){
 
                        timer = null;
                        evt.type = 'scrollstop';
                        jQuery.event.handle.apply(_self, _args);
 
                    }, special.scrollstop.latency);
 
                };
 
            jQuery(this).bind('scroll', handler).data(uid2, handler);
 
        },
        teardown: function() {
            jQuery(this).unbind( 'scroll', jQuery(this).data(uid2) );
        }
    };
 
})();


var pully = {
	
	position: null,
	refreshPossible: false,
	scrollTopBoundary: 0.05,
	withinTopBoundary: false,
	origStartingPosition: null,
	
	init: function() {
		var current_url = document.URL;
		if( current_url.search( 'twitter.com' ) == -1 )
		{
			// Inject the div
			$('body').prepend('<div id="pullToRefresh"><div class="wrap"><span class="icon">&nbsp;</span><div id="pullyText"></div></div></div>');
			// listener for scrolling
			$(window).bind('scroll', pully.scrollStart);
			$(window).bind('scrollstop', pully.scrollStop);
		}
	},

	// Only refresh the page if you are scrolling at the top of the page.
	checkScrollTopBoundary: function() {
		var totalHeight = $('body').height(),
			positionPercent = null;
		if (pully.origStartingPosition === null) {
			pully.origStartingPosition = pully.position;
		}
		positionPercent = pully.origStartingPosition / totalHeight;
		pully.withinTopBoundary = positionPercent <= pully.scrollTopBoundary;
	},
	
	scrollStart: function() {
		pully.position = $(window).scrollTop();

		pully.checkScrollTopBoundary();

		if (pully.position <= -30 && pully.withinTopBoundary)
		{
			$('#pullToRefresh #pullyText').text('Release to refresh');
			$('#pullToRefresh .icon').addClass('release');
			pully.refreshPossible = true;
		}
		else if (pully.position <= -5 && pully.refreshPossible === false && pully.withinTopBoundary)
		{
			pully.slideDownMenu();
		}
		else if (pully.refreshPossible === false)
		{
			pully.slideUpMenu();
		}
		
	},
	
	scrollStop: function() {
		pully.position = $(window).scrollTop();
		pully.origStartingPosition = null;
		
		if (pully.position >= 0 && pully.refreshPossible === true)
		{
			$('#pullToRefresh').addClass('fixed');
			$('#pullToRefresh #pullyText').text('Reloading…');
			$(window).scrollTop(0);
			
			setTimeout(function(){
				window.location.reload();
			}, 1000);
		}
		
	},
	
	slideDownMenu: function() {
		$('#pullToRefresh').slideDown(200);
		$('#pullToRefresh #pullyText').text('Pull to refresh');
		$('#pullToRefresh .icon').removeClass('release');
	},
	
	slideUpMenu: function() {
		$('#pullToRefresh').slideUp(200);
	}
	
};

$(document).ready(pully.init);