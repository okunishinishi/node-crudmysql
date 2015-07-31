mysqlcrud
=====

Simple crud functions with mysql database.

<!-- Badge start -->

[![Build Status][my_travis_badge_url]][my_travis_url]
[![Code Climate][my_codeclimate_badge_url]][my_codeclimate_url]
[![Code Coverage][my_codeclimate_coverage_badge_url]][my_codeclimate_url]
[![npm version][my_npm_budge_url]][my_npm_url]


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





Links
-----

+ [node-mysql](https://github.com/felixge/node-mysql/)



License
-------
This software is released under the [MIT License][my_license_url].


<!-- Links start -->

[nodejs_url]: http://nodejs.org/
[npm_url]: https://www.npmjs.com/
[nvm_url]: https://github.com/creationix/nvm
[bitdeli_url]: https://bitdeli.com/free
[my_bitdeli_badge_url]: https://d2weczhvl823v0.cloudfront.net/okunishinishi/node-mysqlcrud/trend.png
[my_repo_url]: https://github.com/okunishinishi/node-mysqlcrud
[my_travis_url]: http://travis-ci.org/okunishinishi/node-mysqlcrud
[my_travis_badge_url]: http://img.shields.io/travis/okunishinishi/node-mysqlcrud.svg?style=flat
[my_license_url]: https://github.com/okunishinishi/node-mysqlcrud/blob/master/LICENSE
[my_codeclimate_url]: http://codeclimate.com/github/okunishinishi/node-mysqlcrud
[my_codeclimate_badge_url]: http://img.shields.io/codeclimate/github/okunishinishi/node-mysqlcrud.svg?style=flat
[my_codeclimate_coverage_badge_url]: http://img.shields.io/codeclimate/coverage/github/okunishinishi/node-mysqlcrud.svg?style=flat
[my_apiguide_url]: http://okunishinishi.github.io/node-mysqlcrud/apiguide
[my_lib_apiguide_url]: http://okunishinishi.github.io/node-mysqlcrud/apiguide/module-mysqlcrud_lib.html
[my_coverage_url]: http://okunishinishi.github.io/node-mysqlcrud/coverage/lcov-report
[my_coverage_report_url]: http://okunishinishi.github.io/node-mysqlcrud/coverage/lcov-report/
[my_gratipay_url]: https://gratipay.com/okunishinishi/
[my_gratipay_budge_url]: http://img.shields.io/gratipay/okunishinishi.svg?style=flat
[my_npm_url]: http://www.npmjs.org/package/mysqlcrud
[my_npm_budge_url]: http://img.shields.io/npm/v/mysqlcrud.svg?style=flat
[my_tag_url]: http://github.com/okunishinishi/node-mysqlcrud/releases/tag/
[my_tag_badge_url]: http://img.shields.io/github/tag/okunishinishi/node-mysqlcrud.svg?style=flat

<!-- Links end -->
