import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, AlertController } from 'ionic-angular';
import { RemoteServiceProvider } from './../../providers/remote-service/remote-service';
import { ImageUploadingProvider } from './../../providers/image-uploading/image-uploading';
import { TranslateService } from '@ngx-translate/core';
import * as $ from "jquery"

const Tagedusers = []
@Component({
  selector: 'page-post-featurs',
  templateUrl: 'post-featurs.html',
})
export class PostFeatursPage {
  post = {
    'text': "",
    'feeling': ''
  }
  bgshow = true
  tagedUsers
  searchedUsers = []
  chosenUsers
  listeningShow = true
  userId = localStorage.getItem('userDataID').replace(/[^0-9]/g, "");
  userAvatar = localStorage.getItem('userAvatar').slice(8, -1);
  users
  type
  typeId
  callback
  to_user_id
  imagePath
  constructor(public imageUploading: ImageUploadingProvider, public translate: TranslateService, public navCtrl: NavController, public navParams: NavParams, public alert: AlertController, public loadingCtrl: LoadingController, public remoteService: RemoteServiceProvider) {
    this.type = navParams.get('type');
    this.typeId = navParams.get('type_id');
    this.to_user_id = navParams.get('to_user_id');
    console.log(this.type, this.typeId);
  }

  ionViewWillEnter() {
    this.callback = this.navParams.get("callback")
  }

  selectPrivacy() {
    $(document).on('click', 'li', function() {
      if ($(this).text() == ' Public') {
        $('.privacy').attr('id', '1')
        $('#privacy').removeClass('fa fa-group');
        $('#privacy').removeClass('fa fa-lock');
        $('#privacy').addClass('fa fa-globe');

      } else if ($(this).text() == ' Friends only') {
        $('.privacy').attr('id', '2')
        $('#privacy').removeClass('fa fa-globe');
        $('#privacy').removeClass('fa fa-lock');
        $('#privacy').addClass('fa fa-group');
      }
      else {
        $('.privacy').attr('id', '3')
        $('#privacy').removeClass('fa fa-globe');
        $('#privacy').removeClass('fa fa-group');
        $('#privacy').addClass('fa fa-lock');
      }
    })
  }

  check(text) {
    if (text.length == 0 && !$('.feeling-div').attr('id'))
      return true;
    else if (this.post.feeling == "" && $('.feeling-div').attr('id'))
      return true;
    else
      return null;
  }

  postFeed(userID = this.userId, postText = this.post) {

    let privacy = $('.privacy').attr('id')
    let id = $('.postBody').attr('id')

    let loading = this.loadingCtrl.create({
      content: "Posting",
    });
    loading.present()
    //(userID,post,feeling='none',postType='text',privacy='1',background='default',tag :any='no', type, type_id, to_user_id="")
    if ($('.feeling-div').attr('id') && this.post.text == "") {
      let selectedFeeling = $('.feeling-div').attr('id')

      this.remoteService.feedPosting(userID, postText.feeling, selectedFeeling, 'feeling', privacy, id, 'no', this.type, this.typeId, this.to_user_id).subscribe(res => {
        // this.feeds.unshift(res.feed)
        this.post.text = ""
        //this.getFeedsList(this.userId);
        loading.dismiss();
        res.feed.hidden = false;
        this.callback(res.feed).then(() => {
          this.navCtrl.pop();
        });
      });

    } else if ($('.feeling-div').attr('id') && this.post.text != "") {
      let selectedFeeling = $('.feeling-div').attr('id')
      // $('.dropdown-feeling').toggleClass('open');
      this.remoteService.feedPosting(userID, postText, selectedFeeling, 'feeling&text', privacy, id, 'no', this.type, this.typeId, this.to_user_id).subscribe(res => {
        // this.feeds.unshift(res.feed)
        this.post.text = ""
        //this.getFeedsList(this.userId);
        res.feed.hidden = false;
        loading.dismiss();
        this.callback(res.feed).then(() => {
          this.navCtrl.pop();
        });
      });


    } else if (Tagedusers.length > 0) {
      this.remoteService.feedPosting(userID, postText.text, 'none', 'text', privacy, id, Tagedusers, this.type, this.typeId, this.to_user_id).subscribe(res => {

        // this.feeds.unshift(res.feed)
        this.post.text = ""
        //this.getFeedsList(this.userId);
        if (res.status == 1) Tagedusers.splice(0, Tagedusers.length)


        console.log(Tagedusers)
        loading.dismiss();
        res.feed.hidden = false;
        this.callback(res.feed).then(() => {
          this.navCtrl.pop();
        });
      });

    }
    else {
      console.log(userID, postText.text, 'none', 'text', privacy, id, 'no', this.type, this.typeId);
      this.remoteService.feedPosting(userID, postText.text, 'none', 'text', privacy, id, 'no', this.type, this.typeId, this.to_user_id).subscribe(res => {

        this.post.text = ""
        //this.getFeedsList(this.userId);
        console.log(res);
        loading.dismiss();
        res.feed.hidden = false;
        this.callback(res.feed).then(() => {
          this.navCtrl.pop();
        });
      });
    }
    // if(this.imagePath){
    //   this.imageUploading.uploadImage('feed', this.userId, id)
    // }

  }
  locationPopUp() {
    let title, yourLocation, post, cancel, message;
    this.translate.get('location').subscribe(value => { title = value; })
    this.translate.get('your-location').subscribe(value => { yourLocation = value; })
    this.translate.get('post').subscribe(value => { post = value; })
    this.translate.get('cancel').subscribe(value => { cancel = value; })
    this.translate.get('location-message').subscribe(value => { message = value; })
    let locationAlert = this.alert.create(
      {
        title: title,
        message: message,
        inputs: [{
          name: 'location',
          placeholder: yourLocation
        }],
        buttons: [
          {
            text: post,
            handler: data => {

              this.remoteService.locationPosting(this.userId, data.location).subscribe(res => {
                console.log(res)
                this.callback(res.feed).then(() => {
                  this.navCtrl.pop();
                });

              })
            }
          }
        ]
      }
    )
    locationAlert.present()
  }
  backgroundShow() {
    this.bgshow = !this.bgshow
  }
  ionViewDidLoad() {
    console.log('ionViewDidLoad PostFeatursPage');
  }
  getColor() {
    $(document).on('click', 'li', function() {
      $('.postBody').attr('id', this.id)
      $('.p-0').attr('id', this.id)

    });

  }
  feelingsShow() {
    $('.dropdown-feeling').toggleClass('open');
  }
  selectFeeling() {
    $(document).on('click', '.dropdown-menu li a', function() {
      $('.feeling-div').attr('id', $(this).text())
      $(".feeling-div").show()
      $('.feelingText').text($(this).text())

    })
    $('.dropdown-feeling').toggleClass('open');
  }

  tagUsersDivShow() {
    $('.tag-div').toggle();

  }

  getFriendsListToTag(term) {
    if (term != "") {
      this.remoteService.friendsListApiCall(this.userId, this.userId, term).subscribe(res => {
        this.searchedUsers = [];
        for(let i = 0; i < res.length; ++i){
          console.log(Tagedusers.indexOf(res[i].id));
          if(Tagedusers.indexOf(res[i].id) == -1){
            this.searchedUsers.push(res[i]);
          }
        }
        document.getElementById("myDropdown").classList.toggle("show");
        console.log(res);
      });
    }
  }
  selectUserToTag(userName, userID, userImage, index, searchedUsers) {
    var users = []
    this.tagedUsers = ''
    $(document).one('click', '.dropdown-content a', function(e) {
      e.preventDefault();
      // let userName = $(this).find('a').text()
      // let userID = $(this).find('p').text()
      // let userImage = $(this).find('img').attr('src')
      searchedUsers.splice(index, 1);
      console.log(userName, userID, userImage);
      Tagedusers.push(userID)
      $('.selectedUsersInTag').find("ul[class='chosenElments']").append('<li class="btn btn-theme btn-xs created-tag" style="margin:3px;">' + userName + '<p hidden>' + userID + '</p> <i class="fa fa-close"></i></li>')
      var dropdowns = document.getElementsByClassName("dropdown-content");
      var i;
      for (i = 0; i < dropdowns.length; i++) {
        var openDropdown = dropdowns[i];
        if (openDropdown.classList.contains('show')) {
          openDropdown.classList.remove('show');
        }
      }
    })
    $(document).on('click', '.created-tag>i', function() {
      let userid = $(this).parent().find('p').text()
      let index = Tagedusers.findIndex(item => item.id == userid)

      searchedUsers.splice(index, 0, {
        name: userName,
        id: userID,
        avatar: userImage
      });
      Tagedusers.splice(index, 1);
      $(this).parent().remove()

      console.log(index)
    })
    console.log(Tagedusers)

  }
  back() {
    this.navCtrl.pop()
  }
}
