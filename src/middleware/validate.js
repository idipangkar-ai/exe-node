
import AppError from '../utils/AppError.js';

// Create reusable validation middleware using a Zod schema.
const validate = (schemas) => {
  return (req, res, next) => {
    // Store validated and transformed request data here.
    const validated = {};

    // Validate each request section only when a schema is provided.
    const requestParts = ['body', 'query', 'params'];

    for (const part of requestParts) {
      const schema = schemas[part];

      // Skip sections that do not have a validation schema.
      if (!schema) {
        continue;
      }

      // Validate the corresponding request data.
      const result = schema.safeParse(req[part]);

      // Stop processing if validation fails.
      if (!result.success) {
        const error = new AppError('Request validation failed', 400);

        // Return useful field-level validation information.
        error.details = result.error.issues.map((issue) => ({
          field: issue.path.join('.'),
          message: issue.message,
        }));

        return next(error);
      }

      // Keep the parsed data, including any Zod transformations.
      validated[part] = result.data;
    }

    // Controllers can access validated data through req.validated.
    req.validated = validated;

    next();
  };
};

export default validate;
