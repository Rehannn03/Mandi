import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/apiError.js";
import Dukaandar from "../model/dukaandar.model.js";
import Bepari from "../model/bepari.model.js";
import Kb_dukaandar from "../model/khaataBook_dukaandar.model.js";
import { ApiResponse } from "../utils/apiResponse.js";


const getKhataByDate=asyncHandler(async(req,res)=>{
    const {date,dukaandarId}=req.body

    const khata=await Kb_dukaandar.findOne({date,dukaandarId})

    if(!khata){
        return next(new ApiError(404,"Khata not found"))
    }

    return res.status(200).json(new ApiResponse(200,"Khata found",{khata}))
})

const getKhataByDukaandar=asyncHandler(async(req,res)=>{
    const {dukaandarId}=req.body

    const khata=await Kb_dukaandar.find({dukaandarId})

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

export {
    getKhataByDate,
    getKhataByDukaandar,
    updateKhata
}