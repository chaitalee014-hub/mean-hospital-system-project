import Specialist from "../models/specialist.model.js";
import { sendEmail } from "../utils/sendEmail.js";

export const getSpecialists = async(req,res)=>{

const data = await Specialist.find();

res.json(data);

};

export const createSpecialist = async (req, res) => {

try{

// check if specialist already exists
const existing = await Specialist.findOne({ email: req.body.email });

if(existing){
return res.status(400).json({ message: "Specialist already exists with this email" });
}

// create new specialist
const specialist = new Specialist({

name:req.body.name,
specialization:req.body.specialization,
qualification:req.body.qualification,
experience:req.body.experience,
caseStory1:req.body.caseStory1,
caseStory2:req.body.caseStory2,
email:req.body.email,
image:req.file ? req.file.path : null
});

await specialist.save();

res.json({message:"Specialist added successfully"});

}catch(error){

res.status(500).json({error:error.message});

}

};

export const updateSpecialist = async (req, res) => {

  const data = req.body;

  if(req.file){
    data.image = req.file.path;
  }

  const updated = await Specialist.findByIdAndUpdate(
    req.params.id,
    data,
    {new:true}
  );

  res.json(updated);

};
export const deleteSpecialist = async(req,res)=>{

await Specialist.findByIdAndDelete(req.params.id);

res.json({message:"Specialist deleted"});

};

export const sendEmergencyEmail = async (req, res) => {

try{

const specialist = await Specialist.findById(req.params.id);

if(!specialist){
return res.status(404).json({message:"Specialist not found"});
}

const subject = "Emergency Medical Case - Immediate Assistance Required";

const message = `
Dear  ${specialist.name},

Our hospital currently has a critical medical emergency requiring
expert consultation in the field of ${specialist.specialization}.

Your expertise is highly valued and we request you to visit the hospital
as soon as possible to assist with this complicated case.

Hospital Administration
Emergency Response Team
`;

await sendEmail(
specialist.email,
subject,
message
);

res.json({message:"Emergency email sent successfully"});

}catch(error){

res.status(500).json({error:error.message});

}

};