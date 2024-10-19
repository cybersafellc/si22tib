import Joi from "joi";

const create = Joi.object({
  mata_kuliah_id: Joi.string().required(),
  ruang: Joi.string().required(),
  hari: Joi.number().required(),
  jam_masuk: Joi.string().required(),
  jam_keluar: Joi.string().required(),
});

const get = Joi.object({
  page: Joi.number().optional(),
  take: Joi.number().optional(),
});

const getById = Joi.object({
  id: Joi.string().required(),
});

export default { create, get, getById };
