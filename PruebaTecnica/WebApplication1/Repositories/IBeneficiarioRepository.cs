using WebApplication1.DTOs;
using WebApplication1.Models;

namespace WebApplication1.Repositories;

public interface IBeneficiarioRepository
{
    Task<IReadOnlyList<BeneficiarioResponse>> ListarAsync();
    Task<BeneficiarioResponse?> ObtenerPorIdAsync(int id);
    Task<BeneficiarioResponse> InsertarAsync(Beneficiario beneficiario);
    Task<BeneficiarioResponse?> ActualizarAsync(Beneficiario beneficiario);
    Task<bool> EliminarAsync(int id);
}
