import { Component, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { MdDialog } from '@angular/material';
import { AuthenticationService } from '../login/authentication.service';
import { OrderLandingService } from './order-landing.service';
import { OrderDetailDailogComponent } from '../order-detail-dailog/order-detail-dailog.component';
import { DistributorServiceService } from '../distributor/distributor-service.service';
import { AddEditCustomerDailogComponent } from '../add-edit-customer-dailog/add-edit-customer-dailog.component';
import { EditQuantityDailogComponent } from '../edit-quantity-dailog/edit-quantity-dailog.component';
import { OrderCoverageDetailDailogComponent } from '../order-coverage-detail-dailog/order-coverage-detail-dailog.component';
import { LoaderService } from '../login/loader.service';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/startWith';
import 'rxjs/add/operator/map';
import * as _ from 'underscore';
@Component({

  templateUrl: './order-landing.component.html',
  styleUrls: ['./order-landing.component.css']
})
export class OrderLandingComponent implements OnInit {
  DistributorCtrl: FormControl;
  filteredDistributors: Observable<any[]>;
  SupplierCtrl: FormControl;
  filteredSupplier: Observable<any[]>;
  constructor(public dialog: MdDialog, private authenticationService: AuthenticationService, private distributorService: DistributorServiceService, private orderLandingService: OrderLandingService,private loaderService: LoaderService) {
    this.DistributorCtrl = new FormControl();
    this.filteredDistributors = this.DistributorCtrl.valueChanges
      .startWith(null)
      .map(dist => dist ? this.findDistributors(dist) : this.distributors.slice());
      this.SupplierCtrl = new FormControl();
      this.filteredSupplier = this.SupplierCtrl.valueChanges
        .startWith(null)
        .map(supplier =>supplier ? this.findSupplier(supplier) : this.supplierList.slice());

  }
  distributors: any = [];
  supplierList:any = [];
  LastfilterRecords = false;
  selectedDistForFilter: any = "";
  orderListInput = { "order": { "userid": this.authenticationService.loggedInUserId(), "priority": this.authenticationService.loggedInUserId(), "usertype": this.authenticationService.userType(), "status": "", "pagesize": 10, "last_orderid": null, "apptype": this.authenticationService.appType(), "createdthru": "website" } };
  tabPanelView: string = "forward";
  forwardOrders: any = [];
  allOrders: any = [];
  filterRecords = false;
  forwardClickMore = true;
  orderClickMore = true;
  polygonArray = [];
  filterInput = { "order": { "pagesize": "10", "searchtype": "", "status": "", "userid": this.authenticationService.loggedInUserId(), "usertype": this.authenticationService.userType(), "searchtext": "", "apptype": this.authenticationService.appType(), "last_orderid": "0" } };
  dropdownData = { selectedItems: [] };
  filterType = { customerName: "", customerMobile: "", orderid: "", supplierid: "", distributorid: "" };
  dropdownSettings = {
    singleSelection: false,
    text: "Select Status",
    selectAllText: 'Select All',
    unSelectAllText: 'UnSelect All',
    enableSearchFilter: true,
    badgeShowLimit: 2,
    classes: "myclass custom-class myyy"
  };
  statusListForward = [{ "id": "pendingwithdistributor", "itemName": "Pending With Distributor" },
  { "id": "pendingwithsupplier", "itemName": "Pending With Supplier" },
  { "id": "delivered", "itemName": "Delivered" },
  { "id": "cancelled", "itemName": "Cancelled" },
  { "id": "doorlock", "itemName": "Doorlock" },
  { "id": "rejected", "itemName": "Rejected" },
  { "id": "notreachable", "itemName": "Not Reachable" },
  { "id": "cantdeliver", "itemName": "Can't Deliver" }];
  statusListAll = [
    { "id": "pendingwithsupplier", "itemName": "Pending With Supplier" },
    { "id": "delivered", "itemName": "Delivered" },
    { "id": "cancelled", "itemName": "Cancelled" },
    { "id": "doorlock", "itemName": "Doorlock" },
    { "id": "rejected", "itemName": "Rejected" },
    { "id": "notreachable", "itemName": "Not Reachable" },
    { "id": "cantdeliver", "itemName": "Can't Deliver" }];
  findDistributors(name: string) {
    console.log(name);
    let finalDistributors = this.distributors.filter(dist =>
      dist.fullName.toLowerCase().indexOf(name.toLowerCase()) === 0);
    console.log(finalDistributors);
    if (finalDistributors && finalDistributors.length > 0) {
      let findDistributor: any = {};

      findDistributor = _.find(finalDistributors, function (k, l) {
        let distDetails: any = k;
        return distDetails.fullName == name;
      });

      if (findDistributor) {
        this.filterType.distributorid = findDistributor.userid;
      }


    }
    else {
      if (name.length >= 3 && !this.LastfilterRecords) {
        this.getDistributors();
      }


    }
    return finalDistributors;
  }
  findSupplier(name: string) {
    console.log(name);
    let finalsupplier = this.supplierList.filter(dist =>
      dist.fullName.toLowerCase().indexOf(name.toLowerCase()) === 0);
    console.log(finalsupplier);
    if (finalsupplier && finalsupplier.length > 0) {
      let findSupplier: any = {};

      findSupplier = _.find(finalsupplier, function (k, l) {
        let supplierDetails: any = k;
        return supplierDetails.fullName == name;
      });

      if (findSupplier) {
        this.filterType.supplierid = findSupplier.userid;
      }


    }
  
    return finalsupplier;
  }
  showTabPanel(panelName) {
    this.filterRecords = false;
    this.tabPanelView = panelName;
    this.clearFilter();
   // this.refreshOrders();
  }
  showEditCustomer(orderDetails) {
    let dialogRefEditCustomer = this.dialog.open(AddEditCustomerDailogComponent, {

      width: '700px',
      data: orderDetails
    });
    dialogRefEditCustomer.afterClosed().subscribe(result => {
      console.log(`Dialog closed: ${result}`);


    });

  }
  showCoverageDetails(orderDetails) {
    let modelData = { orders: orderDetails, polygons: this.polygonArray }
    let dialogRefCoverageDailog = this.dialog.open(OrderCoverageDetailDailogComponent, {
      width: '95%',
      data: modelData
    });
    dialogRefCoverageDailog.afterClosed().subscribe(result => {
      console.log(`Dialog closed: ${result}`);
      if (result == 'success') {
        this.getForwardOrderDetails(true);
        this.getAllOrderDetails(true);
      }

    });

  }
  showOrderDetails(orderData) {
    let dialogRefShowOrder = this.dialog.open(OrderDetailDailogComponent, {

      width: '90%',
      data: orderData
    });
    dialogRefShowOrder.afterClosed().subscribe(result => {
      console.log(`Dialog closed: ${result}`);


    });

  }
  editQuanity(orderDetails) {
    let dialogRefEditQun = this.dialog.open(EditQuantityDailogComponent, {

      width: '500px',
      data: orderDetails
    });
    dialogRefEditQun.afterClosed().subscribe(result => {
      console.log(`Dialog closed: ${result}`);
      if (result == 'success') {
        this.getForwardOrderDetails(true);
        this.getAllOrderDetails(true);

      }

    });

  }
  getForwardOrderDetails(firstcall) {
    this.orderListInput.order.status = 'forwardedorders';
    if (this.forwardOrders && this.forwardOrders.length && !firstcall) {
      let lastForwardOrder: any = _.last(this.forwardOrders);
      if (lastForwardOrder) {
        this.orderListInput.order.last_orderid = lastForwardOrder.order_id;
      }

    }
    else {
      this.forwardOrders = [];
      this.orderListInput.order.last_orderid = null;
    }
    let forwardInput = this.orderListInput
    this.loaderService.display(true);
    this.orderLandingService.getOrderList(forwardInput)
      .subscribe(
      output => this.getForwardOrderDetailsResult(output),
      error => {
        console.log("error in distrbutors");
        this.loaderService.display(false);
      });
  }
  getForwardOrderDetailsResult(result) {
    // this.forwardOrders = result.data;
    this.loaderService.display(false);
    console.log(this.forwardOrders);
    if (result.data && result.data.length > 0) {
      let data = this.ModifyOrderList(result.data);
      this.forwardClickMore = true;
      this.forwardOrders = _.union(this.forwardOrders, data);
    }
    else {
      this.forwardClickMore = false;
    }
  }
  getAllOrderDetails(firstcall) {

    this.orderListInput.order.status = 'all';
    if (this.allOrders && this.allOrders.length && !firstcall) {
      let lastAllOrder: any = _.last(this.allOrders);
      if (lastAllOrder) {
        this.orderListInput.order.last_orderid = lastAllOrder.order_id;
      }


    }
    else {
      this.allOrders = [];
      this.orderListInput.order.last_orderid = null;
    }
    let orderInput = this.orderListInput;
    this.loaderService.display(true);
    this.orderLandingService.getOrderList(orderInput)
      .subscribe(
      output => this.getAllOrderDetailsResult(output),
      error => {
        console.log("error in distrbutors");
        this.loaderService.display(false);
      });
  }
  getAllOrderDetailsResult(result) {
    //  this.allOrders = result.data;
    this.loaderService.display(false);
    console.log(this.allOrders);
    if (result.data && result.data.length > 0) {
      let data = this.ModifyOrderList(result.data);
      this.orderClickMore = true;
      this.allOrders = _.union(this.allOrders, data);
    }
    else {
      this.orderClickMore = false;
    }
  }
  getPolygonDistributors() {

    var input = { area: { user_type: "dealer", user_id: "0", "apptype": this.authenticationService.appType() } };
    this.loaderService.display(true);
    this.distributorService.getpolygonByDistributor(input)
      .subscribe(
      output => this.getPolygonDataResult(output),
      error => {
        console.log("falied");
        this.loaderService.display(false);
      });
  }
  getPolygonDataResult(output) {
    this.loaderService.display(false);
    if (output.data && output.data.length > 0) {
      this.polygonArray = [];
      for (let data of output.data) {

        if (data.polygonvalue && data.polygonvalue.length > 0) {
          for (let polygon of data.polygonvalue) {
            polygon.color = '';
            polygon.user_id = data.user_id;
            polygon.distributorName = data.username;
            polygon.supplier = data.suppliers;
            polygon.mobileno = data.mobileno;
            this.polygonArray.push(polygon);

          }
        }

      }
    }
  }
  searchOrderList() {
    if (this.filterInput.order.searchtype == 'name') {
      this.filterInput.order.searchtext = this.filterType.customerName;
    }
    else if (this.filterInput.order.searchtype == 'mobile') {
      this.filterInput.order.searchtext = this.filterType.customerMobile;
    }
    else if (this.filterInput.order.searchtype == 'orderid') {
      this.filterInput.order.searchtext = this.filterType.orderid;
    }
    else if (this.filterInput.order.searchtype == 'supplierid') {
      this.filterInput.order.searchtext = this.filterType.supplierid;
    }
    else if (this.filterInput.order.searchtype == 'distributor_id') {
      this.filterInput.order.searchtext = this.filterType.distributorid;
    }
    else if (this.filterInput.order.searchtype == 'status') {
      this.filterInput.order.searchtext = "";
      if (this.dropdownData.selectedItems && this.dropdownData.selectedItems.length > 0) {
        for (let data of this.dropdownData.selectedItems) {
          if (this.filterInput.order.searchtext) {
            this.filterInput.order.searchtext += "," + data.id;
          }
          else {
            this.filterInput.order.searchtext += data.id;
          }
        }
      }
    }

    if (this.tabPanelView == 'forward') {
      this.filterInput.order.status = 'forwardedorders';
    }
    else {
      this.filterInput.order.status = 'all';
    }
    console.log(this.filterInput);
    this.getFilteredOrders(true);


  }
  getFilteredOrders(firstcall) {
    if (!firstcall) {
      if (this.tabPanelView == 'forward') {
        let lastForwardOrder: any = _.last(this.forwardOrders);
        if (lastForwardOrder) {
          this.filterInput.order.last_orderid = lastForwardOrder.order_id;
        }
      }

      else if (this.tabPanelView == 'allorder') {
        let lastallOrder: any = _.last(this.allOrders);
        if (lastallOrder) {
          this.filterInput.order.last_orderid = lastallOrder.order_id;
        }

      }


    }
    else {
      if (this.tabPanelView == 'forward') {
        this.forwardOrders = [];
        this.filterInput.order.last_orderid = "0";
      }
      else if (this.tabPanelView == 'allorder') {
        this.allOrders = [];
        this.filterInput.order.last_orderid = "0";
      }
    }
    let input = this.filterInput;
    this.loaderService.display(true);
    this.orderLandingService.getOrdersByfilter(input)
      .subscribe(
      output => this.getFilteredOrdersResult(output),
      error => {
        console.log("falied");
        this.loaderService.display(false);
      });
  }
  getFilteredOrdersResult(result) {
    console.log(result);
    this.loaderService.display(false);
    if (result.result == 'success') {
      this.filterRecords = true;
      if (this.tabPanelView == 'forward') {
        let data = this.ModifyOrderList(result.data);
        this.forwardClickMore = true;
        this.forwardOrders = _.union(this.forwardOrders, data);
      }

      else if (this.tabPanelView == 'allorder') {
        let data = this.ModifyOrderList(result.data);
        this.orderClickMore = true;
        this.allOrders = _.union(this.allOrders, data);
      }

    }
    else {
      if (this.tabPanelView == 'forward') {

        this.forwardClickMore = false;
      }
      else if (this.tabPanelView == 'allorder') {

        this.orderClickMore = false;
      }

    }
  }
  // refreshOrders() {
  //   this.clearFilter();
  //   this.filterRecords = false;
  //   this.getForwardOrderDetails(true);
  //   this.getAllOrderDetails(true);
  //   //this.getPolygonDistributors();
  // }
  clearFilter() {
    this.filterRecords = false;
    this.filterType = { customerName: "", customerMobile: "", orderid: "", supplierid: "", distributorid: "" };
    this.filterInput = { "order": { "pagesize": "10", "searchtype": "", "status": "", "userid": this.authenticationService.loggedInUserId(), "usertype": this.authenticationService.userType(), "searchtext": "", "apptype": this.authenticationService.appType(), "last_orderid": "0" } };
    this.getForwardOrderDetails(true);
    this.getAllOrderDetails(true);
  }
  ModifyOrderList(result) {
    _.each(result, function (i, j) {
      let details: any = i;
      if (details.status == "onhold") {
        details.OrderModifiedStatus = "On Hold";
        details.StatusColor = "warning";
      }
      else if (details.status.toLowerCase() == "cancelled") {
        details.OrderModifiedStatus = "Cancelled";
        details.StatusColor = "danger";
      }
      else if (details.status.toLowerCase() == "rejected") {
        details.OrderModifiedStatus = "Rejected";
        details.StatusColor = "danger";
      }
      else if (details.status == "assigned") {
        details.OrderModifiedStatus = "Re-Assign";
        details.StatusColor = "logo-color";
      }
      else if (details.status.toLowerCase() == "delivered") {
        details.OrderModifiedStatus = "Delivered";
        details.StatusColor = "success";
      }
      else if (details.status == "doorlock" || details.status == "Door Locked") {
        details.OrderModifiedStatus = "Door Locked";
        details.StatusColor = "warning";
      }
      else if (details.status == "cannot_deliver" || details.status == "Cant Deliver") {
        details.OrderModifiedStatus = "Cant Deliver";
        details.StatusColor = "warning";
      }
      else if (details.status == "Not Reachable" || details.status == "not_reachable") {
        details.OrderModifiedStatus = "Not Reachable";
        details.StatusColor = "warning";
      }
      else if (details.status == "pending") {
        details.OrderModifiedStatus = "Pending";
        details.StatusColor = "logo-color";
      }
      else if (details.status == "ordered" || details.status == "backtodealer") {
        details.OrderModifiedStatus = "Assign";
        details.StatusColor = "logo-color";
      }


    });
    return result;
  }
  getPagingOrderDetails(firstcall, tab) {
    if (this.filterRecords) {

      this.getFilteredOrders(firstcall);
    }
    else {
      if (tab == 'forward') {

        this.getForwardOrderDetails(firstcall);
      }
      else if (tab == 'allorder') {

        this.getAllOrderDetails(firstcall);
      }
    }

  }
  getDistributors() {
    let input = { "root": { "userid": this.authenticationService.loggedInUserId(), "usertype": "dealer", "loginid": this.authenticationService.loggedInUserId(), "lastuserid": 0, "apptype": this.authenticationService.appType(), "pagesize": 200 } }
    if (this.distributors && this.distributors.length) {
      let lastDistributor: any = _.last(this.distributors);
      if (lastDistributor) {
        input.root.lastuserid = lastDistributor.userid;
      }


    }
    else {
      this.distributors = [];
      input.root.lastuserid = null;
    }

    console.log(input);
    this.loaderService.display(true);
    this.distributorService.getAllDistributors(input)
      .subscribe(
      output => this.getDistributorsResult(output),
      error => {
        console.log("error in distrbutors");
        this.loaderService.display(false);
      });
  }
  getDistributorsResult(data) {
    console.log(data);
    this.loaderService.display(false);
    if (data.result == 'success') {
      let distributorCopy = [];

      if (data.data && data.data.length) {
        _.each(data.data, function (i, j) {
          let details: any = i;
          details.fullName = details.firstname + " " + details.lastname
          distributorCopy.push(details);

        });

        this.distributors = _.union(this.distributors, distributorCopy);
        //  this.distributors = distributorCopy;
      }
    }
    else {
      this.LastfilterRecords = true;
    }
  }
  getSupplier() {
    let input = { "loginid": this.authenticationService.loggedInUserId(), "appType": this.authenticationService.appType() }; 
   console.log(input);
   this.loaderService.display(true);
    this.distributorService.getAllSuppliers(input)
      .subscribe(
      output => this.getSupplierResult(output),
      error => {
        this.loaderService.display(false);
        console.log("error in distrbutors");
      });
  }
  getSupplierResult(data) {
    console.log(data);
    this.loaderService.display(false);
    if (data.result == 'success') {
      let supplierCopy = [];

      if (data.data && data.data.length) {
        _.each(data.data, function (i, j) {
          let details: any = i;
          details.fullName = details.firstname + " " + details.lastname
          supplierCopy.push(details);

        });

        this.supplierList = _.union(this.supplierList, supplierCopy);
        //  this.distributors = distributorCopy;
      }
    }
    else {
      this.LastfilterRecords = true;
    }
  }
  ngOnInit() {
    this.getPolygonDistributors();
    this.getForwardOrderDetails(true);
    this.getAllOrderDetails(true);
    this.getDistributors();
    this.getSupplier();
  }

}
