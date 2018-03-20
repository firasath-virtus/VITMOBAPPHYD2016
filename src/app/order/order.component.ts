﻿import { Component, OnInit } from '@angular/core';
import {FormControl} from '@angular/forms';
import { AgmCoreModule, GoogleMapsAPIWrapper, LatLngLiteral, MapsAPILoader } from '@agm/core';
import { AuthenticationService } from '../login/authentication.service';
import Chart from 'chart.js';
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/operator/startWith';
import 'rxjs/add/operator/map';
// import { GaugeModule } from 'angular-gauge';
import { NgxGaugeModule } from 'ngx-gauge';
import * as _ from 'underscore';
import * as moment from 'moment';
declare var google: any;
 
interface marker {
	lat: number;
	lng: number;
  label?: string;
  icon?:string;
	
}
 
@Component({
    
    templateUrl: './order.component.html',
    styleUrls: ['./order.component.css']
})
export class OrderComponent implements OnInit {
    timeRemaining:any = '';

    thresholdConfig = {
        '0': {color: 'green'},
        '40': {color: 'orange'},
        '75.5': {color: 'red'}
    };

    gaugeType = "arch";
    gaugeValue = this.timeRemaining;
    gaugeLabel = 'Time Remaining';
    gaugeAppendText = "Hours";
    
    dropdownList = [];
    checkboxlist = [];
    selectedItems = [];
    SelectionStatus = [];
    emailFormArray = [];
    orderedTime:any="";
    currentTime:any= "";
    deliveryTime:any="";
    
    dropdownSettings = {};
    forwardOrdersData=[
        {delivery_exceptedtime:"19-03-2018 8PM-9PM", ordered_date:"2018-03-15T09:25:31.236664"},
        {delivery_exceptedtime:"15-03-2018 7PM-8PM",ordered_date:"2018-03-15T10:28:52.54987" },
        {delivery_exceptedtime:"09-03-2018 9AM-1PM",ordered_date:"2018-03-08T11:03:38.260876" }];
    map: any;
    drawingManager: any;
    stateCtrl: FormControl;
    filteredStates: Observable<any[]>;

    lat: number = 17.3850;
    lng: number = 78.4867;
    lat1: number = 24.886;
    lng1: number = -70.269; 
    zoom: number = 12;
    selectedDist: any = "0";
    selectedDistView: any = "0";
    DistributorArray: any = {
        distibutorname: "",
        area: []
    }
    ploymarkers: marker[] = [];
    polygonArray: any = {
        name: "",
        path: []
    }

    

    constructor(public gMaps: GoogleMapsAPIWrapper, private _loader: MapsAPILoader, private authenticationService: AuthenticationService) { 
        // this.percentageValue = function(value: number): string {
        //     return `${Math.round(value)} / ${this['max']}`;
        //   };

        this.stateCtrl = new FormControl();
        this.filteredStates = this.stateCtrl.valueChanges
            .startWith(null)
            .map(state => state ? this.filterStates(state) : this.allDistibutors.slice());
    }
    filterStates(name: string) {
        return this.allDistibutors.filter(state =>
          state.name.toLowerCase().indexOf(name.toLowerCase()) === 0);
      }
    clickedMarker(label: string, index: number) {
        //console.log(`clicked the marker: ${label || index}`)
    }
    viewAllDistPolygon(){
        this.distPolygon = this.allDistibutors;
    }
  
    click($event: any) {
        //console.log(`click event is called {$event}`);
    }

    delete($event: any) {
        //console.log(`delete is called {$event}`);
    }
    savePloygon(dist) {
        //console.log(this.polygonArray);
        //console.log(dist);
        let polygon = Object.assign({}, this.polygonArray);
        polygon.distibutorname = dist.distibutorname;
        this.allDistibutors.push(polygon);
        dist.area.push(polygon);
        //console.log("all distbtors" +this.distubutors);
        this.polygonArray.name = "";
        this.polygonArray.path = [];
        this.ploymarkers = [];
    }
    saveDistibutor() {
        //console.log(this.polygonArray);
        
        let distibutors = Object.assign([], this.DistributorArray);
        this.distubutors.push(distibutors);
        this.DistributorArray.distibutorname = "";
       

    }
   
    customerMapClicked($event: any) {
        for (let dist of this.allDistibutors) {
            var latlong = new google.maps.LatLng($event.coords.lat, $event.coords.lng);
            var polygonPath = new google.maps.Polygon({
                paths: dist.path
            });
            // google.maps.geometry.poly.containsLocation(latlong, polygonPath)
            if (this.gMaps.containsLocation(latlong, polygonPath)) {
                //console.log(true);
                alert("Distibutor location : " + dist.distibutorname);
                return false;
            }
            
        };
    }
    mapClicked($event: any) {
       //var bermudaTriangle = new google.maps.Polygon({
        //    paths: this.distubutors[0].area[0].path
        //});
        
        
       
        this.ploymarkers.push({
            lat: $event.coords.lat,
            lng: $event.coords.lng
        });
        this.polygonArray.path.push({
            lat: $event.coords.lat,
            lng: $event.coords.lng
        });
       
    }
    viewDistPolygon(dist) {
        this.distPolygon = dist.area;
    }
    
    markers: marker[] = [
        {
            lat: 17.359066,
            lng: 78.399639,
            label: 'A',
            icon: '../assets/images/green.png'
        },
        {
            lat: 17.399695,
            lng: 78.522549,
            label: 'B',
            icon: '../assets/images/red.png'
        },
        {
            lat: 17.385817,
            lng: 78.465643,
            label: 'C',
            icon: '../assets/images/orange.png'
        }
    ]
    allDistibutors: any[] = [
        {
            name: "test",
            distibutorname: "Kinley",
            path: [
                { lat: 17.383406, lng: 78.400841 },
                { lat: 17.353495, lng: 78.380756 },
                { lat: 17.359722, lng: 78.417835 }
            ],
        },
        {
            name: "marmuda",
            distibutorname: "Kinley",
            path: [
                { lat: 25.774, lng: -80.190 },
                { lat: 18.466, lng: -66.118 },
                { lat: 32.3212, lng: -64.757 }
            ],
        },
        {
            name: "test2",
            distibutorname: "Kinley",
            path: [
                { lat: 17.409195, lng: 78.506413 },
                { lat: 17.384624, lng: 78.516026 },
                { lat: 17.407557, lng: 78.545895 }
            ],
        }

    ];
    distubutors: any[] = [{
        distibutorname: "Kinley",
        area: [{
            name: "test2",
            distibutorname: "Kinley",
            path: [
                { lat: 17.409195, lng: 78.506413 },
                { lat: 17.384624, lng: 78.516026 },
                { lat: 17.407557, lng: 78.545895 }
            ],
        },
            {
                name: "marmuda",
                distibutorname: "Kinley",
                path: [
                    { lat: 25.774, lng: -80.190 },
                    { lat: 18.466, lng: -66.118 },
                    { lat: 32.3212, lng: -64.757 }
                ],
            },
            {
                name: "test",
                distibutorname: "Kinley",
                path: [
                    { lat: 17.383406, lng: 78.400841 },
                    { lat: 17.353495, lng: 78.380756 },
                    { lat: 17.359722, lng: 78.417835 }
                ],
            }]
      }
    ];

    intialMap() {
       
        var gPolygons = [];
        var polygon1 = {
            draggable: true,
            editable: true,
            fillColor: "#f00"
        };

        this.map = new google.maps.Map(document.getElementById('map'), {
            center: { lat: 17.4471, lng: 78.454 },
            zoom: 10
        });
        var triangleCoords = [
          {lat: 25.774, lng: -80.190},
          {lat: 18.466, lng: -66.118},
          {lat: 32.321, lng: -64.757},
          {lat: 25.774, lng: -80.190}
        ];
        this.drawingManager = new google.maps.drawing.DrawingManager({
            drawingMode: google.maps.drawing.OverlayType.POLYGON,
            drawingControl: true,
            editable: true,
            polygonOptions: polygon1,
            paths: triangleCoords,
            drawingControlOptions: {
                position: google.maps.ControlPosition.TOP_CENTER,
                drawingModes: ['polygon']

            }
             
        });
         

       
        this.drawingManager.setMap(this.map);
        google.maps.event.addListener(this.drawingManager, 'overlaycomplete', (event) => {
            var poly = event.overlay;
            //this.map.data.add(new google.maps.Data.Feature({
            //    geometry: new google.maps.Data.Polygon([poly.getPath().getArray()])
            //}));
           
           
                google.maps.event.addListener(poly.getPath(), 'set_at', function () {
                   
                    
                });

                google.maps.event.addListener(poly.getPath(), 'insert_at', function () {
                    
                  
                });
              
         
              // pushPolygon(poly);
              
        });
        
       
    }


    initMap() {
        //console.log('now: ', _.now());
         var triangleCoords = [
          {lat: 25.774, lng: -80.190},
          {lat: 18.466, lng: -66.118},
          {lat: 32.321, lng: -64.757},
          {lat: 25.774, lng: -80.190}
        ];
        this.map = new google.maps.Map(document.getElementById('map'), {
            center: { lat: 17.4471, lng: 78.454 },
            zoom: 10,
            // only show roadmap type of map, and disable ability to switch to other type
           // mapTypeId: google.maps.MapTypeId.ROADMAP,
            mapTypeControl: false,
          
        });

        this.map.data.setControls(['Polygon']);
        this.map.data.setStyle({
            editable: true,
            draggable: true
        });
        this.map.data.add({geometry: new google.maps.Data.Polygon([triangleCoords])})
        this.bindDataLayerListeners(this.map.data);

        //load saved data
        //loadPolygons(map);
    }
    bindDataLayerListeners(dataLayer) {
        dataLayer.addListener('addfeature', this.savePolygon);
        dataLayer.addListener('removefeature', this.savePolygon);
        dataLayer.addListener('setgeometry', this.savePolygon);
    }
    savePolygon() {
        this.map.data.toGeoJson(function (json) {
            //console.log(json.features);
            localStorage.setItem('geoData', JSON.stringify(json));
            
        });
    }

      //simulator
//   timeSimultor(){
//     //all orders time
//     let orderedtime = this.forwardOrders.ordered_date;
//     let time1 = moment(orderedtime).format("HH");
//     let time2 = this.forwardOrders.delivery_exceptedtime;
//     // let abc = time2.split(" ").pop('');
//     // console.log(abc);
//     // let def = abc.split("-")
//     let deliverytime= time2;
//     // deliverytime.split(" ")[1]
//     var time = deliverytime.split(" ")[1]
//     console.log(time.substring(0,3));
//     let timeinAMPM = time.substring(0,3);

//     //1
//     var time24 = moment("3PM", ["hA"]).format("HH:mm");
//     // org  let newHour = moment(timeinAMPM).format("HH");
//     //2
//     // '3pm'.replace(
//     //   /(\d+)([ap]m)?/,
//     //   (match, digits, ampm) => +digits + (ampm === "pm" ? 12 : 0)
//     // );


    
    
//     console.log(time24); 
//   }


//time

  //simulator

  timesimu(){
      let input= this.forwardOrdersData;
      for(let data of this.forwardOrdersData){
          let orderedTime = this.forwardOrdersData[0].ordered_date;
          let forderedDate = moment(orderedTime).format("HH"); // ordered date in hours
          let deliveryTime:any = this.forwardOrdersData[0].delivery_exceptedtime; // del exp time
          let f3deliveryDate = deliveryTime.split(" ").pop(''); // removes date part to give time part 
          let f2deliveryDate = f3deliveryDate.split("-")[0]; // gives ground time i.e 3-4 --> 3pm
          let f1deliveryDate = f2deliveryDate.substring(0,3); //3pm
          var timein24 = moment(f1deliveryDate, ["hA"]).format("HH"); //value in 24hours format
          var ifNextDate = this.forwardOrdersData[0].delivery_exceptedtime; // if next date
          let nextdelDate = ifNextDate.slice(0,10);
          var currentDate = new Date();
          var currentdate = moment(currentDate).format("DD-MM-YYYY");
          
          var currentDateTime = new Date(); //Initialising current time
          var currentHour = moment(currentDateTime).format("HH"); // getting current Hour
          this.timeRemaining = parseInt(timein24) - parseInt(currentHour) // Time remaining
          console.log(this.timeRemaining);

      }

  }




    saveP(dist) {
        var data = JSON.parse(localStorage.getItem('geoData'));

        for (let feature of data.features) {
           
            var coordinates = feature.geometry.coordinates;
            for (let coord of coordinates) {
                coord.forEach((item, index) => {
                    if (coord.length - 1 != index) { 
                    var path = { lat: item[1], lng: item[0] };
                    this.polygonArray.path.push(path);
                }
                });
                
            }
            let polygon = Object.assign({}, this.polygonArray);
            polygon.distibutorname = dist.distibutorname;
            this.allDistibutors.push(polygon);
            dist.area.push(polygon);
            this.polygonArray.name = "";
            this.polygonArray.path = [];
            localStorage.setItem('geoData', '');
        }
    }
    distPolygon = this.allDistibutors;
    //paths: Array<LatLngLiteral> = [
    //   { lat: 17.383406,  lng: 78.400841 },
    //   { lat: 17.353495,  lng: 78.380756 },
    //   { lat: 17.359722,  lng: 78.417835 }
    //];
    onItemSelect(item: any) {
        //console.log(item);
        //console.log(this.selectedItems);
    }
    OnItemDeSelect(item: any) {
        //console.log(item);
        //console.log(this.selectedItems);
    }
    onSelectAll(items: any) {
        //console.log(items);
    }
    onDeSelectAll(items: any) {
        //console.log(items);
    }
    onChangeCheck(number: string, isChecked: boolean) {
       

        if (isChecked) {
            this.emailFormArray.push(number);
            //console.log(this.emailFormArray);
        } else {
            this.emailFormArray = _.without(this.emailFormArray, number);
            //console.log(this.emailFormArray);
        }
    }


    //guage code

    
    ngOnInit() {
        this.timesimu();


        // const updateValues = (): void => {
        //     this.gaugeValues = {
        //       1: Math.round(Math.random() * 100),
        //       2: Math.round(Math.random() * 100),
        //       3: Math.round(Math.random() * 100),
        //       4: Math.round(Math.random() * 100),
        //       5: Math.round(Math.random() * 200),
        //       6: Math.round(Math.random() * 100),
        //       7: Math.round(Math.random() * 100)
        //     };
        //   };
      
        //   const INTERVAL: number = 5000;
      
        //   this.interval = setInterval(updateValues, INTERVAL);
        //   updateValues();
        // this.timesimu();
        // this._loader.load().then(() => {
        //     this.initMap();
        // });
        
        this.dropdownList = [
            { "id": 1, "itemName": "India" },
            { "id": 2, "itemName": "Singapore" },
            { "id": 3, "itemName": "Australia" },
            { "id": 4, "itemName": "Canada" },
            { "id": 5, "itemName": "South Korea" },
            { "id": 6, "itemName": "Germany" },
            { "id": 7, "itemName": "France" },
            { "id": 8, "itemName": "Russia" },
            { "id": 9, "itemName": "Italy" },
            { "id": 10, "itemName": "Sweden" }
        ];
        this.checkboxlist = [
            { number:"14253" },
            { number: "21467253"},
            { number: "3142553" },
            { number: "41446253"},
            { number: "514253" },
            { number: "614253" },
            { number: "714253" }
           
        ];
        this.selectedItems = [
           
        ];
        this.dropdownSettings = {
            singleSelection: false,
            text: "Select Countries",
            selectAllText: 'Select All',
            unSelectAllText: 'UnSelect All',
            enableSearchFilter: true,
            badgeShowLimit: 4,
            classes: "myclass custom-class"
        };        
    
  }
//   ngOnDestroy(): void {
//     clearInterval(this.interval);
//   }
   
}



//chart code

//var ctx=  document.getElementById("timeChart");;
// var timeChart = new Chart(ctx, {
//     type: 'doughnut',
//     data:{
//         labels: ["green","orangered","red"],
//         datasets: [{
//             labels: 'time remining',
//             data: [],
//             backgroundColor: [
//                 'rgb(0,128,0)',
//                 'rgb(255,69,0)',
//                 'rgb(255,0,0)',
//             ],
//             borderWidth:1

//         }]
//     },
    
//     options: {
//         scales: {
//             yAxes: [{
//                 ticks: {
//                     beginAtZero:true
//                 }
//             }]
//         }
//     }
// });    


//time code



