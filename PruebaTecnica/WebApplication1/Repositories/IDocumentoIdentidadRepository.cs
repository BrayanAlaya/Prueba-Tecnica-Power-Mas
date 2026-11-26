using WebApplication1.Models;

namespace WebApplication1.Repositories;

public interface IDocumentoIdentidadRepository
{
    Task<IReadOnlyList<DocumentoIdentidad>> ListarActivosAsync();
    Task<DocumentoIdentidad?> ObtenerPorIdAsync(int id);
}
