USE PowerMasBeneficiarios;
GO

SET IDENTITY_INSERT dbo.DocumentoIdentidad ON;

INSERT INTO dbo.DocumentoIdentidad (Id, Nombre, Abreviatura, Pais, Longitud, SoloNumeros, Activo)
VALUES
    (1,  'Documento Nacional de Identidad', 'DNI',  'Perú',            8,  1, 1),
    (2,  'Carnet de Extranjería',           'CE',   'Perú',            9,  0, 1),
    (3,  'Pasaporte',                       'PAS',  'Perú',            9,  0, 1),
    (4,  'Cédula de Ciudadanía',            'CC',   'Colombia',        10, 1, 1),
    (5,  'Pasaporte',                       'PAS',  'Colombia',        9,  0, 1),
    (6,  'Cédula de Identidad',             'CI',   'Chile',           9,  0, 1),
    (7,  'Documento Nacional de Identidad', 'DNI',  'Argentina',       8,  1, 1),
    (8,  'Cédula de Identidad',             'CI',   'Ecuador',         10, 1, 1),
    (9,  'CURP',                            'CURP', 'México',          18, 0, 1),
    (10, 'Pasaporte',                       'PAS',  'Estados Unidos',  9,  0, 1),
    (11, 'Documento Nacional de Identidad', 'DNI',  'España',          8,  0, 0);

SET IDENTITY_INSERT dbo.DocumentoIdentidad OFF;
GO

INSERT INTO dbo.Beneficiario (Nombres, Apellidos, DocumentoIdentidadId, NumeroDocumento, FechaNacimiento, Sexo)
VALUES
    ('María Elena',  'Quispe Huamán',   1,  '45678901',          '1992-04-18', 'F'),
    ('Carlos Andrés','Ramírez Soto',    1,  '70881234',          '1988-11-02', 'M'),
    ('Lucía',        'Fernández Díaz',  2,  'CE0012345',         '1995-07-21', 'F'),
    ('Juan Pablo',   'Gómez Restrepo',  4,  '1029384756',        '1990-01-15', 'M'),
    ('Ana Sofía',    'Vargas López',    7,  '33991200',          '1998-09-09', 'F');
GO
