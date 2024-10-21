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
    req.log = {};
    req.log.ip_address = req.ip;
    req.log.user_agent = req.headers["user-agent"];
    const response = await usersService.login(req.body, req.log);
    res.status(response.status).json(response).end();
  } catch (error) {
    next(error);
  }
}

async function get(req, res, next) {
  try {
    req.body.user_id = await req.id;
    const response = await usersService.get(req.body);
    res.status(response.status).json(response).end();
  } catch (error) {
    next(error);
  }
}

export default { create, login, get };
