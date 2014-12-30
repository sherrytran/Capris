package net.capris.web

import java.security.MessageDigest
import java.util.StringTokenizer
import org.apache.commons.codec.binary.Base64
import com.elixirtech.api.UserGroupAPI
import com.elixirtech.arch._
import net.capris.service.db.CaprisDB


object HouseVisit extends LoggingHelper2 {
  
  def generateFor(accountId : String) : LogMessage = {
    log.info(s"Generating OTP for $accountId")
    
    try {
      val userId="testing12"
    val otp="testing2"
      ARM.run { arm=>
        val conn = arm.manage(CaprisDB.getConnection)
        val sql = "INSERT INTO house_visit_test VALUES (?,?,?)"
        val ps = conn.prepareStatement(sql)
          ps.setString(1,accountId)
          ps.setString(2,userId)
          ps.setString(3,otp)
         
          log.debug(s"Inserting $accountId,$userId,$otp")
          
        
      }
      log.info(s"test for house visit")
      LogMessage.None
    }
    catch {
      case ex : Exception =>
        log.error(s"Error generating OTP for $accountId: $ex",ex)
        LogMessage.Error(s"Error generating OTP: $ex")
    }
  }
  
  

}
