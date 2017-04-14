exports.DATABASE_URL = process.env.DATABASE_URL ||
    global.DATABASE_URL ||
    'mongodb://user:user@ds159180.mlab.com:59180/where-to-hike-db'
exports.PORT = process.env.PORT || 3000;
