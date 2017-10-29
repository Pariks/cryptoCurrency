import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { Api } from './api';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/toPromise';

import {  AngularFireDatabase, FirebaseListObservable } from 'angularfire2/database';
import { AngularFireAuth } from 'angularfire2/auth';
// Do not import from 'firebase' as you'd lose the tree shaking benefits
import * as firebase from 'firebase/app';
import { Facebook } from '@ionic-native/facebook';
import {ToastController} from "ionic-angular";

/**
 * Most apps have the concept of a User. This is a simple provider
 * with stubs for login/signup/etc.
 *
 * This User provider makes calls to our API at the `login` and `signup` endpoints.
 *
 * By default, it expects `login` and `signup` to return a JSON object of the shape:
 *
 * ```json
 * {
 *   status: 'success',
 *   user: {
 *     // User fields your app needs, like "id", "name", "email", etc.
 *   }
 * }
 * ```
 *
 * If the `status` field is not `success`, then an error is detected and returned.
 */
@Injectable()
export class User {
  private _users$: any;
  private _db: any;
  private _usersRef: any;
  _accessToken: any;
  _user: any;
  _users: FirebaseListObservable<any[]>;

  constructor(public http: Http,
              public api: Api,
              public afd: AngularFireDatabase,
              public afAuth: AngularFireAuth,
              private facebook: Facebook,
              public toastCtrl: ToastController,
              ) {
    /*this._db = firebase.database().ref('/'); // Get a firebase reference to the root
    this._usersRef = firebase.database().ref('users'); // Get a firebase reference to the todos
    this._usersRef.on('child_added', this.handleData, this);
    this._users$ = new ReplaySubject();*/

   /*firebase.auth().createUserWithEmailAndPassword(email, password)
      .then( newUser => {
        firebase.database().ref('/userProfile').child(newUser.uid)
          .set({ email: email });
      });*/

    this._db = afd;
    this._users = this._db.list('/users');
    /*this._users.push({
      name: 'Test Human',
      email: 'test@example.com',
      password: 'test'
    }).then( newBill => { console.log(newBill); }, error => { console.log(error); });*/

  }
  get user() {
    return this._user;
  }
  handleData(snap) {
    try { // Tell our observer we have new data
       this._users$.next(snap.val());
    } catch (error) {
      console.log('catching', error);
    }
  }
  save(user)
  {
    return this._usersRef.push(user).key;
  }

  loginWithGoogle() {
    return this.afAuth.auth.signInWithPopup(new firebase.auth.GoogleAuthProvider()); //returns promise
  }

  loginWithFacebook() {
    return this.afAuth.auth.signInWithPopup(new firebase.auth.FacebookAuthProvider()); //returns promise
  }
  facebookLogin(){
    let current = this;
    this.facebook.login(['email']).then( (response) => {
      const facebookCredential = firebase.auth.FacebookAuthProvider
        .credential(response.authResponse.accessToken);

      let result = '';
      firebase.auth().signInWithCredential(facebookCredential)
        .then((success) => {
          result = JSON.stringify(success);

        })
        .catch((error) => {
          result = JSON.stringify(error);

        });
      current._user = result;
      current._showToast('bottom', result, 5000);
    }).catch((error) => {
      current._showToast('bottom', JSON.stringify(error), 5000);
    });
  }
  _showToast(position: string, message: string, duration: any) {
    let toast = this.toastCtrl.create({
      message: message,
      duration: duration,
      position: position
    });

    toast.present(toast);
  }
  signOut() {
    return this.afAuth.auth.signOut();
  }
  /**
   * Send a POST request to our login endpoint with the data
   * the user entered on the form.
   */
  login(accountInfo: any) {
    let seq = this.api.post('login', accountInfo).share();

    seq
      .map(res => res.json())
      .subscribe(res => {
        // If the API returned a successful response, mark the user as logged in
        if (res.status == 'success') {
          this._loggedIn(res);
        } else {
        }
      }, err => {
        console.error('ERROR', err);
      });

    return seq;
  }

  /**
   * Send a POST request to our signup endpoint with the data
   * the user entered on the form.
   */
  signup(accountInfo: any) {
    let seq = this.api.post('signup', accountInfo).share();

    seq
      .map(res => res.json())
      .subscribe(res => {
        // If the API returned a successful response, mark the user as logged in
        if (res.status == 'success') {
          this._loggedIn(res);
        }
      }, err => {
        console.error('ERROR', err);
      });

    return seq;
  }

  /**
   * Log the user out, which forgets the session
   */
  logout() {
    this._user = null;
  }

  /**
   * Process a login/signup response to store user data
   */
  _loggedIn(resp) {
    this._user = resp.user;
  }
}
