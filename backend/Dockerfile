# Stage 1: Build the application
FROM eclipse-temurin:25-jdk-jammy AS builder
WORKDIR /app

# Copy gradle wrapper and configuration files
COPY gradlew .
COPY gradle gradle
COPY build.gradle.kts settings.gradle.kts ./

# Give execution permission to the gradlew script
RUN chmod +x gradlew

# Download dependencies (helps with docker caching)
RUN ./gradlew dependencies --no-daemon || true

# Copy the application source code
COPY src src

# Build the application jar, skipping tests to speed up the docker build
RUN ./gradlew build -x test --no-daemon

# Stage 2: Create the runtime image
FROM eclipse-temurin:25-jdk-jammy
WORKDIR /app

# Create a non-root user for security
RUN groupadd --system springboot && useradd --system --gid springboot springboot

# Pre-create the logs directory and assign ownership to the springboot user
RUN mkdir logs && chown springboot:springboot logs

USER springboot

# Expose the application port
EXPOSE 8081

# Copy the built jar file from the builder stage
COPY --from=builder /app/build/libs/*-SNAPSHOT.jar app.jar

# Run the jar
ENTRYPOINT ["java", "-jar", "app.jar"]