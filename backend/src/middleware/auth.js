export function localVariables(req, res, next) {
  req.app.locals = {
    OTP: null,
  };
  next();
}