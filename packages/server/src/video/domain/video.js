'use strict';

/**
 * This is a video entity (like Aggregate root)
 * If we had interfaces, this entity would implement AggregateRoot interface, providing common
 * methods like "toString", "toPlainObject / to Dto", etc
 * 
 * We use entities to abstract database coupled models
 */
class Video {
  /**
   * @param {ObjectId} _id
   * @param {videoId} videoId
   * @param {String} title
   * @param {Array<VideoSource>} sources
   */
  constructor(_id, videoId, title, sources) {
    this._id = _id;
    this.videoId = videoId;
    this.title = title;
    this.sources = sources;
  }

  toDto() {
    return {
      _id: this._id,
      videoId: this.videoId,
      title: this.title,
      sources: this.sources,
    };
  }
}

module.exports = Video;
