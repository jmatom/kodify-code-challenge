'use strict';

/**
 * We are creating our videoController. To do that we have 2 options:
 *  1. Create class (VideoController for example) and add as many methods as we need
 *  2. Follow a function approach, creating each function controller in a separate file
 *  and construct the controller in the main index file
 *  (note that a controllers/video folder was created for this purpose).
 *
 * I went for option 2
 */

const createTokenController = require('./get-token-controller');
const getVideoController = require('./get-video-controller');

const videoController = {
  createTokenController,
  getVideo: getVideoController,
};

module.exports = videoController;
