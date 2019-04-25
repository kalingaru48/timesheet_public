import { Component, ViewChild } from '@angular/core'
import { NgForm } from '@angular/forms';
import { ipcRenderer } from 'electron';


@Component({
  selector: 'app-lawyer-page',
  templateUrl: 'lawyer.component.html',
  styleUrls: ['lawyer.component.scss']
})

export class LawyerComponent {
  lawyer_code: string = "";
  lawyer_name: string = "";
  @ViewChild('newLawyerForm') newLawyerForm: NgForm;
  submit_message: object = {value: null, valid: null}
  lawyer_result: object = {value: null, valid: null}

  checkCodes(table: string, value: string){
    return ipcRenderer.sendSync('newTimeSheet', {item: table, event: 'check', code: value})
  }

  onSearchChange_lawyer(searchValue : string) {
    if(searchValue.length <= 4){
      return this.lawyer_result = this.checkCodes("Lawyer", searchValue)
    } else {
      return this.lawyer_result = {value: null, valid : false};
    }

  }

  onSubmit(newLawyerForm: NgForm) {

  if(this.lawyer_result['valid'] == false && this.newLawyerForm.valid == true){
      this.submit_message = ipcRenderer.sendSync('create', {item:'Lawyer', code: this.lawyer_code, name: this.lawyer_name})
   }else{
      this.submit_message = {value: 'Incorrect inputs', valid: false}
   }


   this.newLawyerForm.resetForm()

   setTimeout(()=>{
    this.submit_message =  {value: null, valid: null}
   }, 4000)

  }

}
