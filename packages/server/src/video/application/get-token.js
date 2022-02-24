'use strict';

const crypto = require('crypto');

/**
 * Create the use case / app service
 * @param {CdnRepository} cdnRepository
 * @returns {Function} appService
 */
function createAppService(cdnRepository) {
  /**
   * We are storing in memory the number of executions. If we need to make it
   * distributed then we should go for a shared Redis between the instances
   */
  let executionNumberCounter = 0;

  /**
   * Generates a token and return a Video with the urls for each source having
   * the valid token be accessed
   * @param {Object} videoDto
   */
  async function execute(videoDto) {
    const {
      sources,
    } = videoDto;

    const cdn = cdnRepository.getCdnConfig(executionNumberCounter);
    const newSources = sources.map((source) => {
      // We are generating a token, this could be in a repo however with current requirements
      // I consider putting this logic here is enough
      const token = crypto.createHash('md5').update(`${source.src}?secret=${cdn.key}`).digest('hex').toString();

      return {
        ...source,
        src: `${cdn.address}${source.src}?token=${token}`,
      };
    });

    /**
     * We need to keep same format, after checking the code + reviewing package plyr:
     * https://www.npmjs.com/package/plyr section 'The .source setter'
     */
    const videoWithTokenResponse = {
      ...videoDto,
      sources: newSources,
    };

    executionNumberCounter = executionNumberCounter + 1;

    return videoWithTokenResponse;
  }

  return execute;
}

module.exports = createAppService;
