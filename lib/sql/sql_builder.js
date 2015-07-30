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
     * Parse a condition.
     * @param {object} condition - Condition to parse
     * @private
     */
    _parseCondition: function (condition) {
        var s = this;
        condition = condition || {};
        if (Array.isArray(condition)) {
            return condition.map(s._parseCondition.bind(s));
        }
        return Object.keys(condition).map(function (key) {
            var val = condition[key],
                operator = '=';
            if (typeof(val) === 'object') {
                operator = Object.keys(val).shift();
                val = val[operator];
            }
            return {
                expression: [key, operator, '?'].join(' '),
                val: val
            }
        });
    },
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
     * @param {object} condition - Condition to select.
     * @param {object} [options] - Optional settings.
     * @param {string[]} [options.fields] - Filed names to select.
     * @returns {string} SQL String
     */
    selectSql: function (tableName, condition, options) {
        options = options || {};
        var s = this;
        var sql = squel.select()
            .from(tableName);
        var fields = options.field || options.fields;
        if (fields) {
            [].concat(fields).forEach(function (field) {
                sql = sql.field(field);
            });
        }
        s._parseCondition(condition).forEach(function (condition) {
            sql = sql.where(condition.expression, condition.val);
        });
        return sql.toString();
    },
    /**
     * Build a update sql.
     * @param {string} tableName - Name of table.
     * @param {object} condition - Update condition.
     * @param {object} data - Data to update.
     * @returns {string} - SQL string.
     */
    updateSql: function (tableName, condition, data) {
        var s = this;
        var sql = squel.update()
            .table(tableName);
        Object.keys(data).forEach(function (key) {
            sql = sql.set(key, data[key]);
        });
        s._parseCondition(condition).forEach(function (condition) {
            sql = sql.where(condition.expression, condition.val);
        });
        return sql.toString();
    },
    /**
     * Build a delete sql.
     * @param {string} tableName - Name of table.
     * @param {object} condition - Update condition.
     * @returns {string} - SQL string.
     */
    deleteSql: function (tableName, condition) {
        var s = this;
        var sql = squel.delete()
            .from(tableName);

        s._parseCondition(condition).forEach(function (condition) {
            sql = sql.where(condition.expression, condition.val);
        });

        return sql.toString()
    }
};

module.exports = SqlBuilder;

