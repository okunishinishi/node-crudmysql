var mysqlcrud = require('mysqlcrud');


mysqlcrud.connect({
    user: 'root',
    password: 'host'
});

mysqlcrud.disconnect();