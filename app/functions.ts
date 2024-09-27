import { z } from "zod";
import { getHeaders } from "vinxi/http";
import { setResponseStatus, setResponseHeader } from "vinxi/http";

export type FlattenedError<T> = {
  fieldErrors: { [K in keyof T]?: string[] };
  formErrors: string[];
};

export class ValidationError<T> extends Error {
  constructor(public errors: FlattenedError<T>) {
    super("Validation Error");
    this.name = "ValidationError";
  }
}

export function createActionClient() {
  return {
    input: <T extends z.ZodType>(schema: T) => ({
      handler:
        <R>(fn: (input: { parsedInput: z.infer<T> }) => Promise<R>) =>
        async (
          rawInput: z.input<T>
        ): Promise<[R, null] | [null, FlattenedError<z.infer<T>>]> => {
          try {
            const parsedInput = schema.parse(rawInput);
            const result = await fn({ parsedInput });
            return [result, null];
          } catch (error) {
            if (error instanceof z.ZodError) {
              console.log("abc");
              setResponseStatus(202);
              return [null, error.flatten()];
            }
            if (error instanceof ValidationError) {
              console.log("def");
              setResponseStatus(202);
              setResponseHeader("Test", "abc");
              return [null, error.errors];
            }
            throw error;
          }
        },
    }),
  };
}

export function validationError<T extends z.ZodType>(
  _schema: T,
  errors: Partial<FlattenedError<z.infer<T>>>
) {
  return new ValidationError<z.infer<T>>({
    fieldErrors: errors.fieldErrors ?? {},
    formErrors: errors.formErrors ?? [],
  });
}

export function globalValidationError(error: string) {
  return validationError(z.any(), { formErrors: [error] });
}

export function fieldValidationError<T extends z.ZodType>(
  _schema: T,
  errors: FlattenedError<z.infer<T>>["fieldErrors"]
) {
  return validationError(_schema, {
    fieldErrors: errors,
  });
}

export const actionClient = createActionClient();
