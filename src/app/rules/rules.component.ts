import { Component, OnInit } from '@angular/core';
import { MdDialog } from '@angular/material';
import { AuthenticationService } from '../login/authentication.service';
import { AddEditRuleComponent } from '../add-edit-rule/add-edit-rule.component';
import { FollowUpService } from '../follow-up/follow-up.service';
import { DeleteRuleComponent } from '../delete-rule/delete-rule.component';
@Component({
  selector: 'app-rules',
  templateUrl: './rules.component.html',
  styleUrls: ['./rules.component.css']
})
export class RulesComponent implements OnInit {

  constructor(public dialog: MdDialog,private authenticationService: AuthenticationService , private followupService: FollowUpService) { }

  allRules = [];
  isDesc:boolean = false;
  column:any;

  getAllRules(){
    let input = {"offer":{"userid": this.authenticationService.loggedInUserId() , apptype : this.authenticationService.appType() ,    'transtype' :"getrule" , 'loginid': this.authenticationService.loggedInUserId() }} ;
    this.followupService.createpromocode(input)
    .subscribe(
    output => this.getAllRulesResult(output),
    error => {      
    });
  }
  getAllRulesResult(result){
    if(result.result  == 'success'){
      this.allRules = result.data;
    }
    else{
      this.allRules = [];
    }
  }

  addRule(){
    let dialogRef = this.dialog.open(AddEditRuleComponent , {
      width: '60%',
      data: ''
  });
  dialogRef.afterClosed().subscribe(result => {
    if(result == 'success'){
    this.getAllRules();
     
    }
  });
  }

  editRule(data){

    let dialogRef = this.dialog.open(AddEditRuleComponent , {
      width: '60%',
      data: data
  });
  dialogRef.afterClosed().subscribe(result => {
    if(result == 'success'){
      this.getAllRules();
     
    }
  });

  }

  deleteRule(data){
    let dialogRef = this.dialog.open(DeleteRuleComponent , {
      width: '60%',
      data: data
  });
  dialogRef.afterClosed().subscribe(result => {
    if(result == 'success'){
      this.getAllRules();
    }
  });
  }

  sortTable(parm) {
    if(this.isDesc == true) {
      this.isDesc = false;
      this.allRules.sort((a, b) => {
          if(a[parm]){
       return a[parm].localeCompare(b[parm]);
    }
      });
      this.column = parm;
      console.log('all Rules List');
      console.log(this.allRules);
    } else {
      this.isDesc = true;
      this.allRules.sort((a, b) => {
        if(b[parm]){
        return b[parm].localeCompare(a[parm]);
    }
     });
     this.column = parm;
   }
  }

  ngOnInit() {
    this.getAllRules();
  }

}
