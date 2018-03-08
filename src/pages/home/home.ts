import { Component } from '@angular/core';
import { NavController, LoadingController } from 'ionic-angular';
import { Camera, CameraOptions } from '@ionic-native/camera';
import { Globalization } from '@ionic-native/globalization';
import { AlertController } from 'ionic-angular';
import { GoogleVisionProvider } from '../../providers/google-vision/google-vision';
import { HttpClient,HttpHeaders,HttpParams } from '@angular/common/http';
@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})

export class HomePage {
  postList:any;
  placeimg:any="assets/imgs/landing.jpg";
  placename:any="Aonach Mòr";
  placequery:any="eiffel_tower";
  placelocation:any="Mountain in Scotland";
  placedes:any="Aonach Mòr is a mountain in the Highlands of Scotland. It is located about 2 miles/ 3 km north east of Ben Nevis on the south side of Glen Spean, near the town of Fort William . The Nevis Range ski area is located on the northern slopes of the peak; the use of this name has inspired some controversy, as it has been considered by some to represent a deliberate changing of an indigenous name.";
  deviceLang:any="zh-CN";
  options:CameraOptions;
  loading:any;
  places:any;
  namesList:any[];
  contentURL:any;
  apiUrl = 'https://jsonplaceholder.typicode.com';
  transUrl = "https://translation.googleapis.com/language/translate/v2?key=AIzaSyDpR0rhSKe_CiRrzzAFyC0KWIcfUfuV4WE";

  constructor(private alert: AlertController,private vision: GoogleVisionProvider,public http: HttpClient, private globalization: Globalization, public loadingCtrl: LoadingController, public navCtrl: NavController, public camera:Camera) {
    var self=this;
    self.options= {
      quality: 100,
      destinationType: this.camera.DestinationType.DATA_URL,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE
    }

    this.globalization.getPreferredLanguage()
    .then(res => self.deviceLang=res.value)
    .catch(e => console.log(e));
    // self.getWikiPlace();
  }
  ionViewWillEnter(){
    this.translateText();
    this.presentLoadingCustom();
    this.loading.present(); 
  }
  ionViewDidLoad(){
    var self=this;
    setTimeout(() => {
      // self.nearby();   
      self.loading.dismiss();
    }, 3000);
  }
  // nearby(){
  //   var self=this;
  //   // 
    
  //   return new Promise(resolve => {  
  //       self.http.get("https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=37.592149,-97.045433&radius=3000&key=AIzaSyDpR0rhSKe_CiRrzzAFyC0KWIcfUfuV4WE").subscribe(data => {
  //         self.showAlert("saf");
  //         self.namesList=(<any>data).results;
  //         self.showAlert((<any>data).results[0].name);
  //     });
  //   });
  // }
  textToSpeech(){
    // https://translate.google.com.vn/translate_tts?ie=UTF-8&q=%E4%BD%A0%E5%A5%BD&tl=zh-CN&client=tw-ob
    var self=this;
    // 
    
    return new Promise(resolve => {  
        self.http.get("https://translate.google.com.vn/translate_tts?ie=UTF-8&q=Hello&tl=" + self.deviceLang + "&client=tw-ob").subscribe(data => {
          self.showAlert("saf");
          self.namesList=(<any>data).results;
          self.showAlert((<any>data).results[0].name);
      });
    });
  }
  queryP(){
    var self=this;
        
    var datachoosen=self.places.trim();     
    self.placequery=datachoosen.split(' ').join('_');
    self.getWikiPlace();
  }
  presentLoadingCustom() {
    var self=this;
    self.loading = this.loadingCtrl.create({
      // cssClass: 'transparent',
      // spinner: 'hide',
      // content: '<img style="width:auto height:auto;" src="assets/imgs/icon.png"/>'
      content:''
    });
  
    self.loading.present(); 
  }
  showAlert(message) {
    let alert = this.alert.create({
      title: 'Alert',
      subTitle: message,
      buttons: ['OK']
    });
    alert.present();
  }
  translateText(){
    var self=this;
    // console.log(JSON.stringify("here"));
    return new Promise((resolve, reject) => {
      
      // this.http.post(this.apiUrl+'/users', JSON.stringify(data))
      //   .subscribe(res => {
      //     resolve(res);
      //   }, (err) => {
      //     reject(err);
      //   });
       var data={
        "q": [
         self.placedes,
         self.placename,
         self.placelocation
        ],
        "format": "text",
        "target": self.deviceLang
       };
        this.http.post(self.transUrl, data)
        .subscribe(res => {
          console.log(JSON.stringify((<any>res).data.translations[1].translatedText));
          self.placename=(<any>res).data.translations[1].translatedText;
          console.log(JSON.stringify((<any>res).data.translations[0].translatedText));
          self.placedes=(<any>res).data.translations[0].translatedText;
          self.placelocation=(<any>res).data.translations[2].translatedText;
          // resolve(JSON.stringify(res));
          setTimeout(() => {
            self.loading.dismiss();
          }, 1000);
          
        }, (err) => {
          console.log(JSON.stringify(err));
          setTimeout(() => {
            self.loading.dismiss();
          }, 1000); 
          
          // reject(JSON.stringify(err));
        });
    });
  }
  getWikiPlace(){
    console.log("wiki");
    var self=this;

    return new Promise(resolve => {  
      
        this.http.get("https://en.wikipedia.org/api/rest_v1/page/summary/"+self.placequery).subscribe(data => {
          // self.postList=data;
          
          console.log((<any>data).originalimage.source);
          self.placeimg=(<any>data).originalimage.source;
          self.placename=(<any>data).displaytitle;
          self.placelocation=(<any>data).description;
          self.placedes=(<any>data).extract;
          self.contentURL=(<any>data).content_urls.mobile.page;

          setTimeout(() => {
            self.loading.dismiss();
          }, 1000);
          self.translateText();
        }, err => {
          console.log(err);
          setTimeout(() => {
            self.loading.dismiss();
          }, 1000);
      });
    });
  }
  presentPrompt(data:any) {
    var self=this;
    let radioAlert = this.alert.create();
    radioAlert.setTitle('Possible Places');
    var aLength=data.length;
    if(aLength<1){
      self.showAlert("No landmark detected");
    }
    for (var i =0; i<aLength; i++){
      radioAlert.addInput({
        type: 'radio',
        label: data[i].description,
        value: data[i].description,
        checked: false
      })
    }
    radioAlert.addButton("Cancel");
    radioAlert.addButton({
          text: 'OK',
          handler: data => {

            self.presentLoadingCustom();
            // self.showAlert(data);
            var datachoosen=data.trim();     
            self.placequery=datachoosen.split(' ').join('_');
            self.getWikiPlace();
          }
    });
    radioAlert.present();

    
  }
  isEmptyobj(obj) {
    if (Object.keys(obj).length > 0)    return false;
    if (Object.keys(obj).length <1)  return true;

    return true;
}
  takePhoto() {
    var self=this;
    const options: CameraOptions = {
      quality: 100,
      targetHeight: 500,
      targetWidth: 500,
      destinationType: self.camera.DestinationType.DATA_URL,
      encodingType: self.camera.EncodingType.PNG,
      mediaType: self.camera.MediaType.PICTURE
    }
    
    self.camera.getPicture(options).then((imageData) => {
      self.presentLoadingCustom();
      self.vision.getLabels(imageData).subscribe((result) => {
        // self.showAlert(JSON.stringify((<any>result)));
        if ((self.isEmptyobj((<any>result).responses[0]))==false){
          var desc=(<any>result).responses[0].landmarkAnnotations;
          // setTimeout(() => {
          //   self.loading.dismiss();
          // }, 1000);
          // self.presentPrompt(desc);
          if(desc.length<1){

            setTimeout(() => {
              self.loading.dismiss();

            }, 1000);
            setTimeout(() => {

              self.showAlert("No landmark detected");
            }, 5000);
          }
          else{
            desc=desc[0].description
          
            var datachoosen=desc.trim();     
            self.placequery=datachoosen.split(' ').join('_');
            self.getWikiPlace();
          }
        }else{            
          setTimeout(() => {
            self.loading.dismiss();

          }, 1000);
          setTimeout(() => {

            self.showAlert("No landmark detected");
          }, 5000);

        }
      }, err => {
        setTimeout(() => {
          self.loading.dismiss();
        }, 1000);
        self.showAlert(err);
      });
    }, err => {
      setTimeout(() => {
        self.loading.dismiss();
      }, 1000);
        self.showAlert(err);
    });
  }


}
