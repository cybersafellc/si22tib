import { database } from "../app/database.js";
import { Response } from "../app/response.js";
import { ResponseError } from "../errors/response-error.js";
import jadwal_kuliahValidation from "../validations/jadwal_kuliah-validation.js";
import { validation } from "../validations/validation.js";
import crypto from "crypto";

async function create(request) {
  // validasi inputan user
  const result = await validation(jadwal_kuliahValidation.create, request);
  // cek matakuliah beneran ada?
  const matkulIsValid = await database.mata_kuliah.count({
    where: {
      id: result.mata_kuliah_id,
    },
  });
  if (!matkulIsValid)
    throw new ResponseError(
      400,
      "mata_kuliah_id tidak valid, tidak ditemukan mata kuliah dengan id yang anda input!"
    );
  // cek apakah matakuliahnya sudah di tentukan jadwalnya?
  const count = await database.jadwal_kuliah.count({
    where: {
      mata_kuliah_id: result.mata_kuliah_id,
    },
  });
  if (count)
    throw new ResponseError(
      400,
      `mata kuliah id ${result.mata_kuliah_id} sudah ada di jadwal perkuliahan!`
    );
  // exe
  result.id = crypto.randomUUID();
  const response = await database.jadwal_kuliah.create({
    data: result,
  });
  return new Response(
    200,
    "berhasil menambahkan jadwal perkuliahan",
    response,
    null,
    false
  );
}

async function get(request) {
  const result = await validation(jadwal_kuliahValidation.get, request);
  result.page = (result.page - 1) * result.take;
  let response = await database.jadwal_kuliah.findMany({
    orderBy: {
      hari: "asc",
    },
    skip: result.page,
    take: result.take,
  });
  response = await Promise.all(
    response.map(async (data) => {
      data.mata_kuliah = await database.mata_kuliah.findUnique({
        where: {
          id: data.mata_kuliah_id,
        },
      });
      data.mata_kuliah_id = undefined;
      data.mata_kuliah.create_at = undefined;
      data.mata_kuliah.update_at = undefined;
      return data;
    })
  );
  return new Response(200, "list jadwal perkuliahan", response, null, false);
}

async function getById(request) {
  const result = await validation(jadwal_kuliahValidation.getById, request);
  let response = await database.jadwal_kuliah.findUnique({
    where: result,
  });
  if (!response)
    throw new ResponseError(
      400,
      `tidak ada jadwal kuliah dengan id : ${result.id}`
    );
  response.mata_kuliah = await database.mata_kuliah.findUnique({
    where: {
      id: response.mata_kuliah_id,
    },
  });
  response.mata_kuliah_id = undefined;
  response.mata_kuliah.create_at = undefined;
  response.mata_kuliah.update_at = undefined;
  return new Response(
    200,
    `jadwal kuliah dengan id : ${result.id}`,
    response,
    null,
    false
  );
}

export default { create, get, getById };
