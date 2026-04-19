import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environment';

@Injectable({providedIn:'root'})
export class SpecialistService{

api = `${environment.apiUrl}/specialists`;

constructor(private http:HttpClient){}

getSpecialists(){
return this.http.get<any[]>(this.api);
}

addSpecialist(data:any){
return this.http.post(this.api,data);
}

updateSpecialist(id:string,data:any){
return this.http.put(`${this.api}/${id}`,data);
}

deleteSpecialist(id:string){
return this.http.delete(`${this.api}/${id}`);
}

sendEmergency(id:string){
return this.http.post(`${this.api}/emergency/${id}`,{});
}

}