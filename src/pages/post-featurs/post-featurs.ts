import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams ,LoadingController ,AlertController} from 'ionic-angular';
import { RemoteServiceProvider } from './../../providers/remote-service/remote-service';
import * as $ from "jquery"
/**
 * Generated class for the PostFeatursPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-post-featurs',
  templateUrl: 'post-featurs.html',
})
export class PostFeatursPage {
  post ={ 'text' : ""}
  bgshow = true
  listeningShow=true
  public userId = localStorage.getItem('userDataID').replace(/[^0-9]/g, "");
  userAvatar = localStorage.getItem('userAvatar').slice(8,-1);
  
  constructor(public navCtrl: NavController,public navParams: NavParams ,public alert:AlertController,public loadingCtrl: LoadingController, public remoteService : RemoteServiceProvider) {
  
  }
  postFeed(userID=this.userId,postText=this.post.text)
  {
    
    let loading = this.loadingCtrl.create({
      content: "Posting",
    });        
    loading.present()
    if($('.postBody').attr('id'))
    {
      let id=$('.postBody').attr('id')
      this.remoteService.feedPosting(userID,postText,id).subscribe( res => { 
        // this.feeds.unshift(res.feed)
         this.post.text= ""
         //this.getFeedsList(this.userId);
         loading.dismiss();
       });
       this.navCtrl.pop()
    }else{
      this.remoteService.feedPosting(userID,postText).subscribe( res => { 
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
    $("li").click(function() {
      //var myid = $(this).attr("id");
      console.log(this.id)
      $('.postBody').attr('id',this.id)
      $('.p-0').attr('id',this.id)
      
    });  
  }
  feelingsShow()
  {
    this.listeningShow =!this.listeningShow
    
  }
  
}
