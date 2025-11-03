import { Stack } from "aws-cdk-lib";
import * as cdk from "aws-cdk-lib";
import * as sqs from "aws-cdk-lib/aws-sqs";
import * as lambdaEventSources from "aws-cdk-lib/aws-lambda-event-sources";
import * as lambda from "aws-cdk-lib/aws-lambda";

type Props = {
  stack: Stack;
  stage: string;
  broadcastLambda: lambda.Function;
};

export const createWebSocketSQS = ({
  stack,
  stage,
  broadcastLambda,
}: Props) => {
  const queue = new sqs.Queue(stack, `WebSocketBroadcastQueue-${stage}`, {
    queueName: `WebSocketBroadcastQueue-${stage}`,
    visibilityTimeout: cdk.Duration.seconds(30),
  });

  broadcastLambda.addEventSource(
    new lambdaEventSources.SqsEventSource(queue, {
      batchSize: 10,
    }),
  );

  queue.grantSendMessages(broadcastLambda);

  return queue;
};
