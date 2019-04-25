import { Component, ViewChild } from '@angular/core'
import { NgForm } from '@angular/forms';
import { ipcRenderer } from 'electron'



@Component({
  selector: 'app-client-page',
  templateUrl: 'client.component.html',
  styleUrls: ['client.component.scss']
})

export class ClientComponent {
  client_code: string = "";
  client_name: string = "";
  @ViewChild('newClientForm') newClientForm: NgForm;
  submit_message: object = {value: null, valid: null}
  client_result: object = {value: null, valid: null}

  checkCodes(table: string, value: string){
    return ipcRenderer.sendSync('newTimeSheet', {item: table, event: 'check', code: value})
  }

  onSearchChange_client(searchValue : string) {
    if(searchValue.length <= 4){
      return this.client_result = this.checkCodes("Client", searchValue)
    } else {
      return this.client_result = {value: null, valid : false};
    }

  }

  onSubmit(newClientForm: NgForm) {

    if(this.client_result['valid'] == false && this.newClientForm.valid == true){
       this.submit_message = ipcRenderer.sendSync('create', {item:'Client', code: this.client_code, name: this.client_name})
    }else{
       this.submit_message = {value: 'Incorrect inputs', valid: false}
    }


    this.newClientForm.resetForm()
    setTimeout(()=>{
      this.submit_message =  {value: null, valid: null}
     }, 4000)
  }


}
