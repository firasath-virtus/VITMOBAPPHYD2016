﻿import { Injectable } from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { Router } from '@angular/router';
import { Inject } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';
import 'rxjs/add/observable/throw';

@Injectable()
export class AuthenticationService {
    loggedIn = false;
    isSuperDelear = true;
    CurrentSession: any = {};
    dashBoardDetails: any = {};
    polygons:any = {};

    constructor(private router: Router, private http: Http, @Inject('API_URL') private apiUrl: string) {
        this.loggedIn = !!localStorage.getItem('currentUser');
        this.CurrentSession = JSON.parse(localStorage.getItem('currentUser'));
        this.isSuperDelear = this.getSupperDelear();
        this.dashBoardDetails =JSON.parse(localStorage.getItem('dashboardDetails'));
        this.polygons = JSON.parse(localStorage.getItem('polygons'));
    }
    login(username: string, password: string) {
        let bodyString = JSON.stringify({ userName: username, userPwd: password, apptype: "moya" }); // Stringify payload
        let headers = new Headers({ 'Content-Type': 'application/json' }); // ... Set content type to JSON  res.json()
        let options = new RequestOptions({ headers: headers });
        return this.http.post(this.apiUrl + '/weblogin', bodyString, options)
            .map((res: Response) => {
                this.loggedIn = true;
                 return res.json();
            })
            .do(data => console.log('All: '))
            .catch((error: any) => Observable.throw(error.json().error || 'Server error'));
    }


    getDashboardDetails(input) {
        
        let bodyString = JSON.stringify(input); // Stringify payload
        let headers = new Headers({ 'Content-Type': 'application/json' }); // ... Set content type to JSON  res.json()
        let options = new RequestOptions({ headers: headers });
        return this.http.post(this.apiUrl + '/dashboard', bodyString, options)
          .map((res: Response) => res.json())
          .do(data => console.log('All: ') )
          .catch((error: any) => Observable.throw(error.json().error || 'Server error'));
          
      }

     


    logout() {
        localStorage.removeItem('currentUser');
        this.loggedIn = false;
        this.CurrentSession = {};
        this.router.navigate(['/login']);
    }
    isLoggedIn() {
        return this.loggedIn;
    }
    loggedInUserId = function () {
        try {
            if (this.CurrentSession.userid) {
                return JSON.parse(this.CurrentSession.userid);
            }
            else {
                return 0;
            }
        }
        catch (ex) {
            return 0;
        }

    };
    superDelearId = function () {
        try {
            if (this.CurrentSession.superdealerid) {
                return JSON.parse(this.CurrentSession.superdealerid);
            }
            else {
                return 0;
            }
        }
        catch (ex) {
            return 0;
        }

    };

    appType = function () {
        try {
            if (this.CurrentSession.apptype) {
                return this.CurrentSession.apptype.toString();
            }
            else {
                return "";
            }
        }
        catch (ex) {
            return "";
        }

    };
    dealerNo = function () {
        try {
            if (this.CurrentSession.mobileno) {
                return this.CurrentSession.mobileno.toString();
            }
            else {
                return "";
            }
        }
        catch (ex) {
            return "";
        }

    };
    userFullName = function () {
        try {
            if (this.CurrentSession.first_name) {
                let fullName = this.CurrentSession.first_name + this.CurrentSession.last_name;
                return fullName.toString();
            }
            else {
                return "";
            }
        }
        catch (ex) {
            return "";
        }

    };
    userType= function () {
        try {
            if (this.CurrentSession.USERTYPE) {
                return this.CurrentSession.USERTYPE.toString();
            }
            else {
                return "";
            }
        }
        catch (ex) {
            return "";
        }

    };
    getSupperDelear= function () {
        try {
            if (this.CurrentSession.issuperdealer == 'true') {
                return true;
            }
            else {
                return false;
            }
        }
        catch (ex) {
            return false;
        }

    };

    getPolygons = function(){
        try{
            if(this.polygons){
                return this.polygons;
            }
            else{
                return "" ;
            }
        }
        catch (ex){
            return "";
        }
    }

}

// {
//                 // login successful if there's a jwt token in the response
//                 let resData = response.json();
//                 if (resData && resData.data.user) {
//                     // store user details and jwt token in local storage to keep user logged in between page refreshes
//                     localStorage.setItem('currentUser', JSON.stringify(resData.data.user));
//                 }
//             }