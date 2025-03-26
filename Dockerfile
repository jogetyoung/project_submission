# Build Angular
FROM node:22 AS ng-build

WORKDIR /angular

RUN npm i -g @angular/cli@19.2.1

#COPY ./client/public public
COPY ./angular/src src
COPY ./angular/*.json .

# Install dependencies and build
RUN npm install
RUN ng build


# Build Spring Boot
FROM maven:3-eclipse-temurin-23 AS sb-builder


WORKDIR /src


COPY ./vttp_project_backend/mvnw .
COPY ./vttp_project_backend/mvnw.cmd .
COPY ./vttp_project_backend/pom.xml .
COPY ./vttp_project_backend/.mvn .mvn
COPY ./vttp_project_backend/src src

# Copy angular files over to static
COPY --from=ng-build /angular/dist/angular/browser src/main/resources/static

RUN chmod +x mvnw && ./mvnw package -Dmaven.test.skip=true
#chmod a+x mvnw && ./

# Copy the JAR file over to the final container
FROM openjdk:23-jdk-bullseye

WORKDIR /app

COPY --from=sb-builder /src/target/vttp_project_backend-0.0.1-SNAPSHOT.jar app.jar

ENV PORT=8080

ENV JOBAPI =""

ENV JWT_KEY_SECRET=""

ENV S3_BUCKET_ENDPOINT=""
ENV S3_BUCKET_REGION=""
ENV S3_KEY_ACCESS=""
ENV S3_KEY_SECRET=""

ENV SERVER_API_URL=""
ENV SPRING_DATA_MONGODB_URI=""

ENV SPRING_DATASOURCE_PASSWORD=""
ENV SPRING_DATASOURCE_USERNAME=""
ENV SPRING_DATASOURCE_URL=""

ENV SPRING_MAIL_HOST=""
ENV SPRING_MAIL_PASSWORD=""
ENV SPRING_MAIL_PORT=""
ENV SPRING_MAIL_USERNAME=""

ENV SPRING_SECURITY_USER_PASSWORD=""

ENV STRIPE_API_KEY=""

ENV MANAGEMENT_ENDPOINTS_WEB_EXPOSURE_INCLUDE="health,info,metrics,prometheus,loggers"
ENV MANAGEMENT_ENDPOINT_PROMETHEUS_ENABLED="true"
ENV MANAGEMENT_ENDPOINT_METRICS_ENABLED="true"

EXPOSE ${PORT}

ENTRYPOINT SERVER_PORT=${PORT} java -jar app.jar