const jwt = require("jsonwebtoken");
const tokenModel = require("../models/token.model");
class TokenService {
  generateTokens(payload) {
    const access_token = jwt.sign(payload, process.env.JWT_ACCESS_SECRET, {
      expiresIn: "15m",
    });
    const refresh_token = jwt.sign(payload, process.env.JWT_REFRESH_SECRET, {
      expiresIn: "2d",
    });
    return {
      access_token,
      refresh_token,
    };
  }

  async saveToken(userId, refreshToken) {
    const tokenData = await tokenModel.findOne({ userId: userId });
    if (tokenData) {
      tokenData.refreshToken = refreshToken;
      return tokenData.save();
    }
    const token = await tokenModel.create({ userId, refreshToken });
    return token;
  }

  validateAccessToken(token) {
    try {
      const userData = jwt.verify(token, process.env.JWT_ACCESS_SECRET);
      return userData;
    } catch (error) {
      return null;
    }
  }

  validateRefreshToken(token) {
    try {
      const userData = jwt.verify(token, process.env.JWT_REFRESH_SECRET);
      return userData;
    } catch (error) {
      return null;
    }
  }

  async generateOAuthCode(payload) {
    const code = jwt.sign(payload, process.env.JWT_ACCESS_SECRET, {
      expiresIn: "15s",
    });
    const userId = payload.id;
    const tokenData = await tokenModel.findOne({ userId });
    if (tokenData) {
      tokenData.code = code;
      return tokenData.save();
    }
    return tokenData;
  }

  async removeToken(refreshToken) {
    const tokenData = await tokenModel.deleteOne({ refreshToken });
    return tokenData;
  }

  async findToken(refreshToken) {
    const tokenData = await tokenModel.findOne({ refreshToken });
    return tokenData;
  }
}

module.exports = new TokenService();
