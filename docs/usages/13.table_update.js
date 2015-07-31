var userTable = mysqlcrud.table('user', {/*options*/});

// Update a single user record.
userTable.update(3, {
    // Values to update.
    last_name: 'Super Okunishi'
}, function (err, result) {
    /**...**/
});