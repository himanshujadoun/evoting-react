// const express = require('express');
// const webpack = require('webpack');
// const webpackDevMiddleware = require('webpack-dev-middleware');
// const app = express();

// // Load Create React App's Webpack config
// const webpackConfig = require('react-scripts/config/webpack.config')('development');
// const compiler = webpack(webpackConfig);

// // Use Webpack Dev Middleware to serve React app
// app.use(
//   webpackDevMiddleware(compiler, {
//     publicPath: webpackConfig.output.publicPath,
//   })
// );

// // Example API route
// app.get('/api/test', (req, res) => {
//   res.json({ message: 'Backend works! after' });
// });

// const PORT = process.env.PORT || 3000;
// app.listen(PORT, () => {
//   console.log(`Server running on http://localhost:${PORT}`);
// });


const express = require('express');
const webpack = require('webpack');
const webpackDevMiddleware = require('webpack-dev-middleware');
const swaggerJsDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const app = express();

// Load Create React App's Webpack config
const webpackConfig = require('react-scripts/config/webpack.config')('development');
const compiler = webpack(webpackConfig);

// Use Webpack Dev Middleware to serve React app
app.use(
  webpackDevMiddleware(compiler, {
    publicPath: webpackConfig.output.publicPath,
  })
);

// Swagger Configuration
const swaggerOptions = {
  swaggerDefinition: {
    openapi: "3.0.0",
    info: {
      title: "Evoting API",
      version: "1.0.0",
      description: "API documentation for the Evoting system",
      contact: {
        name: "Developer",
      },
    },
    servers: [
      {
        url: "http://localhost:3000",
      },
    ],
  },
  apis: ["./server.js"], // Path to API routes
};

const swaggerDocs = swaggerJsDoc(swaggerOptions);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocs));

// Example API route
/**
 * @swagger
 * /api/test:
 *   get:
 *     summary: Test API
 *     description: Returns a simple JSON message
 *     responses:
 *       200:
 *         description: Success
 */

app.get('/api/test', (req, res) => {
  res.json({ message: 'Backend works! after' });
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
  console.log(`Swagger Docs available at http://localhost:${PORT}/api-docs`);
});
