const models = require('../models');

const Account = models.Account;

const getToken = (request, response) => {
  const req = request;
  const res = response;

  const csrfJSON = {
    csrfToken: req.csrfToken(),
  };

  res.json(csrfJSON);
};

const loginPage = (req, res) => {
  // Add tokens here, where render data is submitted
  res.render('login', { csrfToken: req.csrfToken() });
};

const login = (request, response) => {
  const req = request;
  const res = response;

  // Cast to strings to cover up some security flaws
  const username = `${req.body.username}`;
  const password = `${req.body.pass}`;

  // Make sure all fields are used
  if (!username || !password) {
    return res.status(400).json({ error: 'All fields are required!' });
  }

  return Account.AccountModel.authenticate(username, password, (err, account) => {
    if (err || !account) {
      return res.status(401).json({ error: 'Wrong username or password!' });
    }

    // Store the account information in the session object
    req.session.account = Account.AccountModel.toAPI(account);

    return res.json({ redirect: '/profile' });
  });
};

const logout = (req, res) => {
  req.session.destroy(); // Removes a user's session
  res.redirect('/');
};

const signup = (request, response) => {
  const req = request;
  const res = response;

  // Cast to strings to cover up some security flaws
  req.body.username = `${req.body.username}`;
  req.body.pass = `${req.body.pass}`;
  req.body.pass2 = `${req.body.pass2}`;

  // Make sure all fields are used
  if (!req.body.username || !req.body.pass || !req.body.pass2) {
    return res.status(400).json({ error: 'All fields are required!' });
  }

  // Make sure passwords match
  if (req.body.pass !== req.body.pass2) {
    return res.status(400).json({ error: 'Passwords do not match!' });
  }

  return Account.AccountModel.generateHash(req.body.pass, (salt, hash) => {
    const accountData = {
      username: req.body.username,
      salt,
      password: hash,
    };

    const newAccount = new Account.AccountModel(accountData);

    const savePromise = newAccount.save();

    // Promise
    savePromise.then(() => {
      // Store the account information in the session object
      req.session.account = Account.AccountModel.toAPI(newAccount);
      return res.json({ redirect: '/profile' });
    });

    savePromise.catch((err) => {
      console.log(err);

      if (err.code === 11000) {
        return res.status(400).json({ error: 'Username already taken!' });
      }

      return res.status(400).json({ error: 'An error occured!' });
    });
  });
};

const updateUsername = (request, response) => {
  const req = request;
  const res = response;

  // Cast to strings to cover up some security flaws
  req.body.username1 = `${req.body.username1}`;
  req.body.username2 = `${req.body.username2}`;
  req.body.pass = `${req.body.pass}`;

  // Make sure all fields are used
  if (!req.body.username1 || !req.body.username2 || !req.body.pass) {
    return res.status(400).json({ error: 'All fields are required!' });
  }

  // Make sure passwords match
  if (req.body.username1 !== req.body.username2) {
    return res.status(400).json({ error: 'Passwords do not match!' });
  }

  // Check that the user is here
  return Account.AccountModel.authenticate(req.session.account.username, req.body.pass,
  (err, account) => {
    const updatedAccount = account; // Local copy to modify

    // Make sure the password is correct
    if (err || !updatedAccount) {
      return res.status(401).json({ error: 'Wrong password!' });
    }

    // Try to update the account
    return Account.AccountModel.generateHash(req.body.pass, (salt, hash) => {
      // Update account
      updatedAccount.username = req.body.username1;
      updatedAccount.salt = salt;
      updatedAccount.password = hash;

      const savePromise = updatedAccount.save();

      // Promise
      savePromise.then(() => {
        // Store the account information in the session object
        req.session.account = Account.AccountModel.toAPI(updatedAccount);
        return res.status(204).json({ }); // Send back an empty object to avoid stupidity
      });

      savePromise.catch((er) => {
        if (er.code === 11000) {
          // Doesn't catch on changing name to self
          return res.status(400).json({ error: 'Username already taken!' });
        }

        return res.status(400).json({ error: 'An error occured!' });
      });
    });
  });
};

const updatePassword = (request, response) => {
  const req = request;
  const res = response;

  // Cast to strings to cover up some security flaws
  req.body.pass = `${req.body.pass}`;
  req.body.pass1 = `${req.body.pass1}`;
  req.body.pass2 = `${req.body.pass2}`;

  // Make sure all fields are used
  if (!req.body.pass || !req.body.pass1 || !req.body.pass2) {
    return res.status(400).json({ error: 'All fields are required!' });
  }

  // Make sure passwords match
  if (req.body.pass1 !== req.body.pass2) {
    return res.status(400).json({ error: 'Passwords do not match!' });
  }

  // Check that the user is here
  return Account.AccountModel.authenticate(req.session.account.username, req.body.pass,
  (err, account) => {
    const updatedAccount = account; // Local copy to modify

    // Make sure the password is correct
    if (err || !updatedAccount) {
      return res.status(401).json({ error: 'Wrong password!' });
    }

    // Try to update the account
    return Account.AccountModel.generateHash(req.body.pass1, (salt, hash) => {
      // Update account
      updatedAccount.username = req.session.account.username;
      updatedAccount.salt = salt;
      updatedAccount.password = hash;

      const savePromise = updatedAccount.save();

      // Promise
      savePromise.then(() => {
        // Store the account information in the session object
        req.session.account = Account.AccountModel.toAPI(updatedAccount);
        return res.status(204).json({ }); // Send back an empty object to avoid stupidity
      });

      savePromise.catch(() => res.status(400).json({ error: 'An error occured!' }));
    });
  });
};

const settingsPage = (req, res) => {
  // Add tokens here, where render data is submitted
  res.render('settings', { csrfToken: req.csrfToken() });
};

module.exports.getToken = getToken;
module.exports.loginPage = loginPage;
module.exports.login = login;
module.exports.logout = logout;
module.exports.signup = signup;
module.exports.updateUsername = updateUsername;
module.exports.updatePassword = updatePassword;
module.exports.settingsPage = settingsPage;
