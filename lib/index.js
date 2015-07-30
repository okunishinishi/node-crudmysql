"use strict";


var Mysqlcrud = require('./mysqlcrud');

var mysqlcrud = new Mysqlcrud({});

mysqlcrud.Mysqlcrud = Mysqlcrud;

module.exports = mysqlcrud;