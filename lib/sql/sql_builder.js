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
     * @param {object} config - Select configuration.
     * @param {string[]} [config.fields] - Filed names to select.
     * @param {string} [config.order] - Order by.
     * @param {number} [config.offset] - Offset number
     * @param {number} [config.limit] - Limit number
     * @param {object} [config.where] - Where condition.
     * @param {object} [config.ref] - Refs a data.
     * @returns {string} SQL String
     */
    selectSql: function (tableName, config) {
        var s = this;
        var sql = squel.select()
            .from(tableName);
        var fields = config.fields;
        if (fields) {
            [].concat(fields).forEach(function (field) {
                sql = sql.field(s._parseField(field));
            });
        }
        var where = config.where || {};
        s._parseCondition(where, tableName).forEach(function (condition) {
            sql = sql.where(condition.expression, condition.val);
        });
        var orders = config.order;
        if (orders) {
            s._parseOrder(orders).forEach(function (order) {
                sql = sql.order(order.key, order.asc);
            });
        }
        var limit = config.limit || config.limits;
        if (limit) {
            sql = sql.limit(Number(limit));
        }
        var offset = config.offset || config.skip;
        if (offset) {
            sql = sql.offset(Number(offset))
        }
        var ref = config.ref;
        if (ref) {
            s._parseRef(ref, tableName).forEach(function (ref) {
                sql = sql.left_join(ref.table, ref.table, ref.condition)
            });
        }
        return sql.toString();
    },
    /**
     * Build a update sql.
     * @param {string} tableName - Name of table.
     * @param {object} config - Update configuration.
     * @param {object} config.where - Where to update.
     * @param {object} config.values - Values to update.
     * @returns {string} - SQL string.
     */
    updateSql: function (tableName, config) {
        var s = this;
        var sql = squel.update()
            .table(tableName);
        var values = config.values || {};
        Object.keys(values).forEach(function (key) {
            sql = sql.set(key, values[key]);
        });
        var where = config.where || {};
        s._parseCondition(where, tableName).forEach(function (condition) {
            sql = sql.where(condition.expression, condition.val);
        });
        return sql.toString();
    },
    /**
     * Build a delete sql.
     * @param {string} tableName - Name of table.
     * @param {object} config - Update configuration.
     * @param {object} config.where - Where to update.
     * @returns {string} - SQL string.
     */
    deleteSql: function (tableName, config) {
        var s = this;
        var sql = squel.delete()
            .from(tableName);

        var where = config.where || {};
        s._parseCondition(where, tableName).forEach(function (condition) {
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
            });
        }
        return fileld;
    },
    _parseRef: function (ref, tableName) {
        var s = this;
        if (Array.isArray(ref)) {
            ref.map(function (ref) {
                return s._parseRef(ref, tableName);
            }).reduce(_concat, []);
        }
        return Object.keys(ref).map(function (from) {
            var to = ref[from];
            if (!/\./.test(from)) {
                from = [tableName, from].join('.');
            }
            return {
                table: to.split(/\./).shift(),
                condition: [from, to].join(' = ')
            }
        });
    }
};

function _concat(a, b) {
    return a.concat(b);
}

module.exports = SqlBuilder;

