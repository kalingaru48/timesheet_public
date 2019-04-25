

import * as sqlite from 'sqlite3';
const sqlite3 = sqlite.verbose();


export class Database{
   db: sqlite.Database = new sqlite3.Database('./database.sqlite3');
   _create_result: string;

   get create_result(){
     return this._create_result
   }

   set create_result(value){
    this._create_result = value
   }

   _change_check_result: string;

   get change_check_result(){
     return this._create_result
   }

   set change_check_result(value){
    this._create_result = value
   }

   createClientsTable = ()=>{

        this.db.run("CREATE TABLE IF NOT EXISTS Client ( cl_code TEXT NOT NULL, cl_name TEXT, PRIMARY KEY (cl_code));");

    }

    createLawyersTable = ()=>{

      this.db.run("CREATE TABLE IF NOT EXISTS Lawyer ( la_code TEXT NOT NULL, la_name TEXT, PRIMARY KEY (la_code));");

    }

    createMattersTable = ()=>{

      this.db.run("CREATE TABLE IF NOT EXISTS Matter ( ma_code TEXT NOT NULL, ma_name TEXT, PRIMARY KEY (ma_code));");

    }

    createTimesheetsTable = ()=>{

      this.db.run("CREATE TABLE IF NOT EXISTS Timesheet (sq_number INTEGER NOT NULL, input_date TEXT, hours INTEGER, cl_code TEXT, la_code TEXT, ma_code TEXT, description, PRIMARY KEY (sq_number));");

    }


    addNewEntity = (item: string, code: string, name: string)=>{
      return new Promise((resolve, reject)=>{
        let prefix: string
        if (item == 'Client'){
        prefix = 'cl'
        }else if (item == 'Lawyer'){
        prefix = 'la'
        }else if (item == 'Matter'){
        prefix = 'ma'
        }

        this.db.run(`INSERT INTO ${item} (${prefix}_code, ${prefix}_name) VALUES ('${code.toString()}', '${name}');`, (error)=>{
          if(error == null){
            resolve(this.create_result = `${item} added`)
          }else{
            reject(this.create_result = 'DB error')
          }

        })

      })


    }

    checkChange = (item: string, code: string)=>{
      return new Promise((resolve, reject)=>{
        let prefix: string
        if (item == 'Client'){
        prefix = 'cl'
        }else if (item == 'Lawyer'){
        prefix = 'la'
        }else if (item == 'Matter'){
        prefix = 'ma'
        }

        let query
        if (item == 'Timesheet'){
          query = `SELECT Timesheet.sq_number, Timesheet.hours, Timesheet.input_date, Timesheet.cl_code, Client.cl_name, Timesheet.la_code, Lawyer.la_name, Timesheet.ma_code, Matter.ma_name, Timesheet.description  FROM Timesheet, Client, Lawyer, Matter WHERE (Timesheet.sq_number, Timesheet.input_date, Timesheet.hours, Client.cl_code, Lawyer.la_code, Matter.ma_code, Timesheet.description) = (SELECT  sq_number, input_date, hours, cl_code, la_code, ma_code, description  FROM Timesheet WHERE sq_number = ${code});`
        } else{
          query = `SELECT ${prefix}_code, ${prefix}_name FROM ${item} WHERE ${prefix}_code = "${code}";`;
        }


       this.db.get(query, (error, rows)=>{
          if(rows !== undefined){
            resolve(rows)
          }else{
            reject(null)
          }

        })

      })


    }

    addTimesheet = (obj)=>{

      return new Promise((resolve, reject)=>{

        let query = `INSERT INTO Timesheet (sq_number, input_date, hours, cl_code, la_code, ma_code, description) VALUES (${obj.sq_number}, "${obj.date}", ${obj.hours}, "${obj.cl_code}", "${obj.la_code}", "${obj.ma_code}", "${obj.desc}")`

        this.db.run(query, (error)=>{
          if(error == null){
            resolve({value: 'added', valid : true})
          }else{
            reject('DB error')
          }

        }); // End of DB query

      }); // End of promise

    }; // End of addTimesheet

    editEntry = (item: string, code: string, obj:any)=>{

      return new Promise((resolve, reject)=>{
        let query:string
        let prefix: string
        if (item == 'Client'){
        prefix = 'cl'
        }else if (item == 'Lawyer'){
        prefix = 'la'
        }else if (item == 'Matter'){
        prefix = 'ma'
        }

        if(item == 'Timesheet'){
          query = `UPDATE Timesheet SET (input_date, hours, cl_code, la_code, ma_code, description) = ('${obj.date}', ${obj.hours}, ${obj.cl_code}, ${obj.la_code}, ${obj.ma_code}, '${obj.desc}') WHERE sq_number = ${obj.sq_number};`
          //console.log(query)
        }else {
          query = `UPDATE '${item}' SET (${prefix}_name) = ('${obj.name}') WHERE ${prefix}_code = ${obj.code};`
          //console.log('Query : ' + query)
        }

        this.db.run(query, (error)=>{
          if(error == null){
            resolve({value: 'edited', valid : true})
          }else{
            reject({value: 'DB error', valid : false})
          }

        }); // End of DB query

      }); // End of promise

    }; // End of addTimesheet


    deleteEntry = (item: string, code: string, obj:any)=>{

      return new Promise((resolve, reject)=>{
        let query:string
        let prefix: string
        if (item == 'Client'){
        prefix = 'cl'
        }else if (item == 'Lawyer'){
        prefix = 'la'
        }else if (item == 'Matter'){
        prefix = 'ma'
        }

        if(item == 'Timesheet'){
          query = `DELETE FROM Timesheet WHERE sq_number = ${obj.sq_number};`
          //console.log(query)
        }else {
          query = `DELETE FROM '${item}' WHERE ${prefix}_code = ${obj.code};`;
          //console.log(query)
        }

        this.db.run(query, (error)=>{
          if(error == null){
            resolve({value: 'deleted', valid : true})
          }else{
            reject({value: 'DB error', valid : false})
          }

        }); // End of DB query

      }); // End of promise

    }; // End of addTimesheet

    lastSequence = ()=>{

      return new Promise((resolve, reject)=>{
        let query:string


          query = `SELECT sq_number FROM Timesheet WHERE sq_number = (SELECT MAX(sq_number)  FROM Timesheet);`
          //console.log(query)


        this.db.get(query, (error, rows)=>{

            resolve(rows)

        })

      }); // End of promise

    }; // End of addTimesheet



}
