import { createLambdas } from "./createLambas";
import { Route } from "./createAPIGateway";
import { createWhiteboardSchema } from "../schemas/createWhiteboard.schema";

type Props = {
  lambdas: ReturnType<typeof createLambdas>;
};

export const getAPIGatewayRoutes = ({ lambdas }: Props) => {
  const routes: Route[] = [
    {
      name: "createWhiteboard",
      type: "POST",
      route: "whiteboard",
      lambda: lambdas.createWhiteboard.lambdaFunction,
      secured: true,
      requestSchema: createWhiteboardSchema,
    },
    {
      name: "getWhiteboardsList",
      type: "GET",
      route: "whiteboard",
      lambda: lambdas.getWhiteboardsList.lambdaFunction,
      secured: true,
    },
    {
      name: "getWhiteboardItem",
      type: "GET",
      route: "whiteboard/{id}",
      lambda: lambdas.getWhiteboardItem.lambdaFunction,
      secured: true,
    },
  ];

  return routes;
};
