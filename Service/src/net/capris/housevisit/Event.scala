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
  
def updateEvent(conn : Connection, s:Model.Event,e:String) {
	 ARM.run { arm =>
        val nricArray= s.nric
	      val q = nricArray.map(_=>"?").mkString(",")
	      val sql = s"update f_citizen_address set hv_status=?,activity_id=? where PersonIDNo in ($q);"
	      SQLLogger.info(sql)
	      val ps = arm.manage(conn.prepareStatement(sql))
	      ps.setString(1,"7")
	      ps.setString(2,e)
	      for(i <- 0 until nricArray.length){
        	ps.setString(i+3,nricArray(i))
	      }
	      ps.executeUpdate()
	    }
}
 
def insertEvent(conn : Connection, s : Event) {
	    ARM.run { arm =>
	      val cols = EventColumns.map(_.name)
	      val attrs = cols.mkString(",")
	      val q = cols.map(_=>"?").mkString(",")
	      val sql = s"INSERT INTO m_activity ($attrs) VALUES($q);"
	      SQLLogger.info(sql)
	      val ps = arm.manage(conn.prepareStatement(sql))
	      prepareNewEvent(new PSWrapper(ps),s)
	      ps.executeUpdate()
	    }
	  }

val EventColumns = Array[Column](
    RWColumn("activity_id", DataType.String, 45),
    RWColumn("rc_code", DataType.String, 45),
    RWColumn("cgd_id", DataType.String, 45),
    RWColumn("activity_title", DataType.String, 45),
    RWColumn("activity_from_date", DataType.Timestamp, 45),
    RWColumn("activity_to_date", DataType.Timestamp, 45),
    RWColumn("activity_description", DataType.String, 45),
    RWColumn("activity_type", DataType.String, 45)
   
    )
   

def prepareNewEvent(ps: PSWrapper, s: Event) {
    val cols = EventColumns
    ps.setString(Column.constrain(cols(0),s.eventKey))
    ps.setString(Column.constrain(cols(1),s.rcCode))
    ps.setString(Column.constrain(cols(1),s.cgdId))
    ps.setString(Column.constrain(cols(2),s.title))
    ps.setString(Column.constrain(cols(3),s.startTime))
    ps.setString(Column.constrain(cols(4),s.endTime))
    ps.setString(Column.constrain(cols(5),s.desc))
    ps.setString(Column.constrain(cols(6),"house_visit"))
   
   
  }

  case class Event(
    title: String,
    startTime: String,
    endTime: String,
    desc: String,
     eventKey:String,
    cgdId:String,
    rcCode:String
   

		  )
 
}
 
