"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var sqlite = require("sqlite3");
var sqlite3 = sqlite.verbose();
var Database = /** @class */ (function () {
    function Database() {
        var _this = this;
        this.db = new sqlite3.Database('./database.sqlite3');
        this.createClientsTable = function () {
            _this.db.run("CREATE TABLE IF NOT EXISTS Client ( cl_code TEXT NOT NULL, cl_name TEXT, PRIMARY KEY (cl_code));");
        };
        this.createLawyersTable = function () {
            _this.db.run("CREATE TABLE IF NOT EXISTS Lawyer ( la_code TEXT NOT NULL, la_name TEXT, PRIMARY KEY (la_code));");
        };
        this.createMattersTable = function () {
            _this.db.run("CREATE TABLE IF NOT EXISTS Matter ( ma_code TEXT NOT NULL, ma_name TEXT, PRIMARY KEY (ma_code));");
        };
        this.createTimesheetsTable = function () {
            _this.db.run("CREATE TABLE IF NOT EXISTS Timesheet (sq_number INTEGER NOT NULL, input_date TEXT, hours INTEGER, cl_code TEXT, la_code TEXT, ma_code TEXT, description, PRIMARY KEY (sq_number));");
        };
        this.addNewEntity = function (item, code, name) {
            return new Promise(function (resolve, reject) {
                var prefix;
                if (item == 'Client') {
                    prefix = 'cl';
                }
                else if (item == 'Lawyer') {
                    prefix = 'la';
                }
                else if (item == 'Matter') {
                    prefix = 'ma';
                }
                _this.db.run("INSERT INTO " + item + " (" + prefix + "_code, " + prefix + "_name) VALUES ('" + code.toString() + "', '" + name + "');", function (error) {
                    if (error == null) {
                        resolve(_this.create_result = item + " added");
                    }
                    else {
                        reject(_this.create_result = 'DB error');
                    }
                });
            });
        };
        this.checkChange = function (item, code) {
            return new Promise(function (resolve, reject) {
                var prefix;
                if (item == 'Client') {
                    prefix = 'cl';
                }
                else if (item == 'Lawyer') {
                    prefix = 'la';
                }
                else if (item == 'Matter') {
                    prefix = 'ma';
                }
                var query;
                if (item == 'Timesheet') {
                    query = "SELECT Timesheet.sq_number, Timesheet.hours, Timesheet.input_date, Timesheet.cl_code, Client.cl_name, Timesheet.la_code, Lawyer.la_name, Timesheet.ma_code, Matter.ma_name, Timesheet.description  FROM Timesheet, Client, Lawyer, Matter WHERE (Timesheet.sq_number, Timesheet.input_date, Timesheet.hours, Client.cl_code, Lawyer.la_code, Matter.ma_code, Timesheet.description) = (SELECT  sq_number, input_date, hours, cl_code, la_code, ma_code, description  FROM Timesheet WHERE sq_number = " + code + ");";
                }
                else {
                    query = "SELECT " + prefix + "_code, " + prefix + "_name FROM " + item + " WHERE " + prefix + "_code = \"" + code + "\";";
                }
                _this.db.get(query, function (error, rows) {
                    if (rows !== undefined) {
                        resolve(rows);
                    }
                    else {
                        reject(null);
                    }
                });
            });
        };
        this.addTimesheet = function (obj) {
            return new Promise(function (resolve, reject) {
                var query = "INSERT INTO Timesheet (sq_number, input_date, hours, cl_code, la_code, ma_code, description) VALUES (" + obj.sq_number + ", \"" + obj.date + "\", " + obj.hours + ", \"" + obj.cl_code + "\", \"" + obj.la_code + "\", \"" + obj.ma_code + "\", \"" + obj.desc + "\")";
                _this.db.run(query, function (error) {
                    if (error == null) {
                        resolve({ value: 'added', valid: true });
                    }
                    else {
                        reject('DB error');
                    }
                }); // End of DB query
            }); // End of promise
        }; // End of addTimesheet
        this.editEntry = function (item, code, obj) {
            return new Promise(function (resolve, reject) {
                var query;
                var prefix;
                if (item == 'Client') {
                    prefix = 'cl';
                }
                else if (item == 'Lawyer') {
                    prefix = 'la';
                }
                else if (item == 'Matter') {
                    prefix = 'ma';
                }
                if (item == 'Timesheet') {
                    query = "UPDATE Timesheet SET (input_date, hours, cl_code, la_code, ma_code, description) = ('" + obj.date + "', " + obj.hours + ", " + obj.cl_code + ", " + obj.la_code + ", " + obj.ma_code + ", '" + obj.desc + "') WHERE sq_number = " + obj.sq_number + ";";
                    //console.log(query)
                }
                else {
                    query = "UPDATE '" + item + "' SET (" + prefix + "_name) = ('" + obj.name + "') WHERE " + prefix + "_code = " + obj.code + ";";
                    //console.log('Query : ' + query)
                }
                _this.db.run(query, function (error) {
                    if (error == null) {
                        resolve({ value: 'edited', valid: true });
                    }
                    else {
                        reject({ value: 'DB error', valid: false });
                    }
                }); // End of DB query
            }); // End of promise
        }; // End of addTimesheet
        this.deleteEntry = function (item, code, obj) {
            return new Promise(function (resolve, reject) {
                var query;
                var prefix;
                if (item == 'Client') {
                    prefix = 'cl';
                }
                else if (item == 'Lawyer') {
                    prefix = 'la';
                }
                else if (item == 'Matter') {
                    prefix = 'ma';
                }
                if (item == 'Timesheet') {
                    query = "DELETE FROM Timesheet WHERE sq_number = " + obj.sq_number + ";";
                    //console.log(query)
                }
                else {
                    query = "DELETE FROM '" + item + "' WHERE " + prefix + "_code = " + obj.code + ";";
                    //console.log(query)
                }
                _this.db.run(query, function (error) {
                    if (error == null) {
                        resolve({ value: 'deleted', valid: true });
                    }
                    else {
                        reject({ value: 'DB error', valid: false });
                    }
                }); // End of DB query
            }); // End of promise
        }; // End of addTimesheet
        this.lastSequence = function () {
            return new Promise(function (resolve, reject) {
                var query;
                query = "SELECT sq_number FROM Timesheet WHERE sq_number = (SELECT MAX(sq_number)  FROM Timesheet);";
                //console.log(query)
                _this.db.get(query, function (error, rows) {
                    resolve(rows);
                });
            }); // End of promise
        }; // End of addTimesheet
    }
    Object.defineProperty(Database.prototype, "create_result", {
        get: function () {
            return this._create_result;
        },
        set: function (value) {
            this._create_result = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Database.prototype, "change_check_result", {
        get: function () {
            return this._create_result;
        },
        set: function (value) {
            this._create_result = value;
        },
        enumerable: true,
        configurable: true
    });
    return Database;
}());
exports.Database = Database;
//# sourceMappingURL=server.js.map