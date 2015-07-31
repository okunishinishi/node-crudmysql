var userTable = mysqlcrud.table('user', {/*options*/});

// Count data.
userTable.count({
    where: {
        // Count condition.
        last_name: 'Okunishi'
    }
}, function (err, data) {
    /**...**/
});
