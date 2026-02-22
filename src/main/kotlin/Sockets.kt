package com.example

import io.ktor.serialization.kotlinx.KotlinxWebsocketSerializationConverter
import io.ktor.server.application.*
import io.ktor.server.routing.*
import io.ktor.server.websocket.*
import kotlinx.serialization.Serializable
import kotlinx.serialization.json.Json
import java.util.Collections
import kotlin.concurrent.atomics.ExperimentalAtomicApi
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
        var count = 0
        var target = 10
        var style = 0

        val sessions = Collections.synchronizedList<WebSocketServerSession>(ArrayList())

        webSocket("/click") {
            sessions.add(this)
            try {
                sendSerialized(Response(count, target, style))

                while (true) {
                    val cmd = receiveDeserialized<Command>()
                    if (cmd.command == "inc") {
                        count++
                    }

                    if (count == target) {
                        target*=2
                        count = 0
                        style = if (style > 4) 0 else style + 1
                    }

                    for (session in sessions) {
                        session.sendSerialized(Response(count, target, style))
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

@Serializable
data class Command(val command: String)

@Serializable
data class Response(val count: Int, val target: Int, val style: Int)