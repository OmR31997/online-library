import swaggerJSDoc from "swagger-jsdoc";

const options: swaggerJSDoc.Options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Online Library API Documentation",
      version: "1.0.0",
      description: "API specifications for the roadmap, tutorials, quizzes, and user authentication endpoints of the Online Library platform.",
    },
    servers: [
      {
        url: "/api",
        description: "Local API base URL",
      },
    ],
  },
  // Document all API handlers in src/app/api
  apis: ["./src/app/api/**/*.ts"],
};

export const swaggerSpec = swaggerJSDoc(options);
