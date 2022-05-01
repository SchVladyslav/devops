const userService = require("../service/user.service");
const { validationResult } = require("express-validator");
const ApiError = require("../exceptions/api-error");

class UserController {
  async authorize(req, res) {
    const { client_id, scope, response_type, redirect_uri } = req.query;
    return res.json(
      `${process.env.OAUTH_CLIENT_URL}login?client_id=${client_id}&scope=${scope}&response_type=${response_type}&redirect_uri=${redirect_uri}`
    );
  }

  async signup(req, res, next) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return next(ApiError.BadRequest("Validation Error", errors.array()));
      }

      const { email, password } = req.body;
      const userData = await userService.signup(email, password);
      res.cookie("refresh_token", userData.refresh_token, {
        maxAge: 2 * 24 * 60 * 60 * 1000,
        httpOnly: true,
      });

      return res.json(userData);
    } catch (error) {
      next(error);
    }
  }

  async login(req, res, next) {
    try {
      const { email, password } = req.body;
      const userData = await userService.login(email, password);
      res.cookie("refresh_token", userData.refresh_token, {
        maxAge: 2 * 24 * 60 * 60 * 1000,
        httpOnly: true,
      });

      return res.json(userData);
    } catch (error) {
      next(error);
    }
  }

  async logout(req, res, next) {
    try {
      const { refresh_token } = req.cookies;
      const token = await userService.logout(refresh_token);
      res.clearCookie("refresh_token");

      return res.json(token);
    } catch (error) {
      next(error);
    }
  }

  async refresh(req, res, next) {
    try {
      const { refresh_token } = req.cookies;
      const userData = await userService.refresh(refresh_token);
      res.cookie("refresh_token", userData.refresh_token, {
        maxAge: 2 * 24 * 60 * 60 * 1000,
        httpOnly: true,
      });

      return res.json(userData);
    } catch (error) {
      next(error);
    }
  }

  async getUsers(req, res, next) {
    try {
      const users = await userService.getAllUsers();
      res.json(users);
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new UserController();
