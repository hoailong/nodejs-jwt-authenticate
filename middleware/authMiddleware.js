const jwtHelper = require('../helpers/jwt.helper');
const debug = console.log.bind(console);
require('dotenv').config();

const accessTokenSecret = process.env.ACCESS_TOKEN_SECRET;

let isAuth = async(req, res, next) => {
  const tokenFromClient = req.body.token || req.query.token || req.headers["x-access-token"];
  if(tokenFromClient) {
      try{
          const decoded = await jwtHelper.verifyToken(tokenFromClient, accessTokenSecret);
          req.jwtDecoded = decoded;
          next();
      } catch(error) {
          debug("Error while verify token", error);
          return res.status(401).json({
              message: 'Unauthorized.'
          });
      }
  } else {
      return res.status(403).json({
          message: 'No token provided.'
      })
  }
};

module.exports = {
    isAuth
};