-- Crear la base de datos
CREATE DATABASE IF NOT EXISTS previse;
USE previse;

-- Tabla Usuarios
CREATE TABLE IF NOT EXISTS Usuarios (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL UNIQUE,
    contraseña VARCHAR(255) NOT NULL,
    rol ENUM('Maestro', 'Prefecto', 'Direccion', 'Enfermeria', 'Trabajo Social') NOT NULL
);

-- Tabla Alumnos
CREATE TABLE IF NOT EXISTS Alumnos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    grupo VARCHAR(50) NOT NULL,
    turno ENUM('Matutino', 'Vespertino') NOT NULL,
    ingreso YEAR NOT NULL
);

CREATE TABLE IF NOT EXISTS Justificantes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    tipo_justificante ENUM('Enfermedad', 'Familiar', 'Escolar', 'Otros') NOT NULL,
    departamento ENUM('Prefectura', 'Maestros', 'Enfermeria', 'Direccion', 'Trabajo Social') NOT NULL,
    alumno_id INT NOT NULL,
    tutor VARCHAR(100),
    motivo TEXT NOT NULL,
    fecha_inicio DATE NOT NULL,
    fecha_regreso DATE NOT NULL,
    tiempo_dias INT NOT NULL,
    creado_por INT NULL, -- Nuevo campo COMMENT 'ID del usuario que creó el justificante'
    CONSTRAINT fk_justificantes_alumno
      FOREIGN KEY (alumno_id)
      REFERENCES Alumnos(id)
      ON DELETE CASCADE
);

-- Tabla Entradas y Salidas (cascade al borrar alumno)
CREATE TABLE IF NOT EXISTS EntradasSalidas (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre_visita VARCHAR(100) NOT NULL,
    alumno_id INT,  -- FK opcional
    motivo TEXT NOT NULL,
    tipo ENUM('Entrada', 'Salida') NOT NULL,
    fecha_registro TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_entradasalidas_alumno
      FOREIGN KEY (alumno_id)
      REFERENCES Alumnos(id)
      ON DELETE CASCADE
);
