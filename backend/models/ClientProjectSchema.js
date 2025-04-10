const mongoose = require('mongoose');

const ClientProjectSchema = new mongoose.Schema({
  img: {
    type: String,
    required: false
  },
  title: {
    type: String,
    required: true,
    trim: true
  },
  desc: {
    type: String,
    required: true,
  },
  tech: {
    type: [String],
    required: true,
    validate: {
      validator: function(v) {
        return v.length > 0;
      },
      message: 'At least one technology must be specified'
    }
  },
  timeframe: {
    start: {
      type: Date,
      required: true
    },
    end: {
      type: Date,
      required: true
    }
  },
  priceRange: {
    min: {
      type: Number,
      required: true,
      min: 0
    },
    max: {
      type: Number,
      required: true,
      min: 0,
      validate: {
        validator: function(v) {
          return v >= this.priceRange.min;
        },
        message: 'Max price must be greater than or equal to min price'
      }
    }
  },
  completionDate: {
    type: Date,
    required: false
  },
  type: {
    type: String,
    required: true,
  }
});

module.exports = mongoose.model('ClientProject', ClientProjectSchema);