import group_waService from "../services/group_wa-service.js";

async function getGroupId(req, res, next) {
  try {
    req.body.group_name = (await req.query.q) || (await req.query.name);
    const response = await group_waService.getGroupId(req.body);
    res.status(response.status).json(response).end();
  } catch (error) {
    next();
  }
}

async function create(req, res, next) {
  try {
    const response = await group_waService.create(req.body);
    res.status(response.status).json(response).end();
  } catch (error) {
    next(error);
  }
}

async function get(req, res, next) {
  try {
    const response = await group_waService.get();
    res.status(response.status).json(response).end();
  } catch (error) {
    next(error);
  }
}

export default { getGroupId, create, get };
