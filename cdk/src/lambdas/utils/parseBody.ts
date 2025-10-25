import { ObjectSchema } from "joi";

interface ParseBodyOptions<T> {
  event: any;
  schema?: ObjectSchema<T>;
}

type ResponseType<T> =
  | {
      ok: true;
      value: T;
    }
  | {
      ok: false;
      error: string;
    };

export function parseBody<T = any>({
  event,
  schema,
}: ParseBodyOptions<T>): ResponseType<T> {
  if (!event || !event.body) {
    return { ok: false, error: "Missing body" };
  }

  try {
    const rawBody =
      event.isBase64Encoded && typeof event.body === "string"
        ? Buffer.from(event.body, "base64").toString("utf-8")
        : event.body;

    const parsed = typeof rawBody === "string" ? JSON.parse(rawBody) : rawBody;

    if (schema) {
      const { error, value } = schema.validate(parsed, {
        abortEarly: false,
      });

      if (error) {
        return {
          ok: false,
          error: error.details.map((d) => d.message).join(", "),
        };
      }

      return { value: value as T, ok: true };
    }

    return { value: parsed as T, ok: true };
  } catch (err) {
    console.error("Failed to parse body:", err);
    return { ok: false, error: "Bad Request" };
  }
}
