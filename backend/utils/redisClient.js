// redisClient.js
import { createClient } from 'redis';

const redisClient = createClient();

redisClient.on('error', (err) => {
  console.error('Redis error:', err);
});

await redisClient.connect(); // Works with ES Modules (type: module in package.json)

export default redisClient;
