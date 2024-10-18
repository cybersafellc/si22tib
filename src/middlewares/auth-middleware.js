import Jwt from "jsonwebtoken";
import { ResponseError } from "../errors/response-error.js";

async function user(req, res, next) {
  try {
    const access_token = await req.headers["authorization"]?.split(" ")[1];
    const response = Jwt.verify(
      access_token,
      process.env.USER_SECRET,
      (err, decode) => {
        if (err)
          throw new ResponseError(400, "please provided valid access_token!");
        return decode;
      }
    );
    req.id = await response.id;
    next();
  } catch (error) {
    next(error);
  }
}

export default { user };
