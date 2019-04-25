import { Component, ViewChild, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ipcRenderer } from 'electron';

@Component({
  selector: 'app-timesheet-page',
  templateUrl: 'timesheet.component.html',
  styleUrls: ['timesheet.component.scss']
})

export class TimesheetComponent implements OnInit{
  sq_number: number;
  date_and_time: string = "";
  hours: number;
  client_code: string = "";
  lawyer_code: string = "";
  matter_code: string = "";
  client_result: object = {value: null, valid : null};
  lawyer_result: object = {value: null, valid : null};
  matter_result: object = {value: null, valid : null};
  timesheet_description: string = "";
  timeSheet_result: object = {value: null, valid : null};

  @ViewChild('newTimesheetForm') newTimesheetForm: NgForm;
  submit_message: string = "";

  constructor() { }


  checkCodes(table: string, value: string){
    //console.log(value)
    return ipcRenderer.sendSync('newTimeSheet', {item: table, event: 'check', code: value})
  }

  createTimesheet(obj: object){
    return ipcRenderer.sendSync('newTimeSheet', {item: 'Timesheet', event: 'createTimesheet', data: obj })
  }


  getSequnce(){

    let sequnce = ipcRenderer.sendSync('newTimeSheet', {item: 'Timesheet', event: 'lastSequnce', code: null})

    if(sequnce['valid'] == true){
      this.sq_number = sequnce['value'] + 1
    }else if(sequnce['valid'] == false){
      this.sq_number = 600
    }

  }

  ngOnInit(): void {
    this.getSequnce()
  }

  onSearchChange_client(searchValue : string ) {
    if(searchValue.length <= 4){

      return this.client_result = this.checkCodes("Client", searchValue)
      //console.log(this.checkCodes("Client", searchValue))
    } else {
      this.client_result = {value: null, valid : false};
    }

  }

  onSearchChange_lawyer(searchValue : string ) {
    if(searchValue.length <= 4){
      return this.lawyer_result = this.checkCodes("Lawyer", searchValue)
    } else {
      this.lawyer_result = {value: null, valid : false};
    }

  }

  onSearchChange_matter(searchValue : string ) {
    if(searchValue.length <= 4){
      return this.matter_result = this.checkCodes("Matter", searchValue)
    } else {
      this.matter_result = {value: null, valid : false};
    }

  }

  onSubmit(newTimesheetForm: NgForm) {
    console.log(Boolean(this.newTimesheetForm.valid))
    console.log(Boolean(this.date_and_time))
    console.log(Boolean(this.client_result["valid"]))
    console.log(Boolean(this.lawyer_result["valid"]))
    console.log(Boolean(this. matter_result["valid"]))

    if(this.newTimesheetForm.valid && this.date_and_time != null && this.client_result["valid"] === true &&  this.lawyer_result["valid"] === true &&  this. matter_result["valid"] === true){

      //console.log('Submit sucess')
      this.timeSheet_result = this.createTimesheet({sq_number: this.sq_number, date: this.date_and_time, hours: this.hours, cl_code: this.client_code, la_code: this.lawyer_code, ma_code: this.matter_code, desc: this.timesheet_description})

    } else {
      this.timeSheet_result = {value: null, valid : false};
    }

    this.client_result = {value: null, valid : null};
    this.lawyer_result = {value: null, valid : null};
    this.matter_result = {value: null, valid : null};
    this.newTimesheetForm.resetForm()
    setTimeout(()=>{this.getSequnce()}, 2000)
    setTimeout(()=>{this.timeSheet_result = {value: null, valid : null}}, 4000)

  }


}
