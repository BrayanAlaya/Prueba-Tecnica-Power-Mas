-- Sistema de Gestión de Beneficiarios - PowerMas
-- Crea la base de datos y las tablas DocumentoIdentidad y Beneficiario.

IF DB_ID(N'PowerMasBeneficiarios') IS NOT NULL
BEGIN
    ALTER DATABASE PowerMasBeneficiarios SET SINGLE_USER WITH ROLLBACK IMMEDIATE;
    DROP DATABASE PowerMasBeneficiarios;
END
GO

CREATE DATABASE PowerMasBeneficiarios
    COLLATE Latin1_General_100_CI_AS_SC_UTF8;
GO

USE PowerMasBeneficiarios;
GO

IF OBJECT_ID(N'dbo.Beneficiario', N'U') IS NOT NULL
    DROP TABLE dbo.Beneficiario;
GO

IF OBJECT_ID(N'dbo.DocumentoIdentidad', N'U') IS NOT NULL
    DROP TABLE dbo.DocumentoIdentidad;
GO

CREATE TABLE dbo.DocumentoIdentidad
(
    Id INT IDENTITY(1, 1) NOT NULL CONSTRAINT PK_DocumentoIdentidad PRIMARY KEY,
    Nombre VARCHAR(50) NOT NULL,
    Abreviatura VARCHAR(10) NOT NULL,
    Pais VARCHAR(50) NOT NULL,
    Longitud INT NOT NULL,
    SoloNumeros BIT NOT NULL,
    Activo BIT NOT NULL CONSTRAINT DF_DocumentoIdentidad_Activo DEFAULT (1),
    CONSTRAINT CK_DocumentoIdentidad_Longitud CHECK (Longitud > 0 AND Longitud <= 20)
);
GO

CREATE TABLE dbo.Beneficiario
(
    Id INT IDENTITY(1, 1) NOT NULL CONSTRAINT PK_Beneficiario PRIMARY KEY,
    Nombres VARCHAR(100) NOT NULL,
    Apellidos VARCHAR(100) NOT NULL,
    DocumentoIdentidadId INT NOT NULL,
    NumeroDocumento VARCHAR(20) NOT NULL,
    FechaNacimiento DATE NOT NULL,
    Sexo CHAR(1) NOT NULL,
    CONSTRAINT FK_Beneficiario_DocumentoIdentidad
        FOREIGN KEY (DocumentoIdentidadId) REFERENCES dbo.DocumentoIdentidad (Id),
    CONSTRAINT CK_Beneficiario_Sexo CHECK (Sexo IN ('M', 'F')),
    CONSTRAINT UQ_Beneficiario_Documento UNIQUE (DocumentoIdentidadId, NumeroDocumento)
);
GO

CREATE INDEX IX_Beneficiario_Apellidos_Nombres
    ON dbo.Beneficiario (Apellidos, Nombres);
GO
