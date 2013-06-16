Simpletap.js
============

Enables fast tap events across all elements. Requires jQuery 1.8.

See the [Creating Fast Buttons for Mobile Web Applications][buttons] article for 
the rationale of why this needs to exist.

[buttons]: https://developers.google.com/mobile/articles/fast_buttons

[![Build Status](https://travis-ci.org/nadarei/simpletap.js.png?branch=master)](https://travis-ci.org/rstacruz/ndialog)

Why Simpletap?
--------------

* Elements don't need to exist when binding the tap event. Simpletap listens for 
  all touches in the `document` and finds out what element you tapped (jQuery 
      delegation style).

* You can affect all elements if you wish.

* You can use `event.preventDefault()` in taps to stop default click behaviors.

* It has explicit support for touchscreen PCs (ie, user agents with both touch 
    and click events).

Usage
-----

Simply call it like so:

``` javascript
$.simpletap();
```

And *all* elements across the page will automatically get a 'tap' event.

``` javascript
$('a').on('tap', function() {
  console.log('tap!');
});
```

Tap events will also be triggered when you click.

Advanced usage
--------------

You can specify custom options. Note that these are *all optional*.

``` javascript
$.simpletap({
  for: '*',            // Restrict tappable objects to this selector
  threshold: 10,       // Maximum finger distance for taps in pixels
  timeout: 400,        // Amount of time to supress clicks
  event: 'tap',        // Event name to be triggered
  activeClass: 'tap',  // CSS class to add to tapped things
  emulateTaps: true,  // Emulate taps when clicks happen
  stopClicks: false    // Stop all click events from happening
});
```

Caveats & recommendations
-------------------------

### Restricting elements

Only the top-most element will be triggered. This means if you have an
element like so:

``` html
<button class='btn primary'>
  <i class='trash'></i> Delete
</button>
```

...and you click on the trash icon, it will be the `<i>` that will receive
the `tap` event, not `button`.

This is often good enough, because the event will propagate down to it's 
ancestors anyway. But the `activeClass` (`tap`) will be applied to `i` in this 
case.

To get around this, restrict the tappable element selector to those you're
concerned about:

``` javascript
$.simpletap({ 'for': 'button' });
```

### Stopping links

When attaching tap events to links and buttons, stopping is straightforward.
Doing `preventDefault()`, or `stopPropagation()`, or 
`stopImmediatePropagation()` on taps will propagate those to clicks as well, 
  cancelling any link/button clicks.

``` javascript
$('a').on('tap', function(e) {
  e.preventDefault();
});
```

You can also tell Simpletap to stop all clicks by default. This will do 
`preventDefault()` on clicks.

``` javascript
$.simpletap({
  'for': 'a, button',
  'stopClicks': true
});
```

Devices that support touch and click
------------------------------------

Some devices support both. For instance, there are Lenovo PCs with touch screens 
and pointing devices.

In this case, it behaves like so:

 * Touch taps produce `tap` event.
 * Clicks produce both `tap` and `click` by default.
 * If the `emulateTaps` option is disabled, clicks will only produce clicks.

Styling tapped objects
----------------------

The usual `:active` classes will not work right away. Just style the `.tap`
class. Simpletap adds the `tap` class to tapped elements by default.

``` javascript
a.tap {
  background: #333;
}
```

Removing iOS tap outlines
-------------------------
  
``` css
* {
  -webkit-tap-highlight-color: rgba(0,0,0,0);
  -webkit-user-select: none;                /* disable text select */
  -webkit-touch-callout: none;              /* disable callout, image save panel (popup) */
  -webkit-tap-highlight-color: transparent; /* "turn off" link highlight */
}
```

Sources: [bitsandpix.com], [yuiblog.com]

[bitsandpix.com]:http://www.bitsandpix.com/entry/ios-webkit-uiwebview-remove-tapclick-highlightborder-with-css/ 
[yuiblog.com]:http://www.yuiblog.com/blog/2010/10/01/quick-tip-customizing-the-mobile-safari-tap-highlight-color/ 

Disabling Simpletap
-------------------

You can use `$.simpletap.disable()` to unbind all events Simpletap has bound.  
This returns your document back to the state before `$.simpletap()` was called.

Limitations
-----------

Only handles taps. Other touch events like pinching and swiping are not handled.
Other libraries exist that may get around Simpletap's limitations.

Alternatives
------------

 * [Fastclick](https://github.com/ftlabs/fastclick):
   Transparently makes click events behave like taps.

 * [Touchable](https://github.com/dotmaster/Touchable-jQuery-Plugin):
   Handles other touch events.

 * [Tappable](https://github.com/cheeaun/tappable):
   Has more options and events, and implements a *noScroll* mode.

Acknowledgements
----------------

© 2013, Nadarei, Inc. Released under the [MIT 
License](http://www.opensource.org/licenses/mit-license.php).

**Simpletap** is authored and maintained by [Rico Sta. Cruz][rsc] and Michael
Galero with help from its [contributors][c]. It is sponsored by our startup, 
       [Nadarei, Inc][nd].

[rsc]: http://ricostacruz.com
[c]:   http://github.com/nadarei/simpletap.js/contributors
[nd]:  http://nadarei.co
