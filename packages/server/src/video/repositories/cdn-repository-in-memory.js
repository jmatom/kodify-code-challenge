'use strict';

/**
 * This repository is in charge of the cdn configuration
 * For the puropose of this code challenge:
 *  - This configuration will be in memory (but it could be in a
 *  database / vault to store security keys)
 *  - If we followed a real clean architecture, we should have an interface at
 *  video/domain/cdn-repository-interface and this class should implement it
 *  (in javascript we can simulate that without typescript just creating a class an inherit
 *  from it but for this code challenge I will omit that step because I think is too much)
 * 
 * As I indicated, we are hardcoding the data but this data should be located as env vars
 * (https://12factor.net/config) or in a secure storage, at least for the keys
 * (vault for example, ciphered database, etc)
 */
 const CDN_ADDRESS = process.env.CDN_ADDRESS || 'https://d2usdis6r1u782.cloudfront.net';
 const CDN_KEY = process.env.CDN_KEY || 'U5e0IskwtIfA';

class CdnRepositoryInMemory {
  /**
   * There are no dependencies because we are hardcoding the data but
   * we could expect an external store configuration , database connection,
   * vault connection, etc
   */
  constructor() {
    
  }

  getCdnUrl() {
    return CDN_ADDRESS;
  }

  getCdnKey() {
    return CDN_KEY;
  }
}

module.exports = CdnRepositoryInMemory;
