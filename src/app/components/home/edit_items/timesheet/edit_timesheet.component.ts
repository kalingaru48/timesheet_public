import { Component, ViewChild } from '@angular/core'
import { NgForm } from '@angular/forms';
import { ipcRenderer } from 'electron';

@Component({
  selector: 'app-edit-timesheet-page',
  templateUrl: 'edit_timesheet.component.html',
  styleUrls: ['edit_timesheet.component.scss']
})

export class Edit_TimesheetComponent {

  sq_number: string = "";
  date_and_time: string = "";
  hours: number;
  client_code: string = "";
  lawyer_code: string = "";
  matter_code: string = "";
  client_result: object = {value: null, valid : null};
  lawyer_result: object = {value: null, valid : null};
  matter_result: object = {value: null, valid : null};
  timesheet_description: string = "";
  edit_timeSheet_result: object = {value: null, valid : null};
  sq_number_result: object = { sq_number: null, hours: null, input_date: null, cl_code: null, cl_name: null, la_code: null, la_name: null, ma_code: null,
    ma_name: null,
    description: null }
  not_valid_entry: string  = 'Not a valid entry'

  constructor() { }
  @ViewChild('editTimesheetForm') editTimesheetForm: NgForm;

  checkCodes(table: string, value: string){
    //console.log(value)
    return ipcRenderer.sendSync('newTimeSheet', {item: table, event: 'check', code: value})
  }

  createTimesheet(obj: object){
    return ipcRenderer.sendSync('newTimeSheet', {item: 'Timesheet', event: 'createTimesheet', data: obj })
  }

  editTimesheet(obj: object){
    //console.log('Editing')
    return ipcRenderer.sendSync('newTimeSheet', {item: 'Timesheet', event: 'edit', data: obj })
  }

  deleteTimesheet(obj: object){
    //console.log('Delete')
    return ipcRenderer.sendSync('newTimeSheet', {item: 'Timesheet', event: 'delete', data: obj })
  }


  onSearchChange_sq_number(searchValue : string ) {
    if(searchValue.length <= 6){
      this.sq_number_result = this.checkCodes("Timesheet", searchValue.toString())

      if(this.sq_number_result['sq_number']){

        this.sq_number = this.sq_number_result['sq_number']
        this.date_and_time = this.sq_number_result['input_date']
        this.hours = this.sq_number_result['hours']
        this.client_code = this.sq_number_result['cl_code']
        this.lawyer_code = this.sq_number_result['la_code']
        this.matter_code = this.sq_number_result['ma_code']
        this.timesheet_description = this.sq_number_result['description']

        this.client_result = {value: null, valid : true};
        this.lawyer_result = {value: null, valid : true};
        this.matter_result = {value: null, valid : true};

      }else{

        this.client_result = {value: null, valid : false};
        this.lawyer_result = {value: null, valid : false};
        this.matter_result = {value: null, valid : false};

      }

    }
  }

  onSearchChange_client(searchValue : string ) {
   this.sq_number_result["cl_name"] = null
    if(searchValue.length <= 4){
      return this.client_result = this.checkCodes("Client", searchValue)
      //console.log(this.checkCodes("Client", searchValue))
    } else {
      this.client_result = {value: null, valid : false};
    }

  }

  onSearchChange_lawyer(searchValue : string ) {
    this.sq_number_result["la_name"] = null
    if(searchValue.length <= 4){
      return this.lawyer_result = this.checkCodes("Lawyer", searchValue)
    } else {
      this.lawyer_result = {value: null, valid : false};
    }

  }

  onSearchChange_matter(searchValue : string ) {
    this.sq_number_result["ma_name"] = null
    if(searchValue.length <= 4){
      return this.matter_result = this.checkCodes("Matter", searchValue)
    } else {
      this.matter_result = {value: null, valid : false};
    }

  }

  onEdit(){

    if(this.editTimesheetForm.valid && this.date_and_time != null && this.client_result["valid"] === true &&  this.lawyer_result["valid"] === true  &&  this. matter_result["valid"] === true && Boolean(isNaN(this.hours) == false) && this.sq_number_result['sq_number']){

      this.edit_timeSheet_result = this.editTimesheet({sq_number: this.sq_number, date: this.date_and_time, hours: this.hours, cl_code: this.client_code, la_code: this.lawyer_code, ma_code: this.matter_code, desc: this.timesheet_description})

    }else{
      this.edit_timeSheet_result = {value: 'Incorrect inputs', valid : false}
      //console.log("Incorrect input")
    }

    this.sq_number_result = { sq_number: null, hours: null, input_date: null, cl_code: null, cl_name: null, la_code: null, la_name: null, ma_code: null,
      ma_name: null,
      description: null }
    setTimeout(()=>{this.edit_timeSheet_result = {value: null, valid : null}}, 6000)
    this.editTimesheetForm.resetForm()
  }

  onDelete(){
    //console.log('Deleted')
    if(this.editTimesheetForm.valid && this.date_and_time != null && this.client_result["valid"] === true &&  this.lawyer_result["valid"] === true  &&  this. matter_result["valid"] === true && Boolean(isNaN(this.hours) == false)){

      this.edit_timeSheet_result = this.deleteTimesheet({sq_number: this.sq_number, date: this.date_and_time, hours: this.hours, cl_code: this.client_code, la_code: this.lawyer_code, ma_code: this.matter_code, desc: this.timesheet_description})

    }else{
      this.edit_timeSheet_result = {value: 'Incorrect inputs', valid : false}
    }
    setTimeout(()=>{this.edit_timeSheet_result = {value: null, valid : null}}, 6000)
    this.sq_number_result = { sq_number: null, hours: null, input_date: null, cl_code: null, cl_name: null, la_code: null, la_name: null, ma_code: null,
      ma_name: null,
      description: null }
    this.editTimesheetForm.resetForm()
  }

  //onSubmit(editTimesheetForm: NgForm) {
    //this.client_result = {value: null, valid : null};
    //this.lawyer_result = {value: null, valid : null};
    //this.matter_result = {value: null, valid : null};
    //this.editTimesheetForm.resetForm()
  //}
}
