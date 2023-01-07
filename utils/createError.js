 const createError = (status, message) => {
    const err = new Error();
    err.status = status;
    err.message = message
    return err
  };
  module.exports = createError

//   const error = (status, message) => {
//     const err = new Error()
//     err.status = status
//     err.message = message
//     return err
//   }