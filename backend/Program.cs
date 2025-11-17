using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.Hosting;
using Microsoft.EntityFrameworkCore;
using Planner.Web.Data;
using System.Text.RegularExpressions;
using Microsoft.Extensions.FileProviders; // ⬅️ ADICIONAR

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddRazorPages();
builder.Services.AddControllers();

// Configure CORS
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowVercel", policy =>
    {
        policy.WithOrigins(
            "https://planner-umber-eight.vercel.app",
            "http://localhost:5173"
        )
        .AllowAnyHeader()
        .AllowAnyMethod()
        .AllowCredentials();
    });
});

// Configure Database
var connectionString = builder.Configuration.GetConnectionString("DefaultConnection");

Console.WriteLine($"🔍 Environment: {builder.Environment.EnvironmentName}");
Console.WriteLine($"🔍 Connection String existe: {!string.IsNullOrEmpty(connectionString)}");

if (string.IsNullOrEmpty(connectionString))
{
    if (builder.Environment.IsDevelopment())
    {
        Console.WriteLine("⚠️ Connection string não encontrada. Usando SQLite padrão.");
        connectionString = "Data Source=planner.db";
    }
    else
    {
        throw new InvalidOperationException("Connection string 'DefaultConnection' não encontrada em produção!");
    }
}

// Converter PostgreSQL URI para formato Npgsql
if (builder.Environment.IsProduction() && connectionString.StartsWith("postgresql://"))
{
    connectionString = ConvertPostgresUri(connectionString);
    Console.WriteLine("🔄 Connection string convertida para formato Npgsql");
}

builder.Services.AddDbContext<ApplicationDbContext>(options =>
{
    if (builder.Environment.IsDevelopment())
    {
        Console.WriteLine("📦 Usando SQLite (Development)");
        options.UseSqlite(connectionString);
    }
    else
    {
        Console.WriteLine("📦 Usando PostgreSQL (Production)");
        options.UseNpgsql(connectionString);
    }
});

var app = builder.Build();

// Auto-migrate database on startup
try
{
    using (var scope = app.Services.CreateScope())
    {
        var db = scope.ServiceProvider.GetRequiredService<ApplicationDbContext>();
        
        if (builder.Environment.IsDevelopment())
        {
            Console.WriteLine("🔄 Verificando banco de dados...");
            db.Database.EnsureCreated();
            Console.WriteLine("✅ Banco de dados OK!");
        }
        else
        {
            Console.WriteLine("🔄 Aplicando migrations...");
            db.Database.Migrate();
            Console.WriteLine("✅ Migrations aplicadas com sucesso!");
        }
    }
}
catch (Exception ex)
{
    Console.WriteLine($"❌ Erro no banco de dados: {ex.Message}");
    if (app.Environment.IsDevelopment())
    {
        Console.WriteLine($"Stack trace: {ex.StackTrace}");
    }
    throw;
}

// Serve React build se existir (ClientApp/dist)
var clientDist = Path.Combine(app.Environment.ContentRootPath, "ClientApp", "dist");
if (Directory.Exists(clientDist))
{
    app.UseDefaultFiles(new DefaultFilesOptions
    {
        FileProvider = new PhysicalFileProvider(clientDist),
        DefaultFileNames = new List<string> { "index.html" }
    });
    app.UseStaticFiles(new StaticFileOptions
    {
        FileProvider = new PhysicalFileProvider(clientDist),
        RequestPath = ""
    });

    // fallback para SPA
    app.MapFallbackToFile("index.html");
}

// Configure the HTTP request pipeline.
if (!app.Environment.IsDevelopment())
{
    app.UseExceptionHandler("/Error");
    app.UseHsts();
}

app.UseStaticFiles();
app.UseRouting();

// USE CORS
app.UseCors("AllowVercel");

app.UseAuthorization();

app.MapRazorPages();
app.MapControllers();

// Health check endpoint
app.MapGet("/healthz", () => Results.Ok(new 
{ 
    status = "healthy", 
    timestamp = DateTime.UtcNow,
    environment = app.Environment.EnvironmentName
}));

app.Run();

// Helper: Converter PostgreSQL URI para formato Npgsql
static string ConvertPostgresUri(string uri)
{
    var match = Regex.Match(uri, @"postgresql://(?<user>[^:]+):(?<pass>[^@]+)@(?<host>[^/]+)/(?<db>.+)");
    
    if (!match.Success)
        throw new InvalidOperationException("Formato de URI PostgreSQL inválido");
    
    var user = match.Groups["user"].Value;
    var pass = match.Groups["pass"].Value;
    var host = match.Groups["host"].Value;
    var db = match.Groups["db"].Value;
    
    return $"Host={host};Database={db};Username={user};Password={pass};Port=5432;SSL Mode=Require;Trust Server Certificate=true";
}
