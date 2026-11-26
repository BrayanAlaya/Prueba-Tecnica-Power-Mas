using Microsoft.Data.SqlClient;

namespace WebApplication1.Data;

public interface ISqlConnectionFactory
{
    SqlConnection Create();
}
