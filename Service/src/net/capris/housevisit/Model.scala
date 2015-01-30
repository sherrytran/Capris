package net.capris.housevisit


object Model {
  
  case class Event(
      nric: String,
    title: String,
    date: String,
    startTime: String,
    endTime: String,
    desc: String,
     name: String,
    dateOfBirth: String,
    citizentype: String,
    hv_status: String,
    Remarks: String
      )
    
  case class EventItem(
    nric: String,
    title: String,
    date: String,
    startTime: String,
    endTime: String,
    desc: String,
   cgdId:String,
    name: String,
    dateOfBirth: String,
    citizentype: String,
    hv_status: String,
    Remarks: String
    
		  )
    
   case class EventStatus(
    nric: String,
    name: String,
    dateOfBirth: String,
    citizentype: String,
    hv_status: String,
    Remarks: String)

  case class EventList(items: List[Event])
  
  case class EventItemList(items: List[EventItem],eventKey:String)

  case class EventStatusList(items: List[EventStatus])

}
