import { PhotoselectionPage } from './../photoselection/photoselection';
import { RemoteServiceProvider } from './../../providers/remote-service/remote-service';
import { Component } from '@angular/core';
import { NavController, NavParams , LoadingController} from 'ionic-angular';
// import { PhotoLibrary } from '@ionic-native/photo-library';
import {FormControl , FormGroup , Validators } from '@angular/forms'
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
// import { ImagePicker } from '@ionic-native/image-picker';
let self ;
let firebase,photos ;
let photourl = [] ;
import { Events } from 'ionic-angular';
declare var navigator ;
declare var camera ;
/**
 * Generated class for the CreataccountPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */

@Component({
  selector: 'page-signup',
  templateUrl: 'signup.html',
  styleUrls : ['../../assets/main.css','../../assets/ionicons.min.css']
})
export class SignupPage {
name ; mail ; password; confirm ;
pimg = true ; profileimg ; picon = false ;
  constructor(public loadingCtrl: LoadingController , public events: Events , public ds: DomSanitizer,public database:RemoteServiceProvider,public navCtrl: NavController, public navParams: NavParams) {
   events.subscribe('choosed', (photo) => {
   console.log(photo.changingThisBreaksApplicationSecurity) ;
   this.profileimg = photo ;
   this.picon = true ;
   this.pimg = false ;
  });
  firebase = this.database ;
  self = this.ds ;
  // photos = this.photoLibrary ;
}

  userForm = new FormGroup ({

      firstname : new FormControl (null , Validators.required),
      lastname : new FormControl (null , Validators.required),
       username : new FormControl (null , Validators.required) ,
      email_address : new FormControl (null , [Validators.required , Validators.email]) ,

      password : new FormControl (null , [Validators.required]) ,
      confirm : new FormControl (null , [Validators.required ])

  });
checkpassword (password) {

if (password == null && this.userForm.value.confirm == null) {
  return false ;
}
if (password == "" && this.userForm.value.confirm == "") {
  return false ;
}
  if (password == this.userForm.value.password) {

    return true ;

  }else {

    return false ;
  }
}
checkpassword2 (password) {

if (password == null || this.userForm.value.confirm == null) {
  return true ;
}
else if (password == "" || this.userForm.value.confirm == "") {
  return true ;
}
else if (password == this.userForm.value.password) {
    return true ;

  }else  {

    return false ;
  }
}
validateEmail(email) {
  if(email==null){return true ; }
    var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    console.log(re.test(email))
    return re.test(email);
}

  ionViewDidLoad() {
    console.log('ionViewDidLoad CreataccountPage');
  }
  creat() {
console.log("entered")
if(this.profileimg) {
  console.log("there is a photo")
  console.log(this.profileimg.changingThisBreaksApplicationSecurity)
  firebase.creat2(this.userForm.value.email,this.userForm.value.password,this.userForm.value.username,this.profileimg,this.userForm.value.firstname,this.userForm.value.lastname) ;

}else {
  firebase.creat1(this.userForm.value.email,this.userForm.value.password,this.userForm.value.username,this.userForm.value) ;

}
   }
  select_photo () {
//     this.imagePicker.getPictures({maximumImagesCount : 1}).then((results) => {
//   for (var i = 0; i < results.length; i++) {
//       console.log('Image URI: ' + results[i]);
//       this.profileimg = results[i] ;
//        this.picon = true ;
//    this.pimg = false ;
//   }
// }, (err) => { });
//      photos.requestAuthorization().then(() => {
// navigator.camera.getPicture(function (img) {
//   console.log(img);
//   }, (error)=>{

// console.log(error) ;
// });
//      })


// let loading = this.loadingCtrl.create({
//   spinner: 'hide',
//     content: 'Getting Photos ...'
//   });
//    loading.present();
//     photos.requestAuthorization().then(() => {
//   this.photoLibrary.getLibrary().subscribe({
//     next: library => {
//       var i = 1 ;
//       library.forEach(function(libraryItem) {
//              let url: SafeUrl = self.bypassSecurityTrustUrl(libraryItem.thumbnailURL);
//         photourl.push(<string>url);
//         // Cross-platform access to photo
//         // Cross-platform access to thumbnail

//            // array of ids of appropriate AlbumItem, only of includeAlbumsData was used
//       });
//       console.log(library[0].photoURL)
//        loading.dismiss();
//       this.navCtrl.push(PhotoselectionPage , {photourl})
//     },
//     error: err => {},
//     complete: () => { console.log('could not get photos'); }
//   });
// })
// .catch(err => console.log('permissions weren\'t granted'));
  }

}
