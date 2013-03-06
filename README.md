Simpletap.js
============

Enables fast tap events across all elements. Requires jQuery 1.8.

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

You can specify custom options:

``` javascript
$.simpletap({
  for: '*',            // Restrict tappable objects to this selector
  threshold: 10,       // Maximum finger distance for taps in pixels
  timeout: 400,        // Amount of time to supress clicks
  event: 'tap',        // Event name to be triggered
  activeClass: 'tap'   // CSS class to add to tapped things
});
```

Caveats
-------

Only the top-most element will be triggered. This means if you have an
element like so:

``` html
<a href='#' class='btn'>
  <i class='trash'></i> Delete
</a>
```

...and you click on the trash icon, it will be the `<i>` that will receive
the `tap` event, not `a`.

To get around this, restrict the tappable element selector to those you're
concerned about:

``` javascript
$.simpletap({ 'for': 'a, button' });
```

Styling tapped objects
----------------------

The usual `:active` classes will not work right away. Just style the `.tap`
class. Simpletap adds the `tap` class to tapped elements by default.

``` javascript
a.tap {
  background: #333;
}
```

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
