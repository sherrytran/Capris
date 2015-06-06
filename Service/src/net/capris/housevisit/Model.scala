package net.capris.housevisit


object Model {
    case class Event(
    title: String,
    date: String,
    startTime: String,
    endTime: String,
    desc: String,
   divCode:String,
    rcCode:String,
    preRemind:Int,
    postRemind:Int,
     nric:Array[String],
     items: List[HvActivity]
    )
    
    case class HvActivity(
        nric: String,
        floorNo: String,
        unitNo:String,
        postalCode: String,
        reg_date:String,
        hv_status:Int
        
    )
}
