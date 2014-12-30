package net.capris.service.db

import scala.xml._
import scala.language.postfixOps
import java.io.File
import org.squeryl.PrimitiveTypeMode._
import org.squeryl._
import org.squeryl.adapters._
import org.squeryl.dsl.ast.CompositeKeyAttributeAssignment
import org.squeryl.dsl.ast.BinaryOperatorNode
import org.squeryl.dsl.ast.BinaryOperatorNodeLogicalBoolean
import org.squeryl.dsl.ast.LogicalBoolean
import org.squeryl.annotations.Column

import com.elixirtech.arch._
import com.elixirtech.arch.db.C3POPool
import com.elixirtech.arch.db.ConnectionPoolConfig
import com.elixirtech.arch.LoggingHelper2

import com.typesafe.config.Config
import com.elixirtech.arch.db.ConnectionPool
import com.elixirtech.api.AmbienceSettings
import java.util.Date
import com.typesafe.config.ConfigFactory
import java.sql.ResultSet
import com.elixirtech.api.AuditAPI
import scala.collection.immutable.Map
import java.util.concurrent.atomic.AtomicBoolean
import java.util.concurrent.atomic.AtomicReference
import java.sql.Timestamp



import org.squeryl.dsl.CompositeKey

object CaprisDB extends Schema with LoggingHelper2 {

  protected val pool = new AtomicReference[Option[ConnectionPool]](None)
  protected val isInitialized = new AtomicBoolean(false)
  protected val initConfig = new AtomicReference[Option[Config]](None)


  def testInit() : String = {
    log.warn("*** Using testInit ***")
    val config = ConfigFactory.load().getConfig("capris.db")
    init(config)
  }

  def isInit() = isInitialized.get
  def getConnection() = pool.get.map(_.getConnection).getOrElse(throw new IllegalStateException("Pool not initialized"))

  def init(config: Config) : String = {
    if (pool.compareAndSet(None,Some(new C3POPool(getPoolConfig(config))))) {
      initConfig.set(Some(config))
      //testPool()
      "Using " + config.getString("url")
    }
    else {
      "Init ignored"
    }
  }



  private def getPoolConfig(config: Config): ConnectionPoolConfig = {
    val driver = config.getString("driver")
    val url = config.getString("url")
    val user = config.getString("user")
    val password = AmbienceSettings.decrypt(config.getString("password"))
    val poolConfig = config.getConfig("pool")
    val minPoolSize = poolConfig.getInt("min-pool-size")
    val maxPoolSize = poolConfig.getInt("max-pool-size")
    val acquireRetryAttempts = poolConfig.getInt("acquire-retry-attempts")
    val acquireRetryDelay = poolConfig.getInt("acquire-retry-delay")
    val acquireIncrement = poolConfig.getInt("acquire-increment")
    val queryTimeout = poolConfig.getInt("query-timeout")
    val maxIdleTime = poolConfig.getInt("max-idle-time")
    val maxConnectionAge = poolConfig.getInt(" max-connection-age")
    log.info("BizInsights Database connection: " + url)
    new ConnectionPoolConfig(
      driver,
      url,
      minPoolSize,
      maxPoolSize,
      acquireRetryAttempts,
      acquireRetryDelay,
      acquireIncrement,
      user,
      password,
      maxIdleTime,
      maxConnectionAge,
      queryTimeout,
      None,
      Map.empty)
  }

  def getReadOnlyConnection() = {
    val conn = getConnection
    conn.setAutoCommit(false)
    conn.setReadOnly(true)
    conn
  }
}



