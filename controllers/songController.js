const Song = require('../models/song');
const QueryFeature = require('../utils/queryFeature');
const catchAsync = require('../utils/catchAsync');

exports.getAllSongs = catchAsync(async (req, res) => {
  const total = (await Song.countDocuments()) || 0;
  const queryFeature = new QueryFeature(req.query, Song.find(), total);
  queryFeature.filter().sort().limit().page();

  const songs = await queryFeature.query;
  res.status(200).json({
    status: 'success',
    data: {
      count: songs.length || 0,
      total,
      songs,
    },
  });
});

exports.createSong = catchAsync(async (req, res) => {
  const song = await Song.create(req.body);

  return res.status(200).json({
    status: 'success',
    data: {
      song,
    },
  });
});

exports.getSongById = catchAsync(async (req, res) => {
  const id = req.params.id;
  const song = await Song.findById(id);

  if (!song) {
    throw new Error('invalid songId');
  }
  res.status(200).json({
    status: 'success',
    data: {
      song,
    },
  });
});

exports.deleteSong = catchAsync(async (req, res) => {
  const id = req.params.id;
  const song = await Song.findByIdAndDelete(id);
  if (!song) {
    throw new Error('invalid songId');
  }
  return res.status(204).json({
    status: 'success',
  });
});

exports.stat = async (req, res) => {
  try {
    // const songs = await Song.aggregate([
    //   {
    //     $group: {
    //       _id: '$movieName',
    //       songCount: { $sum: 1 },
    //     },
    //   },
    //   { $sort: { songCount: -1 } },
    // ]);

    const songs = await Song.aggregate([
      {
        $unwind: '$artists',
      },
    ]);

    res.status(200).json({
      status: 'success',
      data: {
        count: songs.length || 0,
        songs,
      },
    });
  } catch (e) {
    return res.status(400).json({
      status: 'error',
      message: e.message,
    });
  }
};
