var Utilities = function($) {
	return {
		isSupportedUA: function() {
		    if($.browser.webkit) {
		      return true;
		    } else {
		      return false;
		    }
		}
	};
	
}(jQuery);
