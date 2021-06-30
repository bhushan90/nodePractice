const mongoose = require('mongoose');

const songSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Song title is required!'],
    unique: [true, 'Song title should be unique!'],
    minLength: [4, 'title should contain minimun 4 character.'],
  },
  movieName: {
    type: String,
    required: true,
  },
  releaseYear: {
    type: Number,
    default: Date.now(),
  },
  price: {
    type: Number,
    default: 10,
    validate: {
      validator: function (value) {
        return value > 0 && value < 1000;
      },
      message: 'Price must be greater han 0 and less than 1000',
    },
  },
  artists: [String],
  ratings: {
    type: Number,
    default: 1,
    min: 1.0,
    max: 5.0,
  },
  averageRating: {
    type: Number,
    default: 4.5,
  },
});

songSchema.pre('find', function (next) {
  console.log(this);
  next();
});

const Song = mongoose.model('Song', songSchema);

module.exports = Song;
