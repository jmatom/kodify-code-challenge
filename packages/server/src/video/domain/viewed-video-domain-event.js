'use strict';

/**
 * 1. An use case / app service can trigger/emit events.
 * These events are domain events and can be extended from a base class DomainEvent to specify
 * some common behaviour
 * For the purpose of this code challenge, I will put all the necessary methods here
 * 
 * 2. A domain name, can follow some specs to create the names (in the same way there are
 * styles to create databases/tables/columns names). One the spec I know is:
 *  - https://github.com/fmvilas/topic-definition
 */
const FULL_QUALIFIED_EVENT_NAME = 'kodify.video.1.event.video.viewed';

class ViewedVideoDomainEvent {
  /**
   * Constructor always expect a primitive data type
   * @param {String} videoId
   * @param {String} clientIp
   * @param {Timestmap} ocurredOn
   */
  constructor(videoId, clientIp, ocurredOn = null) {
    this.videoId = videoId;
    this.clientIp = clientIp;
    this.ocurredOn = ocurredOn;
  }

  static eventName() {
    return FULL_QUALIFIED_EVENT_NAME;
  }

  eventName() {
    return FULL_QUALIFIED_EVENT_NAME;
  }

  getEvent() {
    return {
      eventName: this.eventName(),
      data: this.toPrimitives(),
    };
  }

  toPrimitives() {
    return {
      videoId: this.videoId,
      clientIp: this.clientIp,
    };
  }
}

module.exports = ViewedVideoDomainEvent;
