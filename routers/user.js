import express from "express";
import auth from "../middleware/auth.js";
import userController from "../controllers/userController.js";

const router = new express.Router();

router.post("/api/signup", userController.auth.signupUser);

router.post("/api/login", userController.auth.loginUser);

router.post("/api/google", userController.auth.googleAuth);

router.get("/api/general", auth, userController.profile.getGeneralProfile);

router.get("/api/profileCompleted", auth, userController.profile.getProfileCompleted);

router.post("/api/general", auth, userController.profile.updateGeneralProfile);

router.get("/api/getInterests", auth, userController.profile.getInterests);

router.post("/api/avatar", auth, userController.profile.updateAvatar);

router.delete("/api/avatar", auth, userController.profile.deleteAvatar);

router.post("/api/social", auth, userController.profile.updateSocialLinks);

router.get("/api/social", auth, userController.profile.getSocialLinks);

router.post("/api/isEmailTaken", userController.validation.isEmailTaken);

router.post("/api/isUsernameTaken", userController.validation.isUsernameTaken);

router.post("/api/isPasswordMatching", auth, userController.validation.isPasswordMatching);

router.post("/api/changePassword", auth, userController.auth.changePassword);

router.delete("/api/user", auth, userController.auth.deleteAccount);

router.post("/api/personal", auth, userController.profile.addPersonalDetails);

router.get("/api/personal", auth, userController.profile.getPersonalDetails);

router.post("/api/isEmailAvailable", auth, userController.validation.isEmailAvailable);

router.post("/api/isUsernameAvailable", auth, userController.validation.isUsernameAvailable);

router.post("/api/checkEmail", userController.validation.checkEmail);

router.post("/api/resetPassword", userController.auth.resetPassword);

router.get("/api/role", auth, userController.profile.getRole);

router.get("/api/assignees", auth, userController.info.getAssignees);

router.get("/api/users/:username", auth, userController.info.getUserProfile);

// Electrons, Protons, Nucleus
router.get("/api/electrons", auth, userController.info.getElectrons);

router.get("/api/protons", auth, userController.info.getProtons);

router.get("/api/members", auth, userController.info.getMembers);

router.get("/api/nucleus", auth, userController.info.getNucleus);

// Update roles of a user when year changes
router.patch("/api/updateRoles", userController.info.updateRoles);

export default router;
