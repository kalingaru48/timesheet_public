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
  submit_message: string = "";

  onSubmit(newLawyerForm: NgForm) {
    if (this.newLawyerForm.invalid) return this.submit_message = "Failed to add the client!";
    console.log(this.lawyer_code, this.lawyer_name)
    this.submit_message = ipcRenderer.sendSync('create', {item:'lawyers', code: this.lawyer_code, name: this.lawyer_name})
    this.newLawyerForm.resetForm()


  }

}
