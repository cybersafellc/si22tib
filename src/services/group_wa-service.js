import { database } from "../app/database.js";
import { Response } from "../app/response.js";
import { client } from "../app/whatsapp.js";
import { ResponseError } from "../errors/response-error.js";
import group_waValidation from "../validations/group_wa-validation.js";
import { validation } from "../validations/validation.js";
import crypto from "crypto";

async function getGroupId(request) {
  const result = await validation(group_waValidation.getGroupId, request);
  const chats = await client.getChats();
  const mathcingGroups = chats.filter(
    (chat) => chat.isGroup && chat.name === result.group_name
  );
  return new Response(
    200,
    "berhasil mendapatkan id group",
    mathcingGroups,
    null,
    false
  );
}

async function create(request) {
  const result = await validation(group_waValidation.create, request);
  const count = await database.group_wa.count({
    where: {
      mata_kuliah_id: result.mata_kuliah_id,
    },
  });
  if (count)
    throw new ResponseError(400, "untuk mata kuliah ini group sudah ada");
  result.id = crypto.randomUUID();
  const response = await database.group_wa.create({
    data: result,
  });
  return new Response(
    200,
    "berhasil menambahkan pid group",
    response,
    null,
    false
  );
}

async function get() {
  let response = await database.group_wa.findMany();
  response = await Promise.all(
    response.map(async (grup) => {
      grup.mata_kuliah = await database.mata_kuliah.findUnique({
        where: {
          id: grup.mata_kuliah_id,
        },
        select: {
          id: true,
          nama: true,
          sks: true,
          dosen: true,
        },
      });
      grup.mata_kuliah_id = undefined;
      return grub;
    })
  );
  return new Response(200, "list pid groups", response, null, false);
}

export default { getGroupId, create, get };
