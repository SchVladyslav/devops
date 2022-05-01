const bcrypt = require("bcrypt");
const tokenService = require("../service/token.service");
const ProjectModel = require("../models/project.model");
const UserDto = require("../dtos/user.dto");
const tokenModel = require("../models/token.model");
const ApiError = require("../exceptions/api-error");
const userModel = require("../models/user.model");

class ProjectService {
  async create(data, user) {
    const projectData = data; // TODO: add scope
    const projectName = projectData.name; // client_id
    const candidate = await ProjectModel.findOne({ name: projectName });

    if (candidate) {
      throw ApiError.BadRequest(`Project with the same name already exist!`);
    }

    projectData.redirectURLs = [projectData.url];
    projectData.client_id = projectName + ".oauth.app";
    projectData.createdBy = user.id;
    const hash = await bcrypt.hash(projectData.client_id, 3);
    projectData.client_secret = hash;
    const project = await ProjectModel.create({ ...projectData });

    return project; // DTO?
  }

  async getOAuthCode(project, user) {
    const access = "oauth";
    const payload = {
      access,
      id: user.id,
      client_id: project.client_id,
      client_secret: project.client_secret,
      // scope: project.scope,
    };

    const tokenData = await tokenService.generateOAuthCode(payload);

    return tokenData.code;
  }

  async getTokens(data) {
    // user
    // const userDto = new UserDto(user);
    const authCode = data.code;

    if (!authCode) {
      throw ApiError.BadRequest(
        `You are attemping to get token without auth_code!`
      );
    }
    const { userId, code } = await tokenModel.findOne({ code: authCode });
    const user = await userModel.findOne({ userId });
    const userDto = new UserDto(user);

    if (code !== authCode) {
      throw ApiError.BadRequest(`Invalid auth_code!`);
    }

    const tokens = tokenService.generateTokens({ ...data, ...userDto });
    await tokenService.saveToken(userDto.id, tokens.refresh_token);

    return { ...tokens };
  }

  async getProject(user) {
    const project = await ProjectModel.find({ createdBy: user.id }); // _id?
    return project;
  }
}

module.exports = new ProjectService();
