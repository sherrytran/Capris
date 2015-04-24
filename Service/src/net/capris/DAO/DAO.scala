package net.capris.DAO

import com.elixirtech.arch.ARM
import net.capris.service.db.CaprisDB
import scala.collection.mutable.ArrayBuffer
import com.elixirtech.arch.NamedLogger
import java.sql.ResultSet
import java.io.Closeable
import java.sql.PreparedStatement
import com.elixirtech.arch.LoggingHelper2

sealed trait DataType

object DataType {
  object String extends DataType
  object Boolean extends DataType
  object Long extends DataType
  object Integer extends DataType
  object Decimal extends DataType
  object Timestamp extends DataType
}

sealed trait AccessType
object AccessType {
  object ReadOnly extends AccessType
  object ReadWrite extends AccessType
}

case class Column(name : String, access : AccessType, dataType : DataType, length : Int)

object Column {
  def constrain(column : Column, s : String) : String = {
    if (s.length>column.length) s.substring(0,column.length)
    else s
  }
}

object ROColumn {
  def apply(name : String, dataType : DataType, length : Int) : Column = {
    Column(name,AccessType.ReadOnly,dataType,length)
  }
}

object RWColumn {
  def apply(name : String, dataType : DataType, length : Int) : Column = {
    Column(name,AccessType.ReadWrite,dataType,length)
  }
}

class RSWrapper(rs : ResultSet) extends Closeable {
  private var idx = 0
  def columnCount = rs.getMetaData.getColumnCount
  def next() : Boolean =  { idx = 0; rs.next }
  def close() = rs.close
  def getString() : String = { idx +=1; Option(rs.getString(idx)).map(_.trim).getOrElse("") }
  //def getDecimal() : java.math.BigDecimal = { idx +=1; Option(rs.getBigDecimal(idx)).getOrElse(java.math.BigDecimal.ZERO) }
  def getLong() : Long = { idx +=1; Option(rs.getLong(idx)).getOrElse(0L) }
  def getInt() : Int = { idx +=1; Option(rs.getInt(idx)).getOrElse(0) }
  def getBoolean() : Boolean = { idx +=1; Option(rs.getString(idx)).map(_=="1").getOrElse(false) }
  def getTimestamp() : Long = { idx +=1; Option(rs.getTimestamp(idx)).map(_.getTime).getOrElse(0L) }
}

class PSWrapper(ps : PreparedStatement) extends Closeable with LoggingHelper2 {
  private var idx = 0
  private val diagnostics = new ArrayBuffer[String]
  
  def setMaxRows(i : Int) = ps.setMaxRows(i)
  def setFetchSize(i : Int) = ps.setFetchSize(i)
  def close() = ps.close
  def setString(s : String) { 
    idx +=1
    ps.setString(idx,s) 
    diagnostics += s
  }
  /*def setDecimal(d : java.math.BigDecimal) { 
    idx +=1
    ps.setBigDecimal(idx,d)
    diagnostics += String.valueOf(d)
  }*/
  def setTimestamp(v : java.sql.Timestamp) { 
    idx +=1
    ps.setTimestamp(idx,v) 
    diagnostics += String.valueOf(v)
  }
  def setLong(v : Long) { 
    idx +=1
    ps.setLong(idx,v) 
    diagnostics += String.valueOf(v)
  }
  def setInt(v : Int) { 
    idx +=1
    ps.setInt(idx,v) 
    diagnostics += String.valueOf(v)
  }
  def setBoolean(b : Boolean) { 
    idx +=1
    ps.setString(idx,if (b) "1" else "0")
    diagnostics += String.valueOf(b)
  }
  def executeQuery() : RSWrapper = {
    log.debug(diagnostics.mkString("[",", ","]"))
    new RSWrapper(ps.executeQuery)
  }
  def executeUpdate() : Int = {
    log.debug(diagnostics.mkString("[",", ","]"))
    ps.executeUpdate
  }
}

trait DAO {
  
  val SQLLogger = new NamedLogger("CAPRIS.SQL")
  
  def ids(field : String, table : String) : Array[String] = {
    val start = System.currentTimeMillis
    ARM.run { arm=>
      val conn = arm.manage(CaprisDB.getReadOnlyConnection)
      val ps = arm.manage(conn.prepareStatement(s"SELECT DISTINCT $field FROM $table"))
      ps.setFetchSize(10000)
      val rs = arm.manage(ps.executeQuery)
      val buffer = new ArrayBuffer[String]
      while (rs.next) {
        Option(rs.getString(1)).foreach(buffer += _) 
      }
      val stop = System.currentTimeMillis
      println("Elapsed time: " + ((stop-start)/1000) + " seconds")
      buffer.toArray.sorted
    }
  }
  
  def idInts(field : String, table : String) : Array[Int] = {
    ARM.run { arm=>
      val conn = arm.manage(CaprisDB.getReadOnlyConnection)
      val ps = arm.manage(conn.prepareStatement(s"SELECT DISTINCT $field FROM $table"))
      ps.setFetchSize(10000)
      val rs = arm.manage(ps.executeQuery)
      val buffer = new ArrayBuffer[Int]
      while (rs.next) {
        Option(rs.getInt(1)).foreach(buffer += _) 
      }
      buffer.toArray
    }
  }


  def asBoolean(opt : Option[String]) : Boolean = opt.map(_=="1").getOrElse(false)
  def asOptBoolean(opt : Option[String]) : Option[Boolean] = opt.map(_=="1")
  def asOptBoolean(s : String) : Option[Boolean] = Option(s).map(_=="1")
}
