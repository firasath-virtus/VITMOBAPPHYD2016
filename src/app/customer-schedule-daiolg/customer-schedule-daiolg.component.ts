import { Component, OnInit, Inject } from '@angular/core';
import { MD_DIALOG_DATA } from '@angular/material';
import { MdDialogRef } from '@angular/material';
import { LoaderService } from '../login/loader.service';
import { DistributorServiceService } from '../distributor/distributor-service.service';
import { CustomerService } from '../customer/customer.service';
import { AuthenticationService } from '../login/authentication.service';
import * as _ from 'underscore';
import { weekdays } from 'moment';


@Component({
  selector: 'app-customer-schedule-daiolg',
  templateUrl: './customer-schedule-daiolg.component.html',
  styleUrls: ['./customer-schedule-daiolg.component.css']
})
export class CustomerScheduleDaiolgComponent implements OnInit {

  constructor(private customerservice: CustomerService, private distributorService: DistributorServiceService, private loaderService: LoaderService, public thisDialogRef: MdDialogRef<CustomerScheduleDaiolgComponent>, private authenticationService: AuthenticationService, @Inject(MD_DIALOG_DATA) public Detail: any, ) { }
  scheduleInput:any = { schedulefor: "weekdays" , CustomerName: this.Detail.firstname , productName: {} , weekdays:""  , days:"" , productQuantity:"" , timeslot: "" }
  createSchedule = [];
  customerDetails:any = "";
  productList = [];
  checkAll: boolean = false;
  checkAllWeek: boolean = false;
  checkAllDay: boolean = false;
  selectAllWeekDays : boolean = false;
  selectAllDays: boolean = false;
 
  days = [];

  
  
  //create schedule

  createScheduledays() {
    let input = {};
    if(this.scheduleInput.schedulefor=="weekdays" ){
      let weekdays = this.scheduleInput.weekdays.split(',').sort(this.sortWeeks);
      weekdays = weekdays.join(",");
       input = { "order": { "apptype": this.authenticationService.appType(), "excepted_time": this.scheduleInput.timeslot, "orderstatus": "ordered", "orderto": this.authenticationService.loggedInUserId() , "orderfrom":this.Detail.userid, "paymentmode": "cash", "usertype":this.authenticationService.userType(), "quantity": this.scheduleInput.productQuantity, "loginid": this.authenticationService.loggedInUserId(), "groupid": "289", "productid": this.scheduleInput.productName.productid, "product_type": this.scheduleInput.productName.ptype  , "product_quantity": this.scheduleInput.productName.ptype , "weekdays":weekdays , "scheduletype": this.scheduleInput.schedulefor , "product_cost": this.scheduleInput.productName.pcost, "amt": parseInt(this.scheduleInput.productName.pcost) * parseInt(this.scheduleInput.productQuantity) , "total_amt": parseInt(this.scheduleInput.productName.pcost) * parseInt(this.scheduleInput.productQuantity) , "total_items": this.scheduleInput.productQuantity   , "scheduledfrom": "admin" } };
    }
     else{
     input = { "order": { "apptype": this.authenticationService.appType(), "excepted_time":this.scheduleInput.timeslot , "orderstatus": "ordered", "orderto":this.authenticationService.loggedInUserId(), "orderfrom":this.Detail.userid, "paymentmode": "cash", "usertype":this.authenticationService.userType() , "quantity": this.scheduleInput.productQuantity , "loginid": this.authenticationService.loggedInUserId(), "groupid": "289", "productid": this.scheduleInput.productName.productid , "product_type":this.scheduleInput.productName.ptype , "product_quantity":this.scheduleInput.productName.ptype , "days": this.scheduleInput.days, "scheduletype": this.scheduleInput.days, "product_cost": this.scheduleInput.productName.pcost, "amt": parseInt(this.scheduleInput.productName.pcost) * parseInt(this.scheduleInput.productQuantity), "total_amt":parseInt(this.scheduleInput.productName.pcost) * parseInt(this.scheduleInput.productQuantity) , "total_items": this.scheduleInput.productQuantity   , "scheduledfrom": "admin" } };
   }
    this.customerservice.createSchedule(input)
      .subscribe(
      output => this.createScheduledaysResult(output),
      error => {
        console.log("error in create schedule");
        this.loaderService.display(false);
      });  
  }

  createScheduledaysResult(result) {
    console.log(result)
    if (result.result == "success") {
      this.createSchedule = result.data;
      this.thisDialogRef.close('success');
    }

  }

  //getting customers list

  getCustomerDetails() {
    if (this.Detail) {
      let input = { userid: this.Detail.userid, appType: this.authenticationService.appType() }
      this.customerservice.getCustomerById(input)
        .subscribe(
        output => this.getCustomerDetailsResult(output),
        error => {
          console.log("error in distrbutors");
          this.loaderService.display(false);
        });
    }
  }

  getCustomerDetailsResult(result) {
    console.log(result);
    this.loaderService.display(false);
    if (result.result = 'success') {


      this.customerDetails = result.data;
      console.log(this.customerDetails)
    }

  }

  //get products list

    getProductsList() {
      this.loaderService.display(true);
      let input = { apptype: this.authenticationService.appType(), userid: this.Detail.userid, delearId: this.authenticationService.loggedInUserId()}
      this.distributorService.getProductsList(input)
        .subscribe(
        output => this.getProductsListResult(output),
        error => {
          console.log("error in distrbutors");
          this.loaderService.display(false);
        });

    }
    getProductsListResult(result) {
      console.log("distributor products list", result);
      if (result.result == 'success') {
        let productListCopy = [];
        _.each(result.data.products, function (i, j) {
          let details: any = i;
          let customerProduct = _.find(result.data.customerproducts, function (e: any) { return e.productid == details.productid; });
          if (customerProduct) {


            productListCopy.push(customerProduct);

          }
          else {
            productListCopy.push(details);
          }

        });
        this.productList = productListCopy;
    }

  }

  //sorting week days

  sortWeeks(a,b){
    let daysOfWeek = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
    return daysOfWeek.indexOf(a) - daysOfWeek.indexOf(b);
    
}
  


  //check for particular weekday
  onChangeCheckWeek(week:string,  isChecked: boolean) {


    if (isChecked) {
      this.checkAll = false;
      if(this.scheduleInput.weekdays){
        this.scheduleInput.weekdays= this.scheduleInput.weekdays +','  + week;

      }
      else{
      this.scheduleInput.weekdays= this.scheduleInput.weekdays  + week;
      }
      
 
    } else {
      this.checkAll = false;
      this.selectAllWeekDays= false;

    let replaceValue = this.scheduleInput.weekdays.replace(new RegExp(week+',', 'g'), '');
    replaceValue = this.scheduleInput.weekdays.replace(new RegExp(week, 'g'), '');
    this.scheduleInput.weekdays = replaceValue;
    }
  }

  // check for particular day
  onChangeCheckDay(day: any, isChecked: boolean) {


    if (isChecked) {
      this.checkAll = false;
      if(this.scheduleInput.days){
        this.scheduleInput.days= this.scheduleInput.days + ',' + day;
      }
      else{
        this.scheduleInput.days= this.scheduleInput.days  + day;
        }
     
    } else {
      this.checkAll = false;
      this.selectAllDays= false;
      let replaceValue = this.scheduleInput.days.replace(new RegExp(day+',', 'g'), '');
      replaceValue = this.scheduleInput.days.replace(new RegExp(day, 'g'), '');
      this.scheduleInput.days = replaceValue;
     
    }
    let toBeSort:string  = this.scheduleInput.days; // making the in string datatype
    let sortedDays = toBeSort.split(",").sort().join(",");  //it should be string if we want to split it in typscript and soritng
   
    this.scheduleInput.days = sortedDays;
  }

  //check all weekdays
  onChangeCheckAll(isChecked: boolean) {


    if (isChecked) {
      
      this.checkAllWeek = true;
      this.scheduleInput.weekdays="Monday,Tuesday,Wednesday,Thursday,Friday,Saturday,Sunday";

    } else {
      this.checkAll = false;
      this.checkAllWeek = false;
      this.scheduleInput.weekdays="";


    }
  }


  //Check all days
  onChangeCheckAllDays(isChecked: boolean) {


    if (isChecked) {
      
      this.checkAllDay = true;
      this.scheduleInput.days="1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31";

    } else {
      this.checkAll = false;
      this.checkAllDay = false;
      this.scheduleInput.days="";


    }
  }
  onCloseCancel() {
    this.thisDialogRef.close('Cancel');
  }

  ngOnInit() {

    console.log(this.Detail);
    this.getCustomerDetails();
    this.getProductsList();
  }

}
