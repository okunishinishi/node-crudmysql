var userTable = mysqlcrud.table('user', {
    // Table options
});

// Create a new user record.
userTable.create({
    last_name: 'Okunishi',
    first_name: 'Taka'
}, function (err, result) {
    /**...**/
});

// Get a single user record with id.
userTable.one(3, function (err, data) {
    /**...**/
});


// List data.
userTable.list({
    // List condition.
    last_name: 'Okunishi'
}, {
    // List Options.
    order: [{'last_name': false}],
    limit: 20,
    offset: 20
}, function (err, data) {
    /**...**/
});


// Count data.
userTable.count({
    // Count condition.
    last_name: 'Okunishi'
}, function (err, data) {
    /**...**/
});


// Update data.
userTable.update(3, {
    // Count condition.
    last_name: 'Super Okunishi'
}, function (err, result) {
    /**...**/
});

// Destroy data.
userTable.destroy(3, function (err, result) {
    /**...**/
});