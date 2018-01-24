import { Component, OnInit, Inject } from '@angular/core';
import { MdDialogRef } from '@angular/material';
import { MD_DIALOG_DATA } from '@angular/material';
import { SupplierService} from '../supplier/supplier.service';
import { AuthenticationService } from '../login/authentication.service';
import { LoaderService } from '../login/loader.service';
import { OrderLandingService } from '../order-landing/order-landing.service';


@Component({
  selector: 'app-deliverpreorder',
  templateUrl: './deliverpreorder.component.html',
  styleUrls: ['./deliverpreorder.component.css']
})
export class DeliverpreorderComponent implements OnInit {

  constructor( public thisDialogRef: MdDialogRef<DeliverpreorderComponent>,  private loaderService: LoaderService, private supplierservice :SupplierService, private authenticationService: AuthenticationService,  private orderLandingService: OrderLandingService, @Inject(MD_DIALOG_DATA) public Detail: any) { }

  deliverPreOrderInput : any ={"paymentType":"", "confirmPayment": false , supplierslist: {} };
  supplierList = [];
  SupplierListCopy = [];


  //Get supplier list 
  getSupplierList(){
    let input = {  "userId":this.authenticationService.loggedInUserId(), "appType": this.authenticationService.appType() };
    this.supplierservice.supplierList(input)
    .subscribe(
    output => this.getSupplierListResult(output),
    error => {
      console.log("error in feedbacklist");
      this.loaderService.display(false);
    });
  }
  getSupplierListResult(result) {
    console.log(result);
    if (result.result == "success") {
      this.supplierList =result.data;
      this.SupplierListCopy=result.data;
     
    }
  }

  confirmDeliverOrder(){
    this.Detail.order.received_amt = this.Detail.order.total_amt
    let input =[];
    input.push(this.Detail);
    this.orderLandingService.createPreOrder(input)
  .subscribe(
    output => this.createPreOrderResult(output),
    error => {
      console.log("falied");
      this.loaderService.display(false);
    });

  }
  createPreOrderResult(result) {
    console.log(result);
    if(result.result=='success'){
      this.thisDialogRef.close('success');
    }

    }

  onCloseCancel() {
    this.thisDialogRef.close('Cancel');
  }



  ngOnInit() {
    console.log(this.Detail);
    this.getSupplierList();
  }

}
