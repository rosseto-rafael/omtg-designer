# Multi-stage build for OMT-G Designer

# Stage 1: Build stage
FROM maven:3.9-eclipse-temurin-11 AS builder

# Install Ant for build process
RUN apt-get update && apt-get install -y ant && rm -rf /var/lib/apt/lists/*

WORKDIR /build

# Copy source files
COPY . .

# Create directories for compiled classes
RUN mkdir -p www/WEB-INF/classes

# Download Jakarta Servlet API for compilation (compatible with Tomcat 10)
RUN mkdir -p /build/compile-libs && \
    curl -L https://repo1.maven.org/maven2/jakarta/servlet/jakarta.servlet-api/5.0.0/jakarta.servlet-api-5.0.0.jar \
         -o /build/compile-libs/jakarta.servlet-api.jar

# Compile Java source files
RUN javac -d www/WEB-INF/classes \
    -cp "www/WEB-INF/lib/*:/build/compile-libs/*" \
    -sourcepath src \
    $(find src -name "*.java")

# Copy resource files
RUN cp -r resources/com www/WEB-INF/classes/

# Run Ant build for CSS/JS minification (if needed)
RUN if [ -f build.xml ]; then ant copyCss copyJs || true; fi

# Stage 2: Runtime stage with Tomcat
FROM tomcat:10.1-jdk11-temurin

# Remove default Tomcat applications
RUN rm -rf /usr/local/tomcat/webapps/*

# Copy the built application
COPY --from=builder /build/www /usr/local/tomcat/webapps/ROOT

# Expose Tomcat port
EXPOSE 8080

# Set environment variables
ENV CATALINA_OPTS="-Xms512m -Xmx1024m"

# Start Tomcat
CMD ["catalina.sh", "run"]

