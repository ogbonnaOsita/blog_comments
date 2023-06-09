/* eslint-disable import/no-extraneous-dependencies */
const express = require("express");
const authController = require("../controllers/authController");

const router = express.Router();

router.post("/signup", authController.signup);
router.post("/login", authController.login);
router.get("/logout", authController.logout);
router.route("/").get(authController.getAllUsers);
router
  .route("/:id")
  .get(authController.getUser)
  .delete(authController.deleteUser);

module.exports = router;
