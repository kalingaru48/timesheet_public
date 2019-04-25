import { Component, ViewChild } from '@angular/core'
import { ipcRenderer } from 'electron';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-edit-client-page',
  templateUrl: 'edit_client.component.html',
  styleUrls: ['edit_client.component.scss']
})

export class Edit_ClientComponent {

  client_code: string = "";
  client_name: string = "";
  @ViewChild('editClientForm') editClientForm: NgForm;
  submit_message: object = {value: null, valid: null}
  client_result: object = {value: null, valid: null}

  checkCodes(table: string, value: string){
    return ipcRenderer.sendSync('newTimeSheet', {item: table, event: 'check', code: value})
  }

  editTimesheet(obj: object){
   // console.log('Editing')
    return ipcRenderer.sendSync('newTimeSheet', {item: 'Client', event: 'edit', data: obj })
  }

  deleteTimesheet(obj: object){
   // console.log('Delete')
    return ipcRenderer.sendSync('newTimeSheet', {item: 'Client', event: 'delete', data: obj })
  }

  onSearchChange_client(searchValue : string) {
    if(searchValue.length <= 4){
       this.client_result = this.checkCodes("Client", searchValue)
    } else {
      this.client_result = {value: null, valid : false};
    }

    if(this.client_result['valid'] ==  true){
      this.client_name = this.client_result['value']
    }else{
      this.client_name = ""
    }

  }

  onSubmit(editClientForm: NgForm) {

    if(this.client_result['valid'] == true && this.editClientForm.valid){

      this.submit_message = this.editTimesheet({code: this.client_code, name: this.client_name})

    }else{

      this.submit_message = {value: 'Incorrect inputs', valid : false}
    }
    this.client_result= {value: null, valid: null}
    setTimeout(()=>{
      this.submit_message = {value: null, valid: null}
    }, 6000)
    this.editClientForm.resetForm()
  }

  onDelete(){

    if(this.client_result['valid'] == true && this.editClientForm.valid){

      this.submit_message = this.deleteTimesheet({code: this.client_code, name: this.client_name})

    }else{

      this.submit_message = {value: 'Incorrect inputs', valid : false}
    }
    this.client_result= {value: null, valid: null}
    setTimeout(()=>{
      this.submit_message = {value: null, valid: null}
    }, 6000)
    this.editClientForm.resetForm()
  }

}
