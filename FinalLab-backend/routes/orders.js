const express = require('express');
const router = express.Router();
const Order = require('../models/order');
const Medicine = require('../models/medicine');
const mongoose = require('mongoose');

router.post('/', async (req, res, next) => {
  // Start a MongoDB session for transaction
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { medicine_id, customer_name, customer_email, quantity } = req.body;

    if (!medicine_id || !customer_name || !customer_email || !quantity) {
      return res.status(400).json({
        success: false,
        error: 'All fields are required'
      });
    }

    // Find the medicine and check stock
    const medicine = await Medicine.findById(medicine_id).session(session);

    if (!medicine) {
      await session.abortTransaction();
      return res.status(404).json({
        success: false,
        error: 'Medicine not found'
      });
    }

    if (medicine.stock < quantity) {
      await session.abortTransaction();
      return res.status(400).json({
        success: false,
        error: 'Insufficient stock available'
      });
    }

    const total_price = medicine.price * quantity;

    // Create the order
    const order = await Order.create([{
      medicine_id,
      customer_name,
      customer_email,
      quantity,
      total_price,
      status: 'pending'
    }], { session });

    // Update medicine stock
    medicine.stock -= quantity;
    await medicine.save({ session });

    // Commit the transaction
    await session.commitTransaction();
    session.endSession();

    res.status(201).json({
      success: true,
      data: order[0],
      message: 'Order placed successfully'
    });
  } catch (error) {
    next(error);
  }
});

router.get('/', async (req, res, next) => {
  try {
    const orders = await Order.find()
      .populate('medicine_id', 'name price category')
      .sort('-createdAt');

    res.json({ success: true, data: orders });
  } catch (error) {
    next(error);
  }
});

router.patch('/:id/status', async (req, res, next) => {
  try {
    const { status } = req.body;

    if (!['pending', 'completed', 'cancelled'].includes(status)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid status'
      });
    }

    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );

    if (!order) {
      return res.status(404).json({
        success: false,
        error: 'Order not found'
      });
    }

    // If order is cancelled, restore the stock
    if (status === 'cancelled') {
      await Medicine.findByIdAndUpdate(
        order.medicine_id,
        { $inc: { stock: order.quantity } }
      );
    }

    res.json({ success: true, data: order });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
