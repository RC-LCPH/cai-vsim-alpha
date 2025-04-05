const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function(app) {
  const databricksHost = process.env.REACT_APP_DATABRICKS_HOST;
  
  if (databricksHost) {
    app.use(
      '/serving-endpoints',
      createProxyMiddleware({
        target: `https://${databricksHost}`,
        changeOrigin: true,
        secure: true,
        logLevel: 'debug',
      })
    );
  }
}; 