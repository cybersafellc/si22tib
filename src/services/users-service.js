import { database } from "../app/database.js";
import { Response } from "../app/response.js";
import { ResponseError } from "../errors/response-error.js";
import usersValidation from "../validations/users-validation.js";
import { validation } from "../validations/validation.js";
import crypto from "crypto";
import bcrypt from "bcrypt";
import Jwt from "jsonwebtoken";

async function create(request) {
  // validate inputan users
  const result = await validation(usersValidation.create, request);
  // check apakah user ada
  const count = await database.user.count({
    where: {
      nim: result.nim,
    },
  });
  if (count) throw new ResponseError(400, "username already exist");
  // exe
  result.id = crypto.randomUUID();
  result.password = await bcrypt.hash(result.password, 10);
  const response = await database.user.create({
    data: result,
    select: {
      id: true,
      nim: true,
      nama: true,
    },
  });
  return new Response(200, "berhasil membuat akun", response, null, false);
}

async function login(request) {
  const result = await validation(usersValidation.login, request);
  const user = await database.user.findFirst({
    where: {
      username: result.username,
    },
  });
  if (user && (await bcrypt.compare(result.password, user.password))) {
    const access_token = await Jwt.sign(
      { id: user.id },
      process.env.USER_SECRET,
      { expiresIn: "1d" }
    );
    return new Response(200, "berhasil login", { access_token }, null, false);
  } else {
    throw new ResponseError(400, "username atau password salah!");
  }
}

export default { create, login };
