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
        val event = list.items.groupBy(_.title)
        event.map(handleEventDetails(conn))
        //key1 = Math.abs(random.toInt).toString
        conn.commit
        LogMessage.None
      } catch {
        case ex: Exception =>
          conn.rollback
          LogMessage.Error("House Visit Update Exception: " + ex)
      }
    }
  }
  
   def handleEventDetails(conn: Connection)(s: (String, List[Model.EventItem])): LogMessage = {
    var (eventKey,items) = s
    val random=java.lang.System.currentTimeMillis()
    var key2 = Math.abs(random.toInt).toString
    var eventItem = new Event.EventItem("","","","","","","")
    eventKey = key2
    items.map{i=> eventItem = Event.EventItem(i.title,i.date,i.startTime,i.endTime,i.desc,eventKey,i.cgdId)
    }
    println(eventItem)
    Event.insertEvent(conn, eventItem)
    items.map{i=>var eventStatusItem = Event.EventStatusItem(i.nric,i.name,i.dateOfBirth,i.citizentype,i.hv_status,i.Remarks,eventKey)
    Event.insertStatus(conn, eventStatusItem)
    }
    LogMessage.None

  }
   
   
  
}
