import mongoose from "mongoose";

const akdaSchema=new mongoose.Schema({
    bepariId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Bepari",
        required:true
    },
    totalBakra: {
        type: Number,
        required: true
    },
    date: {
        type: Date,
        required: true
    },
    kharchaDetails:[
        {
            commision:{
                type: Number,
            },
            kasar:{
                type: Number,
            },
            kalamFare:{
                type: Number,
            },
            jagaBhada:{
                type: Number,
            },
            motorBhada:{
                type: Number,
            },
            karkoni:{
                type: Number,
            },
            mandiGawali:{
                type: Number,
            },
            charaBhusa:{
                type: Number,
            },
            mazdoori:{
                type: Number,
            },
        }
    ],
    totalKharcha:{
        type: Number,
        required: true
    },
    paidAmount:{
        type: Number,
        default: 0
    },
    balance:{
        type: Number,
        default: 0
    }
})

const Akda=mongoose.model("Akda",akdaSchema)

export default Akda