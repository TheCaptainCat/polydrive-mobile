import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable()
export class HttpProvider {

  constructor(
    private http: HttpClient
  ) { }

  get(route: string): Promise<any> {
    return new Promise(
      (resolve, reject) => {
        this.http.get("http://192.168.43.176:5000" + route, {withCredentials: true}).subscribe(
          data => {
            resolve(data);
          },
          err => {
            reject(err);
          }
        );
      }
    );
  }

  post(route: string, body:any): Promise<any> {
    return new Promise(
      (resolve, reject) => {
        this.http.post("http://192.168.43.176:5000" + route, body, {withCredentials: true}).subscribe(
          data => {
            console.log(data);
            resolve(data);
          },
          err => {
            reject(err);
          }
        );
      }
    )
  }

}
