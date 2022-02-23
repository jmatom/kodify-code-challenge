'use strict';

const crypto = require('crypto');

/*
const { performance, PerformanceObserver } = require('perf_hooks');

const perfObserver = new PerformanceObserver((items) => {
  items.getEntries().forEach((entry) => {
    console.log(entry.duration);
  });
});

perfObserver.observe({ entryTypes: ['measure'], buffer: true })
*/

/**
 * Create the use case / app service
 * @param {CdnRepository} cdnRepository
 * @returns {Function} app service
 */
function createAppService(cdnRepository) {
  /**
   * Generates a token and return a Video with the urls for each source having
   * the valid token be accessed
   * @param {Object} videoDto Basic video data composed by
   */
  async function execute(videoDto) {
    const {
      sources,
    } = videoDto;

    // performance.mark('hash-start');
    const newSources = sources.map((source) => {
      const cdnUrl = cdnRepository.getCdnUrl();
      const cdnKey = cdnRepository.getCdnKey();
      // We are generating a token, this could be in a repo however with current requirements
      // I consider putting this logic here is enough
      const token = crypto.createHash('md5').update(`${source.src}?secret=${cdnKey}`).digest('hex').toString();

      return {
        ...source,
        src: `${cdnUrl}${source.src}?token=${token}`,
      };
    });
    // performance.mark('hash-end');
    // performance.measure('generateHash', 'hash-start', 'hash-end');

    /**
     * We need to keep same format, after checking the code + reviewing package plyr:
     * https://www.npmjs.com/package/plyr section 'The .source setter'
     */
    const videoWithTokenResponse = {
      ...videoDto,
      sources: newSources,
    };

    return videoWithTokenResponse;
  }

  return execute;
}

module.exports = createAppService;
