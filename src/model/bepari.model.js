import mongoose from "mongoose";

const bepariSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    phone: {
        type: String,
        required: true
    },
    address: {
        type: String
    },
    balance:{
        type: Number,
        default: 0, // Total balance to pay to bepari
    }
},{
    timestamps: true
})



const Bepari = mongoose.model('Bepari', bepariSchema);

export default Bepari;