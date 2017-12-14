const mongoose = require('mongoose');
mongoose.Promise = global.Promise;
const _ = require('underscore');

let ProfileModel = {};

// mongoose.Types.ObjectId is a function that
// converts the string ID to a real Mongo ID
const convertId = mongoose.Types.ObjectId;
const setName = (name) => _.escape(name).trim();

const ProfileSchema = new mongoose.Schema({
  name: {
    type: String,
    required: false,
    trim: true,
    set: setName,
  },

  age: {
    type: Number,
    min: 0,
    required: false,
  },

  color: {
    type: String,
    required: false,
    trim: true,
  },

  pals: {
    type: Array,
    value: [],
    required: false,
  },

  owner: {
    type: mongoose.Schema.ObjectId,
    required: true,
    ref: 'Account',
  },

  createdData: {
    type: Date,
    default: Date.now,
  },
});

ProfileSchema.statics.toAPI = (doc) => ({
  name: doc.name,
  age: doc.age,
  color: doc.color,
  pals: doc.pals,
  owner: doc.owner,
});

ProfileSchema.statics.findByOwner = (ownerId, callback) => {
  const search = {
    owner: convertId(ownerId),
  };

  return ProfileModel.findOne(search, callback); // Return the profile object
};

// Return my profiles
ProfileSchema.statics.findMyProfiles = (ownerId, callback) => {
  const search = {
    owner: convertId(ownerId),
  };

  ProfileModel.findOne(search).select('pals').exec(callback);
};

// Return all profiles
ProfileSchema.statics.findAllProfiles = (callback) =>
  ProfileModel.find().select('name age owner').exec(callback);

ProfileModel = mongoose.model('Profile', ProfileSchema);

module.exports.ProfileModel = ProfileModel;
module.exports.ProfileSchema = ProfileSchema;
