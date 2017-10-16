import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams ,LoadingController ,AlertController} from 'ionic-angular';
import { RemoteServiceProvider } from './../../providers/remote-service/remote-service';
import * as $ from "jquery"

const Tagedusers= []
@Component({
  selector: 'page-post-featurs',
  templateUrl: 'post-featurs.html',
})
export class PostFeatursPage {
  post ={ 'text' : "" ,
            'feeling' : ''}
  bgshow = true
  tagedUsers
  searchedUsers
  chosenUsers
  listeningShow=true
   userId = localStorage.getItem('userDataID').replace(/[^0-9]/g, "");
  userAvatar = localStorage.getItem('userAvatar').slice(8,-1);
  users
  constructor(public navCtrl: NavController,public navParams: NavParams ,public alert:AlertController,public loadingCtrl: LoadingController, public remoteService : RemoteServiceProvider) {

  }
  selectPrivacy()
  {
    $(document).on('click','li',function(){
      if($(this).text() == ' Public')
      {
        $('.privacy').attr('id','1')
        $('#privacy').removeClass('fa fa-group');
        $('#privacy').removeClass('fa fa-lock');
        $('#privacy').addClass('fa fa-globe');

      }else if ($(this).text() == ' Friends only')
      {
        $('.privacy').attr('id','2')
        $('#privacy').removeClass('fa fa-globe');
        $('#privacy').removeClass('fa fa-lock');
        $('#privacy').addClass('fa fa-group');
      }
      else{
        $('.privacy').attr('id','3')
        $('#privacy').removeClass('fa fa-globe');
        $('#privacy').removeClass('fa fa-group');
        $('#privacy').addClass('fa fa-lock');

      }

     })
  }
  postFeed(userID=this.userId,postText=this.post)
  {
    let privacy= $('.privacy').attr('id')
    let id=$('.postBody').attr('id')


    let loading = this.loadingCtrl.create({
      content: "Posting",
    });
    loading.present()

      // let id=$('.postBody').attr('id')

      // this.remoteService.feedPosting(userID,postText.text,'none','text',privacy,id).subscribe( res => {
      //   // this.feeds.unshift(res.feed)
      //    this.post.text= ""
      //    //this.getFeedsList(this.userId);
      //    loading.dismiss();
      //  });
      //  this.navCtrl.pop()
      if($('.feeling-div').attr('id') && this.post.text == "") {
      let selectedFeeling=$('.feeling-div').attr('id')
        this.remoteService.feedPosting(userID,postText.feeling,selectedFeeling,'feeling',privacy,id).subscribe( res => {
          // this.feeds.unshift(res.feed)
           this.post.text= ""
           //this.getFeedsList(this.userId);
           loading.dismiss();
         });
         this.navCtrl.pop()
       }else if($('.feeling-div').attr('id') && this.post.text != "")
       {
        let selectedFeeling=$('.feeling-div').attr('id')

        this.remoteService.feedPosting(userID,postText,selectedFeeling,'feeling&text',privacy,id).subscribe( res => {
          // this.feeds.unshift(res.feed)
           this.post.text= ""
           //this.getFeedsList(this.userId);
           loading.dismiss();
         });
         this.navCtrl.pop()

       }else if(Tagedusers.length > 0)
       {
        this.remoteService.feedPosting(userID,postText.text,'none','text',privacy,id,Tagedusers).subscribe( res => {

          // this.feeds.unshift(res.feed)
           this.post.text= ""
           //this.getFeedsList(this.userId);
           if(res.status == 1)  Tagedusers.splice(0,Tagedusers.length)


           console.log(Tagedusers)
           loading.dismiss();
         });
         this.navCtrl.pop()
       }
       else{
      this.remoteService.feedPosting(userID,postText.text,'none','text',privacy,id).subscribe( res => {
        // this.feeds.unshift(res.feed)
         this.post.text= ""
         //this.getFeedsList(this.userId);
         loading.dismiss();
       });
       this.navCtrl.pop()
    }

  }
  locationPopUp()
  {
      let locationAlert = this.alert.create(
        {
          title : 'location',
          message: "where are you now ?",
          inputs : [{
            name:'location',
            placeholder : 'your location !'
          }],
          buttons : [
            {
              text: 'post',
              handler: data => {
                // if (User.isValid(data.username, data.password)) {
                //   // logged in!
                // } else {
                //   // invalid login
                //   return false;
                // }
                this.remoteService.locationPosting(this.userId,data.location).subscribe(res =>
                {
                    console.log(res)

                })
              }

            }
          ]
        }
      )
     locationAlert.present()
  }
  backgroundShow()
  {
    this.bgshow =!this.bgshow
  }
  ionViewDidLoad() {
    console.log('ionViewDidLoad PostFeatursPage');
  }
  getColor()
  {
    $(document).on('click','li',function(){
      $('.postBody').attr('id',this.id)
      $('.p-0').attr('id',this.id)

    });

  }
  feelingsShow()
  {
				$('.dropdown-feeling').toggleClass('open');
  }
  selectFeeling()
  {
    $(document).on('click','.dropdown-menu li a',function(){
    $('.feeling-div').attr('id',$(this).text())
    $(".feeling-div").show()
    $('.feelingText').text($(this).text())
  })

  }

  tagUsersDivShow()
  {
    $('.tag-div').toggle();

  }

  getFriendsListToTag(term)
  {
    if(term != ""){
      this.remoteService.friendsListApiCall(this.userId,this.userId,term).subscribe(res =>{
         this.searchedUsers = res
          });
    }
  }
  selectUserToTag()
  {
    var users = []

      $(document).one('click','.tagslist li',function(e){
        e.preventDefault();
       let userName = $(this).find('a').text()
       let userID = $(this).find('p').text()
       let userImage = $(this).find('img').attr('src')
     users

      Tagedusers.push(userID)
        $('.selectedUsersInTag').find("ul[class='chosenElments']").append('<li class="btn btn-theme btn-xs created-tag" style="margin:3px;">'+userName+'<p hidden>'+userID+'</p> <i class="fa fa-close"></i></li>')

      })
      $(document).on('click','.created-tag>i', function(){
        let userid = $(this).parent().find('p').text()
        let index = Tagedusers.findIndex(item => item.id == userid)
        Tagedusers.splice(index,1)
        $(this).parent().remove()

        console.log(index)
      })
      console.log(Tagedusers)
  
    }
back()
{
  this.navCtrl.pop()
}
  }
