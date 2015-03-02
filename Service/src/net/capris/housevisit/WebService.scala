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
import net.capris.service.db.CaprisDB

object WebService {
  
 
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
 
  
  post("/housevisit/update") {
    val body = request.bodyText
    log.info(body)
    val events = JsonParser.parse(body).extract[Model.Event]
    log.info(events)
    val creds = Authentication.credentials
    HouseVisit.UpdateHouseVisit2(events) match {
        case LogMessage.None => 
          log.info("Updated house visit successfully")
          future(OkResponse)
        case msg => 
          msg.log(log)
          future(ErrorResponse(400,msg.toString))
      }
    
  }
    

}
