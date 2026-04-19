import { ChangeDetectorRef, Component,OnInit } from '@angular/core';
import { ActivatedRoute,Router } from '@angular/router';
import { SpecialistService } from '../../services/specialist.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
selector:'app-edit-specialist',
standalone:true,
imports:[CommonModule,FormsModule],
templateUrl:'./edit-specialist.html',
styleUrl:'./edit-specialist.css'
})
export class EditSpecialist implements OnInit{

id:any;

form:any={};

selectedFile:any;

constructor(
private route:ActivatedRoute,
private service:SpecialistService,
private router:Router,
private cd:ChangeDetectorRef
){}

ngOnInit(){

this.id=this.route.snapshot.paramMap.get('id');

this.service.getSpecialists()
.subscribe(res=>{

const doc=res.find((d:any)=>d._id==this.id);

this.form=doc;
this.cd.detectChanges();

});

}

onFileSelect(event:any){

this.selectedFile=event.target.files[0];

}

updateSpecialist(){

const formData=new FormData();

formData.append("name",this.form.name);
formData.append("specialization",this.form.specialization);
formData.append("qualification",this.form.qualification);
formData.append("experience",this.form.experience);
formData.append("email",this.form.email);
formData.append("caseStory1",this.form.caseStory1);
formData.append("caseStory2",this.form.caseStory2);

if(this.selectedFile){
formData.append("image",this.selectedFile);
}

this.service.updateSpecialist(this.id,formData)
.subscribe(()=>{

alert("Specialist updated");

this.router.navigate(['/admin/specialists']);

});

}

}