const DB_NAME = process.env.DB_NAME || 'fuel-service-app';

module.exports = {
  MONGODB_URI: `mongodb+srv://${process.env.MONGODB_USERNAME}:${process.env.MONGODB_PASSWORD}@${process.env.MONGODB_CLUSTER}/${DB_NAME}?retryWrites=true&w=majority`,
  DB_NAME: DB_NAME
};