package net.capris.DAO

import com.elixirtech.arch._
import java.sql.Connection
import java.sql.Statement
import java.lang.System
import net.capris.service.db.CaprisDB
import scala.collection.mutable.ArrayBuffer
import net.capris.DAO._

object CCddCsDivDAO extends DAO with LoggingHelper2 {
  
def load() : Array[CCddCsDiv] = {
    ARM.run { arm=>
      val conn = arm.manage(CaprisDB.getConnection)
      val attrs = CddCsDivColumns.map(_.name).mkString(",")
      val sql = s"SELECT ${attrs} FROM c_cdd_cs_div"
      SQLLogger.info(sql)
      val ps = arm.manage(conn.prepareStatement(sql))
      val rs = arm.manage(new RSWrapper(ps.executeQuery))
      val buffer = new ArrayBuffer[CCddCsDiv]
      while (rs.next) {
        buffer += CCddCsDiv(rs.getString,rs.getString,rs.getString,rs.getString,rs.getString,rs.getString,rs.getString)
      }
      buffer.toArray
      
    }
  }

   
val CddCsDivColumns = Array[Column](
    RWColumn("cgd_id", DataType.String, 45),
    RWColumn("cdd_code", DataType.String, 45),
    RWColumn("cdd_name", DataType.String, 45),
    RWColumn("capris_cs_code", DataType.String, 20),
    RWColumn("capris_cs_name", DataType.String, 20),
    RWColumn("div_code", DataType.String, 10),
    RWColumn("div_name",DataType.String,10)
    )

case class CCddCsDiv(
    cgd_id:String,
    cdd_code:String,
    cdd_name:String,
    capris_cs_code:String,
    capris_cs_name:String,
    div_code:String,
    div_name:String
    )
}
 
