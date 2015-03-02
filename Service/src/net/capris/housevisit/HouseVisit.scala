package net.capris.housevisit

import com.elixirtech.arch.ARM
import com.elixirtech.arch.LogMessage
import com.elixirtech.arch.LoggingHelper2
import java.sql.Connection
import net.capris.service.db.CaprisDB


object HouseVisit extends LoggingHelper2 {
  //CaprisDB.testInit
   def UpdateHouseVisit2(list: Model.Event): LogMessage = {
	ARM.run { arm =>
      val conn = arm.manage(CaprisDB.getConnection)
      conn.setAutoCommit(false)
      try {
        handleEventDetails(conn,list)   
        conn.commit
        LogMessage.None
      } catch {
        case ex: Exception =>
          conn.rollback
          LogMessage.Error("House Visit Update Exception: " + ex)
      }
    }
   }
  
   def handleEventDetails(conn: Connection,s: Model.Event): LogMessage = {

    val random=java.lang.System.currentTimeMillis()
    var key2 = Math.abs(random.toInt).toString
    log.info(key2)
    var eventItem = new Event.Event(s.title,s.startTime,s.endTime,s.desc,key2,s.cgdId,s.rcCode)
    log.info(eventItem)
    Event.insertEvent(conn, eventItem)
    Event.updateEvent(conn,s,key2)    
   
    LogMessage.None

}
}
