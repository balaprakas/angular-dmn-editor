FROM tomcat:10.1-jdk17-openjdk

# Remove default webapps
RUN rm -rf /usr/local/tomcat/webapps/*

# Copy the WAR file to Tomcat webapps directory
COPY backend/target/business-central-alternative-1.0.0.war /usr/local/tomcat/webapps/business-central.war

# Copy frontend build files to serve static content
COPY frontend/business-central-frontend/dist/business-central-frontend/browser/ /usr/local/tomcat/webapps/ROOT/

# Expose port 8080
EXPOSE 8080

# Configure Tomcat for production
ENV CATALINA_OPTS="-Xmx1024m -Xms512m -server"

# Start Tomcat
CMD ["catalina.sh", "run"]
