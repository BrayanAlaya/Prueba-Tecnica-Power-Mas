USE PowerMasBeneficiarios;
GO

/* ========== DocumentoIdentidad ========== */

IF OBJECT_ID(N'dbo.sp_DocumentoIdentidad_ListarActivos', N'P') IS NOT NULL
    DROP PROCEDURE dbo.sp_DocumentoIdentidad_ListarActivos;
GO

CREATE PROCEDURE dbo.sp_DocumentoIdentidad_ListarActivos
AS
BEGIN
    SET NOCOUNT ON;

    SELECT
        Id,
        Nombre,
        Abreviatura,
        Pais,
        Longitud,
        SoloNumeros,
        Activo
    FROM dbo.DocumentoIdentidad
    WHERE Activo = 1
    ORDER BY Pais, Nombre;
END
GO

IF OBJECT_ID(N'dbo.sp_DocumentoIdentidad_ObtenerPorId', N'P') IS NOT NULL
    DROP PROCEDURE dbo.sp_DocumentoIdentidad_ObtenerPorId;
GO

CREATE PROCEDURE dbo.sp_DocumentoIdentidad_ObtenerPorId
    @Id INT
AS
BEGIN
    SET NOCOUNT ON;

    SELECT
        Id,
        Nombre,
        Abreviatura,
        Pais,
        Longitud,
        SoloNumeros,
        Activo
    FROM dbo.DocumentoIdentidad
    WHERE Id = @Id;
END
GO

/* ========== Beneficiario ========== */

IF OBJECT_ID(N'dbo.sp_Beneficiario_ObtenerPorId', N'P') IS NOT NULL
    DROP PROCEDURE dbo.sp_Beneficiario_ObtenerPorId;
GO

CREATE PROCEDURE dbo.sp_Beneficiario_ObtenerPorId
    @Id INT
AS
BEGIN
    SET NOCOUNT ON;

    SELECT
        b.Id,
        b.Nombres,
        b.Apellidos,
        b.DocumentoIdentidadId,
        b.NumeroDocumento,
        b.FechaNacimiento,
        b.Sexo,
        d.Nombre AS DocumentoNombre,
        d.Abreviatura AS DocumentoAbreviatura,
        d.Pais AS DocumentoPais
    FROM dbo.Beneficiario b
    INNER JOIN dbo.DocumentoIdentidad d ON d.Id = b.DocumentoIdentidadId
    WHERE b.Id = @Id;
END
GO

IF OBJECT_ID(N'dbo.sp_Beneficiario_Listar', N'P') IS NOT NULL
    DROP PROCEDURE dbo.sp_Beneficiario_Listar;
GO

CREATE PROCEDURE dbo.sp_Beneficiario_Listar
AS
BEGIN
    SET NOCOUNT ON;

    SELECT
        b.Id,
        b.Nombres,
        b.Apellidos,
        b.DocumentoIdentidadId,
        b.NumeroDocumento,
        b.FechaNacimiento,
        b.Sexo,
        d.Nombre AS DocumentoNombre,
        d.Abreviatura AS DocumentoAbreviatura,
        d.Pais AS DocumentoPais
    FROM dbo.Beneficiario b
    INNER JOIN dbo.DocumentoIdentidad d ON d.Id = b.DocumentoIdentidadId
    ORDER BY b.Apellidos, b.Nombres;
END
GO

IF OBJECT_ID(N'dbo.sp_Beneficiario_Insertar', N'P') IS NOT NULL
    DROP PROCEDURE dbo.sp_Beneficiario_Insertar;
GO

CREATE PROCEDURE dbo.sp_Beneficiario_Insertar
    @Nombres VARCHAR(100),
    @Apellidos VARCHAR(100),
    @DocumentoIdentidadId INT,
    @NumeroDocumento VARCHAR(20),
    @FechaNacimiento DATE,
    @Sexo CHAR(1)
AS
BEGIN
    SET NOCOUNT ON;

    INSERT INTO dbo.Beneficiario
    (
        Nombres,
        Apellidos,
        DocumentoIdentidadId,
        NumeroDocumento,
        FechaNacimiento,
        Sexo
    )
    VALUES
    (
        @Nombres,
        @Apellidos,
        @DocumentoIdentidadId,
        @NumeroDocumento,
        @FechaNacimiento,
        @Sexo
    );

    DECLARE @Id INT = SCOPE_IDENTITY();
    EXEC dbo.sp_Beneficiario_ObtenerPorId @Id = @Id;
END
GO

IF OBJECT_ID(N'dbo.sp_Beneficiario_Actualizar', N'P') IS NOT NULL
    DROP PROCEDURE dbo.sp_Beneficiario_Actualizar;
GO

CREATE PROCEDURE dbo.sp_Beneficiario_Actualizar
    @Id INT,
    @Nombres VARCHAR(100),
    @Apellidos VARCHAR(100),
    @DocumentoIdentidadId INT,
    @NumeroDocumento VARCHAR(20),
    @FechaNacimiento DATE,
    @Sexo CHAR(1)
AS
BEGIN
    SET NOCOUNT ON;

    UPDATE dbo.Beneficiario
    SET
        Nombres = @Nombres,
        Apellidos = @Apellidos,
        DocumentoIdentidadId = @DocumentoIdentidadId,
        NumeroDocumento = @NumeroDocumento,
        FechaNacimiento = @FechaNacimiento,
        Sexo = @Sexo
    WHERE Id = @Id;

    IF @@ROWCOUNT = 0
        RETURN;

    EXEC dbo.sp_Beneficiario_ObtenerPorId @Id = @Id;
END
GO

IF OBJECT_ID(N'dbo.sp_Beneficiario_Eliminar', N'P') IS NOT NULL
    DROP PROCEDURE dbo.sp_Beneficiario_Eliminar;
GO

CREATE PROCEDURE dbo.sp_Beneficiario_Eliminar
    @Id INT
AS
BEGIN
    SET NOCOUNT ON;

    DELETE FROM dbo.Beneficiario
    WHERE Id = @Id;

    SELECT @@ROWCOUNT AS FilasAfectadas;
END
GO
