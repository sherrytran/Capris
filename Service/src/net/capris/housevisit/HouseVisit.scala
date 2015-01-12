package net.capris.housevisit

import com.elixirtech.arch.ARM
import com.elixirtech.arch.LogMessage
import com.elixirtech.arch.LoggingHelper2
import java.sql.Connection
import net.capris.service.db.CaprisDB
import net.capris.housevisit.Model.EventItem

object HouseVisit extends LoggingHelper2 {
  //CaprisDB.testInit
  
  def updateFor(accountId : String) : LogMessage = {
    
    try {
      val test1="testing12"
    val test2="testing2"
      CaprisDB.testInit
      ARM.run { arm=>
        val conn = arm.manage(CaprisDB.getConnection)
        val sql = "INSERT INTO house_visit_test VALUES (?,?,?)"
        val ps = conn.prepareStatement(sql)
          ps.setString(1,accountId)
          ps.setString(2,test1)
          ps.setString(3,test2)
          ps.executeUpdate()
          log.debug(s"Inserting $accountId,$test1,$test2")
          
      }
      log.info(s"test for house visit")
      LogMessage.None
    }
    catch {
      case ex : Exception =>
        log.error(s"Error updating house visit table for $accountId: $ex",ex)
        LogMessage.Error(s"Error updating house visit table: $ex")
    }
  }
  
  def UpdateHouseVisit(list: Model.EventItemList): LogMessage = {
    
    ARM.run { arm =>
      val conn = arm.manage(CaprisDB.getConnection)
      conn.setAutoCommit(false)
      try {
        val event = list.items
        event.map(handleEventDetails(conn))
        conn.commit
        LogMessage.None
      } catch {
        case ex: Exception =>
          conn.rollback
          LogMessage.Error("House Visit Update Exception: " + ex)
      }
    }
  }
  
   def handleEventDetails(conn: Connection)(item: Model.EventItem): LogMessage = {
    var eventItem = Event.EventItem(item.nric,item.title,item.date,item.startTime,item.endTime,item.desc)
    Event.insertEvent(conn, eventItem)
    LogMessage.None

  }
   
   def handleEventStatusDetails(conn: Connection)(status: Model.EventStatus): LogMessage = {
    var eventStatus = Event.EventStatusItem(status.nric,status.name,status.dateOfBirth,status.citizentype,status.hv_status,status.Remarks)
    Event.insertStatus(conn, eventStatus)
    LogMessage.None

  }
  
}
