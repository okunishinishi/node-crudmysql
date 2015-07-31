/**
 * A database table object.
 * @constructor MysqlcludTable
 * @param {string} tableName - Table name
 * @param {object} config - Table configuration.
 * @param {string} config.idKey - Key for id.
 */

"use strict";

var argx = require('argx'),
    SqlBuilder = require('./sql/sql_builder');


function MysqlcludTable(tableName, config) {
    var s = this;
    config = config || {};
    var connection = config.connection;
    s._sqlBuilder = new SqlBuilder({});
    s._connection = connection;
    s._tableName = tableName;
    s._idKey = config.idKey;

}
MysqlcludTable.prototype = {
    _tableName: undefined,
    _connection: undefined,
    _sqlBuilder: undefined,
    _idKey: 'id',
    _executeSql: function (sql, callback) {
        var s = this,
            connection = s._connection;
        connection.query({
            sql: sql,
            nestTables: '.'
        }, function (err, result) {
            callback(err, s._formatResult(result));
        });
    },
    _identifyCondition: function (id) {
        if (typeof(id) === 'undefined') {
            throw new Error('id is required.');
        }
        var s = this,
            condition = {};
        condition[s._idKey] = id;
        return condition;
    },
    _formatResult: function (data) {
        if (!data) {
            return;
        }
        var s = this,
            table = s._tableName.toLowerCase();
        if (Array.isArray(data)) {
            return data.map(s._formatResult.bind(s));
        }
        var formatted = {};
        Object.keys(data).forEach(function (key) {
            var val = data[key],
                names = key.split(/\./).filter(function (name) {
                    return !!name;
                });
            if (names.length == 1) {
                formatted[key.replace(/^\./, '')] = data[key];
                return;
            }
            var namespace = names[0] && names[0].toLowerCase(),
                col = names[1] && names[1].toLowerCase();
            var hasNameSpace = namespace && (namespace != table);
            if (hasNameSpace) {
                formatted[namespace] = formatted[namespace] || {};
                formatted[namespace][col] = val;
            } else {
                formatted[col] = val;
            }
        });
        return formatted;
    },
    /**
     * Create a data.
     * @param {object} data - Data to insert.
     * @param {object} [options] - Optional settings.
     * @param {function} callback - Callback when done.
     * @returns {MysqlcludTable} - Returns this.
     */
    create: function (data, options, callback) {
        var s = this,
            args = argx(arguments);

        callback = args.pop('function') || argx.noop;
        data = args.shift() || {};
        options = args.pop('object') || {};

        var sql = s._sqlBuilder.insertSql(s._tableName, data);
        return s._executeSql(sql, callback);

    },
    /**
     * Get a single data.
     * @param {string} id - Id of data.
     * @param {object} [options] - Optional settings.
     * @param {object} [options.ref] - Table reference.
     * @param {function} callback - Callback when done.
     * @returns {MysqlcludTable} - Returns this.
     */
    one: function (id, options, callback) {
        var s = this,
            args = argx(arguments);

        callback = args.pop('function') || argx.noop;
        options = args.pop('object') || {};
        id = args.shift();

        var sql = s._sqlBuilder.selectSql(s._tableName, {
            where: s._identifyCondition(id),
            ref: options.ref
        });
        return s._executeSql(sql, function (err, result) {
            callback(err, result && result.shift());
        }, function (err, result) {
            callback(err, s._formatResult(result));
        });

    },
    /**
     * List data.
     * @param {object} [options] - Optional settings.
     * @param {string[]} [options.fields] - Filed names to select.
     * @param {number} [options.offset] - Offset number.
     * @param {number} [options.limit] - Limit number.
     * @param {object} [options.condition] - Condition to find.
     * @param {object} [options.ref] - Table reference.
     * @param {function} callback - Callback when done.
     * @returns {MysqlcludTable} - Returns this.
     */
    list: function (options, callback) {
        var s = this,
            args = argx(arguments);
        callback = args.pop('function') || argx.noop;
        options = args.pop('object') || {};
        var sql = s._sqlBuilder.selectSql(s._tableName, {
            where: options.where || options.condition,
            fields: options.fields || options.fields,
            order: options.order || options.orders || options.orderBy,
            offset: options.offset,
            limit: options.limit,
            ref: options.ref
        });
        return s._executeSql(sql, callback);
    },
    /**
     * Count data.
     * @param {object} [options] - Optional settings.
     * @param {string[]} [options.fields] - Filed names to select.
     * @param {object} [options.condition] - Search condition.
     * @param {function} callback - Callback when done.
     * @returns {MysqlcludTable} - Returns this.
     */
    count: function (options, callback) {
        var s = this,
            args = argx(arguments);

        callback = args.pop('function') || argx.noop;
        options = args.pop('object') || {};

        var sql = s._sqlBuilder.selectSql(s._tableName, {
            where: options.where || options.condition,
            fields: ['count(1) as count'],
            order: options.order || options.orders || options.orderBy
        });
        return s._executeSql(sql, function (err, result) {
            callback(err, result && result.shift()['count']);
        });
    },
    /**
     * Update data.
     * @param {string} id - Resource id.
     * @param {object} data - Values to update.
     * @param {object} [options] - Optional settings.
     * @param {function} callback - Callback when done.
     * @returns {MysqlcludTable} - Returns this.
     */
    update: function (id, data, options, callback) {
        var s = this,
            args = argx(arguments);

        callback = args.pop('function') || argx.noop;
        options = args.pop('object') || {};
        id = args.shift();

        var sql = s._sqlBuilder.updateSql(s._tableName, {
            where: s._identifyCondition(id),
            values: data
        });
        return s._executeSql(sql, callback);

    },
    /**
     * Destroy a data.
     * @param {string} id - Resource id.
     * @param {object} [options] - Optional settings.
     * @param {function} callback - Callback when done.
     * @returns {MysqlcludTable} - Returns this.
     */
    destroy: function (id, options, callback) {
        var s = this,
            args = argx(arguments);

        callback = args.pop('function') || argx.noop;
        options = args.pop('object') || {};
        id = args.shift();
        var sql = s._sqlBuilder.deleteSql(s._tableName, {
            where: s._identifyCondition(id)
        });
        return s._executeSql(sql, callback);
    }
};


module.exports = MysqlcludTable;