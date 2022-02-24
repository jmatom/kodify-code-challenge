
# https://jdlm.info/articles/2019/09/06/lessons-building-node-app-docker.html
FROM node:16.14.0-alpine

#RUN apk add --no-cache --quiet \
#    git=~2.18 \
#    g++=~6.4 \
#    make=~4.2 \
#    python=~2.7
RUN apk add --no-cache --quiet git g++ make

WORKDIR /srv/kodify-technical-test-server

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