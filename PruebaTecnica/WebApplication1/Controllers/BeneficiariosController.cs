using Microsoft.AspNetCore.Mvc;
using WebApplication1.DTOs;
using WebApplication1.Services;

namespace WebApplication1.Controllers;

[ApiController]
[Route("api/beneficiarios")]
public class BeneficiariosController : ControllerBase
{
    private readonly IBeneficiarioService _service;

    public BeneficiariosController(IBeneficiarioService service)
    {
        _service = service;
    }

    [HttpGet]
    public async Task<IActionResult> Listar()
    {
        var beneficiarios = await _service.ListarAsync();
        return Ok(beneficiarios);
    }

    [HttpGet("{id:int}")]
    public async Task<IActionResult> ObtenerPorId(int id)
    {
        var beneficiario = await _service.ObtenerPorIdAsync(id);
        return Ok(beneficiario);
    }

    [HttpPost]
    public async Task<IActionResult> Crear([FromBody] BeneficiarioRequest request)
    {
        var creado = await _service.CrearAsync(request);
        return CreatedAtAction(nameof(ObtenerPorId), new { id = creado.Id }, creado);
    }

    [HttpPut("{id:int}")]
    public async Task<IActionResult> Actualizar(int id, [FromBody] BeneficiarioRequest request)
    {
        var actualizado = await _service.ActualizarAsync(id, request);
        return Ok(actualizado);
    }

    [HttpDelete("{id:int}")]
    public async Task<IActionResult> Eliminar(int id)
    {
        await _service.EliminarAsync(id);
        return NoContent();
    }
}
