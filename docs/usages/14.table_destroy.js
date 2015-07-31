var userTable = mysqlcrud.table('user', {/*options*/});

// Destroy data.
userTable.destroy(3, function (err, result) {
    /**...**/
});