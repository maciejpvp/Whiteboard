import { ObjectSchema } from "joi";

interface ParsePathParamsOptions<T> {
  event: any;
  schema?: ObjectSchema<T>;
}

export function parsePathParams<T = any>({
  event,
  schema,
}: ParsePathParamsOptions<T>):
  | { ok: true; value: T }
  | { ok: false; error: string } {
  if (!event || !event.pathParameters) {
    return { ok: false, error: "Missing path parameters" };
  }

  const params = event.pathParameters;

  if (schema) {
    const { error, value } = schema.validate(params, {
      abortEarly: false,
      stripUnknown: true,
    });

    if (error) {
      return {
        ok: false,
        error: error.details.map((d) => d.message).join(", "),
      };
    }

    return { ok: true, value };
  }

  return { ok: true, value: params };
}
