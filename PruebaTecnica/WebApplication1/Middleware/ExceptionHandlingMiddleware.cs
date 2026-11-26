using Microsoft.Data.SqlClient;
using WebApplication1.Exceptions;

namespace WebApplication1.Middleware;

public class ExceptionHandlingMiddleware
{
    private readonly RequestDelegate _next;
    private readonly ILogger<ExceptionHandlingMiddleware> _logger;

    public ExceptionHandlingMiddleware(RequestDelegate next, ILogger<ExceptionHandlingMiddleware> logger)
    {
        _next = next;
        _logger = logger;
    }

    public async Task InvokeAsync(HttpContext context)
    {
        try
        {
            await _next(context);
        }
        catch (AppException ex)
        {
            await WriteAsync(context, ex.StatusCode, ex.Message);
        }
        catch (SqlException ex) when (ex.Number is 2627 or 2601)
        {
            await WriteAsync(context, StatusCodes.Status409Conflict,
                "Ya existe un beneficiario con el mismo tipo y número de documento.");
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error no controlado al procesar {Path}", context.Request.Path);
            await WriteAsync(context, StatusCodes.Status500InternalServerError,
                "Ocurrió un error interno. Intente nuevamente más tarde.");
        }
    }

    private static async Task WriteAsync(HttpContext context, int statusCode, string message)
    {
        context.Response.StatusCode = statusCode;
        context.Response.ContentType = "application/json";
        await context.Response.WriteAsJsonAsync(new { message, statusCode });
    }
}
