'use strict';

const VideoViewedRecordModel = require('./VideoViewedRecordModel');

class VideoViewedRepositoryMongo {
  /**
   * Record a video view
   * @param {VideoWatchedDto} videoWatchedDto Object { videoId, clientIp, ocurredOn }
   */
  async saveVideoWatched(videoWatchedDto) {
    const videoViewedRecord = {
      videoId: videoWatchedDto.videoId,
      clientIp: videoWatchedDto.clientIp,
      timestamp: videoWatchedDto.ocurredOn,
    };

    await VideoViewedRecordModel.create(videoViewedRecord);
  }
}

module.exports = VideoViewedRepositoryMongo;
