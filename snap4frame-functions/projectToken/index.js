const { v4: uuidv4 } = require('uuid');
const { Datastore } = require('@google-cloud/datastore');

const functions = require('@google-cloud/functions-framework');

const datastore = new Datastore();

functions.http('getProjectToken', (req, res) => {
  
  const kind = 'token4projects';
  const token = uuidv4();
  const name = req.body.name;
  const user = req.body.user;

  if (!name || !user) {
    res.status(400).send('Both name and user must be provided in the request body.');
    return;
  }

  const key = datastore.key(kind);

  let entity = {
    key: key,
    data: {
      token: token,
      name: name,
      user: user
    }
  };

  datastore
    .save(entity)
    .then(() => {
      res.status(200).send({ token });
    })
    .catch(err => {
      console.error('ERROR:', err);
      res.status(500).send('Error occured when creating the token');
    });

});
