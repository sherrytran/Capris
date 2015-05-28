package net.capris.DAO

import com.elixirtech.arch._
import java.sql.Connection
import java.sql.Statement
import java.lang.System
import net.capris.service.db.CaprisDB
import scala.collection.mutable.ArrayBuffer

object ChitChatActivity extends DAO with LoggingHelper2 {
  
def load(div : String) : Array[Location] = {
    ARM.run { arm=>
      val conn = arm.manage(CaprisDB.getConnection)
      val attrs = LocationColumns.map(_.name).mkString(",")
      val sql = s"SELECT ${attrs} FROM rcnc_table WHERE div_code=?"
      SQLLogger.info(sql)
      val ps = arm.manage(conn.prepareStatement(sql))
      //ps.setMaxRows(1)
      ps.setString(1,div)
      val rs = arm.manage(new RSWrapper(ps.executeQuery))
      val buffer = new ArrayBuffer[Location]
      while (rs.next) {
        buffer += Location(rs.getString,rs.getString,rs.getString,rs.getString)
      }
      buffer.toArray
      
    }
  }

def insertChitChatDetail(s : Details) : LogMessage = {
      ARM.run { arm =>
        val conn = arm.manage(CaprisDB.getConnection)
        conn.setAutoCommit(false)
        val cols = ChitChatColumns.map(_.name)
        val attrs = cols.mkString(",")
        val q = cols.map(_=>"?").mkString(",")
        val sql = s"INSERT INTO f_chit_chat_activity ($attrs) VALUES($q);"
        SQLLogger.info(sql)
        try {
          val ps = arm.manage(conn.prepareStatement(sql,Statement.RETURN_GENERATED_KEYS))
          prepareNewEvent(new PSWrapper(ps),s)
          ps.executeUpdate()
          val key = ps.getGeneratedKeys()
          if(key.next()){
            val keyID = key.getLong(1)
            insertChitChatActivity(s.basic.head,conn,keyID)
            conn.commit() 
          }
          else {
            throw new RuntimeException("No key returned from first insert")
          } 
          LogMessage.None
        } catch {
          case ex: Exception =>
            conn.rollback
            LogMessage.Error("Chit Chat Session Exception: " + ex)
        }
       
      }
      LogMessage.None
    }

def insertChitChatActivity(s : ActivityDetail, conn : Connection, key:Long) {
      ARM.run { arm =>
        val cols = ActivityColumns.map(_.name)
        val attrs = cols.mkString(",")
        val q = cols.map(_=>"?").mkString(",")
        val sql = s"INSERT INTO f_activity ($attrs) VALUES($q);"
        SQLLogger.info(sql)
        val ps = arm.manage(conn.prepareStatement(sql))
        prepareNewActivity(new PSWrapper(ps),s,key)
        ps.executeUpdate()
        } 
    }

val LocationColumns = Array[Column](
    RWColumn("div_code", DataType.String, 45),
    RWColumn("div_name", DataType.String, 45),
    RWColumn("rc_code", DataType.String, 45),
    RWColumn("rc_name", DataType.String, 45)   
    )

def buildLocation(rs: RSWrapper): Location = {
    val div_code = rs.getString
    val div_name = rs.getString
    val rc_code = rs.getString
    val rc_name = rs.getString
    Location(div_code,div_name,rc_code,rc_name)
}

val ChitChatColumns = Array[Column](
    RWColumn("div_code", DataType.Timestamp, 45),
    RWColumn("rc_code", DataType.String, 45),
    RWColumn("adviser_name", DataType.String, 45),
    RWColumn("venue", DataType.String, 45),
    RWColumn("facilitator_name", DataType.Integer, 45),
    RWColumn("CLJ_tour", DataType.Integer, 45),
    RWColumn("phase1_date", DataType.String, 45),
    RWColumn("phase2_date", DataType.String, 45),
    RWColumn("remark", DataType.String, 45),
    RWColumn("citizen_local_participated", DataType.String, 45),
    RWColumn("citizen_newimmigrant_participated", DataType.String, 45),
    RWColumn("citizen_foreigner_participated", DataType.String, 45),
    RWColumn("country_china_participated", DataType.String, 45),
    RWColumn("country_malaysia_participated", DataType.String, 45),
    RWColumn("country_india_participated", DataType.String, 45),
    RWColumn("country_singapore_participated", DataType.String, 45),
    RWColumn("country_indonesia_participated", DataType.String, 45),
    RWColumn("country_philippines_participated", DataType.String, 45),
    RWColumn("country_other_participated", DataType.String, 45),
    RWColumn("country_other_remark", DataType.String, 45),
    RWColumn("ethnic_chinese_participated", DataType.String, 45),
    RWColumn("ethnic_malay_participated", DataType.String, 45),
    RWColumn("ethnic_indian_participated", DataType.String, 45),
    RWColumn("ethnic_other_participated", DataType.String, 45),
    RWColumn("supporting_document_url", DataType.String, 1000)
    )

val ActivityColumns = Array[Column](
    RWColumn("detail_id", DataType.String, 45),
    RWColumn("rc_code", DataType.String, 45),
    RWColumn("div_code", DataType.String, 45),
    RWColumn("start_date", DataType.Timestamp, 45),
    RWColumn("end_date", DataType.Timestamp, 45),
    RWColumn("activity_type", DataType.String, 45)
    )
    
def prepareNewActivity(ps: PSWrapper, s: ActivityDetail, key:Long) {
    val cols = ActivityColumns
    ps.setLong(key)
    ps.setString(Column.constrain(cols(1),s.rc_code))
    ps.setString(Column.constrain(cols(2),s.div_code))
    ps.setString(Column.constrain(cols(3),s.phase1_date))
    ps.setString(Column.constrain(cols(4),s.phase2_date))
    ps.setString(Column.constrain(cols(5),"chit_chat"))
  }

def prepareNewEvent(ps: PSWrapper,g:ChitChatActivity.Details) {
    val cols = ChitChatColumns
    val s=g.basic.head
    val e=g.number.head
    ps.setString(Column.constrain(cols(0),s.div_code))
    ps.setString(Column.constrain(cols(1),s.rc_code))
    ps.setString(Column.constrain(cols(2),s.adviser))
    ps.setString(Column.constrain(cols(3),s.venue))
    ps.setString(Column.constrain(cols(4),s.faci))
    ps.setString(Column.constrain(cols(5),s.tour))
    ps.setString(Column.constrain(cols(6),s.phase1_date))
    ps.setString(Column.constrain(cols(7),s.phase2_date))
    ps.setString(Column.constrain(cols(8),s.remark))
    ps.setInt(e.ci_local_part)
    ps.setInt(e.ci_imm_part)
    ps.setInt(e.ci_for_part)
    ps.setInt(e.co_china_part)
    ps.setInt(e.co_malaysia_part)
    ps.setInt(e.co_india_part)
    ps.setInt(e.co_sing_part)
    ps.setInt(e.co_indonesia_part)
    ps.setInt(e.co_philip_part)
    ps.setInt(e.co_other_part)
    ps.setString(Column.constrain(cols(19),e.co_other_remark))
    ps.setInt(e.et_chinese_part)
    ps.setInt(e.et_malay_part)
    ps.setInt(e.et_indian_part)
    ps.setInt(e.et_other_part)
    ps.setString(Column.constrain(cols(24),e.url))
  }



case class ActivityDetail(
    cs_code: String,
    div_code: String,
    rc_code: String,
    adviser: String,
    venue: String,
    faci: String,
    tour:String,
    phase1_date:String,
    phase2_date:String,
    remark:String)
    
case class CountDetail(
   ci_local_part:Int,
   ci_imm_part:Int,
   ci_for_part:Int,
   co_china_part:Int,
   co_malaysia_part:Int,
   co_india_part:Int,
   co_sing_part:Int,
   co_indonesia_part:Int,
   co_philip_part:Int,
   co_other_part:Int,
   co_other_remark:String,
   et_chinese_part:Int,
   et_malay_part:Int,
   et_indian_part: Int,
   et_other_part: Int,
   url:String
    )

case class Details(basic: List[ActivityDetail], number: List[CountDetail])
 
case class Location(
    div_code:String,
    div_name:String,
    rc_code:String,
    rc_name:String
    )
    
case class Activity(
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
}
 
