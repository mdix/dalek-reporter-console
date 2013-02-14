/*!
 *
 * Copyright (c) 2013 Sebastian Golasch
 *
 * Permission is hereby granted, free of charge, to any person obtaining a
 * copy of this software and associated documentation files (the "Software"),
 * to deal in the Software without restriction, including without limitation
 * the rights to use, copy, modify, merge, publish, distribute, sublicense,
 * and/or sell copies of the Software, and to permit persons to whom the
 * Software is furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included
 * in all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
 * OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL
 * THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
 * FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER
 * DEALINGS IN THE SOFTWARE.
 *
 */

'use strict';

// int globals
var reporter = null;

/**
 * @class Reporter
 * @constructor
 */

var Reporter = function (opts) {
  this.level = (parseInt(opts.logLevel, 10) >= 0 && parseInt(opts.logLevel, 10) <= 4) ? parseInt(opts.logLevel, 10) : 1;
  this.events = opts.events;
  this.importLogModule();
  this.startListening();
};

/**
 * @module Reporter
 */

module.exports = function (opts) {
  if (reporter === null) {
    reporter = new Reporter(opts);
  }

  return reporter;
};

/**
 * Imports an output module with the correct log state
 *
 * @method importLogModule
 * @param {object} data
 * @return {Reporter}
 */

Reporter.prototype.importLogModule = function () {
  var logModule = require('./lib/loglevel/level' + this.level);
  var methods = Object.keys(logModule.prototype);

  methods.forEach(function (method) {
    this[method] = logModule.prototype[method];
  }.bind(this));
  return this;
};

/**
 * Connects to all the event listeners
 *
 * @method startListening
 * @param {object} data
 * @return {Reporter}
 */

Reporter.prototype.startListening = function () {
  this.events.on('report:assertion', this.outputAssertionResult.bind(this));
  this.events.on('report:assertion:status', this.outputAssertionExpecation.bind(this));
  this.events.on('report:test:finished', this.outputTestFinished.bind(this));
  this.events.on('report:test:started', this.outputTestStarted.bind(this));
  this.events.on('report:runner:started', this.outputRunnerStarted.bind(this));
  this.events.on('report:runner:finished', this.outputRunnerFinished.bind(this));
  this.events.on('report:run:browser', this.outputRunBrowser.bind(this));
  this.events.on('report:action', this.outputAction.bind(this));
  this.events.on('report:log:user', this.outputLogUser.bind(this));
};