FROM gradle:jdk17 AS builder
COPY . /app/
WORKDIR /app
RUN gradle build -x test

FROM openjdk:17.0.2-slim
LABEL author="hushukang"
COPY --from=builder /app/build/libs/book-api-0.0.1-SNAPSHOT.jar /app/
EXPOSE 8080
ENTRYPOINT ["java","-jar","/app/book-api-0.0.1-SNAPSHOT.jar"]