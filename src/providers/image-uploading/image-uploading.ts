import { Injectable } from '@angular/core';
import { IonicPage, App, NavParams, ActionSheetController, Platform, ToastController, Loading, AlertController, LoadingController } from 'ionic-angular';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';
import { FileTransfer, FileUploadOptions, FileTransferObject } from '@ionic-native/file-transfer';
import { File } from '@ionic-native/file';
import { FilePath } from '@ionic-native/file-path';
import { Camera, CameraOptions } from '@ionic-native/camera';
import { UploadImagePage } from '../../pages/upload-image/upload-image';
import { TranslateService } from '@ngx-translate/core';
/*
  Generated class for the ImageUploadingProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
declare var cordova: any;
@Injectable()
export class ImageUploadingProvider {
  lastImage: string = null;
  loading: Loading;

  constructor(public loadingCtrl: LoadingController, private transfer: FileTransfer, public translate: TranslateService, public file: File, public toast: ToastController, public http: Http, public actionSheetCtrl: ActionSheetController, public camera: Camera, public platform: Platform, public filePath: FilePath) {
    console.log('Hello ImageUploadingProvider Provider');
  }
  public presentActionSheet(type) {
    let actionSheet = this.actionSheetCtrl.create({
      // title: 'Select Image Source',
      buttons: [
        {
          text: 'Library',
          handler: () => {
            return this.takePicture(this.camera.PictureSourceType.PHOTOLIBRARY, type);

          }
        },
        {
          text: 'Camera',
          handler: () => {
            return this.takePicture(this.camera.PictureSourceType.CAMERA, type);

          }
        }
      ]
    });
    actionSheet.present();
  }

  public takePicture(sourceType, type) {
    // Create options for the Camera Dialog
    var options = {
      quality: 100,
      sourceType: sourceType,
      saveToPhotoAlbum: false,
      correctOrientation: true
    };

    // Get the data of an image
    this.camera.getPicture(options).then((imagePath) => {
      // Special handling for Android library
      if (this.platform.is('android') && sourceType === this.camera.PictureSourceType.PHOTOLIBRARY) {
        this.filePath.resolveNativePath(imagePath)
          .then(filePath => {
            let correctPath = filePath.substr(0, filePath.lastIndexOf('/') + 1);
            let currentName = imagePath.substring(imagePath.lastIndexOf('/') + 1, imagePath.lastIndexOf('?'));
            return this.copyFileToLocalDir(correctPath, currentName, this.createFileName(), type);

          });
      } else {
        var currentName = imagePath.substr(imagePath.lastIndexOf('/') + 1);
        var correctPath = imagePath.substr(0, imagePath.lastIndexOf('/') + 1);
        return this.copyFileToLocalDir(correctPath, currentName, this.createFileName(), type);

      }
    }, (err) => {
      this.presentToast('Error while selecting image.');
    });
  }

  private createFileName() {
    var d = new Date(),
      n = d.getTime(),
      newFileName = n + ".jpg";
    return newFileName;
  }

  private copyFileToLocalDir(namePath, currentName, newFileName, type) {
    this.file.copyFile(namePath, currentName, cordova.file.dataDirectory, newFileName).then(success => {
      this.lastImage = newFileName;
      return this.lastImage;
    }, error => {
      this.presentToast('Error while storing file.');
    });
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

  public pathForImage(img) {
    if (img === null) {
      return '';
    } else {
      return cordova.file.dataDirectory + img;
    }
  }

  public uploadImage(type, userId, id) {

    let uploading, message;
    this.translate.get('uploading').subscribe(value => { uploading = value; })
    this.translate.get('successfully-uploaded').subscribe(value => { message = value; })

    var filename = this.lastImage;
    // File for Upload
    var targetPath = this.pathForImage(this.lastImage);
    // Destination URL
    var url, options;
    if (type == "album") {
      url = "http://192.168.1.252/arabface/api/14789632/photo/album/upload";
      options = {
        fileKey: "photo",
        fileName: filename,
        chunkedMode: false,
        mimeType: "multipart/form-data",
        params: { 'album_id': id, 'photo': filename, 'userid': userId }
      };
    } else if (type == "profile.avatar") {
      url = "http://192.168.1.252/arabface/api/14789632/profile/change/avatar";
      options = {
        fileKey: "avatar",
        fileName: filename,
        chunkedMode: false,
        mimeType: "multipart/form-data",
        params: { 'avatar': filename, 'userid': userId }
      };
    } else if (type == "profile.cover") {
      url = "http://192.168.1.252/arabface/api/14789632/profile/change/cover";
      options = {
        fileKey: "cover",
        fileName: filename,
        chunkedMode: false,
        mimeType: "multipart/form-data",
        params: { 'cover': filename, 'userid': userId }
      };
    } else if (type == "page.logo") {
      url = "http://192.168.1.252/arabface/api/14789632/page/logo";
      options = {
        fileKey: "image",
        fileName: filename,
        chunkedMode: false,
        mimeType: "multipart/form-data",
        params: { 'image': filename, 'userid': userId, 'page_id': id }
      };
    } else if (type == "page.cover") {
      url = "http://192.168.1.252/arabface/api/14789632/page/cover";
      options = {
        fileKey: "image",
        fileName: filename,
        chunkedMode: false,
        mimeType: "multipart/form-data",
        params: { 'image': filename, 'userid': userId, 'page_id': id }
      };
    } else if (type == "group.logo") {
      url = "http://192.168.1.252/arabface/api/14789632/group/logo";
      options = {
        fileKey: "image",
        fileName: filename,
        chunkedMode: false,
        mimeType: "multipart/form-data",
        params: { 'image': filename, 'userid': userId, 'group_id': id }
      };
    } else if (type == "group.cover") {
      url = "http://192.168.1.252/arabface/api/14789632/group/cover";
      options = {
        fileKey: "image",
        fileName: filename,
        chunkedMode: false,
        mimeType: "multipart/form-data",
        params: { 'image': filename, 'userid': userId, 'group_id': id }
      };
    } else if (type == "event.cover") {
      url = "http://192.168.1.252/arabface/api/14789632/event/cover";
      options = {
        fileKey: "image",
        fileName: filename,
        chunkedMode: false,
        mimeType: "multipart/form-data",
        params: { 'image': filename, 'userid': userId, 'event_id': id }
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
      if (type == "profile.avatar") {
        localStorage.setItem('userAvatar', JSON.stringify(data.response['data_one']))
      } else if (type == "profile.cover") {
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

  }

}
