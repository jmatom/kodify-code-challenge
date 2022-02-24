'use strict';

class VideoNotFound extends Error {
  constructor(videoId) {
    super(`Video not found. Received: ${videoId}`);

    this.name = 'VideoNotFound';
  }
}

module.exports = VideoNotFound;
