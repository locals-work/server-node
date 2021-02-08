var express = require("express");
const AuthController = require("../controllers/AuthController");

var router = express.Router();

router.post("/create-user", AuthController.create_user);
router.post("/login", AuthController.login);
router.get("/user-list", AuthController.user_list);
router.get("/get-user/:id", AuthController.get_user);
router.put("/update-user/:id", AuthController.update_user);
router.delete("/delete-user/:id", AuthController.delete_user);

module.exports = router;
