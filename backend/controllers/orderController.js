import Order from "../models/OrderModel.js";
import Product from "../models/productsModel.js";

export const createOrderController = async (req, res) => {
  try {
    const {
      shippingInfo,
      orderItems,
      paymentInfo,
      itemsPrice,
      taxPrice,
      shippingPrice,
      totalPrice,
    } = req.body;

    const order = await Order.create({
      shippingInfo,
      orderItems,
      paymentInfo,
      itemsPrice,
      taxPrice,
      shippingPrice,
      totalPrice,
      paidAt: Date.now(),
      user: req.user._id,
    });

    res.status(201).json({
      success: true,
      order,
    });
  } catch (error) {
    console.log("error hai");
    return res.status(500).json({
      success: false,
      message: "something went wrong",
    });
  }
};

export const getSingleOrderController = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate(
      "user",
      "name email"
    );

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order is not found",
      });
    }

    return res.status(200).json({
      success: true,
      order,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "something went wrong",
    });
  }
}

export const getMyOrderController = async (req,res) => {
  try {
    const orders = await Order.find({user : req.user._id});

    return res.status(200).json({
      success : true,
      orders
    })

  } catch (error) {
    return res.status(500).json({
      success : false,
      message : "something went wrog"
    })
  }
}

export const getAllOrdersController = async (req,res) => {
  try {
    const orders = await Order.find();

  let total = 0;

  orders.forEach((order) => {
    total += order.totalPrice;
  })

  return res.status(200).json({
    success : true,
    total,
    orders
  })
  } catch (error) {
    return res.status(500).json({
      success : false,
      message : "something went wrong"
    })
  }
}

export const updateOrderStatusController = async (req,res) => {
  try {
    const order = await Order.findById(req.params.id);

    if(!order){
      return res.status(400).json({
        success : false,
        message : "order not found"
      })
    }

    if(order.status === "Delivered"){
      return res.status(400).json({
        success : false,
        message : "You already delivered this order"
      })
    }

    if(req.body.status === "Shipped"){
      order.orderItems.forEach(async (o)=>{
        await updateStock(o.product, o.quantity)
      })
    }

    order.orderStatus = req.body.status;

    if(req.body.status === "Delivered"){
      order.deliveredAt = Date.now();
    }

    await order.save({validateBeforeSave : false});

    return res.status(200).json({
      success : true,
      message : "order updated successfully"
    })
  } catch (error) {
    return res.status(500).json({
      success : false,
      message : "something went wrong"
    })
  }
}

export const deleteOrderController = async (req,res) => {
  try {
    const order = await Order.findById(req.params.id);

    if(!order){
      return res.status(404).json({
        success : false,
        message : "Order not found"
      })
    }

    await order.remove();

    return res.status(200).json({
      success : true,
      message : "Deleted successfully"
    })
  } catch (error) {
    return res.status(500).json({
      success : false,
      message : "something went wrong"
    })
  }
}


async function updateStock(id, quantity) {
  const product = await Product.findById(id);

  product.Stock -= quantity;

  await product.save({ validateBeforeSave: false });
}