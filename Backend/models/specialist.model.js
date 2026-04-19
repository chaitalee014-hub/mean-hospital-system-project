import mongoose from "mongoose";

const specialistSchema = new mongoose.Schema({

name:{
type:String,
required:true
},

specialization:{
type:String,
required:true
},

qualification:{
type:String
},

experience:{
type:Number
},

email:{
type:String,
required:true
},

caseStory1:{
type:String
},

caseStory2:{
type:String
},

image:{
type:String
}

},{timestamps:true});

export default mongoose.model("Specialist",specialistSchema);