const mongoose = require('mongoose');

const partSchema = mongoose.Schema({
  part_name: {
    type: String,
    required: true,
    trim: true
  },
  part_ok: {
    type: Number,
    required: true,

  },
  part_not_ok: {
    type: Number,
    required: true,
  },
  part_details: {
    part_date: {
      type: Date,
    }
  }
})

module.exports = mongoose.model('Part', partSchema)