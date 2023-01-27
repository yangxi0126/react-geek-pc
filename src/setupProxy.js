const { createProxyMiddleware } = require("http-proxy-middleware");

module.exports = function (app) {
  app.use(
    createProxyMiddleware("/v1_0", {
      target: "http://geek.itheima.net",
      changeOrigin: true
    })
  );
};
