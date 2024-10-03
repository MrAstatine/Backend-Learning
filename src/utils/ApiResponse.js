class ApiResponse{
    //whenever v send response to someone it is through this
    constructor(statusCode,data,message="Success"){
        this.statusCode=statusCode
        this.data=data
        this.message=message
        this.success=statusCode < 400
        //statusCode to b sent should b <400
        /*
        Types                   Status code
        Informational response  100-199
        Successfule response    200-299
        Redirection response    300-399
        Client error response   400-499
        Server error response   500-599
        */
       //this is reason y it is successful if statusCode is <400
       
    }
}