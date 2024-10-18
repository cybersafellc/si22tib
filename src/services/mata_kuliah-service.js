import { database } from "../app/database.js";
import { Response } from "../app/response.js";
import { ResponseError } from "../errors/response-error.js";
import mata_kuliahValidation from "../validations/mata_kuliah-validation.js";
import { validation } from "../validations/validation.js";
import crypto from "crypto";

async function create(request) {
  const result = await validation(mata_kuliahValidation.create, request);
  const count = await database.mata_kuliah.count({
    where: {
      nama: result.nama,
    },
  });
  if (count)
    throw new ResponseError(400, `mata kuliah ${result.nama} sudah ada`);
  result.id = crypto.randomUUID();
  const response = await database.mata_kuliah.create({
    data: result,
  });
  return new Response(200, "berhasil menambahkan", response, null, false);
}

async function get(request) {
  const result = await validation(mata_kuliahValidation.get, request);
  result.page = (result.page - 1) * result.take;
  const response = await database.mata_kuliah.findMany({
    orderBy: {
      nama: "asc",
    },
    take: result.take,
    skip: result.page,
  });
  return new Response(200, "list mata kuliah", response, null, false);
}

export default { create, get };
