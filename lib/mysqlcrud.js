/**
 * A mysqlcrud Context.
 * @constructor mysqlcrud
 * @param {object} configuration.
 */

"use strict";

var mysql = require('mysql'),
    events = require('events'),
    extend = require('extend'),
    MysqlcludTable = require('../lib/mysqlcrud_table');

function Mysqlclud(config) {
    var s = this;
    config = config || {};
}

Mysqlclud.prototype = extend(
    Object.create(events.EventEmitter.prototype),
    {
        _connection: undefined,
        /**
         * Connect to mysql table.
         * @param {object} config - Connect setting.
         * @returns {Mysqlclud} - Returns self.
         */
        connect: function (config) {
            var s = this;
            if (s._connection) {
                s.disconnect();
            }
            s._connection = mysql.createConnection(config);
            s._connection.connect(function (err) {
                if (err) {
                    delete s._connection;
                    s.emit('error', err);
                } else {
                    s.emit('connect');
                }
            });
            return s;
        },
        /*
         * Disconnect from mysql server.
         * @returns {Mysqlclud} - Returns self.
         */
        disconnect: function () {
            var s = this;
            s._connection.end();
            delete s._connection;
            return s;
        },
        /**
         * Get a mysqlcrud table instance.
         * @param {string} tableName - Name of database table.
         * @returns {*}
         */
        table: function (tableName) {
            var s = this;
            if (!tableName) {
                throw new Error('tableName is required.');
            }
            if (!s._connection) {
                throw new Error('Not connected!');
            }
            return new MysqlcludTable(tableName, {
                connection: s._connection
            });
        }
    });

function mysqlclud(config) {
    return new Mysqlclud(config);
}
module.exports = mysqlclud;

