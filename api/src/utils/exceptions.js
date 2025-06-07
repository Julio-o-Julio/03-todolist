const handleError = (response, status, message) => {
  return response.status(status).json({ error: message });
};

module.exports = handleError;
