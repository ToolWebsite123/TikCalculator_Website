const mongoose = require('mongoose');

/**
 * Country CPM Schema
 * Stores default CPM rates for different countries
 */
const CountryCpmSchema = new mongoose.Schema(
  {
    code: {
      type: String,
      required: [true, 'Country code is required'],
      unique: true,
      uppercase: true,
      trim: true,
      minlength: [2, 'Country code must be at least 2 characters'],
      maxlength: [2, 'Country code must be exactly 2 characters'],
      validate: {
        validator: function(v) {
          return /^[A-Z]{2}$/.test(v);
        },
        message: 'Country code must be 2 uppercase letters'
      }
    },
    name: {
      type: String,
      required: [true, 'Country name is required'],
      trim: true,
      minlength: [2, 'Country name must be at least 2 characters'],
    },
    defaultCpm: {
      type: Number,
      required: [true, 'Default CPM is required'],
      min: [0, 'CPM cannot be negative'],
      max: [100, 'CPM seems unrealistically high'],
      validate: {
        validator: function(v) {
          return !isNaN(v) && isFinite(v);
        },
        message: 'CPM must be a valid number'
      }
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    description: {
      type: String,
      trim: true,
      maxlength: [500, 'Description cannot exceed 500 characters'],
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Indexes for better query performance
// Note: code index is already created by unique: true, so we only add isActive index
CountryCpmSchema.index({ isActive: 1 });

// Instance method to format CPM for display
CountryCpmSchema.methods.getFormattedCpm = function() {
  return `$${this.defaultCpm.toFixed(2)}`;
};

// Static method to get all active countries
CountryCpmSchema.statics.getActiveCountries = function() {
  return this.find({ isActive: true }).sort({ name: 1 });
};

// Static method to get CPM by country code
CountryCpmSchema.statics.getCpmByCode = async function(code) {
  const country = await this.findOne({ 
    code: code.toUpperCase(), 
    isActive: true 
  });
  return country ? country.defaultCpm : null;
};

// Pre-save middleware to uppercase the code
CountryCpmSchema.pre('save', function(next) {
  if (this.code) {
    this.code = this.code.toUpperCase();
  }
  next();
});

module.exports = mongoose.model('CountryCpm', CountryCpmSchema);