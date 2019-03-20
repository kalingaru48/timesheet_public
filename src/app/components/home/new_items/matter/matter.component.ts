import { Component, ViewChild } from '@angular/core'
import { NgForm } from '@angular/forms';
import { ipcRenderer } from 'electron';

@Component({
  selector: 'app-matter-page',
  templateUrl: 'matter.component.html',
  styleUrls: ['matter.component.scss']
})

export class MatterComponent {
  matter_code: string = "";
  matter_name: string = "";
  @ViewChild('newMatterForm') newMatterForm: NgForm;
  submit_message: string = "";

  onSubmit(newLawyerForm: NgForm) {
    if (this.newMatterForm.invalid) return this.submit_message = "Failed to add the client!";
    console.log(this.matter_code, this.matter_name)
    this.submit_message = ipcRenderer.sendSync('create', {item:'matters', code: this.matter_code, name: this.matter_name})
    this.newMatterForm.resetForm()

  }
}
