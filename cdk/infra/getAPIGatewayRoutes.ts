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
      name: "deleteWhiteboard",
      type: "DELETE",
      route: "whiteboard/{id}",
      lambda: lambdas.deleteWhiteboard.lambdaFunction,
      secured: true,
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
    {
      name: "getSharedWhiteboardItem",
      type: "GET",
      route: "whiteboard/shared/{ownerId}/{id}",
      lambda: lambdas.getSharedWhiteboard.lambdaFunction,
      secured: true,
    },

    {
      name: "updateWhiteboardData",
      type: "POST",
      route: "whiteboard/draw/{id}",
      lambda: lambdas.updateWhiteboardData.lambdaFunction,
      secured: true,
    },
    {
      name: "shareWhiteboard",
      type: "POST",
      route: "whiteboard/share/{id}",
      lambda: lambdas.shareWhiteboard.lambdaFunction,
      secured: true,
    },
  ];

  return routes;
};
