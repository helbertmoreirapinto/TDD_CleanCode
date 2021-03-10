export default {
  mongoUrl: process.env.MONGO_URL || 'mongodb://localhost:27017/clean-node-api',
  port: process.env.PORT || 3333,
  jwtSecret: process.env.JET_SECRET || '4ihf4g3#_45sd!kj',
  salt: +process.env.SECRET_SALT || 12
}
