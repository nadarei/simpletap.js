if (typeof module === 'object') require('./setup');

testSuite('Simpletap', function() {
  var div;

  describe('Basic functions', function() {
    beforeEach(function() {
      div = $("<div>").appendTo('body');
      $.simpletap();
    });

    afterEach(function() {
      div.remove();
    });

    it('should work', function(done) {
      div
        .on('tap', function() { done(); })
        .trigger(touchstartEvent(div, 100, 100))
        .trigger(touchendEvent(div));
    });

    it('should not register drags', function() {
      var tapped = false;
      div
        .on('tap', function() { tapped = true; })
        .trigger(touchstartEvent(div, 100, 100))
        .trigger(touchmoveEvent(200, 200))
        .trigger(touchendEvent(div));

      tapped.should.equal(false);
    });

    it('should account for delta', function(done) {
      div
        .on('tap', function() { done(); })
        .trigger(touchstartEvent(div, 50, 50))
        .trigger(touchmoveEvent(45, 55))
        .trigger(touchendEvent(div));
    });
  });

  // ----------------------------------------------------------------------------

  describe('Tap emulation', function() {
    beforeEach(function() {
      div = $("<div>").appendTo('body');
    });

    afterEach(function() {
      div.remove();
    });

    it('should trigger taps for clicks', function(done) {
      $.simpletap();
      div
        .on('tap', function() { done(); })
        .trigger('click');
    });

    it('should honor emulateTaps: false', function(done) {
      $.simpletap({ emulateTaps: false });
      div
        .on('tap', function() { throw "Fail"; })
        .on('click', function() { setTimeout(done, 20); })
        .trigger('click');
    });
  });

  // ----------------------------------------------------------------------------

  describe('Custom threshold', function() {
    beforeEach(function() {
      div = $("<div>").appendTo('body');
      $.simpletap({ threshold: 200 });
    });

    afterEach(function() {
      div.remove();
    });

    it('should not register drags', function() {
      var tapped = false;
      div
        .on('tap', function() { tapped = true; })
        .trigger(touchstartEvent(div, 100, 100))
        .trigger(touchmoveEvent(900, 900))
        .trigger(touchendEvent(div));

      tapped.should.equal(false);
    });

    it('should account for delta', function(done) {
      div
        .on('tap', function() { done(); })
        .trigger(touchstartEvent(div, 50, 50))
        .trigger(touchmoveEvent(145, 155))
        .trigger(touchendEvent(div));
    });
  });

  // ----------------------------------------------------------------------------

  describe('Timeout', function() {
    beforeEach(function() {
      div = $("<div>").appendTo('body');
      $.simpletap();
    });

    afterEach(function() {
      div.remove();
    });

    it('should not trigger clicks after timeout', null, function(done) {
      div
        .on('click', function() { throw "Click should not happen"; })
        .trigger(touchstartEvent(div, 100, 100))
        .trigger(touchendEvent(div))
        .trigger('click');

      setTimeout(done, 450);
    });
  });

  // ----------------------------------------------------------------------------

  describe('Active class', function() {
    beforeEach(function() {
      div = $("<div>").appendTo('body');
    });

    afterEach(function() {
      div.remove();
    });

    it('should work', function(done) {
      $.simpletap({ activeClass: 'hello' });

      div
        .on('tap', function() {
          setTimeout(function() {
            div.is('.hello').should.equal(false);
            done();
          }, 50);
        })
        .trigger(touchstartEvent(div, 100, 100));

      div.is('.hello').should.equal(true);
      div.trigger(touchendEvent(div));
    });

    it('should be disableable', function(done) {
      $.simpletap({ activeClass: false });
      div.attr('class', 'button');

      div
        .on('tap', function() {
          setTimeout(function() {
            div.attr('class').should.equal('button');
            done();
          }, 50);
        })
        .trigger(touchstartEvent(div, 100, 100));

      div.attr('class').should.equal('button');
      div.trigger(touchendEvent(div));
    });
  });

  // ----------------------------------------------------------------------------

  describe('Custom selectors', function() {
    beforeEach(function() {
      div = $("<div>").appendTo('body');
      this.icon = $("<i>").appendTo(div);
      $.simpletap({ 'for': 'div' });
    });

    afterEach(function() {
      div.remove();
    });

    it('should work', function(done) {
      div
        .on('tap', function() { setTimeout(done, 50); });

      this.icon
        .on('tap', function() { throw "Fail"; })
        .trigger(touchstartEvent(div, 100, 100))
        .trigger(touchendEvent(div));
    });
  });

  // ----------------------------------------------------------------------------

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
});
