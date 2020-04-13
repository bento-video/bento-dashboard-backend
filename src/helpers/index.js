function asyncRoute(callback) {
  return function (req, res, next) {
    callback(req, res, next).catch(next);
  };
}
export default asyncRoute;
