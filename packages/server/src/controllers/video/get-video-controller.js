'use strict';

// const VideoViewedRecord = require('../../models/VideoViewedRecord');

const createFindVideo = require('../../video/application/find-video');
const VideoRepositoryMongo = require('../../video/infrastructure/video-repository-mongo');

/**
 * @param {EventBusInMemory} eventBus 
 * @returns {Function} appService
 */
function createVideoController(eventBus) {
  const videoRepository = new VideoRepositoryMongo();
  const findVideo = createFindVideo(videoRepository, eventBus);

  async function getVideoController(req, res) {
    try {
      const { videoId } = req.params;
      const clientIp = req.ip;
      const video = await findVideo(videoId, clientIp);

      return res.send(video.toDto());
    } catch (e) {
      if (e.name === 'VideoNotFound') {
        return res.status(404).send();
      }

      /**
       * For unexpected errors, return a 500 error (https://jsonapi.org/format/#errors)
       */
      return res.status(500).send({
        id: e.name,
        status: "500",
        code: 500,
        title: e.message,
        detail: e,
      });
    }
  }

  return getVideoController;
}

module.exports = createVideoController;
