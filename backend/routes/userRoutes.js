import express from "express";
import {deleteMyAccount, deleteUser, getAllUsers, getMyProfile, login, signup, updateMyProfile,refreshAccessToken,logout} from "../controllers/userController.js"
import { protectRoute } from "../middleware/protectRoute.js";
const router=express.Router()


router.post('/signup', signup);
router.post('/login', login);
router.post('/refresh', refreshAccessToken);
router.post('/logout', logout);


router.get("/getProfile",protectRoute,getMyProfile)
router.put("/update",protectRoute,updateMyProfile)
router.delete("/delete",protectRoute,deleteMyAccount)

router.get("/admin/allusers",getAllUsers)
router.delete("/admin/delete",deleteUser)



export default router