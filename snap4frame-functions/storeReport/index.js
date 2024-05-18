const { PubSub } = require('@google-cloud/pubsub');
const { Datastore, PropertyFilter } = require('@google-cloud/datastore');
const functions = require('@google-cloud/functions-framework');

const pubsub = new PubSub();
const datastore = new Datastore();

functions.http('storeReport', (req, res) => {

console.log("HERE");
  const topicName = 'reports';

  const kind = 'report';
  const token = req.query.token;
  const inputReport = req.body;

  const key = datastore.key(kind);
 
  if(!inputReport){
    const message = 'The body can\'t be empty';
    res.status(400).send({message});
    return;
  }

  const query = datastore.createQuery("token4projects").filter(new PropertyFilter('token', '=', token));

  let report = {
    key: key,
    data: {
      token: token,
      timestamp: Date.now(),
      resolved: false,
      report: inputReport
    }
  };

  datastore
    .runQuery(query)
    .then(result => {
      const entities = result[0];
      if(entities.length === 0)
        return Promise.reject(new Error('No entity with specified token found.'));
      else
        return datastore.save(report);
    })
    .then(() => {
      const message = `Saved ${report.key.id} report for project ${token}`;
      res.status(200).send({message});

      const data = { reportID: report.key.id };
      const attributes = { token }

      return pubsub.topic(topicName).publishJSON(data, attributes);
      
    })
    .catch(err => {
      console.error(err);
      let message = 'No entity with specified token found.';
      if (err.message === message) {
          res.status(404).send({message});
        } else {
          message = 'Error saving report entity';
          res.status(500).send({message});
        }
    });
});
