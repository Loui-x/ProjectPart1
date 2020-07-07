// INSTRUCTIONS
/*
  Create a new resource model that uses the User
  as an associative collection (examples):
  - User -> Books
  - User -> Reservation

  Your model must contain at least three attributes
  other than the associated user and the timestamps.

  Your model must have at least one helpful virtual
  or query function. For example, you could have a
  book's details output in an easy format: book.format()
*/
const mongoose = require('mongoose');
const DayoffSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  startDate: {
    type: Date,
    required: true // This must exist
  },
  endDate: {
    type: Date,
    required: true // This must exist
  },
  reasonforAbsence: {
    type: String,
    required: true
  },
  subtituteFound: {
    type: Boolean,
    
  },
  status: {
    type: String,
    enum: ['DRAFT', 'PUBLISHED'],
    default: 'DRAFT'
  }
}, {
  timestamps: true
});
DayoffSchema.query.drafts = function () {
  return this.where({
    status: 'DRAFT'
  })
};

DayoffSchema.query.published = function () {
  return this.where({
    status: 'PUBLISHED'
  })
};

DayoffSchema.virtual('synopsis')
.get(function () {
  const post = this.content;
  return post
    .replace(/(<([^>]+)>)/ig,"")
    .substring(0, 500);
});
module.exports = mongoose.model('Dayoff', DayoffSchema);