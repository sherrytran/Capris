package net.capris.DAO

import com.elixirtech.arch._
import java.sql.Connection
import java.sql.Statement
import java.lang.System
import net.capris.service.db.CaprisDB
import scala.collection.mutable.ArrayBuffer
import net.capris.DAO._

object CCCTermDAO extends DAO with LoggingHelper2 {
  
def load(div : String) : Array[Term] = {
    ARM.run { arm=>
      val conn = arm.manage(CaprisDB.getConnection)
      val attrs = TermColumns.map(_.name).mkString(",")
      val sql = s"SELECT ${attrs} FROM c_ccc_term WHERE div_code=?"
      SQLLogger.info(sql)
      val ps = arm.manage(conn.prepareStatement(sql))
      //ps.setMaxRows(1)
      ps.setString(1,div)
      val rs = arm.manage(new RSWrapper(ps.executeQuery))
      val buffer = new ArrayBuffer[Term]
      while (rs.next) {
        buffer += Term(rs.getString,rs.getString,rs.getString,rs.getString,rs.getString)
      }
      buffer.toArray
      
    }
  }

def updateExcel(s:CCCTermDAO.CCCTermDetail,user:String):LogMessage= {
   ARM.run { arm =>
        val conn = arm.manage(CaprisDB.getConnection)
        conn.setAutoCommit(false)
        val excelUrl= s.url
        val div=s.div_code
        val start=s.term_start_date
        val end=s.term_end_date
        val remark = s.div_remark
        val sql = s"update c_ccc_term set div_status='Pending',hq_status='Waiting HQ',appointment_excel_url=? , div_remark=?,Modified_By=?,Modified_Date=? where div_code=? and term_start_date=? and term_end_date=?;"
        SQLLogger.info(sql)
        try {
          val ps = arm.manage(conn.prepareStatement(sql))
          ps.setString(1,excelUrl)
          ps.setString(2,remark)
          ps.setString(3,user)
          ps.setString(4,formatTimestamp(nowTimestamp))
          ps.setString(5,div)
          ps.setString(6,start)
          ps.setString(7,end)
          ps.executeUpdate()
          conn.commit
          LogMessage.None
        }catch{
          case ex: Exception =>
          conn.rollback
          LogMessage.Error("CCC Term Update Exception: " + ex)
        }
      }
}

def updatePDF(s:CCCTermDAO.CCCTermDetail):LogMessage= {
   ARM.run { arm =>
        val conn = arm.manage(CaprisDB.getConnection)
        conn.setAutoCommit(false)
        val pdfUrl= s.url
        val div=s.div_code
        val start=s.term_start_date
        val end=s.term_end_date
        val remark = s.div_remark
        val sql = s"update d_ccc_term set div_status=CASE WHEN appointment_excel_url is null or appointment_excel_url='' THEN null ELSE 'Pending' END,hq_status=CASE WHEN appointment_excel_url is null or appointment_excel_url='' THEN 'Waiting CO' ELSE 'Waiting HQ' END , appointment_pdf_url=? where div_code=? and term_start_date=? and term_end_date=?;"
        SQLLogger.info(sql)
        try {
          val ps = arm.manage(conn.prepareStatement(sql))
          ps.setString(1,pdfUrl)
          ps.setString(2,div)
          ps.setString(3,start)
          ps.setString(4,end)
          ps.executeUpdate()
          conn.commit
          LogMessage.None
        }catch{
          case ex: Exception =>
          conn.rollback
          LogMessage.Error("CCC Term Update Exception: " + ex)
        }
      }
}

val TermColumns = Array[Column](
    RWColumn("div_code", DataType.String, 45),
    RWColumn("term_start_date", DataType.String, 45),
    RWColumn("term_end_date", DataType.String, 45),
    RWColumn("appointment_excel_url", DataType.String, 1000),
    RWColumn("hq_status", DataType.String, 45)
    )

def buildTerm(rs: RSWrapper): Term = {
    val div_code = rs.getString
    val term_start = rs.getString
    val term_end = rs.getString
    val excel_url=rs.getString
    val hq_status=rs.getString
    Term(div_code,term_start,term_end,excel_url,hq_status)
}

val CccTermColumns = Array[Column](
    RWColumn("div_code", DataType.String, 45),
    RWColumn("term_start_date", DataType.String, 45),
    RWColumn("term_end_date", DataType.String, 45),
    RWColumn("appointment_excel_url", DataType.String, 1000),
    RWColumn("div_remark",DataType.String, 200)
    )
   
case class CCCTermDetail(
    div_code:String,
    term_start_date:String,
    term_end_date:String,
    url:String,
    div_remark:String    )

case class Term(
    div_code:String,
    term_start_date:String,
    term_end_date:String,
    excel_url:String,
    hq_status:String
    )
}
 
