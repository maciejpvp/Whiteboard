import { createLambdas } from "./createLambas";
import { Route } from "./createAPIGateway";

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
    },
  ];

  return routes;
};
