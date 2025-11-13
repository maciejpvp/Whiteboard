import * as cdk from "aws-cdk-lib";
import { Construct } from "constructs";
import { createWhiteboardTable } from "../infra/createWhiteboardTable";
import { createLambdas } from "../infra/createLambdas";
import { createAPIGateway } from "../infra/createAPIGateway";
import { createCognito } from "../infra/createCognito";
import { getAPIGatewayRoutes } from "../infra/getAPIGatewayRoutes";
import { createConnectionsTable } from "../infra/createConnectionsTable";
import { createWebSocketAPI } from "../infra/createWebSocketAPI";
import * as iam from "aws-cdk-lib/aws-iam";
import { createWebSocketSQS } from "../infra/createWebSocketSQS";
import { createWhiteboardAccessTable } from "../infra/createWhiteboardAccessTable";

interface WhiteboardStackProps extends cdk.StackProps {
  stage: string;
}

export class WhiteboardStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props: WhiteboardStackProps) {
    super(scope, id, props);
    const { stage } = props;

    const { userPool, userPoolClient } = createCognito(this, stage);

    const whiteboardTable = createWhiteboardTable({ stack: this, stage });

    const whiteboardAccessTable = createWhiteboardAccessTable({
      stack: this,
      stage,
    });

    const connectionsTable = createConnectionsTable(this, {
      stage: props.stage,
    });

    const lambdas = createLambdas(this, {
      whiteboardTable,
      whiteboardAccessTable,
      stage,
      connectionsTable,
      userPool,
      userPoolClient,
    });

    createAPIGateway(this, {
      userPool,
      stage,
      routes: getAPIGatewayRoutes({ lambdas }),
    });

    const { endpoint, wsApi } = createWebSocketAPI(this, lambdas, props.stage);

    const broadcastQueue = createWebSocketSQS({
      stack: this,
      stage,
      broadcastLambda: lambdas.broadcastUpdates.lambdaFunction,
    });

    const needWsSQSAccess = Object.values(lambdas).filter((l) => l.grantWsSQS);

    for (const l of needWsSQSAccess) {
      l.lambdaFunction.addEnvironment(
        "BROADCAST_QUEUE_URL",
        broadcastQueue.queueUrl,
      );

      broadcastQueue.grantSendMessages(l.lambdaFunction);
    }

    const needWsAccess = Object.values(lambdas).filter((l) => l.grantWsAccess);

    for (const l of needWsAccess) {
      l.lambdaFunction.addEnvironment("WS_ENDPOINT", endpoint);
      l.lambdaFunction.addToRolePolicy(
        new iam.PolicyStatement({
          effect: iam.Effect.ALLOW,
          actions: ["execute-api:ManageConnections"],
          resources: [
            `arn:aws:execute-api:eu-central-1:${this.account}:${wsApi.apiId}/${props.stage}/POST/@connections/*`,
          ],
        }),
      );
    }
  }
}
