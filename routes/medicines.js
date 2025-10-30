const express = require('express');
const router = express.Router();
const Medicine = require('../models/medicine');

router.get('/', async (req, res, next) => {
  try {
    const medicines = await Medicine.find().sort({ createdAt: -1 });
    res.json({ success: true, data: medicines });
  } catch (error) {
    next(error);
  }
});

router.get('/:id', async (req, res, next) => {
  try {
    const medicine = await Medicine.findById(req.params.id);
    
    if (!medicine) {
      return res.status(404).json({ success: false, error: 'Medicine not found' });
    }

    res.json({ success: true, data: medicine });
  } catch (error) {
    next(error);
  }
});

router.post('/', async (req, res, next) => {
  try {
    const { name, description, price, stock, image_url, category } = req.body;

    if (!name || !price || stock === undefined) {
      return res.status(400).json({
        success: false,
        error: 'Name, price, and stock are required'
      });
    }

    const medicine = await Medicine.create({
      name,
      description: description || '',
      price,
      stock,
      image_url: image_url || '',
      category: category || 'General'
    });

    res.status(201).json({ success: true, data: medicine });
  } catch (error) {
    next(error);
  }
});

router.put('/:id', async (req, res, next) => {
  try {
    const { name, description, price, stock, image_url, category } = req.body;

    const medicine = await Medicine.findByIdAndUpdate(
      req.params.id,
      {
        name,
        description,
        price,
        stock,
        image_url,
        category
      },
      { new: true, runValidators: true }
    );

    if (!medicine) {
      return res.status(404).json({ success: false, error: 'Medicine not found' });
    }

    res.json({ success: true, data: medicine });
  } catch (error) {
    next(error);
  }
});

router.delete('/:id', async (req, res, next) => {
  try {
    const medicine = await Medicine.findByIdAndDelete(req.params.id);

    if (!medicine) {
      return res.status(404).json({ success: false, error: 'Medicine not found' });
    }

    res.json({ success: true, message: 'Medicine deleted successfully' });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
