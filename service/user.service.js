const UserModel = require("../models/user.model");
const bcrypt = require("bcrypt");
const uuid = require("uuid");
const tokenService = require("../service/token.service");
const UserDto = require("../dtos/user.dto");
const ApiError = require("../exceptions/api-error");

class UserService {
  async signup(email, password) {
    const candidate = await UserModel.findOne({ email });
    if (candidate) {
      throw ApiError.BadRequest(`User with the same email already exist!`);
    }
    const hashPassword = await bcrypt.hash(password, 3);
    // const activationLink = uuid.v4();

    const user = await UserModel.create({ email, password: hashPassword });
    const userDto = new UserDto(user); // id, email

    const tokens = tokenService.generateTokens({ ...userDto });
    await tokenService.saveToken(userDto.id, tokens.refresh_token);

    return {
      ...tokens,
      user: userDto,
    };
  }

  async login(email, password) {
    const user = await UserModel.findOne({ email });
    if (!user) {
      throw ApiError.BadRequest("User with this email doesn't exist!");
    }

    const isPasswordEquals = await bcrypt.compare(password, user.password);
    if (!isPasswordEquals) {
      throw ApiError.BadRequest("Invalid password");
    }

    const userDto = new UserDto(user);
    const tokens = tokenService.generateTokens({ ...userDto });
    await tokenService.saveToken(userDto.id, tokens.refresh_token);

    return {
      ...tokens,
      user: userDto,
    };
  }

  async refresh(refreshToken) {
    if (!refreshToken) {
      throw ApiError.UnathorizedError();
    }

    const userData = tokenService.validateRefreshToken(refreshToken);
    const tokenFromDB = await tokenService.findToken(refreshToken);

    if (!userData && !tokenFromDB) {
      throw ApiError.UnathorizedError();
    }

    const user = await UserModel.findById(userData.id); // data about user could be refreshed
    const userDto = new UserDto(user);
    const tokens = tokenService.generateTokens({ ...userDto });
    await tokenService.saveToken(userDto.id, tokens.refresh_token);

    return {
      ...tokens,
      user: userDto,
    };
  }

  async logout(refreshToken) {
    const token = await tokenService.removeToken(refreshToken);
    return token;
  }

  async getAllUsers() {
    const users = await UserModel.find({});
    return users;
  }
}

module.exports = new UserService();
