package com.example

import io.ktor.serialization.kotlinx.KotlinxWebsocketSerializationConverter
import io.ktor.server.application.*
import io.ktor.server.routing.*
import io.ktor.server.websocket.*
import kotlinx.coroutines.delay
import kotlinx.coroutines.launch
import kotlinx.serialization.Serializable
import kotlinx.serialization.json.Json
import java.util.Collections
import kotlin.concurrent.atomics.AtomicInt
import kotlin.concurrent.atomics.ExperimentalAtomicApi
import kotlin.concurrent.atomics.decrementAndFetch
import kotlin.concurrent.atomics.incrementAndFetch
import kotlin.time.Duration.Companion.seconds

@OptIn(ExperimentalAtomicApi::class)
fun Application.configureSockets() {
    install(WebSockets) {
        contentConverter = KotlinxWebsocketSerializationConverter(Json)
        pingPeriod = 15.seconds
        timeout = 15.seconds
        maxFrameSize = Long.MAX_VALUE
        masking = false
    }
    routing {
        var count = AtomicInt(0)
        var target = AtomicInt(10)
        val sessions = Collections.synchronizedList<WebSocketServerSession>(ArrayList())
        var style = AtomicInt(0)
        var activityTimestamp = System.currentTimeMillis()

       launch {
          while (true) {
             delay (2000)
              if (System.currentTimeMillis() - activityTimestamp < 4000) {
                 continue
              }
              val countVal = count.load()
              if (countVal > 0) {
                  count.decrementAndFetch()
                  updateEveryone(sessions, count, target, style)
              }
          }
       }

        webSocket("/click") {
            sessions.add(this)
            try {
                sendSerialized(Response(count.load(), target.load(), style.load()))

                while (true) {
                    val cmd = receiveDeserialized<Command>()
                    if (cmd.command == "inc") {
                        activityTimestamp = System.currentTimeMillis()
                        val countVal = count.incrementAndFetch()
                        var targetVal = target.load()
                        if (countVal > targetVal) {
                            targetVal*=2
                            count.store(0)
                            target.store(targetVal)
                            val styleVal = style.load() + 1
                            style.store(styleVal % 5)
                        }

                       updateEveryone(sessions, count, target, style)

                    }


                }
            }
            catch (e: Throwable) {
               println(e.message)
            } finally {
                sessions -= this
            }
        }
    }
}

@OptIn(ExperimentalAtomicApi::class)
suspend fun updateEveryone(sessions: Collection<WebSocketServerSession>, count: AtomicInt, target: AtomicInt, style: AtomicInt) {
    for (session in sessions) {
        session.sendSerialized(Response(count.load(), target.load(), style.load()))
    }

}

@Serializable
data class Command(val command: String)

@Serializable
data class Response(val count: Int, val target: Int, val style: Int)