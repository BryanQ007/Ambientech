const { getDataConnect, validateArgs } = require('firebase/data-connect');

const connectorConfig = {
  connector: 'default',
  service: 'Ambientech',
  location: 'us-central1'
};
exports.connectorConfig = connectorConfig;

