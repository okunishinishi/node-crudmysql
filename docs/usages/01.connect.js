var mysqlcrud = require('mysqlcrud');

// Connect to mysql.
// For more about connection options,
// see https://github.com/felixge/node-mysql/#connection-options
mysqlcrud.connect({
    user: 'root',
    password: 'host',
    database: 'my_db'
});

