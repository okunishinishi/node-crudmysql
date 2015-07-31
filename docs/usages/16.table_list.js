var userTable = mysqlcrud.table('user', {/*options*/});

// List data.
userTable.list({
    where: {
        // List condition.
        last_name: 'Okunishi'
    },
    order: [{'last_name': false}],
    limit: 20,
    offset: 20
}, function (err, data) {
    /**...**/
});


