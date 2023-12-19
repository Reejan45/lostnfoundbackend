function checkAuthentication(req, res, next) {
  let loggedIn = true;
  if (loggedIn) {
    req.user_id = "6578908e7ce04554be24aa41";
    next();
  } else {
    res.status(401).send({
      msg: "Unauthenticated",
    });
  }
}

module.exports = { checkAuthentication };
