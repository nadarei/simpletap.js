;(function() {

  describe('Simpletap.js', function() {
    beforeEach(function() {
      this.div = $("<div>").appendTo('body');
      $.simpletap();
    });

    afterEach(function() {
      this.div.remove();
    });

    it('should work', function(done) {
      this.div
        .on('tap', function() { done(); })
        .trigger(touchstartEvent(this.div, 100, 100))
        .trigger(touchendEvent(this.div));
    });

    it('should not register drags', function() {
      var tapped = false;
      this.div
        .on('tap', function() { tapped = true; })
        .trigger(touchstartEvent(this.div, 100, 100))
        .trigger(touchmoveEvent(200, 200))
        .trigger(touchendEvent(this.div));

      tapped.should.equal(false);
    });

    it('should account for delta', function(done) {
      this.div
        .on('tap', function() { done(); })
        .trigger(touchstartEvent(this.div, 0, 0))
        .trigger(touchendEvent(this.div));
    });

  });

  // Creates a mock 'touchstart' event.
  function touchstartEvent(target, x, y) {
    return event('touchstart', {
      touches: [{ screenX: x, screenY: y }],
      target: target
    });
  }

  // Creates a mock 'touchmove' event.
  function touchmoveEvent(x, y) {
    return event('touchmove', {
      touches: [{ screenX: x, screenY: y }]
    });
  }

  // Creates a mock 'touchend' event.
  function touchendEvent(target) {
    return event('touchend', {
      target: target
    });
  }

  function event(name, obj) {
    obj.originalEvent = obj;
    return $.Event(name, obj);
  }

})();
