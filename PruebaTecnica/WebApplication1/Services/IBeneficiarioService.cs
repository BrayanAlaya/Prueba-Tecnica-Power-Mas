using WebApplication1.DTOs;

namespace WebApplication1.Services;

public interface IBeneficiarioService
{
    Task<IReadOnlyList<BeneficiarioResponse>> ListarAsync();
    Task<BeneficiarioResponse> ObtenerPorIdAsync(int id);
    Task<BeneficiarioResponse> CrearAsync(BeneficiarioRequest request);
    Task<BeneficiarioResponse> ActualizarAsync(int id, BeneficiarioRequest request);
    Task EliminarAsync(int id);
}
