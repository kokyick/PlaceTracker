import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import 'rxjs/add/operator/map';
/*
  Generated class for the GoogleVisionProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class GoogleVisionProvider {

  constructor(public http: HttpClient) {
    console.log('Hello GoogleVisionProvider Provider');
  }
  getLabels(base64Image) {
    const body = {
      "requests": [
        {
          "image": {
            "content": base64Image
          },
          "features": [
            {
              "type": "LANDMARK_DETECTION"
            }
          ]
        }
      ]
    }
    return this.http.post('https://vision.googleapis.com/v1/images:annotate?key=AIzaSyDpR0rhSKe_CiRrzzAFyC0KWIcfUfuV4WE', body);
    }
}
