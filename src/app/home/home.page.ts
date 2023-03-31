import { Component } from '@angular/core';
import { Camera, CameraOptions } from '@ionic-native/camera/ngx';
import {HttpClient,HttpClientModule } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { AngularFireDatabase, AngularFireList, AngularFireObject } from '@angular/fire/compat/database';
import * as internal from 'stream';

export interface data{
  description: String;
  score: any;
}
class Funlist{
  $key: string; 
  name: string;
  constructor(name){
    this.name = name;
  }
}

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  base64Image:any;
  result:any;
  extractedData: data[];
  imageData: any;
  visionResponse: any;
  i: number;

  selectedCard: string;
  Object: string;
  FirebaseList: AngularFireList<any>; // Online List on Firebase
  LocalList: Funlist[];       // Local list copy inside my app
  FirebaseObject: AngularFireObject<any>;

  constructor(private camera:Camera, private http:HttpClient, private db:AngularFireDatabase) {
    this.base64Image="https://placehold.it/250x250";

    this.selectedCard = "";
    this.Object = "";
    this.LocalList = [];
    this.FirebaseList = this.db.list("/funlist");
    this.FirebaseList.snapshotChanges().subscribe(data => this.handleData(data));
  }

   handleData(data){
    console.table(data);
    this.LocalList = []; 
    data.forEach(item => { 
      let pl = item.payload.toJSON();
      pl['$key'] = item.key;
      this.LocalList.push(pl as Funlist);
    });
  }
  async takePicture(){
    this.extractedData = [];
    const options: CameraOptions = {
      quality: 100,
      destinationType: this.camera.DestinationType.DATA_URL,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE,
      targetHeight:250,
      targetWidth:250,
      saveToPhotoAlbum:false
    }
    this.camera.getPicture(options).then((imageData) => {
      this.imageData = imageData;
      this.base64Image = 'data:image/jpeg;base64,' + imageData;
      this.processImage();
      this.check();
     }, (err) => {
       console.log("Could not get picture")
     });
  }

  extractData(base64Image){
    const body ={
      "requests":[
        {
          "image":{
            "content":base64Image
          },
          "features":[
            {
              "type":"OBJECT_LOCALIZATION",
              "maxResults":10
            }
          ]
        }
      ]
    }
    return this.http.post('https://vision.googleapis.com/v1/images:annotate?key='+environment.googleCloudVisionAPIKey,body);
  }

  processImage(){

        if (this.imageData != null){
          //process the image
          this.extractData(this.imageData).subscribe((result)=>
          {
            this.result = result;
            this.result = this.result.responses[0].localizedObjectAnnotations;
            this.result.forEach(extractedItem=>{
            this.extractedData.push({description: extractedItem.name, score:extractedItem.score})
          });
            console.log(this.result);     
          }
          ); 
        } 
  }
  check ()
  {
    // for (let t1 of this.LocalList.map(a => a.name))
    //         {
      console.log("here");this.processImage();
              for(let t2 of this.extractedData.map(a => a.description))
              {
                  // if (t1 == t2)
                  // {
                  //   this.FirebaseObject = this.db.object("/funlist/" + this.LocalList.map(a => a.$key));
                  //   this.FirebaseObject.remove();
                  //   console.log("removed " + t1); 
                  // }
                  // console.log("t1 firebase:" + t1);
                  console.log("t1 data:" + t2);
                }
            // }
     }
  /*check ()
  {
    for (let t1 of this.listAppointment.map(a => a.name))
    {
      for(let t2 of this.extractedData.map(a => a.description))
      {
          if (t1 == t2)
          {
           console.log("wow");
          }
          console.log("t1 firebase:" + t1);
          console.log("t1 data:" + t2);
      }
    }

  }*/
}
