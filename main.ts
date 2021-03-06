import { app, BrowserWindow, ipcMain, screen } from 'electron';
import * as path from 'path';
import * as url from 'url';
import { Database } from './server/server'

let db = new Database()

db.createClientsTable()
db.createLawyersTable()
db.createMattersTable()
db.createTimesheetsTable()

ipcMain.on('create', (event, args)=>{
  //console.log(args)
  db.addNewEntity(args.item, args.code, args.name)
      .then((result)=>{
        event.returnValue = {value:'Added', valid: true}
      })
      .catch((err)=>{
          event.returnValue = {value: err, valid: false}
    })

})

ipcMain.on('newTimeSheet', (event, args)=>{
  //console.log(args.item)
  //console.log(args.code)

  if(args.event == 'check'){

      db.checkChange(args.item, args.code)
      .then((result)=>{
          if(args.item == 'Timesheet'){
            if(result != null){
              event.returnValue = result
            } else if(result == null){
              // This space will not be excuted as I'm rejecting(null) in server.js check promise
            }

          } else {
            let keys = Object.keys(result)
            event.returnValue = {"value": result[keys[1]], "valid" : true}
            //console.log(result)
          }
      })
      .catch((err)=>{
       if(args.item == 'Timesheet'){
        event.returnValue = { sq_number: false, hours: null, input_date: null, cl_code: null, cl_name: null, la_code: null, la_name: null, ma_code: null, ma_name: null, description: null }
       }else{
        event.returnValue = {"value": err, "valid" : false}
       }

      })


  } else if(args.event ==  'createTimesheet'){

    db.addTimesheet(args.data)
        .then((result)=>{
         event.returnValue =  result
        }).catch((err)=>{
          event.returnValue = {value: err, valid : false}
        })

  } else if(args.event == 'edit'){
    //console.log(args.data)
    db.editEntry(args.item, args.code, args.data)
        .then((result)=>{
         //console.log('Here is your result: ', result)
         event.returnValue =  result
        }).catch((err)=>{

          event.returnValue = {"value": err['value'], "valid" : false}
        })

  } else if(args.event == 'delete'){

    //console.log(args.data)
    db.deleteEntry(args.item, args.code, args.data)
        .then((result)=>{
         //console.log('Here is your result: ', result)
         event.returnValue =  result
        }).catch((err)=>{
          event.returnValue = {"value": err['value'], "valid" : false}
        })

  } else if (args.event == 'lastSequnce'){

    db.lastSequence().then((result)=>{
      //console.log(result)
      event.returnValue = {"value": result['sq_number'], "valid" : true}

    }).catch((err)=>{

      event.returnValue = {"value": 'DB Error!', "valid" : false}

    })

  }

})



let win, serve;
const args = process.argv.slice(1);
serve = args.some(val => val === '--serve');

function createWindow() {

  const electronScreen = screen;
  const size = electronScreen.getPrimaryDisplay().workAreaSize;

  // Create the browser window.
  win = new BrowserWindow({
    x: 0,
    y: 0,
    width: size.width,
    height: size.height
  });

  if (serve) {
    require('electron-reload')(__dirname, {
      electron: require(`${__dirname}/node_modules/electron`)
    });
    win.loadURL('http://localhost:4200');
  } else {
    win.loadURL(url.format({
      pathname: path.join(__dirname, 'dist/index.html'),
      protocol: 'file:',
      slashes: true
    }));
  }

  win.webContents.openDevTools();

  let server = require("./server/server.js")

  // Emitted when the window is closed.
  win.on('closed', () => {
    // Dereference the window object, usually you would store window
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    win = null;
  });

}

try {

  // This method will be called when Electron has finished
  // initialization and is ready to create browser windows.
  // Some APIs can only be used after this event occurs.
  app.on('ready', createWindow);

  // Quit when all windows are closed.
  app.on('window-all-closed', () => {
    // On OS X it is common for applications and their menu bar
    // to stay active until the user quits explicitly with Cmd + Q
    if (process.platform !== 'darwin') {
      app.quit();
    }
  });

  app.on('activate', () => {
    // On OS X it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (win === null) {
      createWindow();
    }
  });

} catch (e) {
  // Catch Error
  // throw e;
}
