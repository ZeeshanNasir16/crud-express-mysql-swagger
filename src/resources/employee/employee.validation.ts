import Joi from 'joi';

const addEmployee = Joi.object({
  fullname: Joi.string().max(60).required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(8).required(),
  salary: Joi.number().min(500).required(),
  role: Joi.string().min(3).required(),
  address: Joi.string(),
});

const updateEmp = Joi.object({
  fullname: Joi.string().max(60),
  email: Joi.string().email(),
  password: Joi.string().min(8),
  salary: Joi.number().min(500),
  role: Joi.string().min(3),
  address: Joi.string(),
});

export default { updateEmp, addEmployee };
