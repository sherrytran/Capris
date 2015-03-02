package net.capris.integration

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
import scala.collection.mutable.ArrayBuffer

object Activity extends DAO with LoggingHelper2 {
  
def activityList() : Array[Activity] = {
    ARM.run { arm=>
      val conn = arm.manage(CaprisDB.getConnection)
      conn.setAutoCommit(false)
      val sql = "SELECT distinct fiscal_year, engagement_title FROM c_int_engagement"
      SQLLogger.info(sql)
      val ps = arm.manage(new PSWrapper(conn.prepareStatement(sql)))
      ps.setFetchSize(1000)
      ps.setMaxRows(1000)
      val rs = arm.manage(ps.executeQuery)
      val buffer = new ArrayBuffer[Activity]
      while (rs.next) {
        buffer += Activity(rs.getInt,rs.getString)
      }
      buffer.toArray
    }
  }

 
def insertActivityDetail(s : ActivityDetail) : LogMessage = {
	    ARM.run { arm =>
	      val conn = arm.manage(CaprisDB.getConnection)
	      conn.setAutoCommit(false)
	      val cols = EventColumns.map(_.name)
	      val attrs = cols.mkString(",")
	      val q = cols.map(_=>"?").mkString(",")
	      val sql = s"INSERT INTO int_engagement_activity ($attrs) VALUES($q);"
	      SQLLogger.info(sql)
	      try {
	        val ps = arm.manage(conn.prepareStatement(sql))
		      prepareNewEvent(new PSWrapper(ps),s)
		      ps.executeUpdate()
		      conn.commit
	        LogMessage.None
	      } catch {
	        case ex: Exception =>
	          conn.rollback
	          LogMessage.Error("House Visit Update Exception: " + ex)
	      }
	     
	    }
	    LogMessage.None
	  }

val EventColumns = Array[Column](
    RWColumn("engagement_title", DataType.String, 45),
    RWColumn("activity_date", DataType.Timestamp, 45),
    RWColumn("activity_description", DataType.String, 45),
    RWColumn("main_organiser", DataType.String, 45),
    RWColumn("staff_ic_name", DataType.String, 45),
    RWColumn("no_participants", DataType.Integer, 45),
    RWColumn("no_immigrants", DataType.Integer, 45),
    RWColumn("budget_spent", DataType.Integer, 45),
    RWColumn("onepa_activity_code", DataType.String, 45)
    )
   

def prepareNewEvent(ps: PSWrapper, s: ActivityDetail) {
    val cols = EventColumns
    ps.setString(Column.constrain(cols(0),s.title))
    ps.setString(Column.constrain(cols(1),s.date))
    ps.setString(Column.constrain(cols(2),s.description))
    ps.setString(Column.constrain(cols(3),s.organiser))
    ps.setString(Column.constrain(cols(4),s.staff))
    ps.setInt(s.participants)
    ps.setInt(s.immigrants)
    ps.setInt(s.budget)
    ps.setString(Column.constrain(cols(8),s.onepa))
  }

  case class Activity(
    year: Int,
    title: String
		  )

  case class ActivityDetail(
    title: String,
    date: String,
    description: String,
    organiser: String,
    staff: String,
    participants: Int,
    immigrants: Int,
    budget:Int,
    onepa:String
		  )
 
}
 
