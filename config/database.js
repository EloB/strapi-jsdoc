const path = require('path');

module.exports = /** @satisfies {Strapi.ConfigDatabase} */ (({ env }) => ({
  connection: {
    client: 'sqlite',
    connection: {
      filename: path.join(__dirname, '..', env('DATABASE_FILENAME', '.tmp/data.db')),
    },
    useNullAsDefault: true,
  },
}));
