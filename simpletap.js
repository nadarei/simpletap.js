/*! simpletap.js (c) 2013, Nadarei Inc.
 *  https://github.com/nadarei/simpletap.js */

;(function($) {

  var tapStart,
      tapEnd,
      lastTap,    // The last tapped element
      enabled,    // If simpletap has been called before
      timer;

  $.simpletap = function(options) {
    // Ensure it's unbound
    $.simpletap.disable();

    var defaults = {
      'for': '*',
      'threshold': 10,
      'timeout': 400,
      'event': 'tap',
      'activeClass': 'tap',
      'emulateTaps': true,
      'stopClicks': false
    };

    options = $.extend({}, defaults, options || {});

    // Store the origin (tapStart) when a touch event starts.
    $(document).on('touchstart.simpletap', function(e) {
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

    $(document).on('touchmove.simpletap', function(e) {
      var touches = e.originalEvent.touches;
      tapEnd = { x: touches[0].screenX, y: touches[0].screenY };
    });

    $(document).on('touchend.simpletap', function(e) {
      var target = getTarget(e);
      if (!target) return;

      if (!tapEnd ||
        ((Math.abs(tapEnd.x - tapStart.x) < options.threshold) &&
        (Math.abs(tapEnd.y - tapStart.y) < options.threshold))) {

        // Cancel the touch. In touch-enabled Windows desktops, this will
        // cancel the click event as well.
        e.preventDefault();

        // Trigger a constructed `tap` event.
        triggerTap(e, $(target));

        // Prevent clicks in the next 400ms.
        if (typeof timer !== 'undefined') clearTimeout(timer);
        timer = setTimeout(function() {
          lastTap = false;
          timer = undefined;
        }, options.timeout);

        // Unset CSS class if needed.
        if (options.activeClass) $(target).removeClass(options.activeClass);
      }

      lastTap = target;
      tapStart = false;
      tapEnd = false;
    });

    // Do two things:
    //   [1] If this is triggered in the next 400ms after a tap, cancel the click.
    //   [2] Make click events trigger tap events.
    $(document).on('click.simpletap', options['for'], function(e) {
      if (lastTap && $(this).closest(lastTap).length) { /* [1] */
        e.preventDefault();
        e.stopPropagation();
      } else if (options.emulateTaps) { /* [2] */
        var tapEvent = triggerTap(e, $(this));

        if (options.stopClicks) {
          e.preventDefault();
          e.stopPropagation();
        } else {
          // If `e.stopPropagation()` was done on the tap event, do it here too.
          propagatePrevention(tapEvent, e);
        }
      }
    });

    // Constructs a `tap` event.
    function triggerTap(e, target) {
      var eventTarget = e.originalEvent && e.originalEvent.target || e.target || target;
      var event = $.Event(options.event, { target: eventTarget });
      target.trigger(event);
      return event;
    }

    // Copy the `preventDefault()` (et al) calls from one event (`from`) to
    // another event (`to`). This is used to propagate them from `tap` events
    // to `click` events.
    function propagatePrevention(from, to) {
      if (from.isDefaultPrevented()) to.preventDefault();
      if (from.isPropagationStopped()) to.stopPropagation();
      if (from.isImmediatePropagationStopped()) to.stopImmediatePropagation();
    }

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

  $.simpletap.disable = function() {
    $(document).off('.simpletap');
  };

})(jQuery);
