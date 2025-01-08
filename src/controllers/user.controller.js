import {ApiError} from '../utils/apiError.js'
import {asyncHandler} from '../utils/asyncHandler.js'
import {ApiResponse} from '../utils/apiResponse.js'
import User from '../model/user.model.js'
import Dukaandar from '../model/dukaandar.model.js'
import Bepari from '../model/bepari.model.js'
const addUser=asyncHandler(async(req,res)=>{
    const {name,email,password}=req.body;

    const user=await User.create({
        name,
        email,
        password,
        role:'Admin'
    })

    if(!user){
        throw new ApiError(400,'User not created')
    }

    return res.json(new ApiResponse(200,'User created successfully',user))
})

const loginUser=asyncHandler(async(req,res)=>{
    const {email,password}=req.body;

    const user=await User.findOne({email})

    if(!user){
        throw new ApiError(404,'User not found')
    }

    const isMatch=await user.matchPassword(password)

    if(!isMatch){
        throw new ApiError(400,'Invalid credentials')
    }

    const token=user.generateAccessToken()

    const options={
        httpOnly:true,
        sameSite:'None',
        secure:true
    }

    return res
    .cookie('accessToken',token,options)
    .json(new ApiResponse(200,'User logged in successfully',{token,user}))

})

const logoutUser=asyncHandler(async(req,res)=>{
    res.clearCookie('accessToken')
    return res.json(new ApiResponse(200,'User logged out successfully'))
})

const addDukaandar=asyncHandler(async(req,res)=>{
    const user=req.user

    if(user.role!=='Admin'){
        throw new ApiError(403,'Not authorized to create dukaandar')
    }
    const {name,shopName,address,contact}=req.body

    const dukaandar=await Dukaandar.create({
        name,
        shopName,
        address,
        contact
    })

    if(!dukaandar){
        throw new ApiError(400,'Dukaandar not created')
    }

    return res.json(new ApiResponse(200,'Dukaandar created successfully',dukaandar))
})

const viewDukaandars=asyncHandler(async(req,res)=>{
    const user=req.user
    if(user.role!=='Admin'){
        throw new ApiError(403,'Not authorized to view dukaandar')
    }
    const dukaandars=await Dukaandar.find()

    if(!dukaandars){
        throw new ApiError(404,'Dukaandar not found')
    }

    return res.json(new ApiResponse(200,'Dukaandar found successfully',dukaandars))
})

const viewDukaandarById=asyncHandler(async(req,res)=>{
    const user=req.user
    if(user.role!=='Admin'){
        throw new ApiError(403,'Not authorized to view dukaandar')
    }
    const {id}=req.body

    const dukaandar=await Dukaandar.findById(id)

    if(!dukaandar){
        throw new ApiError(404,'Dukaandar not found')
    }

    return res.json(new ApiResponse(200,'Dukaandar found successfully',dukaandar))
})

const addBepari=asyncHandler(async(req,res)=>{
    const user=req.user
    if(user.role!=='Admin'){
        throw new ApiError(403,'Not authorized to create bepari')
    }
    const {name,phone,address}=req.body

    const bepari=await Bepari.create({
        name,
        phone,
        address
    })

    if(!bepari){
        throw new ApiError(400,'Bepari not created')
    }

    return res.json(new ApiResponse(200,'Bepari created successfully',bepari))
})

const viewBeparis=asyncHandler(async(req,res)=>{
    const user=req.user
    if(user.role!=='Admin'){
        throw new ApiError(403,'Not authorized to view bepari')
    }
    const beparis=await Bepari.find()
    if(!beparis){
        throw new ApiError(404,'Bepari not found')
    }

    return res.json(new ApiResponse(200,'Bepari found successfully',beparis))
})

const viewBepariById=asyncHandler(async(req,res)=>{
    const user=req.user
    if(user.role!=='Admin'){
        throw new ApiError(403,'Not authorized to view bepari')
    }
    const {id}=req.body

    const bepari=await Bepari.findById(id)

    if(!bepari){
        throw new ApiError(404,'Bepari not found')
    }

    return res.json(new ApiResponse(200,'Bepari found successfully',bepari))
})


export {addUser,
    loginUser,
    logoutUser,
    addDukaandar,
    viewDukaandars,
    viewDukaandarById,
    addBepari,
    viewBeparis,
    viewBepariById}