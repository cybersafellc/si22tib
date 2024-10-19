import Joi from "joi";

const create = Joi.object({
  username: Joi.string().required(),
  password: Joi.string().required(),
  nim: Joi.string().required(),
  nama: Joi.string().required(),
  whatsapp: Joi.string().required(),
});

const login = Joi.object({
  username: Joi.string().required(),
  password: Joi.string().required(),
});

const loginInfoLogin = Joi.object({
  ip_address: Joi.string().required(),
  user_agent: Joi.string().required(),
});

export default { create, login, loginInfoLogin };
