

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

   createClientsTable = ()=>{

        this.db.run("CREATE TABLE IF NOT EXISTS clients (cl_id INTEGER NOT NULL, cl_code TEXT, cl_name TEXT, PRIMARY KEY (cl_id));");

    }

    createLawyersTable = ()=>{

      this.db.run("CREATE TABLE IF NOT EXISTS lawyers (la_id integer NOT NULL, la_code TEXT, la_name TEXT, PRIMARY KEY (la_id));");

    }

    createMattersTable = ()=>{

      this.db.run("CREATE TABLE IF NOT EXISTS matters (ma_id INTEGER NOT NULL, ma_code TEXT, ma_name TEXT,PRIMARY KEY (ma_id));");

    }

    createTimesheetsTable = ()=>{

      this.db.run("CREATE TABLE IF NOT EXISTS clients (ts_id INTEGER NOT NULL, ts_number INTEGER, ts_description TEXT, ts_hours REAL, cl_id INTEGER, la_id INTEGER, ma_id INTEGER);");

    }


    addNewEntity = (item: string, code: string, name: string)=>{
      return new Promise((resolve, reject)=>{
        let prefix: string
        if (item == 'clients'){
        prefix = 'cl'
        }else if (item == 'lawyers'){
        prefix = 'la'
        }else if (item == 'matters'){
        prefix = 'ma'
        }

        this.db.run(`INSERT INTO ${item} (${prefix}_code, ${prefix}_name) VALUES ('${code}', '${name}');`, (error)=>{
          if(error == null){
            resolve(this.create_result = 'Added!')
          }else{
            reject(this.create_result = 'DB Error!')
          }

        })

      })


    }



}
