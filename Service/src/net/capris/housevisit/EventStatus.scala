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

object EventStatus extends DAO with LoggingHelper2 {
    
def insert(conn : Connection, s : EventItem) {
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

val EventColumns = Array[Column](
    RWColumn("PersonIDNo", DataType.String, 10),
    RWColumn("PersonPrincipalName", DataType.String, 45),
    RWColumn("PersonBirthDate", DataType.String, 45),
    RWColumn("citizen_type", DataType.String, 45),
    RWColumn("hv_status", DataType.String, 45),
    RWColumn("Remarks", DataType.Integer, 100))
   
  def prepareNewEvent(ps: PSWrapper, s: EventItem) {
	val key = java.lang.System.currentTimeMillis()
    val cols = EventColumns
    ps.setString(Column.constrain(cols(0),s.nric))
    ps.setString(Column.constrain(cols(1),s.name))
    ps.setString(Column.constrain(cols(2),s.dateofbirth))
    ps.setString(Column.constrain(cols(3),s.status))
    ps.setString(Column.constrain(cols(4),s.remarks))
    ps.setLong(Math.abs(key.toInt))
   
  }

  def buildEvent(rs: RSWrapper): EventItem = {
    rs.next
    EventItem(rs.getString,rs.getString, rs.getString, rs.getString, rs.getString)
  }


  case class EventItem(
	nric: String,
    name: String,
    dateofbirth: String,
    status: String,
    remarks: String)

}
