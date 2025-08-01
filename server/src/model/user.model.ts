import mongoose, { Model, Schema } from "mongoose";

export interface IUser extends Document{
    username:string,
    email:string,
    password:string,
    profilePicture?:string,
    createdAt?:Date,
    updatedAt?:Date
}

const userSechma : Schema<IUser> = new mongoose.Schema({

    username:{
        type:String,
        required:true,
    },
    email:{
        type:String,
        required:true,
        unique:true
    },
    password:{
        type:String,
        required:true
    },
    profilePicture:{
        type:String,
        default:"https://static.vecteezy.com/system/resources/previews/005/544/718/non_2x/profile-icon-design-free-vector.jpg"

    }

},{timestamps:true});

export const User:Model<IUser> = mongoose.model<IUser>("User",userSechma);