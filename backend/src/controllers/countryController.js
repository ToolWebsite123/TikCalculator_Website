const CountryCpm = require('../models/CountryCpm');

const listCountries = async (_req, res, next) => {
  try {
    const countries = await CountryCpm.find({})
      .select('code name defaultCpm -_id')
      .sort({ name: 1 });
    return res.json(countries);
  } catch (err) {
    return next(err);
  }
};

module.exports = { listCountries };

