import Joi from "joi";

const create = Joi.object({
  mata_kuliah_id: Joi.string().required(),
  nama_tugas: Joi.string().required(),
  deadline: Joi.string().required(),
});

const get = Joi.object({
  page: Joi.number().required(),
  take: Joi.number().required(),
});

const getById = Joi.object({
  id: Joi.string().required(),
});

const deletes = Joi.object({
  id: Joi.string().required(),
});

export default { create, get, getById, deletes };
