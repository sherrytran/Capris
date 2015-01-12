package net.capris.announcement

import akka.actor.Actor
import org.json4s._
import org.json4s.native._
import com.elixirtech.arch._
import com.elixirtech.ask._
import net.capris.profile.UserConfigDAO
import com.elixirtech.json.JsonFormatter
import akka.actor.actorRef2Scala

case class Announcement(title : String, line1 : String)

object Announcements extends LoggingHelper2 {
  
  implicit val jsonFormats = DefaultFormats
  val UserID = "bzn.webservice"
  val AnnouncementsKey = "/announcements.json"
  
  object GetAnnouncements extends Serializable with Replyable [String]
  case class SetAnnouncements(array : Array[Announcement])
  
  case class Cache(announcements : Array[Announcement]=Array.empty, json : String="[]")
  
  def parse(json : String) : Array[Announcement] = JsonParser.parse(json).extract[Array[Announcement]]
  
  def loadAnnouncements() : Cache = {
    try {
      UserConfigDAO.load(UserID,AnnouncementsKey).map(new String(_,"UTF-8")).map { json=>
        try {
          val array = JsonParser.parse(json).extract[Array[Announcement]]
          log.info(s"Loaded announcements: ${json}")
          Cache(array,json)
        }
        catch {
          case ex : Exception => log.error(s"Unable to parse json: $json",ex)
          Cache()
        }
      }.getOrElse(Cache())
    }
    catch {
      case ex : Exception => 
        log.error(s"Error in loadAnnouncements: $ex",ex)
        Cache()
    }
  }
  
  def saveChanges(array : Array[Announcement]) : Cache = {
    val cache = Cache(array,JsonFormatter.build(array))
    log.info(s"Announcements changed: ${cache.json}")
    //UserConfigDAO.save(UserID,AnnouncementsKey,false,cache.json.getBytes("UTF-8"))
    cache
  }
}

class Announcements extends Actor {
  
  import Announcements._
  
  var cache = loadAnnouncements()
  
  def receive = {
    case GetAnnouncements =>
      sender ! cache.json
    case SetAnnouncements(array) =>
      cache = saveChanges(array)
  }
}
