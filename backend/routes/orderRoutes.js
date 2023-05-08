import express from "express";
import { createOrderController, getMyOrderController, getSingleOrderController, getAllOrdersController, updateOrderStatusController, deleteOrderController } from "../controllers/orderController.js";
import { authrizeRole, isAuthenticatedUser } from "../middlewares/auth.js";
const orderRouter = express.Router();

orderRouter.post("/addorder", isAuthenticatedUser, createOrderController);
orderRouter.get("/admin/get-single-order/:id", isAuthenticatedUser, authrizeRole("admin"), getSingleOrderController)
orderRouter.get("/my-orders", isAuthenticatedUser, getMyOrderController)
orderRouter.get("/admin/allorders", isAuthenticatedUser, authrizeRole("admin"), getAllOrdersController)
orderRouter.put("/admin/update-order/:id", isAuthenticatedUser, authrizeRole("admin"), updateOrderStatusController);
orderRouter.delete("/admin/delete-order/:id", isAuthenticatedUser, authrizeRole("admin"), deleteOrderController)


export default orderRouter;