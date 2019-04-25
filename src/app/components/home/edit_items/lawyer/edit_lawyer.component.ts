import { Component, ViewChild } from '@angular/core'
import { NgForm } from '@angular/forms';
import { ipcRenderer } from 'electron';

@Component({
  selector: 'app-edit-lawyer-page',
  templateUrl: 'edit_lawyer.component.html',
  styleUrls: ['edit_lawyer.component.scss']
})

export class Edit_LawyerComponent {

  lawyer_code: string = "";
  lawyer_name: string = "";
  @ViewChild('editLawyerForm') editLawyerForm: NgForm;
  submit_message: object = {value: null, valid: null}
  lawyer_result: object = {value: null, valid: null}

  checkCodes(table: string, value: string){
    return ipcRenderer.sendSync('newTimeSheet', {item: table, event: 'check', code: value})
  }

  editTimesheet(obj: object){
   //console.log('Editing')
    return ipcRenderer.sendSync('newTimeSheet', {item: 'Lawyer', event: 'edit', data: obj })
  }

  deleteTimesheet(obj: object){
   //console.log('Delete')
    return ipcRenderer.sendSync('newTimeSheet', {item: 'Lawyer', event: 'delete', data: obj })
  }

  onSearchChange_lawyer(searchValue : string) {
    if(searchValue.length <= 4){
       this.lawyer_result = this.checkCodes("Lawyer", searchValue)
    } else {
      this.lawyer_result = {value: null, valid : false};
    }

    if(this.lawyer_result['valid'] ==  true){
      this.lawyer_name = this.lawyer_result['value']
    }else{
      this.lawyer_name = ""
    }

  }

  onSubmit(editLawyerForm: NgForm) {

    if(this.lawyer_result['valid'] == true && this.editLawyerForm.valid){

      this.submit_message = this.editTimesheet({code: this.lawyer_code, name: this.lawyer_name})

    }else{

      this.submit_message = {value: 'Incorrect inputs', valid : false}
    }
    this.lawyer_result= {value: null, valid: null}
    setTimeout(()=>{
      this.submit_message = {value: null, valid: null}
    }, 6000)
    this.editLawyerForm.resetForm()
  }

  onDelete(){

    if(this.lawyer_result['valid'] == true && this.editLawyerForm.valid){

      this.submit_message = this.deleteTimesheet({code: this.lawyer_code, name: this.lawyer_name})

    }else{

      this.submit_message = {value: 'Incorrect inputs', valid : false}
    }
    this.lawyer_result= {value: null, valid: null}
    setTimeout(()=>{
      this.submit_message = {value: null, valid: null}
    }, 6000)
    this.editLawyerForm.resetForm()
  }

}
