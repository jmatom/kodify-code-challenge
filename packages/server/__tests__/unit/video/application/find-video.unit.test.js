'use strict';

const {
  describe,
  expect,
  test,
  jest,
  beforeEach,
} = require('@jest/globals');

const createFindVideo = require('../../../../src/video/application/find-video');
const ViewedVideoDomainEvent = require('../../../../src/video/domain/viewed-video-domain-event');

describe('[unit_test] find_video_service', () => {
  const video =  {
    videoId: '00000FindVideo',
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

  const findVideoById = jest.fn((videoId) => video);
  const videoRepository = {
    findVideoById,
  };

  const publish = jest.fn((events) => undefined);
  const eventBus = {
    publish,
  };

  const now = Date.now();
  Date.now = jest.fn(() => now);

  // Create the use case / app service
  const findVideo = createFindVideo(videoRepository, eventBus);

  beforeEach(() => {
    findVideoById.mockClear();
    publish.mockClear();
    Date.now.mockClear();
  });

  test('should return a video', async () => {
    // Arrange
    const videoId = video.videoId;
    const clientIp = '127.0.0.1';

    // Act
    const videoFound = await findVideo(videoId, clientIp);

    // Assert
    expect(videoFound).toMatchObject(video);
  });

  test('should generate an event when video exists', async () => {
    // Arrange
    const videoId = video.videoId;
    const clientIp = '127.0.0.1';

    // Act
    const videoFound = await findVideo(videoId, clientIp);

    // Assert
    expect(videoFound).toMatchObject(video);
    expect(publish).toHaveBeenCalledTimes(1);
    expect(publish).toHaveBeenCalledWith([
      new ViewedVideoDomainEvent(videoId, clientIp, Date.now())
    ]);
  });
});
