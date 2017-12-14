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

// Add a pal
const addPal = (request, response) => {
  const req = request;
  const res = response;

  let profileData = {};

  Profile.ProfileModel.findByOwner(req.session.account._id, (err, docs) => {
    if (err) {
      console.log(err);
      return res.status(400).json({ error: 'An error occurred!' });
    }

    profileData = docs;

    profileData.pals.push(req.body.pal); // Add the pal

    let profilePromise = null;
    profilePromise = profileData.save();

    // Promise
    // Send back an empty object to avoid stupidity
    profilePromise.then(() => res.status(204).json({ }));

    return profilePromise.catch(() => res.status(400).json({ error: 'An error occurred' }));
  });
};

// Get the user's profile information
const getProfile = (request, response) => {
  const req = request;
  const res = response;

  return Profile.ProfileModel.findByOwner(req.session.account._id, (err, docs) => {
    if (err) {
      console.log(err);
      return res.status(400).json({ error: 'An error occurred!' });
    }

    // Check that the profile exists
    let returnDocs = docs;

    // If it doesn't, fill it out
    // This cuts down on code client-side
    if (returnDocs === null) {
      returnDocs = {
        name: 'No name',
        age: '0',
        color: 'N/A',
        pals: [],
        owner: req.session.account._id,
      };

      // Save the new profile in the database
      let userProfile = null;
      let profilePromise = null;

      userProfile = new Profile.ProfileModel(returnDocs);
      profilePromise = userProfile.save();

      // Promise
      // Send back an empty object to avoid stupidity
      // Also, this is totally not the right way to do this, since there's no status code
      // Oh well
      profilePromise.then(() => res.json({ profile: returnDocs }));

      return profilePromise.catch(() => res.json({ profile: returnDocs }));
    }

    return res.json({ profile: returnDocs });
  });
};

// Get my pals
const getMyPals = (request, response) =>
  Profile.ProfileModel.findMyProfiles(request.session.account._id, (err, docs) => {
    if (err) {
      console.log(err);
      return response.status(400).json({ error: 'An error occurred!' });
    }

    const palsList = [];

    for (let i = 0; i < docs.pals.length; i++) {
      Profile.ProfileModel.findByOwner(docs.pals[i].owner, (errr, pals) => {
        if (errr) {
          console.log(errr);
          return response.status(400).json({ error: 'An error occurred!' });
        }
        console.dir(pals);
        palsList.push(pals);

        return palsList;
      });
    }

    return response.json({ profile: palsList });
  }
);

// Get all pals
const getAllPals = (request, response) =>
  Profile.ProfileModel.findAllProfiles((err, docs) => {
    if (err) {
      console.log(err);
      return response.status(400).json({ error: 'An error occurred!' });
    }

    return response.json({ profile: docs });
  }
);

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

    profileData = docs;

    // Check that the user's profile exists,
    // if it does not, make it
    if (profileData === null) {
      profileData = {
        name: '',
        age: '',
        color: '',
        pals: [],
        owner: undefined,
      };
    }

    // Remember to check that fields are not empty
    if (req.body.name !== '') {
      profileData.name = req.body.name;
    }
    if (req.body.age !== '') {
      profileData.age = req.body.age;
    }
    if (req.body.fColor !== '') {
      profileData.color = req.body.fColor;
    }

    let userProfile = null;
    let profilePromise = null;
    // Check if this is a new profile
    if (profileData.owner === undefined) {
      profileData.owner = req.session.account._id;
      userProfile = new Profile.ProfileModel(profileData);
      profilePromise = userProfile.save();
    } else {
      profilePromise = profileData.save();
    }

    // Promise
    // Send back an empty object to avoid stupidity
    profilePromise.then(() => res.status(204).json({ }));

    return profilePromise.catch(() => res.status(400).json({ error: 'An error occurred' }));
  });
};

const palsPage = (req, res) => {
  // Add tokens here, where render data is submitted
  res.render('pals', { csrfToken: req.csrfToken() });
};

module.exports.profilePage = makerPage;
module.exports.getProfile = getProfile;
module.exports.addPal = addPal;
module.exports.getMyPals = getMyPals;
module.exports.getAllPals = getAllPals;
module.exports.updateProfile = updateProfile;
module.exports.palsPage = palsPage;
