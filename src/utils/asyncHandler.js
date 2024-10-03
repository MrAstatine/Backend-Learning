//done with promise 
const asyncHandler=(requestHandler)=>{
    (req,res,next)=>{
        Promise.resolve(requestHandler(req,res,next)).catch((err)=>next(err))
    }
}

export {asyncHandler};

/* done with try catch
const ayncHandler=(fn)=>async (req,res,next)=>{
    try{
        await fn(req,res,next);
    }catch(error){
        res.status(err.code ||500).json({
            success: false,
            message: err.message
        })
    }
}
//this is a higher order function i.e. takes function as parameter or returns function
//to make this function  async  we need to use async keyword before middle ()

*/