import mata_kuliahService from "../services/mata_kuliah-service.js";

async function create(req, res, next) {
  try {
    const response = await mata_kuliahService.create(req.body);
    res.status(response.status).json(response).end();
  } catch (error) {
    next(error);
  }
}

async function get(req, res, next) {
  try {
    req.body.page =
      parseInt(req.query.page) > 0 ? parseInt(req.query.page) : 1 || 1;
    req.body.take =
      parseInt(req.query.take) >= 10 ? parseInt(req.query.take) : 10 || 10;

    const response = await mata_kuliahService.get(req.body);
    res.status(response.status).json(response).end();
  } catch (error) {
    next(error);
  }
}

export default { create, get };
