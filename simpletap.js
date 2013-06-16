/*

################
# simpletap.js #
################

(c) 2013, Nadarei Inc.
https://github.com/nadarei/simpletap.js

*/

(function($) {
  $.simpletap = function(options) {
    var defaults, getTarget, propagatePrevention, triggerTap;
    
    triggerTap = function(e, target) {
      var event, eventTarget;
      
      eventTarget = e.originalEvent && e.originalEvent.target || e.target || target;
      event = $.Event(options.event, {
        target: eventTarget
      });
      
      target.trigger(event);
      return event;
    };
    
    propagatePrevention = function(from, to) {
      if (from.isDefaultPrevented()) {
        to.preventDefault();
      }
      
      if (from.isPropagationStopped()) {
        to.stopPropagation();
      }
      
      if (from.isImmediatePropagationStopped()) {
        return to.stopImmediatePropagation();
      }
    };
    
    getTarget = function(e) {
      var target;
      target = e.originalEvent.target;
      
      if (options["for"] !== "*") {
        target = $(target).closest(options["for"]);
        if (target.length === 0) {
          return;
        }
      }
      return target;
    };
    
    $.simpletap.disable();
    defaults = {
      "for": "*",
      threshold: 10,
      timeout: 400,
      event: "tap",
      activeClass: "tap",
      emulateTaps: true, stopClicks: false
    };
    
    options = $.extend({}, defaults, options || {});
    
    $(document).on("touchstart.simpletap", function(e) {
      var tapEnd, tapStart, target, touches;
      target = getTarget(e);
      
      if (!target) {
        return;
      }
      
      touches = e.originalEvent.touches;
      
      tapStart = {
        x: touches[0].screenX,
        y: touches[0].screenY
      };
      
      tapEnd = false;
      
      if (options.activeClass) {
        return $(target).addClass(options.activeClass);
      }
    });
    
    $(document).on("touchmove.simpletap", function(e) {
      var tapEnd, touches;
      touches = e.originalEvent.touches;
      
      return tapEnd = {
        x: touches[0].screenX,
        y: touches[0].screenY
      };
    });
    
    $(document).on("touchend.simpletap", function(e) {
      var lastTap, tapEnd, tapStart, target, timer;
      target = getTarget(e);
      if (!target) {
        return;
      }
      
      if (!tapEnd || ((Math.abs(tapEnd.x - tapStart.x) < options.threshold) && (Math.abs(tapEnd.y - tapStart.y) < options.threshold))) {
        e.preventDefault();
        triggerTap(e, $(target));
        
        if (typeof timer !== "undefined") {
          clearTimeout(timer);
        }
        
        timer = setTimeout(function() {
          var lastTap;
          lastTap = false;
          return timer = undefined;
        }, options.timeout);
        
        if (options.activeClass) {
          $(target).removeClass(options.activeClass);
        }
      }
      
      lastTap = target;
      tapStart = false;
      return tapEnd = false;
    });
    
    return $(document).on("click.simpletap", options["for"], function(e) {
      var tapEvent;
      
      if (lastTap && $(this).closest(lastTap).length) {
        e.preventDefault();
        return e.stopPropagation();
      } else if (options.emulateTaps) {
        tapEvent = triggerTap(e, $(this));
        if (options.stopClicks) {
          e.preventDefault();
          return e.stopPropagation();
        } else {
          return propagatePrevention(tapEvent, e);
        }
      }
    });
  };
  
  return $.simpletap.disable = function() {
    return $(document).off(".simpletap");
  };
})(jQuery);
