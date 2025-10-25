import { Construct } from "constructs";
import * as apigateway from "aws-cdk-lib/aws-apigateway";
import * as lambda from "aws-cdk-lib/aws-lambda";

export type RequestSchema = {
  modelName: string;
  schema: apigateway.JsonSchema;
  validateRequestBody?: boolean;
  validateRequestParameters?: boolean;
};

type CommonProps = {
  api: apigateway.RestApi;
  type: string; // "GET" | "POST" | "DELETE" | "PUT" | "PATCH";
  route: string | string[];
  lambda: lambda.IFunction;
  name: string;
  requestSchema?: RequestSchema;
};

export type ApiRouteProps =
  | (CommonProps & {
      secured: true;
      authorizer: apigateway.CognitoUserPoolsAuthorizer;
    })
  | (CommonProps & {
      secured?: false;
      authorizer?: never;
    });

export class ApiRoute extends Construct {
  constructor(scope: Construct, props: ApiRouteProps) {
    super(scope, props.name);

    const {
      api,
      authorizer,
      type,
      route,
      lambda,
      secured = false,
      name,
      requestSchema,
    } = props;

    const parts = Array.isArray(route)
      ? route.filter(Boolean)
      : route.split("/").filter(Boolean);

    if (parts.length === 0) {
      throw new Error("Route path must not be empty");
    }

    let resource = api.root;

    for (const part of parts) {
      resource = this.getOrCreateResource(resource, part);
    }

    let requestModel: apigateway.Model | undefined;
    let validator: apigateway.RequestValidator | undefined;

    if (requestSchema) {
      requestModel = new apigateway.Model(
        this,
        `${requestSchema.modelName}Model`,
        {
          restApi: api,
          contentType: "application/json",
          modelName: requestSchema.modelName,
          schema: requestSchema.schema,
        },
      );

      validator = new apigateway.RequestValidator(
        this,
        `${requestSchema.modelName}Validator`,
        {
          restApi: api,
          requestValidatorName: `${requestSchema.modelName}-validator`,
          validateRequestBody: requestSchema.validateRequestBody ?? true,
          validateRequestParameters:
            requestSchema.validateRequestParameters ?? false,
        },
      );
    }

    resource.addMethod(type, new apigateway.LambdaIntegration(lambda), {
      ...(secured && {
        authorizer,
        authorizationType: apigateway.AuthorizationType.COGNITO,
      }),
      operationName: name ?? `${type} ${parts.join("/")}`,
      requestModels: requestModel
        ? { "application/json": requestModel }
        : undefined,
      requestValidator: validator,
    });
  }

  // For Checking if path already exists
  private getOrCreateResource(
    parent: apigateway.IResource,
    part: string,
  ): apigateway.IResource {
    let existing = parent.getResource(part);
    if (existing) {
      return existing;
    }
    return parent.addResource(part);
  }
}
