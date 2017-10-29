import { Component } from '@angular/core';
import {NavController, ToastController, MenuController} from 'ionic-angular';

import { MainPage } from '../../pages/pages';
import { LoginPage } from '../login/login';
import { SignupPage } from '../signup/signup';
import { User } from '../../providers/user';

import { GooglePlus } from '@ionic-native/google-plus';
/**
 * The Welcome Page is a splash page that quickly describes the app,
 * and then directs the user to create an account or log in.
 * If you'd like to immediately put the user onto a login/signup page,
 * we recommend not using the Welcome page.
*/
@Component({
  selector: 'page-welcome',
  templateUrl: 'welcome.html'
})
export class WelcomePage {

  str: any;
  constructor(public navCtrl: NavController,
              public user: User,
              public toastCtrl: ToastController,
              public menu: MenuController,
              private googlePlus: GooglePlus) {

    this.menu.swipeEnable(false);


}

  login() {
    //let current = this;
    //this.googlePlus.login();
    this.navCtrl.push(LoginPage);
  }

  signup() {
    this.navCtrl.push(SignupPage);
  }

  //Login with google
  _loginWithGoogle(){
    let current = this;
     this.user.loginWithGoogle()
       .then(function(result) {
       // This gives you a Google Access Token. You can use it to access the Google API.
       //let token = result.credential.accessToken;
       // The signed-in user info.
       let user = result.user;
       current._openPage(MainPage, user);
     }).catch(function(error) {
       // Handle Errors here.
       current._showToast('bottom', error.message, 3000);
     });
  }

  //Login with facebook
  _loginWithFacebook(){
    this.user.facebookLogin();
    this.navCtrl.push(MainPage);
    this._showToast('bottom', "hello", 4000);
    /*let current = this;
    this.user.loginWithFacebook()
      .then(function(result) {
      // This gives you a Facebook Access Token. You can use it to access the Facebook API.
      let token = result.credential.accessToken;
      // The signed-in user info.
      let user = result.user;
      current._openPage(MainPage, user);
    }).catch(function(error) {
      // Handle Errors here.
      current._showToast('bottom', error.message, 3000);
    });*/
  }


  _showToast(position: string, message: string, duration: any) {
    let toast = this.toastCtrl.create({
      message: message,
      duration: duration,
      position: position
    });

    toast.present(toast);
  }

  _openPage(page, user){

    localStorage.setItem('uid', user.uid);
    localStorage.setItem('displayName', user.displayName);
    localStorage.setItem('email', user.email);
    localStorage.setItem('photoUrl', user.photoUrl);
    localStorage.setItem('phoneNumber', user.phoneNumber);

    this.navCtrl.push(page);
  }

}
