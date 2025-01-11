import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/apiError.js";
import Dukaandar from "../model/dukaandar.model.js";
import Bepari from "../model/bepari.model.js";
import Kb_dukaandar from "../model/khaataBook_dukaandar.model.js";
import { ApiResponse } from "../utils/apiResponse.js";
import mongoose from "mongoose";
const ObjectId=mongoose.Types.ObjectId;

const getKhataByDate=asyncHandler(async(req,res)=>{
    const {date,dukaandarId}=req.body

    const khata=await Kb_dukaandar.findOne({date,dukaandarId})

    if(!khata){
        return next(new ApiError(404,"Khata not found"))
    }

    return res.status(200).json(new ApiResponse(200,"Khata found",{khata}))
})

const getKhataByDukaandar=asyncHandler(async(req,res)=>{
    const {dukaandarId}=req.params

    const khata=await Kb_dukaandar.aggregate([
        {
            $match:{dukaandarId:new ObjectId(dukaandarId)}
        },
        {
            $lookup:{
                from:"dukaandars",
                localField:"dukaandarId",
                foreignField:"_id",
                as:"dukaandar"
            }
        },
  {
    $unwind:'$purchases'
  },{
    $lookup: {
      from: 'beparis',
      localField: 'purchases.bepariId',
      foreignField: '_id',
      as: 'bepari'
    }
  },{
    $group: {
      _id: '$_id',
      dukaandarId:{$first:'$dukaandarId'},
      date:{$first:'$date'},
      purchases:{
      	$push:{
          quantity:'$purchases.quantity',
          amount: '$purchases.amount',
          finalAmount: '$purchases.finalAmount',
          bepari:{$first:'$bepari'}
        }
      },
      totalAmount:{$first:'$totalAmount'},
      paidAmount:{$first:'$paidAmount'},
      balance:{$first:'$balance'},
      datePaid:{$first:'$datePaid'},
    }
  }
    ])

    if(!khata){
        return next(new ApiError(404,"Khata not found"))
    }

    return res.status(200).json(new ApiResponse(200,"Khata found",{khata}))
})

const updateKhata=asyncHandler(async(req,res)=>{
    const {date,dukaandarId,amount}=req.body

    const khata=await Kb_dukaandar.findOneAndUpdate(
        {
            date,
            dukaandarId
        },
        {
            $inc:{paidAmount:amount},
            $inc:{balance:-amount}
        },
        {
            new:true
        }
    )

    if(!khata){
        return next(new ApiError(404,"Khata not found"))
    }

    return res.status(200).json(new ApiResponse(200,"Khata updated",{khata}))
})

const getKhataDates=asyncHandler(async(req,res)=>{
    const {dukaandarId}=req.params

    const khataDates=await Kb_dukaandar.find({dukaandarId}).distinct('date')

    if(!khataDates){
        return next(new ApiError(404,"Khata Dates not found"))
    }

    return res.status(200).json(new ApiResponse(200,{khataDates},"Khata Dates found"))
})

export {
    getKhataByDate,
    getKhataByDukaandar,
    updateKhata,
    getKhataDates
}