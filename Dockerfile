FROM gradle:8.14.4-jdk21 AS build
WORKDIR /app

# Cache dependencies
COPY build.gradle.kts build.gradle.kts
COPY settings.gradle.kts settings.gradle.kts
COPY gradle gradle
COPY gradle.properties gradle.properties

RUN gradle build -x test || return 0

# Copy source and build
COPY src src
RUN gradle clean build

# ---- Run stage ----
FROM eclipse-temurin:21-jre-jammy

ARG USER_ID=1001
ARG GROUP_ID=1001

RUN groupadd --gid $GROUP_ID appgroup && \
 useradd --uid $USER_ID --gid $GROUP_ID --create-home --shell /bin/bash appuser

USER appuser

WORKDIR /app

# Copy fat JAR from build (adjust name if different)
COPY --from=build /app/build/libs/*-all.jar /app/app.jar

# Expose app port (change if your server uses a different one)
EXPOSE 8080

# Run the web server
ENTRYPOINT ["java","-jar","/app/app.jar"]
