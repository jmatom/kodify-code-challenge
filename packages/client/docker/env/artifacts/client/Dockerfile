FROM node:10.14.2-alpine

RUN apk add --no-cache --quiet \
# npm
git=~2.18 \
# node-gyp
# https://github.com/nodejs/node-gyp/tree/v5.0.4#on-unix
g++=~6.4 \
make=~4.2 \
python=~2.7

WORKDIR /srv/kodify-technical-test-client

COPY package.json yarn.lock ./

# # Hide harmless warnings from node-gyp builds.
ENV CXXFLAGS='-Wno-deprecated-declarations'

# # Silence annoying '(node:1) Warning: .then() only accepts functions but was passed: [object Object]'
ENV BLUEBIRD_DEBUG='0'

# # Silence annoying support messages during install
ENV SUPPRESS_SUPPORT='true'

# Install development dependencies.
ENV NODE_ENV='development'

# No need to bake credentials into the image
RUN yarn install --loglevel warn

CMD ["npm", "start"]