import mongoose from "mongoose";

const kb_dukaandarSchema = new mongoose.Schema({
    dukaandarId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Dukaandar',
        required: true,
    },
    date: {
        type: Date,
        required: true
    },
    purchases:[
        {
            quantity: {
                type: Number,
                required: true
            },
            amount: {
                type: Number,
                required: true
            },
            finalAmount: {
                type: Number,
                required: true
            },
            bepariId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Bepari',
                required: true
            }
        }
    ],
    datePaid:[{
        date: {
            type: Date,
            required: true
        },
        amount: {
            type: Number,
            required: true
        }
    }],
    totalAmount: {
        type: Number,
        required: true
    },
    paidAmount: {
        type: Number,
        required: true
    },
    balance: {
        type: Number,
        required: true
    }
},{
    timestamps: true
})


const Kb_dukaandar = mongoose.model('Kb_dukaandar', kb_dukaandarSchema);

export default Kb_dukaandar;