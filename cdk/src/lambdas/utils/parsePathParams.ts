import { ObjectSchema } from "joi";

interface ParsePathParamsOptions<T> {
  event: any;
  schema?: ObjectSchema<T>;
}

export function parsePathParams<T = any>({
  event,
  schema,
}: ParsePathParamsOptions<T>): { value: T | null; error?: string } {
  if (!event || !event.pathParameters) {
    return { value: null, error: "Missing path parameters" };
  }

  const params = event.pathParameters;

  if (schema) {
    const { error, value } = schema.validate(params, {
      abortEarly: false,
      stripUnknown: true,
    });

    if (error) {
      return {
        value: null,
        error: error.details.map((d) => d.message).join(", "),
      };
    }

    return { value };
  }

  return { value: params };
}
