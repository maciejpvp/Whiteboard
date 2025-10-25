import * as cdk from "aws-cdk-lib";
import { Construct } from "constructs";
import { createWhiteboardTable } from "../infra/createWhiteboardTable";
import { createLambdas } from "../infra/createLambas";
import { createAPIGateway } from "../infra/createAPIGateway";
import { createCognito } from "../infra/createCognito";
import { getAPIGatewayRoutes } from "../infra/getAPIGatewayRoutes";

interface WhiteboardStackProps extends cdk.StackProps {
  stage: string;
}

export class WhiteboardStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props: WhiteboardStackProps) {
    super(scope, id, props);
    const { stage } = props;

    const { userPool } = createCognito(this, stage);

    const whiteboardTable = createWhiteboardTable({ stack: this, stage });

    const lambdas = createLambdas(this, { whiteboardTable, stage });

    createAPIGateway(this, {
      userPool,
      stage,
      routes: getAPIGatewayRoutes({ lambdas }),
    });
  }
}
