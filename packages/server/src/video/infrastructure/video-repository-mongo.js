'use strict';

const VideoModel = require('./VideoModel');
const Video = require('../domain/video');

class VideoRepositoryMongo {
  /**
   * Find a video by id
   * @param {String} videoId
   * @returns {Video} video?
   */
  async findVideoById(videoId) {
    /**
     * Lean allow us to improve the performance because it's not creating
     * the mongoose intermediate model
     * So, we are obtaining a basic javascript object and this object is matching
     * our entity but usually in a big project this is not the case so let's see
     * how can we follow clean architecture for this example
     */
    const videoMongo = await VideoModel.findOne({ videoId }).lean();

    if (!videoMongo) {
      return null;
    }

    const {
      _id,
      title,
      sources,
    } = videoMongo;

    const video = new Video(_id, videoId, title, sources);

    return video;
  }
}

module.exports = VideoRepositoryMongo;
