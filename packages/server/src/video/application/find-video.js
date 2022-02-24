'use strict';

const VideoNotFound = require('../domain/errors/video-not-found');
const ViewedVideoDomainEvent = require('../domain/viewed-video-domain-event');

/**
 * Create the use case / app service
 * @params {VideoRepository} videoRepository
 * @params {EventBus} bus
 * @returns {Function} appService
 */
function createAppService(videoRepository, bus) {
  /**
   * Generates a token and return a Video with the urls for each source having
   * the valid token be accessed
   * @param {String} videoId
   * @param {String} clientIp
   */
  async function execute(videoId, clientIp) {
    const video = await videoRepository.findVideoById(videoId);

    if (!video) {
      throw new VideoNotFound(videoId);
    }

    /**
     * A use case / app service can emit events to indicate some actions ocurred, like
     * in this case 'video_watched'. To emit the event, we have 2 options (or 3):
     *  1. Emit an event if we are working with pub/sub (subscribe to emitters)
     *  2. Use a bus to send a message and a consumer (CommandHandler) will receive it
     *  3. Another approach (delegating it to infra team) is to read web server logs, filter by
     *    this endpoint + http status code 200 and extract the ip + videoId.
     *    This solution would be more reliable with better performance.
     * 
     * NOTE: A command handler is like a controller, I mean, it's the entry point to receive messages
     * from an event bus, emitter, etc
     * I went for option 2.
     */

    bus.publish([
      new ViewedVideoDomainEvent(videoId, clientIp, Date.now()),
    ]);

    return video;
  }

  return execute;
}

module.exports = createAppService;
