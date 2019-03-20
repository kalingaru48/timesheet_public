"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var sqlite = require("sqlite3");
var sqlite3 = sqlite.verbose();
var Database = /** @class */ (function () {
    function Database() {
        var _this = this;
        this.db = new sqlite3.Database('./database.sqlite3');
        this.createClientsTable = function () {
            _this.db.run("CREATE TABLE IF NOT EXISTS clients (cl_id INTEGER NOT NULL, cl_code TEXT, cl_name TEXT, PRIMARY KEY (cl_id));");
        };
        this.createLawyersTable = function () {
            _this.db.run("CREATE TABLE IF NOT EXISTS lawyers (la_id integer NOT NULL, la_code TEXT, la_name TEXT, PRIMARY KEY (la_id));");
        };
        this.createMattersTable = function () {
            _this.db.run("CREATE TABLE IF NOT EXISTS matters (ma_id INTEGER NOT NULL, ma_code TEXT, ma_name TEXT,PRIMARY KEY (ma_id));");
        };
        this.createTimesheetsTable = function () {
            _this.db.run("CREATE TABLE IF NOT EXISTS clients (ts_id INTEGER NOT NULL, ts_number INTEGER, ts_description TEXT, ts_hours REAL, cl_id INTEGER, la_id INTEGER, ma_id INTEGER);");
        };
        this.addNewEntity = function (item, code, name) {
            return new Promise(function (resolve, reject) {
                var prefix;
                if (item == 'clients') {
                    prefix = 'cl';
                }
                else if (item == 'lawyers') {
                    prefix = 'la';
                }
                else if (item == 'matters') {
                    prefix = 'ma';
                }
                _this.db.run("INSERT INTO " + item + " (" + prefix + "_code, " + prefix + "_name) VALUES ('" + code + "', '" + name + "');", function (error) {
                    if (error == null) {
                        resolve(_this.create_result = 'Added!');
                    }
                    else {
                        reject(_this.create_result = 'DB Error!');
                    }
                });
            });
        };
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
    return Database;
}());
exports.Database = Database;
//# sourceMappingURL=server.js.map