using System.Text;
using Azure;
using Azure.AI.OpenAI;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;

var builder = WebApplication.CreateBuilder(args);

// Add EF Core + Postgres
builder.Services.AddDbContext<ApplicationDbContext>(options =>
    options.UseNpgsql(
        builder.Configuration.GetConnectionString("DefaultConnection"),
        sqlOptions => sqlOptions.EnableRetryOnFailure()
    ));

builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = true,
            ValidateAudience = true,
            ValidateLifetime = true,
            ValidateIssuerSigningKey = true,
            ValidIssuer = builder.Configuration["Jwt:Issuer"],
            ValidAudience = builder.Configuration["Jwt:Audience"],
            IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(builder.Configuration["Jwt:Key"]!))
        };
    });

builder.Services.AddAuthorization();

// CORS setup
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowReactApp", policy =>
    {
        policy.WithOrigins(
                "http://localhost:5173",
                "https://localhost:5173" // if vite dev uses https later
            )
            .AllowAnyHeader()
            .AllowAnyMethod()
            .AllowCredentials();
    });
});

// Add services to the container.

builder.Services.AddControllers();
// Learn more about configuring OpenAPI at https://aka.ms/aspnet/openapi
builder.Services.AddOpenApi();

// --- Azure OpenAI Config ---
var endpoint = new Uri(builder.Configuration["AzureOpenAI:EndPoint"]!);
var deploymentName = builder.Configuration["AzureOpenAI:DeploymentName"]!;
var apiKey = builder.Configuration["AzureOpenAI:ApiKey"]!;

// Initialize the AzureOpenAIClient
builder.Services.AddSingleton(new AzureOpenAIClient(endpoint, new AzureKeyCredential(apiKey)));

// Register ChatClient in DI
builder.Services.AddSingleton(sp =>
{
    var client = sp.GetRequiredService<AzureOpenAIClient>();
    return client.GetChatClient(deploymentName);
});

var app = builder.Build();

app.UseCors("AllowReactApp"); // must be before UseAuthentication/UseAuthorization

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
}


app.UseHttpsRedirection();

app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

app.Run();
