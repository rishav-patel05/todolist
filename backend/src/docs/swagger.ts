import swaggerJsdoc from "swagger-jsdoc";

export const swaggerSpec = swaggerJsdoc({
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Todo SaaS API",
      version: "1.0.0",
      description: "Production-ready Todo API"
    },
    servers: [{ url: "http://localhost:5000/api" }],
    components: {
      securitySchemes: {
        cookieAuth: {
          type: "apiKey",
          in: "cookie",
          name: "accessToken"
        }
      }
    }
  },
  apis: []
});
