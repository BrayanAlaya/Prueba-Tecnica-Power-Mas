using System.Data;
using Dapper;
using WebApplication1.Data;
using WebApplication1.DTOs;
using WebApplication1.Models;

namespace WebApplication1.Repositories;

public class BeneficiarioRepository : IBeneficiarioRepository
{
    private readonly ISqlConnectionFactory _connectionFactory;

    public BeneficiarioRepository(ISqlConnectionFactory connectionFactory)
    {
        _connectionFactory = connectionFactory;
    }

    public async Task<IReadOnlyList<BeneficiarioResponse>> ListarAsync()
    {
        using var connection = _connectionFactory.Create();
        var beneficiarios = await connection.QueryAsync<BeneficiarioResponse>(
            "sp_Beneficiario_Listar",
            commandType: CommandType.StoredProcedure);

        return beneficiarios.ToList();
    }

    public async Task<BeneficiarioResponse?> ObtenerPorIdAsync(int id)
    {
        using var connection = _connectionFactory.Create();
        return await connection.QuerySingleOrDefaultAsync<BeneficiarioResponse>(
            "sp_Beneficiario_ObtenerPorId",
            new { Id = id },
            commandType: CommandType.StoredProcedure);
    }

    public async Task<BeneficiarioResponse> InsertarAsync(Beneficiario beneficiario)
    {
        using var connection = _connectionFactory.Create();
        return await connection.QuerySingleAsync<BeneficiarioResponse>(
            "sp_Beneficiario_Insertar",
            Parametros(beneficiario),
            commandType: CommandType.StoredProcedure);
    }

    public async Task<BeneficiarioResponse?> ActualizarAsync(Beneficiario beneficiario)
    {
        using var connection = _connectionFactory.Create();
        return await connection.QuerySingleOrDefaultAsync<BeneficiarioResponse>(
            "sp_Beneficiario_Actualizar",
            Parametros(beneficiario, incluirId: true),
            commandType: CommandType.StoredProcedure);
    }

    public async Task<bool> EliminarAsync(int id)
    {
        using var connection = _connectionFactory.Create();
        var filas = await connection.ExecuteScalarAsync<int>(
            "sp_Beneficiario_Eliminar",
            new { Id = id },
            commandType: CommandType.StoredProcedure);

        return filas > 0;
    }

    private static object Parametros(Beneficiario beneficiario, bool incluirId = false)
    {
        if (incluirId)
        {
            return new
            {
                beneficiario.Id,
                beneficiario.Nombres,
                beneficiario.Apellidos,
                beneficiario.DocumentoIdentidadId,
                beneficiario.NumeroDocumento,
                beneficiario.FechaNacimiento,
                beneficiario.Sexo
            };
        }

        return new
        {
            beneficiario.Nombres,
            beneficiario.Apellidos,
            beneficiario.DocumentoIdentidadId,
            beneficiario.NumeroDocumento,
            beneficiario.FechaNacimiento,
            beneficiario.Sexo
        };
    }
}
