import { database } from "../app/database.js";
import { Response } from "../app/response.js";
import { ResponseError } from "../errors/response-error.js";
import kelompokValidation from "../validations/kelompok-validation.js";
import { validation } from "../validations/validation.js";
import crypto from "crypto";

async function create(request) {
  const result = await validation(kelompokValidation.create, request);
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
  const count = await database.kelompok.count({
    where: {
      mata_kuliah_id: result.mata_kuliah_id,
      nama: result.nama,
    },
  });
  if (count)
    throw new ResponseError(
      400,
      `kelompok ${result.nama} di mata kuliah id ${result.mata_kuliah_id} sudah ada!`
    );
  result.id = crypto.randomUUID();
  const response = await database.kelompok.create({
    data: result,
  });
  return new Response(
    200,
    "berhasil menambahkan kelompok",
    response,
    null,
    false
  );
}

async function get(request) {
  const result = await validation(kelompokValidation.get, request);
  result.page = (result.page - 1) * result.take;
  let response = await database.kelompok.findMany({
    orderBy: {
      create_at: "asc",
    },
    take: result.take,
    skip: result.page,
  });
  response = await Promise.all(
    response.map(async (kelompok) => {
      kelompok.mata_kuliah = await database.mata_kuliah.findUnique({
        where: {
          id: kelompok.mata_kuliah_id,
        },
        select: {
          id: true,
          nama: true,
          sks: true,
          dosen: true,
        },
      });
      kelompok.mata_kuliah_id = undefined;
      return kelompok;
    })
  );
  return new Response(200, "list kelompok", response, null, false);
}

async function getById(request) {
  const result = await validation(kelompokValidation.getById, request);
  let response = await database.kelompok.findUnique({
    where: result,
  });
  if (!response)
    throw new ResponseError(400, `kelompok dengan id ${result.id} tidak ada!`);
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
    `kelompok dengan id ${result.id}`,
    response,
    null,
    false
  );
}

async function deletes(request) {
  const result = await validation(kelompokValidation.deletes, request);
  const count = await database.kelompok.count({
    where: result,
  });
  if (!count)
    throw new ResponseError(400, `kelompok dengan id ${result.id} tidak ada`);
  const response = await database.kelompok.delete({
    where: result,
  });
  return new Response(
    200,
    `berhasil menghapus kelompok dengan id ${result.id}`,
    response,
    null,
    false
  );
}

export default { create, get, getById, deletes };
