using System.ComponentModel.DataAnnotations;

namespace WebApplication1.DTOs;

public class BeneficiarioRequest
{
    [Required(ErrorMessage = "Los nombres son obligatorios.")]
    [StringLength(100, ErrorMessage = "Los nombres no pueden superar 100 caracteres.")]
    public string Nombres { get; set; } = string.Empty;

    [Required(ErrorMessage = "Los apellidos son obligatorios.")]
    [StringLength(100, ErrorMessage = "Los apellidos no pueden superar 100 caracteres.")]
    public string Apellidos { get; set; } = string.Empty;

    [Range(1, int.MaxValue, ErrorMessage = "Debe seleccionar un tipo de documento.")]
    public int DocumentoIdentidadId { get; set; }

    [Required(ErrorMessage = "El número de documento es obligatorio.")]
    [StringLength(20, ErrorMessage = "El número de documento no puede superar 20 caracteres.")]
    public string NumeroDocumento { get; set; } = string.Empty;

    [Required(ErrorMessage = "La fecha de nacimiento es obligatoria.")]
    public DateOnly FechaNacimiento { get; set; }

    [Required(ErrorMessage = "El sexo es obligatorio.")]
    [RegularExpression("^[MF]$", ErrorMessage = "El sexo debe ser M o F.")]
    public string Sexo { get; set; } = string.Empty;
}
