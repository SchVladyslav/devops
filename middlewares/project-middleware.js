const ApiError = require("../exceptions/api-error");
const ProjectModel = require("../models/project.model");

module.exports = async function (req, res, next) {
  try {
    const client_id = req.query.client_id;
    const redirect_uri = req.query.redirect_uri;
    // const scope = req.body.scope;
    const project = await ProjectModel.findOne({ client_id });

    if (!project) {
      return next(ApiError.NotFound("Client ID does not exist"));
    }
    if (!project.redirectURLs.includes(redirect_uri)) {
      next(ApiError.BadRequest("Redirect URL mismatch!"));
    }
    //   if (project.scope != scope) {
    //     next(ApiError.BadRequest("Invalid Scope!"));
    //   }

    req.project = project;
    next();
  } catch (error) {
    if (error.code) {
      res.status(error.code).send(error);
    } else {
      res.status(500).send({ message: "Unknown Error" });
    }
  }
};
