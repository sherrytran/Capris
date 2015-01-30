package net.capris.housevisit

import com.elixirtech.arch._
import java.sql.Connection
import java.sql.Statement
import java.lang.System
import net.capris.service.db.CaprisDB
import net.capris.profile.DAO
import net.capris.profile.Column
import net.capris.profile.RWColumn
import net.capris.profile.PSWrapper
import net.capris.profile.RSWrapper
import net.capris.profile.DataType

object Event extends DAO with LoggingHelper2 {
 
def insertEvent(conn : Connection, s : EventItem) {
	    ARM.run { arm =>
	      val cols = EventColumns.map(_.name)
	      val attrs = cols.mkString(",")
	      val q = cols.map(_=>"?").mkString(",")
	      val sql = s"INSERT INTO house_visit_event ($attrs) VALUES($q);"
	      SQLLogger.info(sql)
	      val ps = arm.manage(conn.prepareStatement(sql))
	      prepareNewEvent(new PSWrapper(ps),s)
	      ps.executeUpdate()
	    }
	  }

def insertStatus(conn : Connection, s : EventStatusItem) {
	    ARM.run { arm =>
	      val cols = EventStatusColumns.map(_.name)
	      val attrs = cols.mkString(",")
	      val q = cols.map(_=>"?").mkString(",")
	      val sql = s"INSERT INTO house_visit ($attrs) VALUES($q);"
	      SQLLogger.info(sql)
	      val ps = arm.manage(conn.prepareStatement(sql))
	      prepareEventStatus(new PSWrapper(ps),s)
	      ps.executeUpdate()
	    }
	  }

val EventStatusColumns = Array[Column](
    RWColumn("PersonIDNo", DataType.String, 10),
    RWColumn("PersonPrincipalName", DataType.String, 45),
    RWColumn("PersonBirthDate", DataType.String, 45),
    RWColumn("citizen_type", DataType.String, 45),
    RWColumn("hv_status", DataType.String, 45),
    RWColumn("Remarks", DataType.String, 45),
    RWColumn("KeyEvent", DataType.Integer, 100)
    )
    
val EventColumns = Array[Column](
    RWColumn("EventTitle", DataType.String, 45),
    RWColumn("EventDate", DataType.String, 45),
    RWColumn("StartTime", DataType.String, 45),
    RWColumn("EndTime", DataType.String, 45),
    RWColumn("Description", DataType.String, 45),
    RWColumn("KeyEvent", DataType.String, 45),
    RWColumn("CgdId", DataType.String, 45)
    
    )
   

def prepareNewEvent(ps: PSWrapper, s: EventItem) {
    val cols = EventColumns
    ps.setString(Column.constrain(cols(0),s.title))
    ps.setString(Column.constrain(cols(1),s.date))
    ps.setString(Column.constrain(cols(2),s.startTime))
    ps.setString(Column.constrain(cols(3),s.endTime))
    ps.setString(Column.constrain(cols(4),s.desc))
    ps.setString(Column.constrain(cols(5),s.eventKey))
    ps.setString(Column.constrain(cols(6),s.cgdId))
   
   
  }

 def prepareEventStatus(ps: PSWrapper, s: EventStatusItem) {
    val cols = EventStatusColumns
    ps.setString(Column.constrain(cols(0),s.nric))
    ps.setString(Column.constrain(cols(1),s.name))
    ps.setString(Column.constrain(cols(2),s.dateofbirth))
    ps.setString(Column.constrain(cols(3),s.citizentype))
    ps.setString(Column.constrain(cols(4),s.status))
    ps.setString(Column.constrain(cols(5),s.remarks))
    ps.setString(Column.constrain(cols(6),s.eventKey))
   
  }
 
  def buildEvent(rs: RSWrapper): EventItem = {
    rs.next
    EventItem(rs.getString, rs.getString, rs.getString, rs.getString, rs.getString,rs.getString,rs.getString)
  }

  
  case class EventItem(
	
    title: String,
    date: String,
    startTime: String,
    endTime: String,
    desc: String,
    eventKey:String,
   cgdId:String)
    
  case class EventStatusItem(
	nric: String,
    name: String,
    dateofbirth: String,
    citizentype: String,
    status: String,
    remarks: String,
    eventKey:String)
}
