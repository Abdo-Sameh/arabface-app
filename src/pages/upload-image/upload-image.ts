import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Loading, ToastController, LoadingController } from 'ionic-angular';
import { FileTransfer, FileUploadOptions, FileTransferObject } from '@ionic-native/file-transfer';
import { File } from '@ionic-native/file';
import { TranslateService } from '@ngx-translate/core';
/**
 * Generated class for the UploadImagePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */
declare var cordova: any;
@Component({
  selector: 'page-upload-image',
  templateUrl: 'upload-image.html',
})
export class UploadImagePage {
  lastImage: string = null;
  userId
  loading: Loading;
  type
  id
  constructor(public translate: TranslateService, public loadingCtrl: LoadingController, public toast: ToastController, private transfer: FileTransfer, private file: File, public navCtrl: NavController, public navParams: NavParams) {
    this.userId = localStorage.getItem('userDataID').replace(/[^0-9]/g, "");
    this.type = navParams.get("type");
    this.lastImage = navParams.get("image");
    this.id = navParams.get("id");

  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad UploadImagePage');
  }

  public pathForImage(img) {
    if (img === null) {
      return '';
    } else {
      return cordova.file.dataDirectory + img;
    }
  }

  presentToast(msg) {
    let toast = this.toast.create({
      message: msg,
      duration: 3000,
      position: 'bottom'
    });

    toast.onDidDismiss(() => {
      console.log('Dismissed toast');
    });

    toast.present();
  }

  public uploadImage() {

    let uploading, message;
    this.translate.get('uploading').subscribe(value => { uploading = value; })
    this.translate.get('successfully-uploaded').subscribe(value => { message = value; })


      var filename = this.lastImage;
      // File for Upload
      var targetPath = this.pathForImage(this.lastImage);
    // Destination URL
    var url, options;
    if(this.type == "album"){
      url = "http://192.168.1.252/arabface/api/14789632/photo/album/upload";
      options = {
        fileKey: "photo",
        fileName: filename,
        chunkedMode: false,
        mimeType: "multipart/form-data",
        params : {'album_id': this.id, 'photo': filename, 'userid' : this.userId}
      };
    }else if(this.type == "profile.avatar") {
      url = "http://192.168.1.252/arabface/api/14789632/profile/change/avatar";
      options = {
        fileKey: "avatar",
        fileName: filename,
        chunkedMode: false,
        mimeType: "multipart/form-data",
        params : {'avatar': filename, 'userid' : this.userId}
      };
    }else if(this.type == "profile.cover"){
      url = "http://192.168.1.252/arabface/api/14789632/profile/change/cover";
      options = {
        fileKey: "cover",
        fileName: filename,
        chunkedMode: false,
        mimeType: "multipart/form-data",
        params : {'cover': filename, 'userid' : this.userId}
      };
    }else if(this.type == "page.logo"){
      url = "http://192.168.1.252/arabface/api/14789632/page/logo";
      options = {
        fileKey: "image",
        fileName: filename,
        chunkedMode: false,
        mimeType: "multipart/form-data",
        params : {'image': filename, 'userid' : this.userId, 'page_id' : this.id}
      };
    }else if(this.type == "page.cover"){
      url = "http://192.168.1.252/arabface/api/14789632/page/cover";
      options = {
        fileKey: "image",
        fileName: filename,
        chunkedMode: false,
        mimeType: "multipart/form-data",
        params : {'image': filename, 'userid' : this.userId, 'page_id': this.id}
      };
    }else if(this.type == "group.logo"){
      url = "http://192.168.1.252/arabface/api/14789632/group/logo";
      options = {
        fileKey: "image",
        fileName: filename,
        chunkedMode: false,
        mimeType: "multipart/form-data",
        params : {'image': filename, 'userid' : this.userId, 'group_id' : this.id}
      };
    }else if(this.type == "group.cover"){
      url = "http://192.168.1.252/arabface/api/14789632/group/cover";
      options = {
        fileKey: "image",
        fileName: filename,
        chunkedMode: false,
        mimeType: "multipart/form-data",
        params : {'image': filename, 'userid' : this.userId, 'group_id': this.id}
      };
    }else if(this.type == "event.cover"){
      url = "http://192.168.1.252/arabface/api/14789632/event/cover";
      options = {
        fileKey: "image",
        fileName: filename,
        chunkedMode: false,
        mimeType: "multipart/form-data",
        params : {'image': filename, 'userid' : this.userId, 'event_id': this.id}
      };
    }

    const fileTransfer: FileTransferObject = this.transfer.create();

    this.loading = this.loadingCtrl.create({
      content: uploading,
    });
    this.loading.present();

    // Use the FileTransfer to upload the image
    fileTransfer.upload(targetPath, url, options, true).then(data => {
      this.loading.dismissAll()
      // alert(data.response['data_one']);
      // alert(data.bytesSent);
      // alert(data.headers);
      // alert(targetPath);
      // alert(url);
       if(this.type == "profile.avatar") {
        localStorage.setItem('userAvatar', JSON.stringify(data.response['data_one']))
      }else if(this.type == "profile.cover"){
          localStorage.setItem('userCover', JSON.stringify(data.response['data_one']))
    }
      this.presentToast(message);
    }, err => {
      this.loading.dismissAll()
      // alert(err.code);
      // alert(err.source);
      // alert(err.target);
      // alert(err.http_status);
      // alert(err.body);
      // alert(err.exception);

      this.presentToast('Error while uploading file.');
    });

    this.navCtrl.pop();
  }

}
