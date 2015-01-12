package net.capris.housevisit

import scala.concurrent._
import com.elixirtech.json.JsonFormatter
import akka.actor.Actor
import akka.actor.Props
import akka.actor.ActorSystem
import akka.actor.ActorRef
import com.elixirtech.arch._
import com.elixirtech.api._
import com.elixirtech.ask._
import com.elixirtech.http.server._
import com.elixirtech.arch.security.Authentication
import net.capris.housevisit.HouseVisit
import org.json4s._
import org.json4s.native._
import net.capris.announcement.Announcements
import net.capris.service.db.CaprisDB

object WebService {
  
  lazy val announcements : ActorRef = {
    val system = Elixir.get(classOf[ActorSystem])
    system.actorOf(Props[Announcements],"biz-web-announcements")
  }
}

class WebService extends Actor
  with AsyncService
  with AsyncStepMethodHandler
  with ShutdownHandler
  with LoggingHelper2 {

  import WebService._
  import VivaceSettings._
    
  implicit val exeCxt = context.dispatcher
  
  implicit val jsonFormats = DefaultFormats
  CaprisDB.testInit
  get("/announcements") {
    (announcements ? Announcements.GetAnnouncements).map(JSONResponse(_)).recover {
      case ex : Exception =>
        log.error("Error getting announcements",ex)
        ErrorResponse(400,"Error getting announcements")
    }
  }
  
  put("/announcements") {
    if (canEditAnnouncements) {
      val json = request.bodyText
      val array = Announcements.parse(json)
      announcements ! Announcements.SetAnnouncements(array)
      future(OkResponse)
    }
    else {
      future(ErrorResponse(403))
    }
  }
  
  post("/update-hv/:accountId") {
    val accountId = params(":accountId")
    HouseVisit.updateFor(accountId) match {
      case LogMessage.None => future(OkResponse)
      case msg : LogMessage => future(ErrorResponse(400,msg.msg))
    }
  }
  
  post("/housevisit/update") {
    val body = request.bodyText
    log.info(body)
    val events = JsonParser.parse(body).extract[Model.EventItemList]
    val creds = Authentication.credentials
    HouseVisit.UpdateHouseVisit(events) match {
        case LogMessage.None => 
          log.info("Updated house visit successfully")
          future(OkResponse)
        case msg => 
          msg.log(log)
          future(ErrorResponse(400,msg.toString))
      }
    
  }
    
  private def canEditAnnouncements() : Boolean = {
    (Authentication.isAdmin || Authentication.groups.contains("marketing"))
  }
}
