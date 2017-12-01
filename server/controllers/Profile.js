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

const makeProfile = (req, res) => {
  if (!req.body.name || !req.body.age) {
    return res.status(400).json({ error: 'Both name and age are required!' });
  }

  const profileData = {
    name: req.body.name,
    age: req.body.age,
    owner: req.session.account._id,
  };

  const newProfile = new Profile.ProfileModel(profileData);

  const profilePromise = newProfile.save();

  profilePromise.then(() => res.json({ redirect: '/profile' }));

  profilePromise.catch((err) => {
    console.log(err);

    if (err.code === 11000) {
      return res.status(400).json({ error: 'Domo already exists!' });
    }

    return res.status(400).json({ error: 'An error occurred!' });
  });

  return profilePromise;
};

const palsPage = (req, res) => {
  // Add tokens here, where render data is submitted
  res.render('pals', { csrfToken: req.csrfToken() });
};

module.exports.profilePage = makerPage;
module.exports.getProfile = getProfile;
module.exports.profile = makeProfile;
module.exports.palsPage = palsPage;
