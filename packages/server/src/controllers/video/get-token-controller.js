'use strict';

const Joi = require('joi');
const createGetToken = require('../../video/application/get-token');
const CdnRepository = require('../../video/infrastructure/cdn-repository-in-memory');

async function validateSchema(payload) {
  const sourcesSchema = Joi.object({
    src: Joi.string().trim().required(),
    size: Joi.number().integer().required(),
    type: Joi.string().trim().required(),
  });

  const videoSchema = Joi.object({
    _id: Joi.string().pattern(/^[0-9a-fA-F]{24}$/),
    videoId: Joi.string().trim().required(),
    title: Joi.string().trim().required(),
    sources: Joi.array().required().items(sourcesSchema),
  });

  const videoRootSchema = Joi.object({
    video: videoSchema,
  });

  return Joi.assert(payload, videoRootSchema);
}

/*
Create the endpoint for the url signing. The hash should be generated using the instructions
below and appended to each source url.

For the cdn to accept the request, the url needs to contain a query param called token that is
equal to a md5 hex encoded hash of the uri with a secret query param set to the relative key in
the table below.

For example http://www.cdn.com/big_buck_bunny.mp4 would require a hash encoding of
/big_buck_bunny.mp4?secret=U5e0IskwtIfA resulting in the following call to the
cdn: http://www.cdn.com/big_buck_bunny.mp4?token=666906502bbc3550b95d561fa14af3ae
*/

/**
 * We don't hava a dependency injection container so we are
 * instantiating here the dependencies
 */
function createTokenController() {
  const repository = new CdnRepository();
  const getToken = createGetToken(repository);

  async function getTokenController(req, res) {
    try {
      /**
       * Controller should run basic validators, at least to ensure the payload structure
       * is being sent before sending this videoDto to the use case
       */
      const payload = req.body;
  
      await validateSchema(payload);
    } catch (e) {
      /**
       * TODO: Create a mapper to map joi validation error to a format error we want to send
       */
      return res.status(400).send(e);
    }
  
    try {
      const videoDto = req.body.video;
      const videoWithTokenResponse = await getToken(videoDto);

      return res.send(videoWithTokenResponse);
    } catch (e) {
      /**
       * To have better performance we can use pino to log error but it's not working fine with
       * this node 10.14.0 + pino 7.6.0 (indicating worker_threads is not available)
       */
      console.error(e);

      /**
       * The use case is not triggering business errors so if this code
       * is reached then we will return a 500 error (https://jsonapi.org/format/#errors)
       */
      return res.status(500).send({
        id: e.name,
        status: "500",
        code: 500,
        title: e.message,
        detail: e,
      });
    }
  }

  return getTokenController;
}

module.exports = createTokenController;
