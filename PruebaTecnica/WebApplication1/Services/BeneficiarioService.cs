using System.Text.RegularExpressions;
using WebApplication1.DTOs;
using WebApplication1.Exceptions;
using WebApplication1.Models;
using WebApplication1.Repositories;

namespace WebApplication1.Services;

public class BeneficiarioService : IBeneficiarioService
{
    private readonly IBeneficiarioRepository _beneficiarioRepository;
    private readonly IDocumentoIdentidadRepository _documentoRepository;

    public BeneficiarioService(
        IBeneficiarioRepository beneficiarioRepository,
        IDocumentoIdentidadRepository documentoRepository)
    {
        _beneficiarioRepository = beneficiarioRepository;
        _documentoRepository = documentoRepository;
    }

    public async Task<IReadOnlyList<BeneficiarioResponse>> ListarAsync()
    {
        return await _beneficiarioRepository.ListarAsync();
    }

    public async Task<BeneficiarioResponse> ObtenerPorIdAsync(int id)
    {
        var beneficiario = await _beneficiarioRepository.ObtenerPorIdAsync(id);
        if (beneficiario is null)
        {
            throw new AppException("El beneficiario no existe.", StatusCodes.Status404NotFound);
        }

        return beneficiario;
    }

    public async Task<BeneficiarioResponse> CrearAsync(BeneficiarioRequest request)
    {
        var documento = await ValidarDocumentoAsync(request);
        var entidad = ToEntity(request, documento);

        return await _beneficiarioRepository.InsertarAsync(entidad);
    }

    public async Task<BeneficiarioResponse> ActualizarAsync(int id, BeneficiarioRequest request)
    {
        var existente = await _beneficiarioRepository.ObtenerPorIdAsync(id);
        if (existente is null)
        {
            throw new AppException("El beneficiario no existe.", StatusCodes.Status404NotFound);
        }

        var documento = await ValidarDocumentoAsync(request);
        var entidad = ToEntity(request, documento);
        entidad.Id = id;

        var actualizado = await _beneficiarioRepository.ActualizarAsync(entidad);
        if (actualizado is null)
        {
            throw new AppException("El beneficiario no existe.", StatusCodes.Status404NotFound);
        }

        return actualizado;
    }

    public async Task EliminarAsync(int id)
    {
        var eliminado = await _beneficiarioRepository.EliminarAsync(id);
        if (!eliminado)
        {
            throw new AppException("El beneficiario no existe.", StatusCodes.Status404NotFound);
        }
    }

    private async Task<DocumentoIdentidad> ValidarDocumentoAsync(BeneficiarioRequest request)
    {
        var documento = await _documentoRepository.ObtenerPorIdAsync(request.DocumentoIdentidadId);
        if (documento is null || !documento.Activo)
        {
            throw new AppException("El tipo de documento no existe o no está activo.");
        }

        var numero = request.NumeroDocumento.Trim();

        if (numero.Length != documento.Longitud)
        {
            throw new AppException(
                $"El {documento.Abreviatura} de {documento.Pais} debe tener {documento.Longitud} caracteres.");
        }

        if (documento.SoloNumeros && !Regex.IsMatch(numero, @"^\d+$"))
        {
            throw new AppException(
                $"El {documento.Abreviatura} de {documento.Pais} solo acepta dígitos.");
        }

        ValidarFechaNacimiento(request.FechaNacimiento);
        return documento;
    }

    private static void ValidarFechaNacimiento(DateOnly fecha)
    {
        var hoy = DateOnly.FromDateTime(DateTime.Today);

        if (fecha > hoy)
        {
            throw new AppException("La fecha de nacimiento no puede ser futura.");
        }

        if (fecha < hoy.AddYears(-120))
        {
            throw new AppException("La fecha de nacimiento no es válida.");
        }
    }

    private static Beneficiario ToEntity(BeneficiarioRequest request, DocumentoIdentidad documento)
    {
        var numero = request.NumeroDocumento.Trim();
        if (!documento.SoloNumeros)
        {
            numero = numero.ToUpperInvariant();
        }

        return new Beneficiario
        {
            Nombres = request.Nombres.Trim(),
            Apellidos = request.Apellidos.Trim(),
            DocumentoIdentidadId = request.DocumentoIdentidadId,
            NumeroDocumento = numero,
            FechaNacimiento = request.FechaNacimiento.ToDateTime(TimeOnly.MinValue),
            Sexo = request.Sexo.Trim().ToUpperInvariant()
        };
    }
}
