# `server`

> TODO: description

## Usage

```
const server = require('server');

// TODO: DEMONSTRATE API
```

# Jose' notes
## Task 2
For generate token, I am using crypto.createHash function. This function is async and we are going to hit it hardly.
To check everything is ok, I used autocannon, node clinic and node hooks to observe the performance.
So far, autocannon results were good and I did not notice any problem at first sight,
getting 3300 rps

```
autocannon -m POST -b '{"video":{"_id":"6213a7299fa2604f1b188ee0","videoId":"12345","title":"Big Buck Bunny","sources":[{"src":"/Big_Buck_Bunny_1080p_surround_FrostWire.com.mp4","size":1080,"type":"video/mp4"},{"src":"/Big_Buck_Bunny_720p_surround_FrostWire.com.mp4","size":720,"type":"video/mp4"}]}}' -H 'Content-type: application/json' -c 1000 -p 1 -d 10 --renderStatusCodes http://localhost:3002/video/token

┌─────────┬────────┬────────┬────────┬────────┬───────────┬───────────┬─────────┐
│ Stat    │ 2.5%   │ 50%    │ 97.5%  │ 99%    │ Avg       │ Stdev     │ Max     │
├─────────┼────────┼────────┼────────┼────────┼───────────┼───────────┼─────────┤
│ Latency │ 202 ms │ 307 ms │ 773 ms │ 852 ms │ 357.83 ms │ 173.88 ms │ 2284 ms │
└─────────┴────────┴────────┴────────┴────────┴───────────┴───────────┴─────────┘
┌───────────┬─────────┬─────────┬─────────┬─────────┬─────────┬────────┬─────────┐
│ Stat      │ 1%      │ 2.5%    │ 50%     │ 97.5%   │ Avg     │ Stdev  │ Min     │
├───────────┼─────────┼─────────┼─────────┼─────────┼─────────┼────────┼─────────┤
│ Req/Sec   │ 1759    │ 1759    │ 3217    │ 4131    │ 3275.57 │ 504.36 │ 1759    │
├───────────┼─────────┼─────────┼─────────┼─────────┼─────────┼────────┼─────────┤
│ Bytes/Sec │ 1.23 MB │ 1.23 MB │ 2.25 MB │ 2.88 MB │ 2.29 MB │ 352 kB │ 1.23 MB │
└───────────┴─────────┴─────────┴─────────┴─────────┴─────────┴────────┴─────────┘
┌──────┬───────┐
│ Code │ Count │
├──────┼───────┤
│ 200  │ 98256 │
└──────┴───────┘

99k requests in 30.09s, 68.6 MB read
```

But it would be nice to reduce the response time.

Running this test, I didn't see a performance problem about not using a mongoose pool but in a production system we should know the limits of our app and a pool is always recommended to avoid unexpected scenarios / bad performance.

## Task 4
An EventBus in memory was created. Architecture is:
1. Any use case / app service can trigger an event into the event bus (an event must be definend at src/video/application/domain)
2. A application handler (use case / app service) is subscribed to N events (just 1 in this code challenge).
3. Triggered event reaches event bus and event bus deliver the event for the subscriber app services
4. Subscriber app service perform the task

This event bus was done in a simple way using Node.js Event Emitter.

When an event can not be processed, would be nice to have a queue (like Rabbit) and define queue strategies to retry the message process again.

## Task 5
I did not have time to add more tests so some componentes were without proper testing :/ like:
* EventBus
* Check if a visit was being stored into the database


## Extra
* For the backend, Docker contained was updated to node:16.14.0-alpine
* An images were builded to avoid problems using `docker-compose build --no-cache --pull`
