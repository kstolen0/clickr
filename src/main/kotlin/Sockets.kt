package com.example

import io.ktor.serialization.kotlinx.KotlinxWebsocketSerializationConverter
import io.ktor.server.application.*
import io.ktor.server.routing.*
import io.ktor.server.websocket.*
import kotlinx.serialization.Serializable
import kotlinx.serialization.json.Json
import java.util.Collections
import kotlin.concurrent.atomics.AtomicInt
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
        val sessions = Collections.synchronizedList<WebSocketServerSession>(ArrayList())

        webSocket("/click") {
            sessions.add(this)
            try {
                sendSerialized(count)

                while (true) {
                    val cmd = receiveDeserialized<Command>()
                    if (cmd.command == "inc") {
                        count++
                    }

                    for (session in sessions) {
                        session.sendSerialized(count)
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