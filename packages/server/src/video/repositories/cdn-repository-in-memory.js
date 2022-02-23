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

 /**
  * Hardcoding the info in memory
  * Array of Cdn [{name, address, key}, ]
  */
const availableCdns = [{
  name: 'AWS CDN 1',
  address: 'https://d2usdis6r1u782.cloudfront.net',
  key: 'U5e0IskwtIfA',
}, {
  name: 'AWS CDN 2',
  address: 'https://d2oukvvww2uoq.cloudfront.net',
  key: '9Weh3dv6QgDN',
}, {
  name: 'AWS CDN 1',
  address: 'https://dbke9ww44or29.cloudfront.net',
  key: '7x1vGkO75i1Y',
}];

class CdnRepositoryInMemory {
  /**
   * There are no dependencies because we are hardcoding the data but
   * we could expect an external store configuration , database connection,
   * vault connection, etc
   */
  /**
   * @param {Array<Cdn>} cdns
   */
  constructor(cdns = availableCdns) {
    this.cdns = cdns;
  }

  /**
   * Get a cdn balanced based on the number of execution
   * @param {Number} numberOfExecution
   * @returns {Cdn}
   */
  getCdnConfig(numberOfExecution) {
    const bucket = numberOfExecution % this.cdns.length;

    return this.cdns[bucket];
  }
}

module.exports = CdnRepositoryInMemory;
