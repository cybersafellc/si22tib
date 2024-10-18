import usersService from "../services/users-service.js";

async function create(req, res, next) {
  try {
    const response = await usersService.create(req.body);
    res.status(response.status).json(response).end();
  } catch (error) {
    next(error);
  }
}

async function login(req, res, next) {
  try {
    const response = await usersService.login(req.body);
    res.status(response.status).json(response).end();
  } catch (error) {
    next(error);
  }
}

export default { create, login };
