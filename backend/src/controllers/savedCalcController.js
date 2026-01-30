const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const SavedCalculation = require('../models/SavedCalculation');
const AdminUser = require('../models/AdminUser');

const saveCalculation = async (req, res, next) => {
  try {
    const { email, inputs, result } = req.body || {};
    if (!inputs || !result) {
      return res.status(400).json({ error: 'inputs and result are required' });
    }

    const saved = await SavedCalculation.create({
      email,
      inputs,
      result,
    });

    return res.status(201).json(saved);
  } catch (err) {
    return next(err);
  }
};

const getCalculation = async (req, res, next) => {
  try {
    const { id } = req.params;
    const calc = await SavedCalculation.findById(id);
    if (!calc) {
      return res.status(404).json({ error: 'Calculation not found' });
    }
    return res.json(calc);
  } catch (err) {
    return next(err);
  }
};

const adminLogin = async (req, res, next) => {
  try {
    const { email, password } = req.body || {};
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    const admin = await AdminUser.findOne({ email: email.toLowerCase() });
    if (!admin) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const match = await bcrypt.compare(password, admin.passwordHash);
    if (!match) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const token = jwt.sign(
      { sub: admin._id, email: admin.email, role: 'admin' },
      process.env.JWT_SECRET || 'changeme',
      { expiresIn: '12h' }
    );

    return res.json({ token });
  } catch (err) {
    return next(err);
  }
};

module.exports = { saveCalculation, getCalculation, adminLogin };

