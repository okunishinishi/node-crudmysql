var userTable = mysqlcrud.table('user', {/*options*/});

// Count data.
userTable.count({
    where: {
        // Count condition.
        last_name: 'Okunishi'
    },
    order:['first_name']
}, function (err, data) {
    /**...**/
});
