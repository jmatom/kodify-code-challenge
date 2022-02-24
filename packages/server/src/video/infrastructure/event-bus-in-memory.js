'use strict';

const EventEmitter = require('events');

/**
 * I am creating a basic event bus using Node.js EventEmitter
 * Other solution I implemented in the past was with https://www.npmjs.com/package/hertzy but
 * it's an overhead for this code challenge
 */

class EventBusInMemory {
  constructor() {
    this.emitter = new EventEmitter;
  }

  subscribeTo(eventName, handler) {
    this.emitter.on(eventName, handler);
  }

  publish(events) {
    try {
      for (const event of events) {
        // console.log('emitting', event.eventName(), event.getEvent());
        this.emitter.emit(event.eventName(), event.getEvent());
      }
    } catch (e) {
      console.error('Error on publish');
      console.error(e);
    }
  }
}

module.exports = EventBusInMemory;
