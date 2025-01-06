import mongoose from "mongoose";

const ledgerSchema = new mongoose.Schema({
    date:{
        type: Date,
        required: true
    },
    transactions:[
        {
            type:{
                type:String,
                enum:['inflow', 'outflow'],
                required: true
            },
            relatedTo:{
                type:String,
                enum:['Dukaandar', 'Bepari','Gawali','Bhada','Miscellaneous'],
                required: true
            },
            partyId:{
                type: mongoose.Schema.Types.ObjectId,
                required: true,
                refPath: 'transactions.relatedTo',
                required:function(){
                    return this.relatedTo==='Dukaandar' || this.relatedTo==='Bepari';
                }
            },
            amount:{
                type: Number,
                required: true
            },
            method:{
                type: String,
                enum:['cash', 'cheque', 'online'],
                required: true
            },
            notes:{
                type: String
            }
        }
    ],
    totalInflow:{
        type: Number,
        required: true
    },
    totalOutflow:{
        type: Number,
        required: true
    },
    balance:{
        type: Number,
        required: true
    },
    balanceCash:{
        type: Number,
    },
},{
    timestamps: true
})


const Ledger = mongoose.model('Ledger', ledgerSchema);

export default Ledger;