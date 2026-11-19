# ---- ビルド用ステージ（Maven + JDK 21）----
FROM maven:3.9-eclipse-temurin-21 AS build
WORKDIR /app
COPY pom.xml .
RUN mvn -q -B dependency:go-offline
COPY src ./src
RUN mvn -q -B package -DskipTests

# ---- 実行用ステージ（JRE 21 のみ）----
FROM eclipse-temurin:21-jre
WORKDIR /app
COPY --from=build /app/target/ingredient-api.jar app.jar
EXPOSE 8080
ENTRYPOINT ["java", "-jar", "app.jar"]
