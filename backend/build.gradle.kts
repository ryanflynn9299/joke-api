plugins {
    id("org.springframework.boot") version "4.0.2"
    id("io.spring.dependency-management") version "1.1.7"
    java
    id("org.jetbrains.kotlin.jvm") version "1.9.23"
}

group = "com.jokeapi"
version = "0.0.1-SNAPSHOT"

java {
    // Enforce Java 25
    toolchain {
        languageVersion.set(JavaLanguageVersion.of(25))
    }
}

repositories {
    // Use Maven Central for resolving dependencies.
    mavenCentral()
}

dependencies {
    // Use JUnit Jupiter for testing.
    testImplementation("org.junit.jupiter:junit-jupiter:5.8.2")
    testRuntimeOnly("org.junit.platform:junit-platform-launcher")

    runtimeOnly("org.postgresql:postgresql")
    implementation("jakarta.persistence:jakarta.persistence-api")
    implementation("org.springframework.boot:spring-boot-starter-web")
    implementation("org.springframework.boot:spring-boot-starter-data-jpa")
    implementation("org.springframework.boot:spring-boot-starter-validation")
    implementation("org.hibernate.orm:hibernate-core")
    implementation("com.google.guava:guava:31.0.1-jre")
    implementation("org.springframework.boot:spring-boot-starter-flyway")
    implementation("org.flywaydb:flyway-database-postgresql")

}

tasks.named<Test>("test") {
    failOnNoDiscoveredTests = false

    // Use JUnit Platform for unit tests.
    useJUnitPlatform()
}

tasks.getByName<org.springframework.boot.gradle.tasks.run.BootRun>("bootRun") {
    val envFile = file("../.env")
    if (envFile.exists()) {
        envFile.readLines().forEach { line ->
            val parts = line.split("=")
            if (parts.size == 2) {
                environment(parts[0], parts[1])
            }
        }
    }
}
