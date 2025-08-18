const createResponse = (success, message, data = null) => {
  console.log("Creating response:", { success, message, data });
  return {
    success,
    message,
    data,
  };
};

module.exports = {
  createResponse,
};
