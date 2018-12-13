import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable()
export class HttpProvider {

  constructor(
    private http: HttpClient
  ) { }

  get(route: string, type?: any): Promise<any> {
    return new Promise(
      (resolve, reject) => {
        this.http.get("http://localhost:5000" + route, {
          withCredentials: true,
          responseType: type
        }).subscribe(
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
        this.http.post("http://localhost:5000" + route, body, {withCredentials: true}).subscribe(
          data => {
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
