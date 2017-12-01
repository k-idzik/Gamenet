const models = require('../models');

const Profile = models.Profile;

const makerPage = (req, res) => {
  Profile.ProfileModel.findByOwner(req.session.account._id, (err, docs) => {
    if (err) {
      console.log(err);
      return res.status(400).json({ error: 'An error occurred!' });
    }

    // Add tokens here, where render data is submitted
    return res.render('app', { csrfToken: req.csrfToken(), profile: docs });
  });
};

const getProfile = (request, response) => {
  const req = request;
  const res = response;

  return Profile.ProfileModel.findByOwner(req.session.account._id, (err, docs) => {
    if (err) {
      console.log(err);
      return res.status(400).json({ error: 'An error occurred!' });
    }

    return res.json({ profile: docs });
  });
};

// Update the user's profile
const updateProfile = (request, response) => {
  const req = request;
  const res = response;

  let profileData = {};

  Profile.ProfileModel.findByOwner(req.session.account._id, (err, docs) => {
    if (err) {
      console.log(err);
      return res.status(400).json({ error: 'An error occurred!' });
    }
    // console.dir(docs);
    profileData = docs;

    if (req.body.name !== undefined) {
      // console.log("name");
      profileData.name = req.body.name;
    }
    if (req.body.age !== undefined) {
      // console.log("age");
      profileData.age = req.body.age;
    }
    if (req.body.fColor !== undefined) {
      // console.log("fColor");
      profileData.color = req.body.fColor;
    }

    // console.log(profileData.owner);
    let userProfile = null;
    let profilePromise = null;
    // Check if this is a new profile
    if (profileData.owner === undefined) {
      profileData.owner = req.session.account._id;
      userProfile = new Profile.ProfileModel(profileData);
      profilePromise = userProfile.save();
    } else {
      profileData.owner = req.session.account._id;
      // userProfile = Profile.ProfileModel(profileData);
      profilePromise = profileData.save();
    }

    // Promise
    // Send back an empty object to avoid stupidity
    profilePromise.then(() => res.status(204).json({ }));

    profilePromise.catch(() => res.status(400).json({ error: 'An error occurred' }));

    return profilePromise;
  });
};

const palsPage = (req, res) => {
  // Add tokens here, where render data is submitted
  res.render('pals', { csrfToken: req.csrfToken() });
};

module.exports.profilePage = makerPage;
module.exports.getProfile = getProfile;
module.exports.updateProfile = updateProfile;
module.exports.palsPage = palsPage;
