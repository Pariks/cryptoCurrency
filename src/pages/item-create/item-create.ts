import { Component, ViewChild } from '@angular/core';
import { Validators, FormBuilder, FormGroup } from '@angular/forms';
import { NavController, ViewController } from 'ionic-angular';

import { Camera } from '@ionic-native/camera';
import {Transfer, TransferObject, FileUploadOptions} from "@ionic-native/transfer";
import {FileChooser} from "@ionic-native/file-chooser";


@Component({
  selector: 'page-item-create',
  templateUrl: 'item-create.html'
})
export class ItemCreatePage {
  @ViewChild('fileInput') fileInput;

  isReadyToSave: boolean;

  item: any;

  form: FormGroup;
  myForm: FormGroup;
  private myData: any;

  constructor(public navCtrl: NavController,
              public viewCtrl: ViewController,
              public formBuilder: FormBuilder,
              public camera: Camera,
              private transfer: Transfer,
              private fileChooser: FileChooser) {

    this.form = formBuilder.group({
      profilePic: [''],
      name: ['', Validators.required],
      about: ['']
    });

    this.myForm = formBuilder.group({
      'upresume_one': ['', Validators.required]
    });
    // Watch the form for changes, and
    this.form.valueChanges.subscribe((v) => {
      this.isReadyToSave = this.form.valid;
    });
  }
  save(formData) {
    console.log('Form data is ', formData);
  }
  ionViewDidLoad() {

  }

  getPicture() {
    if (Camera['installed']()) {
      this.camera.getPicture({
        destinationType: this.camera.DestinationType.DATA_URL,
        targetWidth: 96,
        targetHeight: 96
      }).then((data) => {
        this.form.patchValue({ 'profilePic': 'data:image/jpg;base64,' + data });
      }, (err) => {
        alert('Unable to take photo');
      })
    } else {
      this.fileInput.nativeElement.click();
    }
  }

  processWebImage(event) {
    let reader = new FileReader();
    reader.onload = (readerEvent) => {

      let imageData = (readerEvent.target as any).result; console.log(imageData);
      this.form.patchValue({ 'profilePic': imageData });
    };


    reader.readAsDataURL(event.target.files[0]);
  }

  getProfileImageStyle() {
    return 'url(' + this.form.controls['profilePic'].value + ')'
  }

  /**
   * The user cancelled, so we dismiss without sending data back.
   */
  cancel() {
    this.viewCtrl.dismiss();
  }

  /**
   * The user is done and wants to create the item, so return it
   * back to the presenter.
   */
  done() {
    if (!this.form.valid) { return; }
    console.log(this.form.value);
    this.viewCtrl.dismiss(this.form.value);
  }

  uploadresume()
  {
    this.fileChooser.open()
      .then(uri =>
      {
        const fileTransfer: TransferObject = this.transfer.create();

        // regarding detailed description of this you cn just refere ionic 2 transfer plugin in official website
        let options1: FileUploadOptions = {
          fileKey: 'file',
          fileName: 'test.png',
          headers: {},
          params: {'filename' : uri},
          chunkedMode: false
        };

        fileTransfer.upload(uri, 'http://santasecret.ca/api/data', options1)
          .then((data) => {
            // success
            alert("success"+JSON.stringify(data));
          }, (err) => {
            // error
            alert("error"+JSON.stringify(err));
          });

      })
      .catch(e => console.log(e));
  }



}
