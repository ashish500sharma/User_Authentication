import * as mongoose from 'mongoose';
import {model} from "mongoose";



const userSchema = new mongoose.Schema({
    email:{type: String, required: true },
    password:{type: String, required:true},
    name:{type:String,required:true},
    profile_pic_url:{type: String,required : true,
        default:'http://localhost:5000/src/uploads/logo.jpg'},
    facebookId:{type:String, required:false},
    googleId:{type:String,required:false},
    fb_token:{type:String},
    google_token:{type:String},
    role:{type:String, required: true},

    on_board:{type:Number, required:true},

    gender:{type:String, required:false,default:'Male'},

    phone_no:{type:String,required:true},

    dob:{type:Date,required:false},

    state:{type:String,required:true,default:'Delhi'},

    category:{type:String,required:false},

    last_seen:{type:Date},

    description:{type:String,required:false},

    social_link:{type:String,required:false},

    verified:{type:Boolean ,required:true,default:false},
     verification_token:{type:Number, required:true},
     verification_token_time:{type:Date,required:true},
    reset_password_token:{type:Number,required:false},
    reset_password_token_time:{type:Date,required:false},
    username:{type: String, required:true},
    created_at:{type: Date, required:true , default:new Date()},
    updated_at:{type: Date, required:true , default:new Date()},
});
export default model('users',userSchema);
