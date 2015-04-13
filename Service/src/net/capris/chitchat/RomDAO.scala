package net.capris.chitchat

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

object RomDAO extends DAO with LoggingHelper2 {
  
def load(div : String) : Array[Term] = {
    ARM.run { arm=>
      val conn = arm.manage(CaprisDB.getConnection)
      val attrs = TermColumns.map(_.name).mkString(",")
      val sql = s"SELECT ${attrs} FROM d_ccc_term WHERE div_code=?"
      SQLLogger.info(sql)
      val ps = arm.manage(conn.prepareStatement(sql))
      //ps.setMaxRows(1)
      ps.setString(1,div)
      val rs = arm.manage(new RSWrapper(ps.executeQuery))
      val buffer = new ArrayBuffer[Term]
      while (rs.next) {
        buffer += Term(rs.getString,rs.getString,rs.getString)
      }
      buffer.toArray
      
    }
  }

def updateExcel(s:RomDAO.CCCTermDetail):LogMessage= {
   ARM.run { arm =>
        val conn = arm.manage(CaprisDB.getConnection)
        conn.setAutoCommit(false)
        val excelUrl= s.excel_url
        val div=s.div_code
        val start=s.term_start_date
        val end=s.term_end_date
        val sql = s"update d_ccc_term set div_status=?, appointment_excel_url=? where div_code=? and term_start_date=? and term_end_date=?;"
        SQLLogger.info(sql)
        try {
          val ps = arm.manage(conn.prepareStatement(sql))
          ps.setString(1,"Pending")
          ps.setString(2,excelUrl)
          ps.setString(3,div)
          ps.setString(4,start)
          ps.setString(5,end)
          ps.executeUpdate()
          conn.commit
          LogMessage.None
        }catch{
          case ex: Exception =>
          conn.rollback
          LogMessage.Error("House Visit Update Exception: " + ex)
        }
      }
}

val TermColumns = Array[Column](
    RWColumn("div_code", DataType.String, 45),
    RWColumn("term_start_date", DataType.String, 45),
    RWColumn("term_end_date", DataType.String, 45)
    
    )

def buildTerm(rs: RSWrapper): Term = {
    val div_code = rs.getString
    val term_start = rs.getString
    val term_end = rs.getString
    Term(div_code,term_start,term_end)
}

val CccTermColumns = Array[Column](
    RWColumn("div_code", DataType.String, 45),
    RWColumn("term_start_date", DataType.String, 45),
    RWColumn("term_end_date", DataType.String, 45),
    RWColumn("appointment_excel_url", DataType.String, 45)
    )
   
case class CCCTermDetail(
    div_code:String,
    term_start_date:String,
    term_end_date:String,
    excel_url:String
    )

case class Term(
    div_code:String,
    term_start_date:String,
    term_end_date:String
    )
}
 
