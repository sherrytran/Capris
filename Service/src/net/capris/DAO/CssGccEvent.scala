package net.capris.DAO

import com.elixirtech.arch._
import java.sql.Connection
import java.sql.Statement
import java.lang.System
import net.capris.service.db.CaprisDB


object CssGccEvent extends DAO with LoggingHelper2 {
  
  def insertEvent(s : Event): LogMessage = {
  	    ARM.run { arm =>
          val conn = arm.manage(CaprisDB.getConnection)
          conn.setAutoCommit(false)
  	      val cols = EventColumns.map(_.name)
  	      val attrs = cols.mkString(",")
  	      val q = cols.map(_=>"?").mkString(",")
          log.info(q)
  	      val sql = s"INSERT INTO css_gcc_event ($attrs) VALUES($q);"
  	      SQLLogger.info(sql)
          try {
    	      val ps = arm.manage(conn.prepareStatement(sql))
    	      prepareNewEvent(new PSWrapper(ps),s)
    	      ps.executeUpdate()
            conn.commit
            LogMessage.None
          }
          catch{
            case ex: Exception =>
            conn.rollback
            LogMessage.Error("CSS GSS Activity Update Exception: " + ex)
          }
  	    }
  	  }

val EventColumns = Array[Column](
    RWColumn("activity_type", DataType.String, 45),
    RWColumn("div_code", DataType.String, 45),
    RWColumn("activity_name", DataType.String, 45),
    RWColumn("activity_date", DataType.Timestamp, 45),
    RWColumn("activity_start_time", DataType.Timestamp, 45),
    RWColumn("activity_end_time", DataType.Timestamp, 45),
    RWColumn("venue", DataType.String, 45),
    RWColumn("goh", DataType.String, 45),
    RWColumn("seating_capacity", DataType.Integer,45),
    RWColumn("staff_ic", DataType.String, 45),
    RWColumn("reimbursement", DataType.String, 45),
    RWColumn("refreshment", DataType.String, 45),
    RWColumn("delivery_address", DataType.String, 45)
    )
   

def prepareNewEvent(ps: PSWrapper, s: Event) {
    val cols = EventColumns
    ps.setString(Column.constrain(cols(0),s.actType))
    ps.setString(Column.constrain(cols(1),s.div))
    ps.setString(Column.constrain(cols(2),s.desc))
    ps.setString(Column.constrain(cols(3),s.date))
    ps.setString(Column.constrain(cols(4),s.start))
    ps.setString(Column.constrain(cols(5),s.end))
    ps.setString(Column.constrain(cols(6),s.venue))
    ps.setString(Column.constrain(cols(7),s.goh))
    ps.setInt(s.seat)
    ps.setString(Column.constrain(cols(9),s.staff))
    ps.setString(Column.constrain(cols(10),s.re))
    ps.setString(Column.constrain(cols(11),s.meal))
    ps.setString(Column.constrain(cols(12),s.delivery))
  }

  case class Event(
    actType:String,
    div: String,
    desc: String,
    date:String,
    start: String,
     end:String,
    venue:String,
    goh:String,
    seat:Int,
    staff:String,
    re:String,
    meal:String,
    delivery:String
		  )
 
}
 
