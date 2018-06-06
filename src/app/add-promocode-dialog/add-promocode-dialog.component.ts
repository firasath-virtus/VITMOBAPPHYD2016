import { Component, OnInit , Inject} from '@angular/core';
import { MdDialog } from '@angular/material';
import { MdDialogRef } from '@angular/material';
import { FollowUpService } from '../follow-up/follow-up.service';
import { LoaderService } from '../login/loader.service';
import { AuthenticationService } from '../login/authentication.service';
import { FormControl, Validators } from '@angular/forms';
import { Observable } from 'rxjs/Observable';
import * as _ from 'underscore';
import { ProductsService } from '../products/products.service';
import * as moment from 'moment';
import { MD_DIALOG_DATA } from '@angular/material';

@Component({
  selector: 'app-add-promocode-dialog',
  templateUrl: './add-promocode-dialog.component.html',
  styleUrls: ['./add-promocode-dialog.component.css']
})
export class AddPromocodeDialogComponent implements OnInit {

  CategoryCtrl: FormControl;
  filteredcategories: Observable<any[]>;

  constructor(public thisDialogRef: MdDialogRef<AddPromocodeDialogComponent>,private loaderService: LoaderService,private followupService: FollowUpService,private authenticationService: AuthenticationService,private productService: ProductsService , @Inject(MD_DIALOG_DATA) public Details: any,) {
    this.CategoryCtrl = new FormControl();
    this.filteredcategories = this.CategoryCtrl.valueChanges
      .startWith(null)
      .map(cat => cat ? this.findCategories(cat) : this.categoryList.slice());

  }



  promoCodeInput:any = {discountinpercent:"",   description:"",  offertype:"", startdate:null ,enddate: null, criteria:"", promotype:"", category:"", promocode:"", }

  // filterTypeModel = {categoryname: "" , categoryid: ''};

  LastfilterRecords = false;

  categoryList:any = [];

  findCategories(name: string) {
    let finalCategories:any = [];
    finalCategories = this.categoryList.filter(cat =>
       cat.category.toLowerCase().indexOf(name.toLowerCase()) === 0);
     
   if (finalCategories && finalCategories.length > 0) {
     let findCategory: any = {};

     findCategory = _.find(finalCategories, function (k, l) {
       let catDetails: any = k;
       return catDetails.category == name;
     });

     if (findCategory) {
      //  this.filterTypeModel.categoryname = findCategory.category;
       this.promoCodeInput.category = findCategory.category;
     }
   }
   else {
     if (name.length >= 3 && !this.LastfilterRecords) {       
this.getProductByCategory();
     }
   }
   return finalCategories;
   }

   getProductByCategory(){
    let input= {"userId":this.authenticationService.loggedInUserId(),"userType":"dealer","loginid":this.authenticationService.loggedInUserId(),"appType":this.authenticationService.appType()};

    this.productService.getProductsCategory(input)
    .subscribe(
    output => this.getProductsCategoryResult(output),
    error => {
      //console.log("error in products category list");
    });
  }
  getProductsCategoryResult(result){
    //console.log(result);
    if (result.result == "success") {
      let allObject = {"category": "All" , "category_desc":"desc" , "categoryid":"1234"};
      result.data.push(allObject);
      this.categoryList = result.data;
    }
    else{
        this.LastfilterRecords = true;
    }
  }





  createPromoCode(){
  let input = {"offer":{"discountinpercent":this.promoCodeInput.discountinpercent,"description":this.promoCodeInput.description,"apptype":this.authenticationService.appType(), "offertype":this.promoCodeInput.offertype,"startdate":this.promoCodeInput.startdate,"enddate":this.promoCodeInput.enddate,"criteria":this.promoCodeInput.criteria,"promotype":this.promoCodeInput.promotype,"category":this.promoCodeInput.category,"promocode":this.promoCodeInput.promocode,"transtype":"create"}};

  input.offer.startdate = moment(this.promoCodeInput.startdate).format('YYYY-MM-DD 02:00:00');
  input.offer.enddate = moment(this.promoCodeInput.enddate).format('YYYY-MM-DD 02:00:00');
  console.log(this.promoCodeInput.enddate.toDateString());

  console.log(input);
  this.followupService.createpromocode(input)
  .subscribe(
  output => this.createPromoCodeResult(output),
  error => {
  });
  }
  createPromoCodeResult(result){
    if (result.result == 'success'){
      this.thisDialogRef.close('Cancel');
    }
  }


  getPromoCodeDetails(){
    if(this.Details.offerid){
      this.promoCodeInput.discountinpercent = this.Details.discountinpercent;
      this.promoCodeInput.description = this.Details.description;
      this.promoCodeInput.category = this.Details.category;
      this.promoCodeInput.criteria = this.Details.criteria;
      this.promoCodeInput.enddate = moment.utc(this.Details.enddate).toDate();
      this.promoCodeInput.offertype = this.Details.offertype;
      this.promoCodeInput.promocode = this.Details.promocode;
      this.promoCodeInput.promotype = this.Details.promotype;
      this.promoCodeInput.startdate = moment.utc(this.Details.startdate).toDate();
    }

  }

  updatePromoCode(){
    if(this.Details.offerid){
    let input = {"offer":{"discountinpercent":this.promoCodeInput.discountinpercent,"description":this.promoCodeInput.description,"apptype":this.authenticationService.appType(), "offertype":this.promoCodeInput.offertype,"startdate":this.promoCodeInput.startdate,"enddate":this.promoCodeInput.enddate,"criteria":this.promoCodeInput.criteria,"promotype":this.promoCodeInput.promotype,"category":this.promoCodeInput.category,"promocode":this.promoCodeInput.promocode,"transtype":"update"}};

    console.log(input);
    this.followupService.createpromocode(input)
    .subscribe(
    output => this.updatePromoCodeResult(output),
    error => {
    });
    }
  }
  updatePromoCodeResult(result){
    if(result.result =='success'){
      this.thisDialogRef.close('Cancel');
    }
  }

    onCloseModal(){
      this.thisDialogRef.close('Cancel');
    }

  ngOnInit() {
    this.getProductByCategory();
    console.log(this.Details);
    this.getPromoCodeDetails();

  }
}
