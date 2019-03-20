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
  submit_message: string = "";

  onSubmit(newClientForm: NgForm) {
    if (this.newClientForm.invalid) return this.submit_message = "Failed to add the client!";
    console.log(this.client_code, this.client_name)



    this.submit_message = ipcRenderer.sendSync('create', {item:'clients', code: this.client_code, name: this.client_name})


    this.newClientForm.resetForm()
  }


}
