// Validates the given request part against a zod schema. On failure, rejects
// with 400 and per-field messages (safe to show — schema messages never
// include internals). On success, replaces req[part] with the parsed/coerced
// data (trimmed, lowercased, numbers coerced, defaults applied).
function validate(schema, part = 'body') {
  return (req, res, next) => {
    const result = schema.safeParse(req[part]);
    if (!result.success) {
      return res.status(400).json({
        error: 'Invalid input',
        details: result.error.issues.map(i => ({ field: i.path.join('.') || part, message: i.message })),
      });
    }
    req[part] = result.data;
    next();
  };
}

module.exports = { validate };
