import mongoose from "mongoose";

const dukaandarSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    shopName: {
        type: String,
        required: true
    },
    address: {
        type: String,
    },
    contact: {
        type: String,
        required: true
    },
    balance: {
        type: Number,
        default: 0 //Total balance to get from dukaandar
    }
},{
    timestamps: true
})



const Dukaandar = mongoose.model('Dukaandar', dukaandarSchema);

export default Dukaandar;