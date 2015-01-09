package net.capris.web

import com.elixirtech.arch.ARM
import com.elixirtech.arch.LogMessage
import com.elixirtech.arch.LoggingHelper2

import net.capris.service.db.CaprisDB
 
object HouseVisit extends LoggingHelper2 {
    
  def updateFor(accountId : String) : LogMessage = {
    
    try {
      val test1="testing12"
    val test2="testing2"
      CaprisDB.testInit
      ARM.run { arm=>
        val conn = arm.manage(CaprisDB.getConnection)
        val sql = "INSERT INTO house_visit_test VALUES (?,?,?)"
        val ps = conn.prepareStatement(sql)
          ps.setString(1,accountId)
          ps.setString(2,test1)
          ps.setString(3,test2)
          ps.executeUpdate()
          log.debug(s"Inserting $accountId,$test1,$test2")
          
      }
      log.info(s"test for house visit")
      LogMessage.None
    }
    catch {
      case ex : Exception =>
        log.error(s"Error updating house visit table for $accountId: $ex",ex)
        LogMessage.Error(s"Error updating house visit table: $ex")
    }
  }
  
}
