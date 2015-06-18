package net.capris.DAO

import com.elixirtech.arch._
import java.sql.Connection
import java.sql.Statement
import java.lang.System
import net.capris.service.db.CaprisDB
import scala.collection.mutable.ArrayBuffer

object CalendarDAO extends DAO with LoggingHelper2 {
  
def insertCalendarActivity(s : CalendarDetail,user:String):LogMessage ={
      ARM.run { arm =>
        val conn = arm.manage(CaprisDB.getConnection)
        conn.setAutoCommit(false)
        val cols = ActivityColumns.map(_.name)
        val attrs = cols.mkString(",")
        val q = cols.map(_=>"?").mkString(",")
        val sql = s"INSERT INTO c_calendar ($attrs) VALUES($q);"
        SQLLogger.info(sql)
        try {
            val ps = arm.manage(conn.prepareStatement(sql))
            prepareNewActivity(new PSWrapper(ps),s,user)
            ps.executeUpdate()
            conn.commit
            LogMessage.None
          }
          catch{
            case ex: Exception =>
            conn.rollback
            LogMessage.Error("Annnouncement Update Exception: " + ex)
          }
        
        } 
    }

val ActivityColumns = Array[Column](
    RWColumn("title", DataType.String, 30),
    RWColumn("description", DataType.String, 150),
    RWColumn("start_date", DataType.Timestamp, 45),
    RWColumn("end_date", DataType.Timestamp, 45),
    RWColumn("start_time", DataType.Timestamp, 45),
    RWColumn("end_time", DataType.Timestamp, 45),
    RWColumn("recur", DataType.Boolean,5),
    RWColumn("repeat_frequency", DataType.String, 10),
    RWColumn("Created_by", DataType.String, 45),
    RWColumn("Created_date", DataType.Timestamp, 45)
    )
    
def prepareNewActivity(ps: PSWrapper, s: CalendarDetail,user:String) {
    val cols = ActivityColumns
    ps.setString(Column.constrain(cols(0),s.title))
    ps.setString(Column.constrain(cols(1),s.description))
    ps.setString(Column.constrain(cols(2),s.start_date))
    ps.setString(Column.constrain(cols(3),s.end_date))
    ps.setString(Column.constrain(cols(4),s.start_time))
    ps.setString(Column.constrain(cols(5),s.end_time))
    ps.setBoolean(s.recur)
    ps.setString(Column.constrain(cols(7),s.repeat_frequency))
    ps.setString(Column.constrain(cols(8),user))
    ps.setString(Column.constrain(cols(9),formatTimestamp(nowTimestamp)))
  }

case class CalendarDetail(
    title:String,
    description:String,
    start_date:String,
    end_date:String,
    start_time:String,
    end_time:String,
    recur:Boolean,
    repeat_frequency:String
    
    )
}
 
