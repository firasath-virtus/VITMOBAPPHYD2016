﻿import { Component, OnInit, Inject } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { MD_DIALOG_DATA } from '@angular/material';
import { MdDialogRef } from '@angular/material';
import { SmsServiceService } from '../sms/sms-service.service';
import { AuthenticationService } from '../login/authentication.service';
import { DistributorServiceService } from '../distributor/distributor-service.service';
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/operator/startWith';
import 'rxjs/add/operator/map';
import * as _ from 'underscore';
import * as moment from 'moment';
@Component({

  templateUrl: './sms-dialog.component.html',
  styleUrls: ['./sms-dialog.component.css']
})
export class SmsDialogComponent implements OnInit {
  stateCtrl: FormControl;
  filteredStates: Observable<any[]>;
  constructor(private distributorService: DistributorServiceService,public thisDialogRef: MdDialogRef<SmsDialogComponent>, @Inject(MD_DIALOG_DATA) public smsDetail: any, private smsService: SmsServiceService, private authenticationService: AuthenticationService) { 

    this.stateCtrl = new FormControl();
    this.filteredStates = this.stateCtrl.valueChanges
        .startWith(null)
        .map(dist => dist ? this.filterDistributors(dist) : this.distributors.slice());
  }

  orderinput = { orderType: "", fromDate: null, toDate: null,days:null,distributorid:null };
  smsInput = { name: "", mobilenumber: [], body: "" };
  mobileDetails:any = [];
  distributors:any = [];
  checkAll :boolean = false;
  OrderTypeDetails = [
    { value: 'all', viewValue: 'All Orders' },
    { value: 'ordered', viewValue: 'Unassign Orders' },
    { value: 'delivered', viewValue: 'Delivered Orders' },
    { value: 'assigned', viewValue: 'Pending Orders' },
    { value: 'allcustomers', viewValue: 'All customers' },
    { value: 'customerbydays', viewValue: 'Customer Not order' },
    { value: 'distributorscustomer', viewValue: 'customer By distributor' },
    { value: 'onlydownloaded', viewValue: 'Only downloaded' }
   // { value: 'customersbyarea', viewValue: 'customer By Area' },
  ];
  filterDistributors(name: string) {
    console.log(name);
    let finalDistributors = this.distributors.filter(dist =>
      dist.fullName.toLowerCase().indexOf(name.toLowerCase()) === 0);
      console.log(finalDistributors);
      if(finalDistributors && finalDistributors.length > 0){
        let findDistributor:any = {};
       
          findDistributor = _.find(finalDistributors,function(k,l){
            let distDetails: any = k;
            return distDetails.fullName == name; });

        if(findDistributor){
          this.orderinput.distributorid = findDistributor.userid;
        }
      
      }
      return finalDistributors;
  }
  getMobileNumber() {
    let input = {
      User: {
        "user_type": this.authenticationService.userType(), "loginid": this.authenticationService.loggedInUserId(), type: this.orderinput.orderType,
        "apptype": this.authenticationService.appType(), fromdate: null, todate: null,days:this.orderinput.days,distributorid:this.orderinput.distributorid
      }
    };
if(this.orderinput.fromDate){
    input.User.fromdate = moment(this.orderinput.fromDate).format('YYYY-MM-DD HH:MM:SS.sss');
}
if(this.orderinput.toDate){
    input.User.todate = moment(this.orderinput.toDate).format('YYYY-MM-DD HH:MM:SS.sss');
}
    this.smsService.getMobileNumbers(input)
      .subscribe(
      output => this.getMobileNumberResult(output),
      error => {
        console.log("error in distrbutors");
      });
  }
  getMobileNumberResult(result) {
    console.log(result);
    let mobile = [];
    
    if (result && result.data && result.data.length) {
      _.each(result.data, function (i, j) {
        let details: any = i;
        let mobiles = { mobileno: details.mobileno, gcm_regid: details.gcm_regid };
        mobile.push(mobiles);

      });

      this.mobileDetails = mobile;
    }
  }
  onChangeCheck(number: any, isChecked: boolean) {
    

     if (isChecked) {
         this.smsInput.mobilenumber.push(number);
         
     } else {
         this.smsInput.mobilenumber = _.without(this.smsInput.mobilenumber, number);
         
     }
 }
 onChangeCheckAll(isChecked: boolean) {
  

   if (isChecked) {
       this.smsInput.mobilenumber = this.mobileDetails;
       this.checkAll = true;
       
   } else {
       this.smsInput.mobilenumber = [];
       this.checkAll = false;
       
   }
}
  saveMobileSms() {
    console.log(this.smsInput);
    let createSmsInput = {
      "User": {
        "mobilenumber": this.smsInput.mobilenumber,
        "count": this.smsInput.mobilenumber.length,
        "name": this.smsInput.name,
        "user_type":this.authenticationService.userType(),
        "TransType": "createsms",
        "type": this.orderinput.orderType,
        "loginid": this.authenticationService.loggedInUserId(),
        "apptype": this.authenticationService.appType(),
        "body": this.smsInput.body
      }
    }
    console.log(createSmsInput);
    this.smsService.CreateSms(createSmsInput)
    .subscribe(
    output => this.saveMobileSmsResult(output),
    error => {
      console.log("error in distrbutors");
    });
  }
  saveMobileSmsResult(result){
console.log(result);
this.thisDialogRef.close(result);
  }
  getDistributors() {
    let input = { "root": { "userid": this.authenticationService.loggedInUserId(), "usertype": "dealer", "loginid": this.authenticationService.loggedInUserId(), "lastuserid": 0, "apptype": this.authenticationService.appType(), "pagesize": 100 } }
    console.log(input);
    this.distributorService.getAllDistributors(input)
        .subscribe(
        output => this.getDistributorsResult(output),
        error => {
            console.log("error in distrbutors");
        });
}
getDistributorsResult(data) {
    console.log(data);
    if (data.result == 'success') {
      let distributorCopy = [];
      
      if (data.data && data.data.length) {
        _.each(data.data, function (i, j) {
          let details: any = i;
          details.fullName = details.firstname +" "+ details.lastname
          distributorCopy.push(details);
  
        });
  
        
        this.distributors = distributorCopy;
    }
}
}
  onCloseCancel() {
    this.thisDialogRef.close('Cancel');
}


  ngOnInit() {
    this.getDistributors()
  }

}
