import { database } from "../app/database.js";
import { Response } from "../app/response.js";
import { ResponseError } from "../errors/response-error.js";
import usersValidation from "../validations/users-validation.js";
import { validation } from "../validations/validation.js";
import crypto from "crypto";
import bcrypt from "bcrypt";
import Jwt from "jsonwebtoken";
import { client } from "../app/whatsapp.js";
import { logger } from "../app/logging.js";

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

async function login(request, log) {
  const result = await validation(usersValidation.login, request);
  const resLog = await validation(usersValidation.loginInfoLogin, log);
  const user = await database.user.findFirst({
    where: {
      username: result.username,
    },
  });
  if (user && (await bcrypt.compare(result.password, user.password))) {
    //
    const response = await fetch(
      `http://ip-api.com/json/${resLog.ip_address}`,
      {
        method: "GET",
        headers: {
          Accept: "application/json",
        },
      }
    );
    const responseJson = await response.json();
    client
      .sendMessage(
        `62${user.whatsapp}@c.us`,
        `
Hello ${user.nama},
Anda baru saja berhasil masuk ke sistem kami.

Details Login :
IP Address : ${responseJson?.query}
ISP : ${responseJson?.org}
Kota : ${responseJson?.city}
Provinsi : ${responseJson?.regionName}
Device : ${resLog.user_agent}
Time : ${new Date()}

Maps : https://www.google.com/maps/@${responseJson?.lat},${
          responseJson?.lon
        },14z`
      )
      .then((response) => {
        logger.info(response);
      })
      .catch((err) => {
        logger.error(err.message);
      });
    //
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

async function get(request) {
  const result = await validation(usersValidation.get, request);
  const response = await database.user.findUnique({
    where: {
      id: result.user_id,
    },
    select: {
      id: true,
      username: true,
      nim: true,
      nama: true,
      whatsapp: true,
    },
  });
  if (!response)
    throw new ResponseError(400, `username with id ${result.id} tidak ada`);
  return new Response(200, "info profil", response, null, false);
}

async function verifyToken(request) {
  const result = await validation(usersValidation.verifyToken, request);
  const count = await database.user.count({
    where: result,
  });
  if (!count)
    throw new ResponseError(
      400,
      "this users maybe admin deleted, or your account locked!"
    );
  return new Response(200, "token verified", null, null, false);
}

export default { create, login, get, verifyToken };
