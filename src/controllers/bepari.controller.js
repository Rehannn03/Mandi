import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { ApiError } from "../utils/apiError.js";
import Dukaandar from "../model/dukaandar.model.js";
import Bepari from "../model/bepari.model.js";
import Kb_bepari from "../model/khaataBook_bepari.model.js";
import Kb_dukaandar from "../model/khaataBook_dukaandar.model.js";
import Ledger from "../model/ledger.model.js";
import Akda from "../model/akda.model.js";
import mongoose from "mongoose";
const ObjectId=mongoose.Types.ObjectId;
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
    const akda=await Akda.create({
      bepariId,
      totalBakra,
      date,
      kharchaDetails:[],
      totalKharcha:0,
      paidAmount:0,
      balance:totalBakra*ratePerBakra-paidAmount || 0
    })


    const dukaandarKhataUpdate=outFlowDetails.map(async(item)=>{
        const dukaandar=await Dukaandar.findOneAndUpdate({
            _id:new ObjectId(item.dukaandarId)
        },{
            $inc:{
                balance:item.totalAmount
            }
        },{
            new:true
        })
        await dukaandar.save()
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
    const {bepariId}=req.params
    console.log(bepariId)
    const khata_bepari=await Kb_bepari.aggregate(
        [
            {
              $match: {
                bepariId: new ObjectId(
                  bepariId
                )
              }
            },
            {
              $lookup: {
                from: "beparis",
                localField: "bepariId",
                foreignField: "_id",
                as: "bepari"
              }
            },
            {
              $unwind: "$outFlowDetails"
            },
            {
              $lookup: {
                from: "dukaandars",
                localField: "outFlowDetails.dukaandarId",
                foreignField: "_id",
                as: "dukaandar"
              }
            },
            {
              $group: {
                _id: "$_id",
                bepariId: {
                  $first: "$bepariId"
                },
                date: {
                  $first: "$date"
                },
                outFlowDetails: {
                    $push: {
                        quantity: "$outFlowDetails.quantity",
                        rate: "$outFlowDetails.rate",
                        totalAmount: "$outFlowDetails.totalAmount",
                        notes:'$outFlowDetails.notes',
                        dukaandar: {
                          $first: "$dukaandar"
                        }
                      }
                },
                totalBakra: {
                  $first: "$totalBakra"
                },
                finalAmount: {
                  $first: "$finalAmount"
                },
                ratePerBakra:{
                  $first:"$ratePerBakra"
                },
                paidAmount:{
                  $first:'$paidAmount'
                },
                balance: {
                  $first: "$balance"
                },
                datePaid:{
                  $first:'$datePaid'
                }
              }
            }
          ]
    )

    return res.status(200).json(new ApiResponse(200,"Khata fetched successfully",{khata_bepari}))
})

// const makeAkda=asyncHandler(async(req,res)=>{
//     const {bepariId,date,commision,kasar,kalamfer,jagaBhada,motorBhada,gawali,charaBhusa,majdoori }=req.body
//     // Akda making 
//     // 1. Get the khata of Bepari on that date
//     // 2. Get Previous 
//     const khata=await Kb_bepari.findOne({bepariId,date})
//     const bepari=await Bepari.findById(bepariId)
//     const ledger=await Ledger.findOne({date})

//     const bepariMischellanous=ledger.transactions.filter(
//         item=>item.relatedTo==='Bepari'&&item.partyId.toString()===bepariId.toString()&&item.type==='outflow' || item.relatedTo==='Gawali'&&item.partyId.toString()===bepariId.toString()&&item.type==='outflow' || item.relatedTo==='Bhada'&&item.partyId.toString()===bepariId.toString()&&item.type==='outflow'
//     )
//     console.log(bepariMischellanous)
//     if(!khata){
//         return next(new ApiError(404,"Khata not found"))
//     }

//     const receipt={
//         bepariName:bepari.name,
//         bepariAddress:bepari.address,
//         bepariAmount:khata.finalAmount,
//         givenAmount:khata.paidAmount,
//         commision:commision,
//         kasar:kasar,
//         kalamfer:kalamfer,
//         jagaBhada:jagaBhada,
//         motorBhada:motorBhada,
//         gawali:gawali,
//         charaBhusa:charaBhusa,
//         majdoori:majdoori,
//     }
//     return res.status(200).json(new ApiResponse(200,{},"Akda Created Successfully"))
// })

const updateAkda=asyncHandler(async(req,res)=>{
  // 1. Fetch khata of bepari on that date
  // 2. Fetch ledger of that date
  // 3. Fetch previous akda of that bepari and get balance from that
  // 4. While making akda, add previous balance to the akda dedect paid amount and get the balance
  const {commision,kasar,kalamFare,jagaBhada,motorBhada,karkoni,mandiGawali,charaBhusa,mazdoori,bepariId,date}=req.body
  
  const khata_Update=await Kb_bepari.findOneAndUpdate({
    bepariId,date
  },{
    $push:{
      kharchaDetails:{
        commision,
        kasar,
        kalamFare,
        jagaBhada,
        motorBhada,
        karkoni,
        mandiGawali,
        charaBhusa,
        mazdoori
      }
    }
  },{
    new:true
  })
  
  return res.status(200).json(new ApiResponse(200,{khata_Update},"Akda Updated Successfully"))
})

const akdaInfo=asyncHandler(async(req,res)=>{
  const {bepariId,date}=req.params
  const akda=await Akda.findOne({bepariId,date})

  return res.status(200).json(new ApiResponse(200,{akda},"Akda fetched successfully"))
})

const getKhataDates=asyncHandler(async(req,res)=>{
  const {bepariId}=req.params

  const khataDates=await Kb_bepari.find({bepariId}).distinct('date')
  return res.status(200).json(new ApiResponse(200,{khataDates},"Khata Dates fetched successfully"))
})

export {addKhata,
    getKhata,
    getKhataByBepari,
    updateAkda,
    getKhataDates
}