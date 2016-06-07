module.exports = function mapErrors(error) {
  if (error && !error.isJoi) {
    return error;
  }

  /*
    For now, only parse one level deep. We are saved by the dot notation on errors
    such as form.user.something. For now, this will override key: error with the most
    recent find. If needed, we can override this but I would prefer to only project one
    error.
  */
  const response = {
    isJoi: true,
    valid: false,
    details: {},
    _object: error._object
  };
  const errorDetails = error.details || [];
  return errorDetails
    .reduce((errors, e) => {
      const list = errors;
      list.details[e.path] = { message: e.message, type: e.type };
      return list;
    }, response);
};
