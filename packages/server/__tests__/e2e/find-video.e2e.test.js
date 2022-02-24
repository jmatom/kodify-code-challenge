'use strict';

const {
  describe,
  expect,
  test,
  jest,
} = require('@jest/globals');

const request = require('supertest');

const port = +process.env.PORT || 3002;

/**
 * By default, tests will run at http://localhost:3002 but we can create an env var
 * with the correct base_url to run test through another environment (qa, preprod, prod, etc)
 */
let baseUrl = `http://localhost:${port}`;
if (process.env.BASE_URL) {
  baseUrl = `${process.env.BASE_URL}:${port}`;
}

const videoPath = '/video';

describe('GET /video', () => {
  test('should return 404 when video does not exist', async () => {
    // Arrange
    const nonExistentVideoId = 'nonExistentVideoId';

    // Act
    const response = await request(baseUrl)
      .get(`${videoPath}/${nonExistentVideoId}`);

    // Assert
    expect(response.statusCode).toBe(404);
  });

  test('should return a video', async () => {
    // Arrange
    const videoId = '12345';
    const existentVideo = {
      _id: expect.any(String),
      videoId: '12345',
      title: 'Big Buck Bunny',
      sources:[{
        src: '/Big_Buck_Bunny_1080p_surround_FrostWire.com.mp4',
        size: 1080,
        type: 'video/mp4',
      }, {
        src: '/Big_Buck_Bunny_720p_surround_FrostWire.com.mp4',
        size: 720,
        type: 'video/mp4',
      }]
    };

    // Act
    const response = await request(baseUrl)
      .get(`${videoPath}/${videoId}`);

    // Assert
    expect(response.statusCode).toBe(200);
    expect(response.body).toMatchObject(existentVideo);
  });
});
