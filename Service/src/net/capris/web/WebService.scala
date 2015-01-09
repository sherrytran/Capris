package net.capris.web

import scala.concurrent._
import akka.actor.Actor
import akka.actor.Props
import akka.actor.ActorSystem
import akka.actor.ActorRef
import com.elixirtech.arch._
import com.elixirtech.api._
import com.elixirtech.ask._
import com.elixirtech.http.server._
import com.elixirtech.arch.security.Authentication
import net.capris.web.HouseVisit

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
    
  private def canEditAnnouncements() : Boolean = {
    (Authentication.isAdmin || Authentication.groups.contains("marketing"))
  }
}
