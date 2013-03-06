/*! simpletap.js (c) 2013, Nadarei Inc.
 *  https://github.com/nadarei/simpletap.js */

;(function($) {

  var tapStart, tapEnd, lastTap, enabled, timer;

  $.simpletap = function(options) {
    if (enabled) return;
    enabled = true;

    var defaults = {
      'for': '*',
      'threshold': 10,
      'timeout': 400,
      'event': 'tap',
      'activeClass': 'tap'
    };

    options = $.extend({}, defaults, options || {});

    // Store the origin (tapStart) when a touch event starts.
    $(document).on('touchstart', function(e) {
      // Ensure that it's restricted to options.for.
      var target = getTarget(e);
      if (!target) return;

      // Store the screenX, not the clientX. This (mildly) accounts for
      // pinch-zooming et al.
      var touches = e.originalEvent.touches;
      tapStart = { x: touches[0].screenX, y: touches[0].screenY };
      tapEnd = false;

      // Set CSS class if needed
      if (options.activeClass) $(target).addClass(options.activeClass);
    });

    $(document).on('touchmove', function(e) {
      var touches = e.originalEvent.touches;
      tapEnd = { x: touches[0].screenX, y: touches[0].screenY };
    });

    $(document).on('touchend', function(e) {
      var target = getTarget(e);
      if (!target) return;

      if (!tapEnd ||
        ((Math.abs(tapEnd.x - tapStart.x) < options.threshold) &&
        (Math.abs(tapEnd.y - tapStart.y) < options.threshold))) {

        // Trigger the tap, and cancel the touch
        $(target).trigger(options.event);
        e.preventDefault();

        // Prevent clicks in the next 400ms
        if (typeof timer !== 'undefined') clearTimeout(timer);
        timer = setTimeout(function() {
          lastTap = false;
          timer = undefined;
        }, options.timeout);

        // Unset CSS class if needed
        if (options.activeClass) $(target).removeClass(options.activeClass);
      }

      lastTap = target;
      tapStart = false;
      tapEnd = false;
    });

    // Make click events trigger tap events.
    // (If this is triggered in the next 400ms after a tap, it will not trigger)
    $(document).on('click', options['for'], function(e) {
      if (!lastTap || !$(this).closest(lastTap).length) {
        $(this).trigger(options.event);
      }
    });

    // Returns the target element from a given jQuery event `e`, taking the
    // selector restriction into account.
    function getTarget(e) {
      var target = e.originalEvent.target;
      if (options['for'] !== '*') {
        target = $(target).closest(options['for']);
        if (target.length === 0) return;
      }
      return target;
    }
  };

})(jQuery);
