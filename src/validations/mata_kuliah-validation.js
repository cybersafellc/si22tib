import Joi from "joi";

const create = Joi.object({
  nama: Joi.string().required(),
  sks: Joi.number().required(),
  dosen: Joi.string().required(),
});

const get = Joi.object({
  page: Joi.number().optional(),
  take: Joi.number().optional(),
});

export default { create, get };
