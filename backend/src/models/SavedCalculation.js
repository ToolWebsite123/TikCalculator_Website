const mongoose = require('mongoose');

const SavedCalculationSchema = new mongoose.Schema(
    {
        email: { type: String, required: false, trim: true },
        inputs: {
            type: Object,
            required: true,
        },
        result: {
            type: Object,
            required: true,
        },
    },
    { timestamps: { createdAt: true, updatedAt: false } }
);

module.exports = mongoose.model('SavedCalculation', SavedCalculationSchema);

