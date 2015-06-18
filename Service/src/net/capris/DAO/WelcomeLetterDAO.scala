package net.capris.DAO

import com.elixirtech.arch._
import java.sql.Connection
import java.sql.Statement
import java.lang.System
import net.capris.service.db.CaprisDB
import scala.collection.mutable.ArrayBuffer
import net.capris.DAO._

object WelcomeLetterDAO extends DAO with LoggingHelper2 {
  
def UpdateWelcomeLetter(list: PeopleInfoList): LogMessage = {
  ARM.run { arm =>
      val conn = arm.manage(CaprisDB.getConnection)
      conn.setAutoCommit(false)
      try {
        list.items.map(updatePrintLetterStatus(conn))
        conn.commit
        LogMessage.None
      } catch {
        case ex: Exception =>
          conn.rollback
          LogMessage.Error("Welcome Letter Update Exception: " + ex)
      }
    }
   }
  
def updatePrintLetterStatus(conn: Connection)(s:WelcomeLetterDAO.PeopleInfo):LogMessage= {
   ARM.run { arm =>
        val nric= s.nric
        val postal = s.postal_code
        val reg_date=s.reg_date
        val letter_type=s.letter_type
        val sql = s"update f_citizen_address set print_welcome_letter=1,letter_type=?,print_date=? where PersonIDNo=? and postal_code=? and reg_date=?;"
        SQLLogger.info(sql)
        try {
          val ps = arm.manage(conn.prepareStatement(sql))
          ps.setString(1,letter_type)
          ps.setString(2,formatTimestamp(nowTimestamp))
          ps.setString(3,nric)
          ps.setString(4,postal)
          ps.setString(5,reg_date)
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
  
case class PeopleInfo(
    nric:String,
    postal_code:String,
    reg_date:String,
    letter_type:String
    )

case class PeopleInfoList(
    items:List[PeopleInfo]
    )

}
 
