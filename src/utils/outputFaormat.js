module.exports = function (status, message, data) {
  return {
    status: status,
    message,
    data,
  }
}