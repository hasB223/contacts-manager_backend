const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  const authHeader = req.headers.authorization;

  // Check if Authorization header exists and starts with "Bearer"
  if (authHeader && authHeader.startsWith("Bearer")) {
    const token = authHeader.split(" ")[1];

    // Verify token with ACCESS_TOKEN_SECRET
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
      try {
        if (err) {
          res.status(401);
          throw new Error("User is not authorized");
        }
        // Attach user object from decoded token to request object
        req.user = decoded.user;

        // Call the next middleware
        next();
      } catch (err) {
        console.log(err);
        // return error to client
        return next(err);
      }
    });
  } else {
    // Return 403 Forbidden status if Authorization header is missing or doesn't start with "Bearer"
    res.sendStatus(403);
  }
};
