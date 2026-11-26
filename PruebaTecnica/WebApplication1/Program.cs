using WebApplication1.Data;
using WebApplication1.Middleware;
using WebApplication1.Repositories;
using WebApplication1.Services;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(options =>
{
    options.SwaggerDoc("v1", new()
    {
        Title = "PowerMas - Gestión de Beneficiarios",
        Version = "v1",
        Description = "API REST para el registro y administración de beneficiarios de un programa social multi-país."
    });
});

builder.Services.AddCors(options =>
{
    options.AddPolicy("Frontend", policy =>
        policy.WithOrigins(
                  "http://localhost:5173",
                  "http://127.0.0.1:5173",
                  "http://localhost:5174",
                  "http://127.0.0.1:5174")
              .AllowAnyHeader()
              .AllowAnyMethod());
});

builder.Services.AddSingleton<ISqlConnectionFactory, SqlConnectionFactory>();
builder.Services.AddScoped<IDocumentoIdentidadRepository, DocumentoIdentidadRepository>();
builder.Services.AddScoped<IBeneficiarioRepository, BeneficiarioRepository>();
builder.Services.AddScoped<IBeneficiarioService, BeneficiarioService>();

var app = builder.Build();

app.UseMiddleware<ExceptionHandlingMiddleware>();

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseCors("Frontend");
app.UseAuthorization();
app.MapControllers();
app.Run();
