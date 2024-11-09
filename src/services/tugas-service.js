import { database } from "../app/database.js";
import { logger } from "../app/logging.js";
import { Response } from "../app/response.js";
import { client } from "../app/whatsapp.js";
import { ResponseError } from "../errors/response-error.js";
import tugasValidation from "../validations/tugas-validation.js";
import { validation } from "../validations/validation.js";
import crypto from "crypto";

async function create(request) {
  const result = await validation(tugasValidation.create, request);
  const count0 = await database.mata_kuliah.count({
    where: {
      id: result.mata_kuliah_id,
    },
  });
  if (!count0)
    throw new ResponseError(
      400,
      `mata kuliah dengan id ${result.mata_kuliah_id} tidak ada!`
    );
  const count = await database.tugas.findFirst({
    where: {
      mata_kuliah_id: result.mata_kuliah_id,
      nama_tugas: result.nama_tugas,
    },
  });
  if (count) throw new ResponseError(400, "tugas suadah ada!");
  result.id = crypto.randomUUID();
  const response = await database.tugas.create({
    data: result,
  });
  const users = await database.user.findMany();
  await Promise.all(
    users.map(async (user) => {
      try {
        await client.sendMessage(
          `62${user.whatsapp}@c.us`,
          `
Hello ${user.nama},
Admin baru saja menambahkan List Tugas Terbaru

Silahkan cek di sistem kita
https://sisfo.htp22tib.com
`
        );
      } catch (error) {
        logger.error(error.message);
      }
    })
  );
  return new Response(200, "berhasil menambahkan tugas", response, null, false);
}

async function get(request) {
  const result = await validation(tugasValidation.get, request);
  result.page = (result.page - 1) * result.take;
  let response = await database.tugas.findMany({
    orderBy: {
      deadline: "asc",
    },
    skip: result.page,
    take: result.take,
  });
  response = await Promise.all(
    response.map(async (jadwal) => {
      jadwal.mata_kuliah = await database.mata_kuliah.findUnique({
        where: {
          id: jadwal.mata_kuliah_id,
        },
        select: {
          id: true,
          nama: true,
          sks: true,
          dosen: true,
        },
      });
      jadwal.mata_kuliah_id = undefined;
      return jadwal;
    })
  );
  return new Response(200, "list tugas", response, null, false);
}

async function getById(request) {
  const result = await validation(tugasValidation.getById, request);
  let response = await database.tugas.findUnique({
    where: result,
  });
  if (!response)
    throw new ResponseError(400, `tugas dengan id ${result.id} tidak ada!`);
  response.mata_kuliah = await database.mata_kuliah.findUnique({
    where: {
      id: response.mata_kuliah_id,
    },
    select: {
      id: true,
      nama: true,
      sks: true,
      dosen: true,
    },
  });
  response.mata_kuliah_id = undefined;
  return new Response(
    200,
    `tugas dengan id ${result.id}`,
    response,
    null,
    false
  );
}

async function deletes(request) {
  const result = await validation(tugasValidation.deletes, request);
  const count = await database.tugas.count({
    where: result,
  });
  if (!count)
    throw new ResponseError(400, `tugas dengan id ${result.id} tidak ada!`);
  const response = await database.tugas.delete({
    where: result,
  });
  return new Response(200, "berhasil menghapus", response, null, false);
}

export default { create, get, getById, deletes };
