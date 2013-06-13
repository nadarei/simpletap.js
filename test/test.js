if (typeof module === 'object') require('./setup');

testSuite('Simpletap', function() {
  describe('Basic functions', function() {
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
        .trigger(touchstartEvent(this.div, 50, 50))
        .trigger(touchmoveEvent(45, 55))
        .trigger(touchendEvent(this.div));
    });
  });

  // ----------------------------------------------------------------------------

  describe('Tap emulation', function() {
    beforeEach(function() {
      this.div = $("<div>").appendTo('body');
    });

    afterEach(function() {
      this.div.remove();
    });

    it('should trigger taps for clicks', function(done) {
      $.simpletap();
      this.div
        .on('tap', function() { done(); })
        .trigger('click');
    });

    it('should honor emulateTaps: false', function(done) {
      $.simpletap({ emulateTaps: false });
      this.div
        .on('tap', function() { throw "Fail"; })
        .on('click', function() { setTimeout(done, 20); })
        .trigger('click');
    });
  });

  // ----------------------------------------------------------------------------

  describe('Custom threshold', function() {
    beforeEach(function() {
      this.div = $("<div>").appendTo('body');
      $.simpletap({ threshold: 200 });
    });

    afterEach(function() {
      this.div.remove();
    });

    it('should not register drags', function() {
      var tapped = false;
      this.div
        .on('tap', function() { tapped = true; })
        .trigger(touchstartEvent(this.div, 100, 100))
        .trigger(touchmoveEvent(900, 900))
        .trigger(touchendEvent(this.div));

      tapped.should.equal(false);
    });

    it('should account for delta', function(done) {
      this.div
        .on('tap', function() { done(); })
        .trigger(touchstartEvent(this.div, 50, 50))
        .trigger(touchmoveEvent(145, 155))
        .trigger(touchendEvent(this.div));
    });
  });

  // ----------------------------------------------------------------------------

  describe('Timeout', function() {
    beforeEach(function() {
      this.div = $("<div>").appendTo('body');
      $.simpletap();
    });

    afterEach(function() {
      this.div.remove();
    });

    it('should not trigger clicks after timeout', null, function(done) {
      this.div
        .on('click', function() { throw "Click should not happen"; })
        .trigger(touchstartEvent(this.div, 100, 100))
        .trigger(touchendEvent(this.div))
        .trigger('click');

      setTimeout(done, 450);
    });
  });

  // ----------------------------------------------------------------------------

  describe('Active class', function() {
    beforeEach(function() {
      this.div = $("<div>").appendTo('body');
    });

    afterEach(function() {
      this.div.remove();
    });

    it('should work', function(done) {
      $.simpletap({ activeClass: 'hello' });
      var div = this.div;

      div
        .on('tap', function() {
          setTimeout(function() {
            div.is('.hello').should.equal(false);
            done();
          }, 50);
        })
        .trigger(touchstartEvent(this.div, 100, 100));

      div.is('.hello').should.equal(true);
      div.trigger(touchendEvent(this.div));
    });

    it('should be disableable', function(done) {
      $.simpletap({ activeClass: false });
      var div = this.div;
      this.div.attr('class', 'button');

      div
        .on('tap', function() {
          setTimeout(function() {
            div.attr('class').should.equal('button');
            done();
          }, 50);
        })
        .trigger(touchstartEvent(this.div, 100, 100));

      div.attr('class').should.equal('button');
      div.trigger(touchendEvent(this.div));
    });
  });

  // ----------------------------------------------------------------------------

  describe('Custom selectors', function() {
    beforeEach(function() {
      this.div  = $("<div>").appendTo('body');
      this.icon = $("<i>").appendTo(this.div);
      $.simpletap({ 'for': 'div' });
    });

    afterEach(function() {
      this.div.remove();
    });

    it('should work', function(done) {
      this.div
        .on('tap', function() { setTimeout(done, 50); });

      this.icon
        .on('tap', function() { throw "Fail"; })
        .trigger(touchstartEvent(this.div, 100, 100))
        .trigger(touchendEvent(this.div));
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
