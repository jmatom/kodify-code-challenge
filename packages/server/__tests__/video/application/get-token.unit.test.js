'use strict';

const {
  describe,
  expect,
  test,
  jest,
} = require('@jest/globals');

const createGetToken = require('../../../src/video/application/get-token');
const cdnRepository = require('../../../src/video/repositories/cdn-repository-in-memory');

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
     *  token=0fae07ababe9612cdcd21909b046e4fe
     * - For 2nd source
     *  token=f3a7cbe7d56ad7b587fc7112f54d5ab7
     */
    const cdnKey = '1234';
    const cdnUrl = 'http://foo';
    cdnRepository.getCdnUrl = jest.fn(() => cdnUrl);
    cdnRepository.getCdnKey = jest.fn(() => cdnKey);

    const getToken = createGetToken(cdnRepository);

    // Act
    const videoWithTokenResponse = await getToken(videoDto);

    // Assert
    expect(videoWithTokenResponse._id).toBe('6213a7299fa2604f1b188ee0');
    expect(videoWithTokenResponse.videoId).toBe('12345');
    expect(videoWithTokenResponse.title).toBe('Big Buck Bunny');
    expect(videoWithTokenResponse.sources[0].src).toBe(`${cdnUrl}/Big_Buck_Bunny_1080p_surround_FrostWire.com.mp4?token=0fae07ababe9612cdcd21909b046e4fe`);
    expect(videoWithTokenResponse.sources[1].src).toBe(`${cdnUrl}/Big_Buck_Bunny_720p_surround_FrostWire.com.mp4?token=f3a7cbe7d56ad7b587fc7112f54d5ab7`);
  });
});
