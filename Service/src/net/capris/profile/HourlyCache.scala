package net.capris.profile

import org.joda.time.LocalTime
import com.elixirtech.arch.LoggingHelper2

class HourlyCache[T](name : String)(load : =>Option[T]) extends LoggingHelper2 {
  private var hour = -1
  private var cache : Option[T] = None
    
  private def ensureUpToDate() {
    val nowHour = LocalTime.now.getHourOfDay
    log.info(s"hour=$hour nowHour=$nowHour")
    if (nowHour!=hour) {
      synchronized {
        log.infoElapsedTime(name) {
          try {
            log.info("Loading")
            cache = load
            hour = nowHour
          }
          catch {
            case ex : Exception => log.error(s"Error reading cache $name: $ex",ex)
          }
        }
      }
    }
  }
  
  def get() : Option[T] = {
    ensureUpToDate()
    cache
  }
  
  def getOrElse(t : T) : T = {
    ensureUpToDate()
    cache.getOrElse(t)
  }
}
