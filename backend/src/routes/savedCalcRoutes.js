const express = require('express');
const {
    saveCalculation,
    getCalculation,
    adminLogin,
} = require('../controllers/savedCalcController');

const router = express.Router();

router.post('/save', saveCalculation);
router.get('/saved/:id', getCalculation);
router.post('/admin/login', adminLogin);

module.exports = router;

