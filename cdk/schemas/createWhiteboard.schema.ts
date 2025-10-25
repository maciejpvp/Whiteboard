import * as apigateway from "aws-cdk-lib/aws-apigateway";

const schema: apigateway.JsonSchema = {
  type: apigateway.JsonSchemaType.OBJECT,
  required: ["name"],
  properties: {
    name: {
      type: apigateway.JsonSchemaType.STRING,
      minLength: 1,
      maxLength: 60,
    },
  },
  additionalProperties: false,
};

export const createWhiteboardSchema = {
  modelName: "createWhiteboardSchema",
  schema,
};
