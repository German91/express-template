export const validateEmpty = (fields) => {
  const errors = {};

  if (fields.length) {
    fields.forEach((field) => {
      if (!field.value) {
        errors[field.name] = {
          error: field.name,
          message: `${field.name} is required`
        };
      }
    });
  }

  return errors;
};

export const validateMatch = (field1, field2) => {
  if (field1 !== field2) {
    return { error: field2, message: 'Password does not match' };
  }
};
