package net.capris.profile

import com.elixirtech.arch._
import net.capris.service.db.CaprisDB
import java.io.ByteArrayOutputStream
import java.io.ByteArrayInputStream
import scala.collection.mutable.HashMap


object UserConfigDAO extends DAO with LoggingHelper2 {
  
  def load(id : String, key : String) : Option[Array[Byte]] = {
    ARM.run { arm=>
      val conn = arm.manage(CaprisDB.getConnection)
      val sql = s"SELECT VALUE FROM bzn_userconfig WHERE ID=? AND KEY=?"
      SQLLogger.info(sql)
      val ps = arm.manage(conn.prepareStatement(sql))
      ps.setMaxRows(1)
      ps.setString(1,id)
      ps.setString(2,key)
      val rs = arm.manage(ps.executeQuery)
      if (rs.next) {
        val baos = new ByteArrayOutputStream
        rs.getBinaryStream(1).copyTo(baos)
        Some(baos.toByteArray)
      }
      else {
        None
      }
    }
  }
 
 
}
