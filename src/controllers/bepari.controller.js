import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { ApiError } from "../utils/apiError.js";
import Dukaandar from "../model/dukaandar.model.js";
import Bepari from "../model/bepari.model.js";
import Kb_bepari from "../model/khaataBook_bepari.model.js";
import Kb_dukaandar from "../model/khaataBook_dukaandar.model.js";
import Ledger from "../model/ledger.model.js";
const addKhata=asyncHandler(async(req,res)=>{
    const {bepariId,totalBakra,date,outFlowDetails,paidAmount,ratePerBakra}=req.body
    const bepari=await Bepari.findByIdAndUpdate({
        _id:bepariId
    },{
        $inc:{
            balance:totalBakra*ratePerBakra - paidAmount
        }
    },{
        new:true
    })
    if(!bepari){
        return next(new ApiError(404,"Bepari not found"))
    }

    const khata=await Kb_bepari.create({
        bepariId,
        totalBakra,
        date,
        outFlowDetails:outFlowDetails,
        ratePerBakra:ratePerBakra,
        finalAmount:totalBakra*ratePerBakra,
        paidAmount:paidAmount || 0,
        balance:totalBakra*ratePerBakra-paidAmount || 0
    })

    const dukaandarKhataUpdate=outFlowDetails.map(async(item)=>{
        const dukaandar=await Dukaandar.findByIdAndUpdate({
            _id:item.dukaandarId
        },{
            $inc:{
                balance:item.totalAmount
            }
        },{
            new:true
        })
        if(!dukaandar){
            return next(new ApiError(404,"Dukaandar not found"))
        }
        const khata=await Kb_dukaandar.findOne({date,dukaandarId:item.dukaandarId})
        if(!khata){
            const newKhata=await Kb_dukaandar.create({
                dukaandarId:item.dukaandarId,
                date,
                purchases:[{
                    quantity:item.quantity,
                    amount:item.rate,
                    finalAmount:item.totalAmount,
                    bepariId
                }],
                totalAmount:item.totalAmount,
                paidAmount:0,
                balance:item.totalAmount
            })
            await newKhata.save()
        }else{
            const newPurchase={
                quantity:item.quantity,
                amount:item.rate,
                finalAmount:item.totalAmount,
                bepariId
            }
            khata.purchases.push(newPurchase)
            khata.totalAmount+=item.totalAmount
            khata.balance+=item.totalAmount
            await khata.save()
        }
    })
    

    return res.status(201).json(new ApiResponse(201,"Khata succesfully Created",{khata}))
})

const getKhata=asyncHandler(async(req,res)=>{
    const {bepariId,date}=req.body

    const khata=await Kb_bepari.find({bepariId,date})
    return res.status(200).json(new ApiResponse(200,"Khata fetched successfully",{khata}))
})

const getKhataByBepari=asyncHandler(async(req,res)=>{
    const {bepariId}=req.body

    const khata_bepari=await Kb_bepari.find({bepariId})

    return res.status(200).json(new ApiResponse(200,"Khata fetched successfully",{khata_bepari}))
})

const makeAkda=asyncHandler(async(req,res)=>{
    const {bepariId,date,commision,kasar,kalamfer,jagaBhada,motorBhada,gawali,charaBhusa,majdoori }=req.body

    const khata=await Kb_bepari.findOne({bepariId,date})
    const bepari=await Bepari.findById(bepariId)
    const ledger=await Ledger.findOne({date})

    const bepariMischellanous=ledger.transactions.filter(
        item=>item.relatedTo==='Bepari'&&item.partyId.toString()===bepariId.toString()&&item.type==='outflow' || item.relatedTo==='Gawali'&&item.partyId.toString()===bepariId.toString()&&item.type==='outflow' || item.relatedTo==='Bhada'&&item.partyId.toString()===bepariId.toString()&&item.type==='outflow'
    )
    if(!khata){
        return next(new ApiError(404,"Khata not found"))
    }

    const receipt={
        bepariName:bepari.name,
        bepariAddress:bepari.address,
        bepariAmount:khata.finalAmount,
        givenAmount:khata.paidAmount,
        commision:commision
    }
})

export {addKhata,
    getKhata,
    getKhataByBepari
}