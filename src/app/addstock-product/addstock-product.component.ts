import { Component, OnInit, Inject } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { MD_DIALOG_DATA } from '@angular/material';
import { MdDialogRef } from '@angular/material';
import { AuthenticationService } from '../login/authentication.service';
import * as _ from 'underscore';
import * as moment from 'moment';
import { ProductsService } from '../products/products.service';

@Component({
  selector: 'app-addstock-product',
  templateUrl: './addstock-product.component.html',
  styleUrls: ['./addstock-product.component.css']
})
export class AddstockProductComponent implements OnInit {

  constructor(public thisDialogRef: MdDialogRef<AddstockProductComponent>, @Inject(MD_DIALOG_DATA) public Detail: any,  private authenticationService: AuthenticationService,private productsService:ProductsService) { }
StockInput = { invoiceDate:null,stock:"",itemCost:""};

onCloseCancel() {
  this.thisDialogRef.close('Cancel');
}
addStockDetails(){
  console.log(this.StockInput);
  let input = [{"product":{"pid":this.Detail.productid.toString(),"stock":this.StockInput.stock,"loginid":this.authenticationService.loggedInUserId(),"invoicenumber":Math.floor(1000 + Math.random() * 9000).toString(),"invoicedate":"","itemcost":this.StockInput.itemCost,"apptype":this.authenticationService.appType()}}];
  if (this.StockInput.invoiceDate) {
    input[0].product.invoicedate= moment(this.StockInput.invoiceDate).format('YYYY-MM-DD');
  }
  console.log(input);
  this.productsService.addStockDetails(input)
  .subscribe(
  output => this.addStockDetailsResult(output),
  error => {
    console.log("error in distrbutors");
  });
}
addStockDetailsResult(result){

console.log(result);
if(result.result == 'success'){
  this.thisDialogRef.close('success');
}
}
  ngOnInit() {
    console.log(this.Detail);
  }


}