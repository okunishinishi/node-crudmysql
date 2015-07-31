var userTable = mysqlcrud.table('user', {/*options*/});

// Create a new user record.
userTable.create({
    last_name: 'Okunishi',
    first_name: 'Taka'
}, function (err, result) {
    /**...**/
});
