const projectService = require("../service/project.service");
const ApiError = require("../exceptions/api-error");

class ProjectController {
  async create(req, res, next) {
    try {
      const projectData = await projectService.create(req.body, req.user); // TODO: add scope to req.body
      return res.json(projectData);
    } catch (error) {
      next(error);
    }
  }

  async verify(req, res, next) {
    try {
      const scope = req.project.scope;
      return res.send({ scope });
    } catch (error) {
      next(error);
    }
  }

  async code(req, res, next) {
    try {
      const code = await projectService.getOAuthCode(req.query, req.user);
      // const redirectURL = `${req.query.redirectURL}?code=${code}`;
      return res.send({ code });
    } catch (error) {
      next(error);
    }
  }

  async token(req, res, next) {
    try {
      if (req.query.client_secret !== req.project.client_secret) {
        return next(ApiError.BadRequest("Mismatch clientID and ClientSecret"));
      }
      const tokens = await projectService.getTokens(req.query, req.user);

      res.cookie("refresh_token", tokens.refresh_token, {
        maxAge: 2 * 24 * 60 * 60 * 1000,
        httpOnly: true,
      });

      const access_token = tokens.access_token;

      return res.send({ access_token });
    } catch (error) {
      next(error);
    }
  }

  async getProject(req, res, next) {
    try {
      const project = await projectService.getProject(req.user);
      return res.json(project);
    } catch (error) {
      next(error);
    }
  }

  async delete(req, res, next) {
    try {
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new ProjectController();
