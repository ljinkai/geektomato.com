class AppBootHook {
    constructor(app) {
      this.app = app;
    }


    async didLoad() {
    }

    async didReady() {
        // 应用已经启动完毕
    }

    async serverDidReady() {
        // http / https server 已启动，开始接受外部请求
        // 此时可以从 app.server 拿到 server 的实例
        // console.log("begin==serverDidReady")

        // const ctx = await this.app.createAnonymousContext();
        // await ctx.service.imstart.allFetch();
        // console.log("finish==serverDidReady")
    }
  }

  module.exports = AppBootHook;
