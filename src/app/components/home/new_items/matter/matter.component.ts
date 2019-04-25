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
  submit_message: object = {value: null, valid: null}
  matter_result: object = {value: null, valid: null}

  checkCodes(table: string, value: string){
    return ipcRenderer.sendSync('newTimeSheet', {item: table, event: 'check', code: value})
  }

  onSearchChange_matter(searchValue : string) {
    if(searchValue.length <= 4){
      return this.matter_result = this.checkCodes("Matter", searchValue)
    } else {
      return this.matter_result = {value: null, valid : false};
    }

  }

  onSubmit(newMatterForm: NgForm) {

    if(this.matter_result['valid'] == false && this.newMatterForm.valid == true){
      this.submit_message = ipcRenderer.sendSync('create', {item:'Matter', code: this.matter_code, name: this.matter_name})
    }else{
        this.submit_message = {value: 'Incorrect inputs', valid: false}
    }

    this.newMatterForm.resetForm()

     setTimeout(()=>{
      this.submit_message =  {value: null, valid: null}
     }, 4000)

    }

}
