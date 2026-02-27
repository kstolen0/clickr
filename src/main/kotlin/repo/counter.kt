package com.example.repo

import io.ktor.server.application.Application
import org.jetbrains.exposed.v1.core.Table
import org.jetbrains.exposed.v1.jdbc.Database
import org.jetbrains.exposed.v1.jdbc.SchemaUtils
import org.jetbrains.exposed.v1.jdbc.transactions.transaction

object Counter : Table() {
    val id = integer("id")
    val current = integer("current")
    val target = integer("target")
    val style = integer("style")
    override val primaryKey = PrimaryKey(id)
}

fun Application.configureDatabase() {
    val dbPath = "/app/data/app.db"
    Database.connect("jdbc:sqlite:$dbPath", "org.sqlite.JDBC")
    transaction {
        SchemaUtils.create(Counter)
    }
}
