import express from "express";
import { addProductController, deleteProductController, getAllProductsController, addReviewsController, productDetailController, updateProductController, getAllProductReviews, deleteReviewController } from "../controllers/productControllers.js";
import { authrizeRole, isAuthenticatedUser } from "../middlewares/auth.js";
const productRouter = express.Router();

productRouter.post("/admin/addproduct", isAuthenticatedUser, authrizeRole("admin"), addProductController)
productRouter.get("/allproducts", getAllProductsController)
productRouter.put("/admin/updateproduct/:id", isAuthenticatedUser, authrizeRole("admin"), updateProductController)
productRouter.delete("/admin/deleteproduct/:id", isAuthenticatedUser, authrizeRole("admin"), deleteProductController)
productRouter.get("/productdetail/:id", productDetailController)
productRouter.put("/review", isAuthenticatedUser, addReviewsController)
productRouter.get("/allreviews", getAllProductReviews);
productRouter.delete("/delete-review", isAuthenticatedUser, deleteReviewController);

export default productRouter