package net.capris.housevisit


object Model {
    case class Event(
    title: String,
    date: String,
    startTime: String,
    endTime: String,
    desc: String,
    cgdId:String,
    rcCode:String,
     nric:Array[String]
    )
}
