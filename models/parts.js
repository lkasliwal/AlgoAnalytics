const mongoose = require('mongoose');

const partSchema = mongoose.Schema({
  part_name: {
    type: String,
    required: true,
    trim: true
  },
  part_ok: {
    type: Number,
    required: false,
  },
  part_not_ok: {
    type: Number,
    required: false,
  },
  part_details_datewise: [
    {
      part_date: String,
      part_ok_total: Number,
      part_not_ok_total: Number
    }
  ]
})

module.exports = mongoose.model('Part', partSchema)