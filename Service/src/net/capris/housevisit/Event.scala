package net.capris.housevisit

import com.elixirtech.arch._
import java.sql.Connection
import java.sql.Statement
import java.lang.System
import net.capris.service.db.CaprisDB
import net.capris.DAO._

object Event extends DAO with LoggingHelper2 {
  
def updateEvent(conn : Connection, s:Model.Event) {
	 ARM.run { arm =>
        val nricArray= s.nric
	      val q = nricArray.map(_=>"?").mkString(",")
	      val sql = s"update f_citizen_address set hv_status=? where PersonIDNo in ($q) and hv_status=2;"
	      SQLLogger.info(sql)
	      val ps = arm.manage(conn.prepareStatement(sql))
	      ps.setString(1,"7")
	      for(i <- 0 until nricArray.length){
        	ps.setString(i+2,nricArray(i))
	      }
	      ps.executeUpdate()
	    }
}
 
def insertEvent(conn : Connection, s : Event) {
	    ARM.run { arm =>
	      val cols = EventColumns.map(_.name)
	      val attrs = cols.mkString(",")
	      val q = cols.map(_=>"?").mkString(",")
	      val sql = s"INSERT INTO f_activity ($attrs) VALUES($q);"
	      SQLLogger.info(sql)
	      val ps = arm.manage(conn.prepareStatement(sql))
	      prepareNewEvent(new PSWrapper(ps),s)
	      ps.executeUpdate()
	    }
	  }

def insertHvActivity(conn : Connection, s : HvActivity) {
      ARM.run { arm =>
        val cols = ActivityColumns.map(_.name)
        val attrs = cols.mkString(",")
        val q = cols.map(_=>"?").mkString(",")
        val sql = s"INSERT INTO f_house_visit_activity ($attrs) VALUES($q);"
        SQLLogger.info(sql)
        val ps = arm.manage(conn.prepareStatement(sql))
        prepareNewHvActivity(new PSWrapper(ps),s)
        ps.executeUpdate()
      }
    }

val EventColumns = Array[Column](
    RWColumn("detail_id", DataType.String, 45),
    RWColumn("rc_code", DataType.String, 45),
    RWColumn("div_code", DataType.String, 45),
    RWColumn("title", DataType.String, 45),
    RWColumn("start_date", DataType.Timestamp, 45),
    RWColumn("end_date", DataType.Timestamp, 45),
    RWColumn("start_time", DataType.Timestamp, 45),
    RWColumn("end_time", DataType.Timestamp, 45),
    RWColumn("description", DataType.String, 45),
    RWColumn("activity_type", DataType.String, 45),
    RWColumn("pre_reminder_day", DataType.String, 45),
    RWColumn("post_reminder_day", DataType.String, 45)
    )
    
val ActivityColumns = Array[Column](
    RWColumn("hv_activity_id", DataType.String, 45),
    RWColumn("PersonIDNo", DataType.String, 45),
    RWColumn("floor_no", DataType.String, 45),
    RWColumn("unit_no", DataType.String, 45),
    RWColumn("postal_code", DataType.String, 45),
    RWColumn("reg_date", DataType.Timestamp, 45),
    RWColumn("hv_status", DataType.Timestamp, 45)
    )
   

def prepareNewEvent(ps: PSWrapper, s: Event) {
    val cols = EventColumns
    ps.setString(Column.constrain(cols(0),s.eventKey))
    ps.setString(Column.constrain(cols(1),s.rcCode))
    ps.setString(Column.constrain(cols(1),s.div_code))
    ps.setString(Column.constrain(cols(2),s.title))
    ps.setString(Column.constrain(cols(3),s.date))
    ps.setString(Column.constrain(cols(4),s.date))
    ps.setString(Column.constrain(cols(5),s.startTime))
    ps.setString(Column.constrain(cols(6),s.endTime))
    ps.setString(Column.constrain(cols(7),s.desc))
    ps.setString(Column.constrain(cols(8),"house_visit"))
   ps.setInt(s.pre_remind)
   ps.setInt(s.post_remind)
   
  }

def prepareNewHvActivity(ps: PSWrapper, s: HvActivity) {
    val cols = ActivityColumns
    ps.setString(Column.constrain(cols(0),s.eventKey))
    ps.setString(Column.constrain(cols(1),s.nric))
    ps.setString(Column.constrain(cols(2),s.floorNo))
    ps.setString(Column.constrain(cols(3),s.unitNo))
    ps.setString(Column.constrain(cols(4),s.postalCode))
    ps.setString(Column.constrain(cols(5),s.regDate))
    ps.setInt(7)
   
  }

  case class Event(
    title: String,
    date:String,
    startTime: String,
    endTime: String,
    desc: String,
    eventKey:String,
    div_code:String,
    rcCode:String,
    pre_remind:Int,
    post_remind:Int
		  )
      
   case class HvActivity(
    eventKey: String,
    nric: String,
    floorNo: String,
    unitNo: String,
    postalCode:String,
    regDate:String
    
      )
}
 
