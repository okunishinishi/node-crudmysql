var userTable = mysqlcrud.table('user', {/*options*/});

// Get a single user record with id.
userTable.one(3, function (err, data) {
    /**...**/
});
