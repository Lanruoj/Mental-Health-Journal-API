// Error handler middleware
function errorHandler(error, request, response, next) {
  console.log(error);
  if (error) {
    return response.status(500).json({ error: error.message });
  }
}

module.exports = { errorHandler };
