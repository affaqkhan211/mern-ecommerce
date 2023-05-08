import express from "express";
const userRouter = express.Router();
import { loginUserController, registerUserController, logoutUserController, forgotPasswordController, resetPasswordController, userOwnDetailController, updateUserPasswordController, updateUserProfileController, getAllUsersDetailController, getSingleUserDetailController, updateUserRoleController, deleteUserController } from "../controllers/userControllers.js"
import { authrizeRole, isAuthenticatedUser } from "../middlewares/auth.js";

userRouter.post("/register", registerUserController)
userRouter.post("/login", loginUserController)
userRouter.get("/logout", logoutUserController);
userRouter.post("/password/forgot", forgotPasswordController);
userRouter.put("/password/reset/:token", resetPasswordController)
userRouter.get("/me", isAuthenticatedUser, userOwnDetailController);
userRouter.put("/password/update", isAuthenticatedUser, updateUserPasswordController)
userRouter.put("/updateprofile", isAuthenticatedUser, updateUserProfileController)
userRouter.get("/admin/allusers", isAuthenticatedUser, authrizeRole("admin"), getAllUsersDetailController);
userRouter.get("/admin/user/:id", isAuthenticatedUser, authrizeRole("admin"), getSingleUserDetailController)
userRouter.put("/admin/update-user-role/:id", isAuthenticatedUser, authrizeRole("admin"), updateUserRoleController);
userRouter.delete("/admin/delete-user/:id", isAuthenticatedUser, authrizeRole("admin"), deleteUserController);

export default userRouter