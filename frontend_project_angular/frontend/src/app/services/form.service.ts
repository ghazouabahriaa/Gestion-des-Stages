import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class FormService {
  url = environment.apiUrl;

  constructor(private httpClient: HttpClient) {}

generateReport(data:any){
  return this.httpClient.post(this.url+"/form/generateReport/",data,{
    headers:new HttpHeaders().set('Content-Type',"application/json")
  })
}

getPDF(data:any):Observable<Blob>{
  return this.httpClient.post(this.url+
    "/form/getPdf",data,{responseType:'blob'});
}

getForms(){
  return this.httpClient.get(this.url+"/form/getForms/");
}

delete(id:any){
  return this.httpClient.delete(this.url+
    "/form/delete/"+id,{
      headers:new HttpHeaders().set('Content-Type',"application/json")
  })
}
getStagesByPermission() {
  return this.httpClient.get(this.url + '/form/getByPermission/' );
}

updateStatus(data: any) {
  return this.httpClient.patch(this.url + '/form/updateStatus/', data, {
    headers: new HttpHeaders().set('Content-Type', 'application/json'),
  });
}

}
