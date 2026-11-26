using Microsoft.AspNetCore.Mvc;
using WebApplication1.Repositories;

namespace WebApplication1.Controllers;

[ApiController]
[Route("api/documentos-identidad")]
public class DocumentosIdentidadController : ControllerBase
{
    private readonly IDocumentoIdentidadRepository _repository;

    public DocumentosIdentidadController(IDocumentoIdentidadRepository repository)
    {
        _repository = repository;
    }

    [HttpGet]
    public async Task<IActionResult> ListarActivos()
    {
        var documentos = await _repository.ListarActivosAsync();
        return Ok(documentos);
    }

    [HttpGet("{id:int}")]
    public async Task<IActionResult> ObtenerPorId(int id)
    {
        var documento = await _repository.ObtenerPorIdAsync(id);
        if (documento is null)
        {
            return NotFound(new { message = "El tipo de documento no existe.", statusCode = 404 });
        }

        return Ok(documento);
    }
}
