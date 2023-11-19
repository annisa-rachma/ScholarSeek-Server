const Redis = require("ioredis")
const redis = new Redis("redis://default:1sL97yqC9QPsrzjZKnuTSqV5NZ9uRtck@redis-11610.c252.ap-southeast-1-1.ec2.cloud.redislabs.com:11610");

module.exports = redis