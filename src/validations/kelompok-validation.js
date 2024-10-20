import Joi from "joi";

const create = Joi.object({
  mata_kuliah_id: Joi.string().required(),
  nama: Joi.string().required(),
  anggota: Joi.string().required(),
});

const get = Joi.object({
  page: Joi.number().optional(),
  take: Joi.number().optional(),
});

const getById = Joi.object({
  id: Joi.string().required(),
});

const deletes = Joi.object({
  id: Joi.string().required(),
});

export default { create, get, getById, deletes };
