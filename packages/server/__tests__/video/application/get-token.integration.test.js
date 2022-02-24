'use strict';

const {
  describe,
  expect,
  test,
  jest,
} = require('@jest/globals');

const createGetToken = require('../../../src/video/application/get-token');
const CdnRepositoryInMemory = require('../../../src/video/infrastructure/cdn-repository-in-memory');

describe('[integration_test] get_token_app_service', () => {
  test('should return a video from each balanced cdns', async () => {
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

    const availableCdns = [{
      name: 'AWS TEST CDN 1',
      address: 'https://foo.cloudfront.net',
      key: '0000',
    }, {
      name: 'AWS TEST CDN 2',
      address: 'https://bar.cloudfront.net',
      key: '1111',
    }, {
      name: 'AWS TEST CDN 1',
      address: 'https://baz.cloudfront.net',
      key: '2222',
    }];

    const cdnRepository = new CdnRepositoryInMemory(availableCdns);
    const getToken = createGetToken(cdnRepository);

    /**
     * using invented key
     *  crypto.createHash('md5').update(`/Big_Buck_Bunny_1080p_surround_FrostWire.com.mp4?secret=1234`).digest('hex').toString();
     * 1st source
     *  token1=a3b44a7c71a89adfb06cc383f8e00243
     *  token2=8aa62616c28f90dbddebb2a4eb498975
     *  token3=c6a31ea0b5eb4c93b1a9344cf619a819
     * 2nd source
     *  token1=38e67683cae0e1a71565b363fcaa13ef
     *  token2=25c82b55ef0c056d2a8e05726c2fc4a3
     *  token3=cda804e4d00aedea426c9e7b67015e7c
     */

    // Act
    const videoWithTokenResponse1 = await getToken(videoDto);
    const videoWithTokenResponse2 = await getToken(videoDto);
    const videoWithTokenResponse3 = await getToken(videoDto);
    const videoWithTokenResponse4 = await getToken(videoDto);
    const videoWithTokenResponse5 = await getToken(videoDto);

    /**
     * Assert
     * Check videoWithTokenResponse1
     * Check videoWithTokenResponse2
     * Check videoWithTokenResponse3
     * Check videoWithTokenResponse4
     * Check videoWithTokenResponse5
     */
    // videoWithTokenResponse1
    expect(videoWithTokenResponse1._id).toBe('6213a7299fa2604f1b188ee0');
    expect(videoWithTokenResponse1.videoId).toBe('12345');
    expect(videoWithTokenResponse1.title).toBe('Big Buck Bunny');
    expect(videoWithTokenResponse1.sources[0].src).toBe(`${availableCdns[0].address}/Big_Buck_Bunny_1080p_surround_FrostWire.com.mp4?token=a3b44a7c71a89adfb06cc383f8e00243`);
    expect(videoWithTokenResponse1.sources[1].src).toBe(`${availableCdns[0].address}/Big_Buck_Bunny_720p_surround_FrostWire.com.mp4?token=38e67683cae0e1a71565b363fcaa13ef`);

    // videoWithTokenResponse2
    expect(videoWithTokenResponse2._id).toBe('6213a7299fa2604f1b188ee0');
    expect(videoWithTokenResponse2.videoId).toBe('12345');
    expect(videoWithTokenResponse2.title).toBe('Big Buck Bunny');
    expect(videoWithTokenResponse2.sources[0].src).toBe(`${availableCdns[1].address}/Big_Buck_Bunny_1080p_surround_FrostWire.com.mp4?token=8aa62616c28f90dbddebb2a4eb498975`);
    expect(videoWithTokenResponse2.sources[1].src).toBe(`${availableCdns[1].address}/Big_Buck_Bunny_720p_surround_FrostWire.com.mp4?token=25c82b55ef0c056d2a8e05726c2fc4a3`);

    // videoWithTokenResponse3
    expect(videoWithTokenResponse3._id).toBe('6213a7299fa2604f1b188ee0');
    expect(videoWithTokenResponse3.videoId).toBe('12345');
    expect(videoWithTokenResponse3.title).toBe('Big Buck Bunny');
    expect(videoWithTokenResponse3.sources[0].src).toBe(`${availableCdns[2].address}/Big_Buck_Bunny_1080p_surround_FrostWire.com.mp4?token=c6a31ea0b5eb4c93b1a9344cf619a819`);
    expect(videoWithTokenResponse3.sources[1].src).toBe(`${availableCdns[2].address}/Big_Buck_Bunny_720p_surround_FrostWire.com.mp4?token=cda804e4d00aedea426c9e7b67015e7c`);

    // videoWithTokenResponse4
    expect(videoWithTokenResponse4.sources[0].src).toBe(`${availableCdns[0].address}/Big_Buck_Bunny_1080p_surround_FrostWire.com.mp4?token=a3b44a7c71a89adfb06cc383f8e00243`);
    expect(videoWithTokenResponse4.sources[1].src).toBe(`${availableCdns[0].address}/Big_Buck_Bunny_720p_surround_FrostWire.com.mp4?token=38e67683cae0e1a71565b363fcaa13ef`);

    // videoWithTokenResponse5
    expect(videoWithTokenResponse5.sources[0].src).toBe(`${availableCdns[1].address}/Big_Buck_Bunny_1080p_surround_FrostWire.com.mp4?token=8aa62616c28f90dbddebb2a4eb498975`);
    expect(videoWithTokenResponse5.sources[1].src).toBe(`${availableCdns[1].address}/Big_Buck_Bunny_720p_surround_FrostWire.com.mp4?token=25c82b55ef0c056d2a8e05726c2fc4a3`);
  });
});
