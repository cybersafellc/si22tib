import tugasService from "../services/tugas-service.js";

async function create(req, res, next) {
  try {
    const response = await tugasService.create(req.body);
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
      response = await tugasService.getById(req.body);
    } else {
      req.body.page =
        parseInt(req.query.page) > 0 ? parseInt(req.query.page) : 1 || 1;
      req.body.take =
        parseInt(req.query.take) >= 10 ? parseInt(req.query.take) : 10 || 10;
      response = await tugasService.get(req.body);
    }
    res.status(response.status).json(response).end();
  } catch (error) {
    next(error);
  }
}

async function deletes(req, res, next) {
  try {
    const response = await tugasService.deletes(req.body);
    res.status(response.status).json(response).end();
  } catch (error) {
    next(error);
  }
}

export default { create, get, deletes };
