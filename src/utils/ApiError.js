class ApiError extends Error{
    constructor(
        statusCode,
        message="Something went wrong",
        errors=[],
        stack =""
        //whosoever uses this constructor wil give above things to me
        //message has been given a default value
    ){
        super(message) //this overwrite message
        this.statusCode=statusCode
        this.data= null
        this.message=message
        this.success=false
        this.errors=errors 
        //this part overwrites the codes of ApiEror
        if(stack){
            this.stack=stack
        }else{
            Error.captureStackTrace(this,this.constructor)
        }
        //if statement written as stack might exsist. Stack consists of all ther errors that exsist as a stack
        //samaj aya to thik hai varna code ditto copy kar le. Samjne ka try zaroor karna  
    }
}

export {ApiError}
