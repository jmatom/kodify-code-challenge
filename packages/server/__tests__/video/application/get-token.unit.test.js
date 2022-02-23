'use strict';

const {
  describe,
  expect,
  test,
  jest,
} = require('@jest/globals');

const createGetToken = require('../../../src/video/application/get-token');
const CdnRepository = require('../../../src/video/repositories/cdn-repository-in-memory');

describe('unit_test get_token_app_service', () => {
  test('should return a video with token param at each source', async () => {
    // Arrange
    const videoDto = {
      _id:'6213a7299fa2604f1b188ee0',
      videoId:'12345',
      title:'Big Buck Bunny',
      sources:[{
        src:'/Big_Buck_Bunny_1080p_surround_FrostWire.com.mp4',
        size:1080,
        type:'video/mp4'
      }, {
        src:'/Big_Buck_Bunny_720p_surround_FrostWire.com.mp4',
        size:720,
        type:'video/mp4'
      }]
    };

    /**
     * using invented key 1234
     * - For 1st source
     *  crypto.createHash('md5').update(`/Big_Buck_Bunny_1080p_surround_FrostWire.com.mp4?secret=1234`).digest('hex').toString();
     *  token=a3b44a7c71a89adfb06cc383f8e00243
     * - For 2nd source
     *  token=38e67683cae0e1a71565b363fcaa13ef
     */
    const availableCdns = [{
      name: 'AWS TEST CDN 1',
      address: 'https://foo.cloudfront.net',
      key: '0000',
    }];
    const cdnRepository = new CdnRepository(availableCdns);

    cdnRepository.getCdnConfig = jest.fn(() => availableCdns[0]);
    const getToken = createGetToken(cdnRepository);

    // Act
    const videoWithTokenResponse = await getToken(videoDto);

    // Assert
    expect(videoWithTokenResponse._id).toBe('6213a7299fa2604f1b188ee0');
    expect(videoWithTokenResponse.videoId).toBe('12345');
    expect(videoWithTokenResponse.title).toBe('Big Buck Bunny');
    expect(videoWithTokenResponse.sources[0].src).toBe(`${availableCdns[0].address}/Big_Buck_Bunny_1080p_surround_FrostWire.com.mp4?token=a3b44a7c71a89adfb06cc383f8e00243`);
    expect(videoWithTokenResponse.sources[1].src).toBe(`${availableCdns[0].address}/Big_Buck_Bunny_720p_surround_FrostWire.com.mp4?token=38e67683cae0e1a71565b363fcaa13ef`);
  });
});
