const Router = require("express").Router;
const router = new Router();
const userController = require("../controllers/user.controller");
const projectController = require("../controllers/project.controller");
const { body } = require("express-validator");
const authMiddleware = require("../middlewares/auth-middleware")
const projectMiddleware = require("../middlewares/project-middleware")

router.post(
  "/auth/signup",
  body("email").isEmail(),
  body("password").isLength({ min: 4, max: 16 }),
  userController.signup
);
router.post("/auth/login", userController.login);
router.post("/auth/logout", userController.logout);
router.post("/project/create", authMiddleware, projectController.create)

router.get("/oauth/authorize", projectMiddleware, userController.authorize);
router.get("/oauth/verify", authMiddleware, projectMiddleware, projectController.verify);
router.get("/oauth/code", authMiddleware, projectMiddleware, projectController.code);
router.get("/oauth/token", projectMiddleware, projectController.token);
router.get("/project/projects-list", authMiddleware, projectController.getProject);

router.get("/oauth/users", authMiddleware, userController.getUsers);

router.get("/refresh", userController.refresh);

router.delete("/project", authMiddleware, projectController.delete)

module.exports = router;
