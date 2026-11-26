using System.Data;
using Dapper;
using WebApplication1.Data;
using WebApplication1.Models;

namespace WebApplication1.Repositories;

public class DocumentoIdentidadRepository : IDocumentoIdentidadRepository
{
    private readonly ISqlConnectionFactory _connectionFactory;

    public DocumentoIdentidadRepository(ISqlConnectionFactory connectionFactory)
    {
        _connectionFactory = connectionFactory;
    }

    public async Task<IReadOnlyList<DocumentoIdentidad>> ListarActivosAsync()
    {
        using var connection = _connectionFactory.Create();
        var documentos = await connection.QueryAsync<DocumentoIdentidad>(
            "sp_DocumentoIdentidad_ListarActivos",
            commandType: CommandType.StoredProcedure);

        return documentos.ToList();
    }

    public async Task<DocumentoIdentidad?> ObtenerPorIdAsync(int id)
    {
        using var connection = _connectionFactory.Create();
        return await connection.QuerySingleOrDefaultAsync<DocumentoIdentidad>(
            "sp_DocumentoIdentidad_ObtenerPorId",
            new { Id = id },
            commandType: CommandType.StoredProcedure);
    }
}
