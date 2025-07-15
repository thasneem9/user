import express from "express";
 import {getFilteredStores,addProduct} from "../controllers/storeController.js"
 const router=express.Router()

router.post("/add",addProduct) 
router.get("/filter",getFilteredStores) 


export default router