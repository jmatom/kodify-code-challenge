'use strict';

const { URL } = require('url');
const request = require('supertest');
const mongoose = require('mongoose');
const {
  describe,
  expect,
  test,
} = require('@jest/globals');

const port = +process.env.PORT || 3002;

/**
 * By default, tests will run at http://localhost:3002 but we can create an env var
 * with the correct base_url to run test through another environment (qa, preprod, prod, etc)
 */
let baseUrl = `http://localhost:${port}`;
if (process.env.BASE_URL) {
  baseUrl = `${process.env.BASE_URL}:${port}`;
}

const videoTokenPath = '/video/token';

const videoCreated =  {
  _id: mongoose.Types.ObjectId(),
  videoId: '12345getToken',
  title: 'Big Buck Bunny',
  sources:[{
    src: '/Big_Buck_Bunny_1080p_surround_FrostWire.com.mp4',
    "size": 1080,
    type: 'video/mp4',
  }, {
    src: '/Big_Buck_Bunny_720p_surround_FrostWire.com.mp4',
    size: 720,
    type: 'video/mp4',
  }],
};

describe('GET /video/token', () => {
  test('should return 400 when video payload is malformed: invalid sources', async () => {
    // Arrange
    const payload = {
      video: {
        ...videoCreated,
        sources: undefined,
      }
    };

    // Act
    const response = await request(baseUrl)
      .post(videoTokenPath)
      .send(payload);

    // Assert
    expect(response.statusCode).toBe(400);
  });

  test('should return 200 and same video structure', async () => {
    // Arrange
    const payload = {
      video: {
        ...videoCreated,
      }
    };

    const expectedStructure = {
      _id: expect.any(String),
      videoId: expect.any(String),
      title: expect.any(String),
      // sources: expect.any(Array),
      sources: expect.arrayContaining([
        expect.objectContaining({
          src: expect.any(String),
          size: expect.any(Number),
          type: expect.any(String),
        }),
      ]),
    };

    // Act
    const response = await request(baseUrl)
      .post(videoTokenPath)
      .send(payload);

    // Assert
    const video = response.body;
    expect(response.statusCode).toBe(200);
    expect(video).toEqual(expect.objectContaining(expectedStructure));
  });

  test('should return 200 and sources with token in the url', async () => {
    // Arrange
    const payload = {
      video: {
        ...videoCreated,
      }
    };

    // Act
    const response = await request(baseUrl)
      .post(videoTokenPath)
      .send(payload);

    // Assert
    const sources = response.body.sources;
    const urlSource1 = new URL(sources[0].src);
    const urlSource2 = new URL(sources[1].src);

    expect(response.statusCode).toBe(200);
    expect(urlSource1.pathname).toBe(payload.video.sources[0].src);
    expect(urlSource1.searchParams.get('token')).toBeDefined();
    expect(urlSource2.pathname).toBe(payload.video.sources[1].src);
    expect(urlSource2.searchParams.get('token')).toBeDefined();
  });
});
