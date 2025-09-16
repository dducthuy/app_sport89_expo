const swaggerJsDoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");

// Cấu hình swagger
const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "API Documentation",
      version: "1.0.0",
      description: "Docs cho API của bạn",
    },
    servers: [
      {
        url: "http://localhost:3000", // base url backend
      },
    ],
  },
  apis: ["./routes/*.js"], // nơi bạn viết swagger comments
};

const swaggerSpec = swaggerJsDoc(options);

function swaggerDocs(app, port) {
  app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
  console.log(`📚 Swagger chạy tại: http://localhost:${port}/api-docs`);
}

module.exports = swaggerDocs;
