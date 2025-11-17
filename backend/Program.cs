using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.Hosting;
using Microsoft.EntityFrameworkCore;
using Planner.Web.Data;
using Planner.Web.Services;
using Microsoft.Extensions.FileProviders;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container
builder.Services.AddControllersWithViews();
builder.Services.AddRazorPages();

// Register services
builder.Services.AddScoped<IEventService, EventService>();

// Configure CORS para Vercel
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

// Configure Database - SQLite para dev, PostgreSQL para produção
builder.Services.AddDbContext<ApplicationDbContext>(options =>
{
    var connectionString = builder.Configuration.GetConnectionString("DefaultConnection");
    
    if (builder.Environment.IsDevelopment())
    {
        // Local: SQLite
        options.UseSqlite(connectionString);
    }
    else
    {
        // Produção: PostgreSQL
        options.UseNpgsql(connectionString);
    }
});

// Add Swagger
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();

// Auto-migrate database on startup
using (var scope = app.Services.CreateScope())
{
    var db = scope.ServiceProvider.GetRequiredService<ApplicationDbContext>();
    db.Database.Migrate();
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

// Configure the HTTP request pipeline
if (app.Environment.IsDevelopment())
{
    app.UseDeveloperExceptionPage();
    app.UseSwagger();
    app.UseSwaggerUI();
}
else
{
    app.UseExceptionHandler("/Error");
    app.UseHsts();
}

// app.UseHttpsRedirection(); // Remova esta linha

app.UseStaticFiles();

app.UseRouting();

// USE CORS
app.UseCors("AllowVercel");

app.UseAuthorization();

app.MapControllers();
app.MapRazorPages();

// Health check endpoint
app.MapGet("/healthz", () => Results.Ok(new { status = "healthy", timestamp = DateTime.UtcNow }));

app.Run();
