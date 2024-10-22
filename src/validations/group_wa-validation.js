import Joi from "joi";

const getGroupId = Joi.object({
  group_name: Joi.string().required(),
});

const create = Joi.object({
  mata_kuliah_id: Joi.string().required(),
  pid: Joi.string().required(),
});

export default { getGroupId, create };
