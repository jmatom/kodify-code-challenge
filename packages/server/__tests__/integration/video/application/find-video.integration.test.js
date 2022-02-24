'use strict';

const {
  afterAll,
  beforeAll,
  describe,
  expect,
  test,
} = require('@jest/globals');
const mongoose = require('mongoose');


const VideoNotFound = require('../../../../src/video/domain/errors/video-not-found');
const createFindVideo = require('../../../../src/video/application/find-video');
const EventBusInMemory = require('../../../../src/video/infrastructure/event-bus-in-memory');
const VideoRepositoryMongo = require('../../../../src/video/infrastructure/video-repository-mongo');
const VideoModel = require('../../../../src/video/infrastructure/VideoModel');

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost/testfindvideo';

describe('[integration_test] find_video_service', () => {
  // Create the use case / app service
  const eventBus = new EventBusInMemory();
  const videoRepository = new VideoRepositoryMongo();
  const findVideo = createFindVideo(videoRepository, eventBus);

  const videoCreated =  {
    _id: mongoose.Types.ObjectId(),
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


  beforeAll(async () => {
    await mongoose.connect(MONGO_URI,{
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    await VideoModel.create(videoCreated);
  });

  afterAll(async () => {
    /**
     * Remove video data
     */
    // await VideoModel.deleteOne({ _id: videoCreated._id });
    await VideoModel.collection.drop();
    // Closes the Mongoose connection
    await mongoose.connection.close()
  });

  test('should return a video', async () => {
    // Arrange
    const videoId = videoCreated.videoId;
    const clientIp = '127.0.0.1';

    // Act
    const videoFound = await findVideo(videoId, clientIp);

    // Assert
    expect(videoFound).toMatchObject(videoCreated);
  });

  test('should throw VideoNotFound when videoId do not exist', async () => {
    // Arrange
    const videoId = 'unexistentVideoId';
    const clientIp = '127.0.0.1';

    // Act + Assert
    await expect( async () => {
      await findVideo(videoId, clientIp)
    }).rejects.toBeInstanceOf(VideoNotFound);
  });
});
