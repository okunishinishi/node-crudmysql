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
     * @param {object} condition - Condition to select.
     * @param {object} [options] - Optional settings.
     * @param {string[]} [options.fields] - Filed names to select.
     * @param {string} [options.order] - Order by.
     * @param {number} [options.offset] - Offset number
     * @param {number} [options.limit] - Limit number
     * @returns {string} SQL String
     */
    selectSql: function (tableName, condition, options) {
        options = options || {};
        var s = this;
        var sql = squel.select()
            .from(tableName);
        var fields = options.fields;
        if (fields) {
            [].concat(fields).forEach(function (field) {
                sql = sql.field(s._parseField(field));
            });
        }
        s._parseCondition(condition, tableName).forEach(function (condition) {
            sql = sql.where(condition.expression, condition.val);
        });
        var orders = options.order;
        if (orders) {
            s._parseOrder(orders).forEach(function (order) {
                sql = sql.order(order.key, order.asc);
            });
        }
        var limit = options.limit || options.limits;
        if (limit) {
            sql = sql.limit(Number(limit));
        }
        var offset = options.offset || options.skip;
        if (offset) {
            sql = sql.offset(Number(offset))
        }
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
        s._parseCondition(condition, tableName).forEach(function (condition) {
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

        s._parseCondition(condition, tableName).forEach(function (condition) {
            sql = sql.where(condition.expression, condition.val);
        });

        return sql.toString()
    },
    _parseCondition: function (condition, tableName) {
        var s = this;
        condition = condition || {};
        if (Array.isArray(condition)) {
            return condition.map(function (condition) {
                return s._parseCondition(condition, tableName);
            });
        }
        return Object.keys(condition).map(function (key) {
            var val = condition[key],
                operator = '=';
            if (typeof(val) === 'object') {
                operator = Object.keys(val).shift();
                val = val[operator];
            }
            if (!/\./.test(key)) {
                key = [tableName, key].join('.');
            }
            return {
                expression: [key, s._parseOperator(operator), '?'].join(' '),
                val: val
            }
        });
    },
    _parseOperator: function (operator) {
        switch (String(operator).toLowerCase()) {
            case '$gt':
                return '>';
            case '$gte':
                return '>=';
            case '$lt':
                return '<';
            case '$lte':
                return '<=';
        }
        return operator;
    },
    _parseOrder: function (orders) {
        return [].concat(orders || []).map(function (order) {
            switch (typeof(order)) {
                case 'string':
                    return [{
                        key: order,
                        asc: true
                    }];
                case 'object':
                    return Object.keys(order).map(function (key) {
                        var desc = (order[key] === false) || (order[key] === 'asc');
                        return {
                            key: key,
                            asc: !desc
                        }
                    });
                default:
                    return [];
            }
        }).reduce(_concat, []);
    },
    _parseField: function (fileld, tableName) {
        var s = this;
        if (Array.isArray(fileld)) {
            fileld.map(function (field) {
                return s._parseField(field, tableName);
            })
        }
        return fileld;
    }
};

function _concat(a, b) {
    return a.concat(b);
}

module.exports = SqlBuilder;

