# Multi-stage build for Spring Boot application
# Stage 1: Build stage
FROM eclipse-temurin:17-jdk-alpine AS builder

# Set working directory
WORKDIR /app

# Copy Maven wrapper and pom.xml first (for better caching)
COPY mvnw .
COPY mvnw.cmd .
COPY pom.xml .
COPY .mvn .mvn

# Download dependencies (this layer will be cached if pom.xml doesn't change)
RUN sed -i 's/\r$//' mvnw # Ensure line endings are correct for Unix
RUN chmod +x ./mvnw
#RUN ls -la
RUN ./mvnw dependency:go-offline # Download dependencies without building the project

# Copy source code
COPY src ./src

# Build the application
RUN ./mvnw clean package -DskipTests -B

# 2 stage makes image smaller
# Stage 2: Runtime stage
FROM eclipse-temurin:17-jre-alpine AS runtime

# Create a non-root user for security
RUN addgroup -g 1001 -S appgroup && \
    adduser -u 1001 -S appuser -G appgroup

# Set working directory
WORKDIR /app

# Copy the JAR file from builder stage
COPY --from=builder /app/target/*.jar app.jar

# Change ownership of the app directory to the app user
RUN chown -R appuser:appgroup /app

# Switch to non-root user
USER appuser

# Expose the port the app runs on
EXPOSE 8081

# Health check
# HEALTHCHECK --interval=30s --timeout=3s --start-period=30s --retries=3 \
#     CMD wget --no-verbose --tries=1 --spider http://localhost:8081/actuator/health || exit 1

# Run the application
ENTRYPOINT ["java", "-jar", "-Xmx512m", "-Xms256m", "app.jar"]
