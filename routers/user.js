const express = require("express");
const auth = require("../middleware/auth");
const router = new express.Router();
const userController = require("../controllers/userController");

router.post("/api/signup", userController.signupUser);

router.post("/api/login", userController.loginUser);

router.post("/api/google", userController.googleAuth);

router.get("/api/general", auth, userController.getGeneralProfile);

router.get("/api/profileCompleted", auth, userController.getProfileCompleted);

router.post("/api/general", auth, userController.updateGeneralProfile);

router.get("/api/getInterests", auth, userController.getInterests);

router.post("/api/avatar", auth, userController.updateAvatar);

router.delete("/api/avatar", auth, userController.deleteAvatar);

router.post("/api/social", auth, userController.updateSocialLinks);

router.get("/api/social", auth, userController.getSocialLinks);

router.post("/api/isEmailTaken", userController.isEmailTaken);

router.post("/api/isUsernameTaken", userController.isUsernameTaken);

router.post("/api/isPasswordMatching", auth, userController.isPasswordMatching);

router.post("/api/changePassword", auth, userController.changePassword);

router.delete("/api/user", auth, userController.deleteAccount);

router.post("/api/personal", auth, userController.addPersonalDetails);

router.get("/api/personal", auth, userController.getPersonalDetails);

router.post("/api/isEmailAvailable", auth, userController.isEmailAvailable);

router.post("/api/isUsernameAvailable", auth, userController.isUsernameAvailable);

router.post("/api/checkEmail", userController.checkEmail);

router.post("/api/resetPassword", userController.resetPassword);

router.get("/api/role", auth, userController.getRole);

router.get("/api/assignees", auth, userController.getAssignees);

router.get("/api/users/:username", auth, userController.getUserProfile);

// Electrons, Protons, Nucleus
router.get("/api/electrons", auth, userController.getElectrons);

router.get("/api/protons", auth, userController.getProtons);

router.get("/api/members", auth, userController.getMembers);

router.get("/api/nucleus", auth, userController.getNucleus);

module.exports = router;
