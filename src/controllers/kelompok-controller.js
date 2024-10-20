import kelompokService from "../services/kelompok-service.js";

async function create(req, res, next) {
  try {
    const response = await kelompokService.create(req.body);
    res.status(response.status).json(response).end();
  } catch (error) {
    next(error);
  }
}

async function get(req, res, next) {
  try {
    let response;
    if (await req.query.id) {
      req.body.id = await req.query.id;
      response = await kelompokService.getById(req.body);
    } else {
      req.body.page =
        parseInt(req.query.page) > 0 ? parseInt(req.query.page) : 1 || 1;
      req.body.take =
        parseInt(req.query.take) >= 10 ? parseInt(req.query.take) : 10 || 10;
      response = await kelompokService.get(req.body);
    }
    res.status(response.status).json(response).end();
  } catch (error) {
    next(error);
  }
}

async function deletes(req, res, next) {
  try {
    const response = await kelompokService.deletes(req.body);
    res.status(response.status).json(response).end();
  } catch (error) {
    next(error);
  }
}

export default { create, get, deletes };
