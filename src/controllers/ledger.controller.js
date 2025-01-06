import { ApiError } from "../utils/apiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/apiResponse.js";
import Ledger from "../model/ledger.model.js";
import Kb_dukaandar from "../model/khaataBook_dukaandar.model.js";
import Kb_bepari from "../model/khaataBook_bepari.model.js";
import Dukaandar from '../model/dukaandar.model.js'
import Bepari from '../model/bepari.model.js'
const addTransaction = (ledger, type, relatedTo, partyId, amount, method, notes) => {
    ledger.transactions.push({
        type,
        relatedTo,
        partyId,
        amount,
        method,
        notes
    });
    if (type === 'inflow') {
        ledger.totalInflow += amount;
        ledger.balance += amount;
        if (method === 'cash') {
            ledger.balanceCash += amount;
        }
    } else {
        ledger.totalOutflow += amount;
        ledger.balance -= amount;
        if (method === 'cash') {
            ledger.balanceCash -= amount;
        }
    }
};

const handleRelatedEntityUpdate = async (relatedTo, partyId, amount, dateOfEntity) => {
    let entity, entityUpdate;
    if (relatedTo === 'Dukaandar') {
        entity = await Kb_dukaandar.findOneAndUpdate(
            { date: dateOfEntity, dukaandarId: partyId },
            { $inc: { paidAmount: amount, balance: -amount } },
            { new: true }
        );
        if (!entity) throw new ApiError(404, 'Dukaandar not found');
        entityUpdate = await Dukaandar.findOneAndUpdate(
            { dukaandarId: partyId },
            { $inc: { balance: -amount } },
            { new: true }
        );
    } else if (relatedTo === 'Bepari') {
        entity = await Kb_bepari.findOneAndUpdate(
            { date: dateOfEntity, bepariId: partyId },
            { $inc: { paidAmount: amount, balance: -amount } },
            { new: true }
        );
        if (!entity) throw new ApiError(404, 'Bepari not found');
        entityUpdate = await Bepari.findOneAndUpdate(
            { bepariId: partyId },
            { $inc: { balance: -amount } },
            { new: true }
        );
    }
    return entity;
};

const addInflow = asyncHandler(async (req, res) => {
    const { date, relatedTo, partyId, amount, method, notes, dateOfDukaandar } = req.body;

    let ledger = await Ledger.findOne({ date });

    if (!ledger) {
        ledger = new Ledger({
            date,
            transactions: [
                {
                    type: 'inflow',
                    relatedTo,
                    partyId,
                    amount,
                    method,
                    notes
                }
            ],
            totalInflow: amount,
            totalOutflow: 0,
            balance: amount,
            balanceCash: (method === 'cash') ? amount : 0,
        });
    } else {
        addTransaction(ledger, 'inflow', relatedTo, partyId, amount, method, notes);
    }

    await ledger.save();

    if (relatedTo === 'Dukaandar') {
        const dukaandar = await handleRelatedEntityUpdate(relatedTo, partyId, amount, dateOfDukaandar);
        return res.status(201).json(new ApiResponse(201, { ledger, dukaandar }, 'Inflow added successfully'));
    }

    res.status(201).json(new ApiResponse(201, { ledger }, 'Inflow added successfully'));
});

const addOutflow = asyncHandler(async (req, res) => {
    const { date, relatedTo, partyId, amount, method, notes, dateOfBepari } = req.body;

    let ledger = await Ledger.findOne({ date });

    if (!ledger) {
        ledger = new Ledger({
            date,
            transactions: [
                {
                    type: 'outflow',
                    relatedTo,
                    partyId,
                    amount,
                    method,
                    notes
                }
            ],
            totalInflow: 0,
            totalOutflow: amount,
            balance: -amount,
            balanceCash: (method === 'cash') ? -amount : 0,
        });
    } else {
        addTransaction(ledger, 'outflow', relatedTo, partyId, amount, method, notes);
    }

    await ledger.save();

    if (relatedTo === 'Bepari') {
        const bepari = await handleRelatedEntityUpdate(relatedTo, partyId, amount, dateOfBepari);
        return res.status(201).json(new ApiResponse(201, { ledger, bepari }, 'Outflow added successfully'));
    }

    res.status(201).json(new ApiResponse(201, { ledger }, 'Outflow added successfully'));
});

const getLedgers=asyncHandler(async(req,res)=>{
    const ledgers=await Ledger.find();
    res.status(200).json(new ApiResponse(200,{ledgers}));
})

const getLedger=asyncHandler(async(req,res)=>{
    const {date}=req.params;
    const ledger=await Ledger.findOne({date});

    if(!ledger){
        throw new ApiError(404,'Ledger not found');
    }

    res.status(200).json(new ApiResponse(200,{ledger}));
})


export { addInflow , addOutflow , getLedgers , getLedger }