namespace WebApplication1.DTOs;

public class BeneficiarioResponse
{
    public int Id { get; set; }
    public string Nombres { get; set; } = string.Empty;
    public string Apellidos { get; set; } = string.Empty;
    public int DocumentoIdentidadId { get; set; }
    public string NumeroDocumento { get; set; } = string.Empty;
    public DateOnly FechaNacimiento { get; set; }
    public string Sexo { get; set; } = string.Empty;
    public string DocumentoNombre { get; set; } = string.Empty;
    public string DocumentoAbreviatura { get; set; } = string.Empty;
    public string DocumentoPais { get; set; } = string.Empty;
}
