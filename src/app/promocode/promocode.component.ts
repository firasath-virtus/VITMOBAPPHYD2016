import { Component, OnInit } from '@angular/core';
import { MdDialog } from '@angular/material';
import { AddPromocodeDialogComponent } from '../add-promocode-dialog/add-promocode-dialog.component';
import { RedeemSettingsDialogComponent } from '../redeem-settings-dialog/redeem-settings-dialog.component';
import { PromocodeServiceService } from '../promocode/promocode-service.service';
import { FollowUpService } from '../follow-up/follow-up.service';
import { AuthenticationService } from '../login/authentication.service';
import { DistributorServiceService } from '../distributor/distributor-service.service';
import { ProcessPaymentDialogComponent } from '../process-payment-dialog/process-payment-dialog.component';
import { ProcessedPaymentsDetailsComponent } from '../processed-payments-details/processed-payments-details.component';
import { DeletePromocodeComponent } from '../delete-promocode/delete-promocode.component';
import * as moment from 'moment';




@Component({
  selector: 'app-promocode',
  templateUrl: './promocode.component.html',
  styleUrls: ['./promocode.component.css']
})
export class PromocodeComponent implements OnInit {

  constructor( public dialog: MdDialog, private promocodeservice: PromocodeServiceService ,  private authenticationService: AuthenticationService, private followupService: FollowUpService,  private distributorService: DistributorServiceService) { }

allPromoCodes:any = [];
tabPanelView:string="promoCode";
redeemDetails:any = [];
redeemSettingsDetails:any = [];
showFilterDailog = false;
filterInput = {"searchtype":""};
filterType = {"startdate": null , "enddate": null};
startDate = '';
endDate = '';


  addPromoCode(){
    let dialogRef = this.dialog.open(AddPromocodeDialogComponent, {
      width: '50%',
      data: ''
  });
  dialogRef.afterClosed().subscribe(result => {
    if(result == 'success'){
      this.getAllPromoCodes();
    }

  });
  }

  editPromoCode(data){
    let dialogRef = this.dialog.open(AddPromocodeDialogComponent, {
      width: '50%',
      data: data
  });
  dialogRef.afterClosed().subscribe(result => {
    if(result == 'success'){
      this.getAllPromoCodes();

    }

  });

  }


  deletePromoCodeDialog(data){

    let dialogRef = this.dialog.open(DeletePromocodeComponent, {
      width: '50%',
      data: data
  });
  dialogRef.afterClosed().subscribe(result => {
    if(result == 'success'){
      this.getAllPromoCodes();
    }
  });
  }

  getAllPromoCodes(){
    let input = {"offer":{"transtype":"getall" , "apptype":this.authenticationService.appType()}};
    console.log(input);
    this.followupService.createpromocode(input)
    .subscribe(
    output => this.getAllPromoCodesResult(output),
    error => {
      //console.log("error in customer");
    });
  }
  getAllPromoCodesResult(result){
    if(result.result == 'success'){
      this.allPromoCodes = result.data;
      console.log(result.data);
    }
    else{
      this.allPromoCodes = [];
    }
  }

  
//   showTabPanel(panelName) {
// this.tabPanelView=panelName;
// if(this.tabPanelView == 'redeemSetting'){
//   this.redeemSettingsDialog();
// }
// else if(this.tabPanelView == 'redeemDetails'){
//   this.getRedeemDetails();
// }
//   }

  redeemSettingsDialog(){
    let dialogRef = this.dialog.open(RedeemSettingsDialogComponent , {
      width: '50%',
      data: ''
  });
  dialogRef.afterClosed().subscribe(result => {
    if(result == 'success'){
      this.getRedeemSettingsDetails();
      this.getRedeemDetails();
      this.getAllPromoCodes();
    }
  });
  }


  showTabPanel(panelName) {
    this.tabPanelView=panelName;
    if(this.tabPanelView == 'redeemSetting'){
      this.getRedeemSettingsDetails();
    }
    else if(this.tabPanelView == 'redeemDetails'){
      this.getRedeemDetails();
    }
      }


      getRedeemSettingsDetails(){
        let input = {"User": {"TransType":"getredeemsettings" , apptype: this.authenticationService.appType() , "loginid":  this.authenticationService.loggedInUserId() }};
        this.distributorService.getPoints(input)
        .subscribe(
        output => this.getRedeemSettingsDetailsResult(output),
        error => {      
        });
      }
      getRedeemSettingsDetailsResult(result){
        if(result.result == 'success'){
          this.redeemSettingsDetails = result.data;
        }
      }

      changeSettings(data){

        let dialogRef = this.dialog.open(RedeemSettingsDialogComponent , {
          width: '50%',
          data: data
      });
      dialogRef.afterClosed().subscribe(result => {
        if(result == 'success'){
          this.getRedeemSettingsDetails();
        }
      });

      }





  getRedeemDetails(){
    let input = {"User":{"TransType":"getredeemdetails" , appType: this.authenticationService.appType()}};
    this.distributorService.getPoints(input)
    .subscribe(
    output => this.getRedeemDetailsResult(output),
    error => {      
    });

  }
  getRedeemDetailsResult(result){
    if(result.result == 'success'){
      this.redeemDetails = result.data;
    }
  }

  processPaymentDialog(data){

    let dialogRef = this.dialog.open(ProcessPaymentDialogComponent , {
      width: '75%',
      data: data
  });
  dialogRef.afterClosed().subscribe(result => {
    if(result == 'success'){
      this.getRedeemDetails();
    }
  });

  }

  viewProcessedDetails(data){
    let dialogRef = this.dialog.open(ProcessedPaymentsDetailsComponent , {
      width: '75%',
      data: data
  });
  dialogRef.afterClosed().subscribe(result => {
    if(result == 'success'){
     
    }
  });

  }

  deleteRedeemSetting(data){
    console.log('data ', data);
    let input = {"User":{loginid : this.authenticationService.loggedInUserId() , apptype: this.authenticationService.appType() , id: data.id , TransType:'delete'}};
    this.distributorService.getPoints(input)
    .subscribe(
    output => this.deleteRedeemSettingResult(output),
    error => {      
    });
  }
  deleteRedeemSettingResult(result){
    if(result.result == 'success'){
      this.getRedeemSettingsDetails();
    }
  }

  filterDailogToggle(){
    this.showFilterDailog = !this.showFilterDailog;
  }

  searchByDate(){
    let input = {};
    if(this.filterType.startdate && this.filterType.enddate === null){
      this.startDate = moment(this.filterType.startdate).format('DD-MM-YYYY');
      input = {"offer":{"transtype":"filters","apptype": this.authenticationService.appType() ,"pagesize":"100","startdate": this.startDate ,"loginid": this.authenticationService.loggedInUserId() ,"usertype": this.authenticationService.userType() ,"dealerid": this.authenticationService.loggedInUserId() }}
    }
    else if(this.filterType.enddate && this.filterType.startdate === null ){
      this.endDate = moment(this.filterType.enddate).format('DD-MM-YYYY');
      input = {"offer":{"transtype":"filters","apptype": this.authenticationService.appType() ,"pagesize":"100","enddate": this.endDate ,"loginid": this.authenticationService.loggedInUserId() ,"usertype": this.authenticationService.userType() ,"dealerid": this.authenticationService.loggedInUserId() }}
    }
    else if(this.filterType.startdate && this.filterType.enddate){
      this.startDate = moment(this.filterType.startdate).format('DD-MM-YYYY');
      this.endDate = moment(this.filterType.enddate).format('DD-MM-YYYY');
      input = {"offer":{"transtype":"filters","apptype": this.authenticationService.appType() ,"pagesize":"100","enddate": this.endDate ,"startdate": this.startDate,  "loginid": this.authenticationService.loggedInUserId() ,"usertype": this.authenticationService.userType() ,"dealerid": this.authenticationService.loggedInUserId() }}
    }
    console.log(input);
    this.followupService.createpromocode(input)
    .subscribe(
    output => this.searchByDateResult(output),
    error => {
      //console.log("error in customer");
    });
  }
  searchByDateResult(result){
    if(result.result == 'success'){
      this.allPromoCodes = result.data;
    }
    else{
      this.allPromoCodes = [];
    }
  }


  clearFilter(){
    this.showFilterDailog = false;
    this.filterInput = {"searchtype":""};
    this.filterType = {"startdate": null , "enddate": null};
    this.getAllPromoCodes();
  }


  ngOnInit() {
    this.getAllPromoCodes();
  
  }

}
