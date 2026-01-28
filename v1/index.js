require('egg').startCluster({
  baseDir: __dirname,
  workers: 1,
  port: process.env.port || 7001,
});
