'use strict';

const ViewedVideoDomainEvent = require('../domain/viewed-video-domain-event');

/**
 * This is a domain event subscriber but is like an use case / app service,
 * the main difference is the invokation is done by a command handler
 */
class RegisterClientOnVideoViewed {
  constructor(videoViewedRepository, eventBus) {
    this.videoViewedRepository = videoViewedRepository;
    this.eventBus = eventBus;

    this.execute = this.execute.bind(this);

    /**
     * Subscribe to events
     */
     for (const event of RegisterClientOnVideoViewed.subscribedTo()) {
      this.eventBus.subscribeTo(event.eventName(), this.execute);
    }
  }

  static subscribedTo() {
    return [ViewedVideoDomainEvent];
  }

  /**
   * @param {ViewedVideoDomainEvent} event 
   */
  execute(event) {
    try {
      const { data: videoWatchedDto } = event;

      this.videoViewedRepository.saveVideoWatched(videoWatchedDto);
    } catch(e) {
      /**
       * If this fails, could be due to repository connection problems
       * we could enqueue the event to be reprocessed later
       */
      console.error(e);
    }
  }
}

module.exports = RegisterClientOnVideoViewed;
