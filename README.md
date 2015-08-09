mysqlcrud
==========

<!-- Badge Start -->
<a name="badges"></a>

[![Build Status][bd_travis_shield_url]][bd_travis_url]
[![Code Climate][bd_codeclimate_shield_url]][bd_codeclimate_url]
[![Code Coverage][bd_codeclimate_coverage_shield_url]][bd_codeclimate_url]
[![npm Version][bd_npm_shield_url]][bd_npm_url]

[bd_repo_url]: https://github.com/okunishinishi/node-mysqlcrud
[bd_travis_url]: http://travis-ci.org/okunishinishi/node-mysqlcrud
[bd_travis_shield_url]: http://img.shields.io/travis/okunishinishi/node-mysqlcrud.svg?style=flat
[bd_license_url]: https://github.com/okunishinishi/node-mysqlcrud/blob/master/LICENSE
[bd_codeclimate_url]: http://codeclimate.com/github/okunishinishi/node-mysqlcrud
[bd_codeclimate_shield_url]: http://img.shields.io/codeclimate/github/okunishinishi/node-mysqlcrud.svg?style=flat
[bd_codeclimate_coverage_shield_url]: http://img.shields.io/codeclimate/coverage/github/okunishinishi/node-mysqlcrud.svg?style=flat
[bd_gemnasium_url]: https://gemnasium.com/okunishinishi/node-mysqlcrud
[bd_gemnasium_shield_url]: https://gemnasium.com/okunishinishi/node-mysqlcrud.svg
[bd_npm_url]: http://www.npmjs.org/package/mysqlcrud
[bd_npm_shield_url]: http://img.shields.io/npm/v/mysqlcrud.svg?style=flat

<!-- Badge End -->


<!-- Description Start -->
<a name="description"></a>

Simple crud functions with mysql database.

<!-- Description End -->



<!-- Sections Start -->
<a name="sections"></a>

Installation
-----

```bash
npm install mysqlcrud --save
```

Usage
-----

### Connect to Database

Pass [node-mysql connection config](https://github.com/felixge/node-mysql/#connection-options) to connect mysql database.

```javascript
var mysqlcrud = require('mysqlcrud');

// Connect to mysql.
// For more about connection options,
// see https://github.com/felixge/node-mysql/#connection-options
mysqlcrud.connect({
    user: 'root',
    password: 'host',
    database: 'my_db'
});
```

### Disconnect from Database

Ensure to disconnect from database before exit.

```javascript
mysqlcrud.disconnect();
```

### Execute a SQL

```javascript
mysqlcrud.execute('show tables', function () {

});
```

### Accessing a Table

mysqlcrud table provides basic CURD functions.

Use `mysqlcrud.table()` to create table instance.

```javascript
var userTable = mysqlcrud.table('user', {
    idKey: 'user_id'
});

```

**Table Optoins**

| Key | Description | Example |
| --- | ----------- | ------- |
| idKey | Key for id column. | 'user_id' |



### Create a Record on a Table

```javascript
var userTable = mysqlcrud.table('user', {/*options*/});

// Create a new user record.
userTable.create({
    last_name: 'Okunishi',
    first_name: 'Taka'
}, function (err, result) {
    /**...**/
});

```


### Find a Record from a Table

```javascript
var userTable = mysqlcrud.table('user', {/*options*/});

// Get a single user record with id.
userTable.one(3, function (err, data) {
    /**...**/
});

```

### Update a Record in a Table

```javascript
var userTable = mysqlcrud.table('user', {/*options*/});

// Update a single user record.
userTable.update(3, {
    // Values to update.
    last_name: 'Super Okunishi'
}, function (err, result) {
    /**...**/
});
```

### Destroy a Record form a Table

```javascript
var userTable = mysqlcrud.table('user', {/*options*/});

// Destroy data.
userTable.destroy(3, function (err, result) {
    /**...**/
});
```

#### Count Records in a Table

```javascript
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

```


#### List Records from a Table

```javascript
var userTable = mysqlcrud.table('user', {/*options*/});

// List data.
userTable.list({
    where: {
        // List condition.
        last_name: 'Okunishi'
    },
    order: [{'first_name': false}],
    limit: 20,
    offset: 20
}, function (err, data) {
    /**...**/
});



```

**List Options**

| Key | Description | Example |
| --- | ----------- | ------- |
| order | Column name to order. | ['last_name'] <br> [{'last_name', false}] |
| limit | Limit count | 20 |
| offset | Offset count | 20 |

Tips
----

### Connection Options

`mysqlcrud` uses [node-mysql](https://github.com/felixge/node-mysql/) as connector.
For more advanced setting, see the [node-mysql documents about Connection options](https://github.com/felixge/node-mysql/#connection-options)


<!-- Sections Start -->


<!-- LICENSE Start -->
<a name="license"></a>

License
-------
This software is released under the [MIT License](https://github.com/okunishinishi/node-mysqlcrud/blob/master/LICENSE).

<!-- LICENSE End -->


<!-- Links Start -->
<a name="links"></a>

Links
------

+ [node-mysql](https://github.com/felixge/node-mysql/)

<!-- Links End -->
