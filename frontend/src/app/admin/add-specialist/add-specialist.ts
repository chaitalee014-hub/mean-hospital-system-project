import { Component } from '@angular/core';
import { SpecialistService } from '../../services/specialist.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
selector:'app-add-specialist',
standalone:true,
imports:[CommonModule,FormsModule],
templateUrl:'./add-specialist.html',
styleUrls:['./add-specialist.css']
})

export class AddSpecialistComponent{

form:any={};
image:any;

constructor(private service:SpecialistService){}

onFileSelect(event:any){
this.image=event.target.files[0];
}

addSpecialist(){

const formData=new FormData();

formData.append("name",this.form.name);
formData.append("specialization",this.form.specialization);
formData.append("qualification",this.form.qualification);
formData.append("experience",this.form.experience);
formData.append("caseStory1",this.form.caseStory1);
formData.append("caseStory2",this.form.caseStory2);
formData.append("email",this.form.email);
if(this.image){formData.append("image",this.image)};

this.service.addSpecialist(formData)
.subscribe({
next:()=>{
alert("Specialist added successfully");
this.form = {};
this.image = null;
},
error:(err)=>{
alert(err.error.message);
}
});


}

}