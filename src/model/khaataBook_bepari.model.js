import mongoose from "mongoose";

const kb_bepariSchema = new mongoose.Schema({
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
    outFlowDetails:[
        {
            dukaandarId:{
                type: mongoose.Schema.Types.ObjectId,
                ref: "Dukaandar",
                required: true
            },
            quantity:{
                type: Number,
                required: true
            },
            rate:{
                type: Number,
                required: true
            },
            totalAmount:{
                type: Number,
                required: true
            },
            notes:{
                type: String
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
    reaminingBakra: {
        type: Number
    },
    finalAmount:{
        type: Number,
        default: 0
    },
    ratePerBakra:{
        type: Number,
        default: 0
    },
    paidAmount:{
        type: Number,
        default: 0
    },
    balance:{
        type: Number,
        default: 0
    },
    totalEarnings:{
        type: Number,
        default: 0
    }
},{
    timestamps: true
})

kb_bepariSchema.pre('save',async function(next){
    const totalEarnings = this.outFlowDetails.reduce((acc,curr)=>{
        return acc + curr.totalAmount
    },0)
    this.totalEarnings = totalEarnings

    const totalBakra = this.outFlowDetails.reduce((acc,curr)=>{
        return acc + curr.quantity
    },0)
    this.reaminingBakra = this.totalBakra - totalBakra
    next()
})

const Kb_bepari = mongoose.model('Kb_bepari', kb_bepariSchema);

export default Kb_bepari;