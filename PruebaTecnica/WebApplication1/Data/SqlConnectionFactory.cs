using Microsoft.Data.SqlClient;

namespace WebApplication1.Data;

public class SqlConnectionFactory : ISqlConnectionFactory
{
    private readonly string _connectionString;

    public SqlConnectionFactory(IConfiguration configuration)
    {
        _connectionString = configuration.GetConnectionString("DefaultConnection")
            ?? throw new InvalidOperationException("No se encontró la cadena de conexión 'DefaultConnection'.");
    }

    public SqlConnection Create() => new(_connectionString);
}
