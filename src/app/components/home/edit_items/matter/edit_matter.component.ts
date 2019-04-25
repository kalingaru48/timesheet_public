import { Component, ViewChild } from '@angular/core'
import { NgForm } from '@angular/forms';
import { ipcRenderer } from 'electron';

@Component({
  selector: 'app-edit-matter-page',
  templateUrl: 'edit_matter.component.html',
  styleUrls: ['edit_matter.component.scss']
})

export class Edit_MatterComponent {

  matter_code: string = "";
  matter_name: string = "";
  @ViewChild('editMatterForm') editMatterForm: NgForm;
  submit_message: object = {value: null, valid: null}
  matter_result: object = {value: null, valid: null}

  checkCodes(table: string, value: string){
    return ipcRenderer.sendSync('newTimeSheet', {item: table, event: 'check', code: value})
  }

  editTimesheet(obj: object){
    //console.log('Editing')
    return ipcRenderer.sendSync('newTimeSheet', {item: 'Matter', event: 'edit', data: obj })
  }

  deleteTimesheet(obj: object){
    //console.log('Delete')
    return ipcRenderer.sendSync('newTimeSheet', {item: 'Matter', event: 'delete', data: obj })
  }

  onSearchChange_matter(searchValue : string) {
    if(searchValue.length <= 4){
       this.matter_result = this.checkCodes("Matter", searchValue)
    } else {
      this.matter_result = {value: null, valid : false};
    }

    if(this.matter_result['valid'] ==  true){
      this.matter_name = this.matter_result['value']
    }else{
      this.matter_name = ""
    }

  }

  onSubmit(editMatterForm: NgForm) {

    if(this.matter_result['valid'] == true && this.editMatterForm.valid){

      this.submit_message = this.editTimesheet({code: this.matter_code, name: this.matter_name})

    }else{

      this.submit_message = {value: 'Incorrect inputs', valid : false}
    }
    this.matter_result= {value: null, valid: null}
    setTimeout(()=>{
      this.submit_message = {value: null, valid: null}
    }, 6000)
    this.editMatterForm.resetForm()
  }

  onDelete(){

    if(this.matter_result['valid'] == true && this.editMatterForm.valid){

      this.submit_message = this.deleteTimesheet({code: this.matter_code, name: this.matter_name})

    }else{

      this.submit_message = {value: 'Incorrect inputs', valid : false}
    }
    this.matter_result= {value: null, valid: null}
    setTimeout(()=>{
      this.submit_message = {value: null, valid: null}
    }, 6000)
    this.editMatterForm.resetForm()
  }

}
