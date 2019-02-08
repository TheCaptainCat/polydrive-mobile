import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable()
export class HttpProvider {

  public url: string;

  constructor(
    private http: HttpClient
  ) { }

  get(route: string, type?: any): Promise<any> {
    return new Promise(
      (resolve, reject) => {
        this.http.get("http://" + this.url + route, {
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

  post(route: string, body: any): Promise<any> {
    return new Promise(
      (resolve, reject) => {
        this.http.post("http://" + this.url + route, body, {withCredentials: true}).subscribe(
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

  delete(route: string) {
    return new Promise(
      (resolve, reject) => {
        this.http.delete("http://" + this.url + route, {withCredentials: true}).subscribe(
          data => {
            resolve(data)
          },
          err => {
            reject(err)
          }
        )
      }
    )
  }

  put(route: string, body: any): Promise<any> {
    return new Promise(
      (resolve, reject) => {
        this.http.put("http://" + this.url + route, body, {withCredentials: true}).subscribe(
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

}
