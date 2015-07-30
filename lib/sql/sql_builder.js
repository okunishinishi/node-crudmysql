/**
 * SQL builder.
 * @constructor SqlBuilder
 * @param {object} config - Builder configuration.
 */

"use strict";

var squel = require('squel'),
    argx = require('argx');

function SqlBuilder(config) {
    var s = this;
    config = config || {};
}

SqlBuilder.prototype = {
    /**
     * Build a insert sql.
     * @param {string} tableName - Name of table.
     * @param {object} data - Data to set.
     * @returns {string} - SQL string.
     */
    insertSql: function (tableName, data) {
        var s = this;
        var sql = squel.insert()
            .into(tableName);
        Object.keys(data).forEach(function (key) {
            sql = sql.set(key, data[key]);
        });
        return sql.toString();
    },
    /**
     * Build a select sql
     * @param {string} tableName - Name of table.
     * @param {object} condition
     */
    selectSql: function (tableName, condition) {
        var s = this;
        var sql = squel.select()
            .from(tableName);
        Object.keys(condition || {}).forEach(function (key) {
            var operator = '=';
            sql = sql.where([key + operator + '?'].join(' '), condition[key]);
        });
        return sql.toString();
    }
};

module.exports = SqlBuilder;

