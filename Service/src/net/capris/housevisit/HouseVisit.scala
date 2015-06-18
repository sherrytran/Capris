package net.capris.housevisit

import com.elixirtech.arch.ARM
import com.elixirtech.arch.LogMessage
import com.elixirtech.arch.LoggingHelper2
import java.sql.Connection
import net.capris.service.db.CaprisDB


object HouseVisit extends LoggingHelper2 {
  //CaprisDB.testInit
   def UpdateHouseVisit2(list: Model.Event, user:String): LogMessage = {
	ARM.run { arm =>
      var random=java.lang.System.currentTimeMillis()
      val key2 = Math.abs(random.toInt).toString
      val conn = arm.manage(CaprisDB.getConnection)
      conn.setAutoCommit(false)
      try {
        list.items.map(handleInsertHvActivity(conn,key2,user))
        handleEventDetails(conn,list,key2,user)
        conn.commit
        LogMessage.None
      } catch {
        case ex: Exception =>
          conn.rollback
          LogMessage.Error("House Visit Update Exception: " + ex)
      }
    }
   }
  
   def handleInsertHvActivity(conn: Connection,key:String,user:String)(item: Model.HvActivity): LogMessage = {
    log.info(key)
    var activityItem = new Event.HvActivity(key,item.nric,item.floorNo,item.unitNo,item.postalCode,item.reg_date,item.hv_status)
    log.info(activityItem)
    Event.insertHvActivity(conn, activityItem,user)
    Event.updateEvent(conn,activityItem,user) 
    LogMessage.None

  }
   
   def handleEventDetails(conn: Connection,s: Model.Event,key:String,user:String): LogMessage = {
    log.info(key)
    var eventItem = new Event.Event(s.title,s.date,s.startTime,s.endTime,s.desc,key,s.divCode,s.rcCode, s.preRemind, s.postRemind)
    log.info(eventItem)
    Event.insertEvent(conn,eventItem,user)
       
    LogMessage.None

}
}
