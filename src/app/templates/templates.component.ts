import { Component, OnInit } from '@angular/core';

import { MdDialog } from '@angular/material';
import { CreateUpdateTemplateComponent } from '../create-update-template/create-update-template.component';
import { AuthenticationService } from '../login/authentication.service';
import { FollowUpService } from '../follow-up/follow-up.service';
import { LoaderService } from '../login/loader.service';
import * as _ from 'underscore';
import { DeleteTemplateComponent } from '../delete-template/delete-template.component';


@Component({
  selector: 'app-templates',
  templateUrl: './templates.component.html',
  styleUrls: ['./templates.component.css']
})
export class TemplatesComponent implements OnInit {

  constructor( public dialog: MdDialog ,private loaderService: LoaderService, private followupService: FollowUpService,  private authenticationService: AuthenticationService) { }

  AllTemplates:any = [];
  isDesc:boolean = false;
  column:any;


  getAllTemplates(){
    let input = {"User":{"apptype":this.authenticationService.appType() , "loginid":this.authenticationService.loggedInUserId(), "transtype":"getalltemp" } };
    this.followupService.followUpTemplate(input)
    .subscribe(
    output => this.GetAllTemplateResult(output),
    error => {
      //console.log("error in distrbutors");
      this.loaderService.display(false);
    });
  }
  GetAllTemplateResult(result){
    if(result.result == 'success'){
      this.AllTemplates = result.data.message;
    }
  }


  editTemplate(data){
    let dialogRef = this.dialog.open(CreateUpdateTemplateComponent, {
      width: '50%',
      data: data
  });
  dialogRef.afterClosed().subscribe(result => {
    if(result == 'success'){
    this.getAllTemplates();
    }
  });


  }





  addMessages(){
    let dialogRef = this.dialog.open(CreateUpdateTemplateComponent, {
      width: '50%', 
      data: ''
  });
  dialogRef.afterClosed().subscribe(result => {
    if(result == 'success'){
      this.getAllTemplates();
    }

  });

  }

  deleteTemplate(data){
    let dialogRef = this.dialog.open(DeleteTemplateComponent, {
      width: '50%', 
      data: data
  });
  dialogRef.afterClosed().subscribe(result => {
    if(result == 'success'){
      this.getAllTemplates();
    }

  });

}

sortTable(parm) {
  if(this.isDesc == true) {
    this.isDesc = false;
    this.AllTemplates.sort((a, b) => {
        if(a[parm]){
     return a[parm].localeCompare(b[parm]);
  }
    });
    this.column = parm;
  } else {
    this.isDesc = true;
    this.AllTemplates.sort((a, b) => {
      if(b[parm]){
      return b[parm].localeCompare(a[parm]);
  }
   });
   this.column = parm;
 }
}


  ngOnInit() {
    this.getAllTemplates();
  }

}
