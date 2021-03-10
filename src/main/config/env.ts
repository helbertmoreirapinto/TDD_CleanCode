export default {
  mongoUrl: process.env.MONGODB_URI || 'mongodb://localhost:27017/clean-node-api',
  port: process.env.PORT || 3333,
  jwtSecret: process.env.JWT_SECRET || '4Ihf4g3#_45sd!kj',
  salt: +process.env.SECRET_SALT || 12
}
