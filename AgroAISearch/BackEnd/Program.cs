using Azure.Identity;
using hackaton_microsoft_agro.Data;
using hackaton_microsoft_agro.Endpoints;
using hackaton_microsoft_agro.Interface;
using hackaton_microsoft_agro.Services;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

builder.AddServiceDefaults();

builder.Services.AddDbContext<ApplicationIdentityContext>(options =>
    options.UseSqlite("IdentityDB"));

// Identity Configuration 
builder.Services.AddIdentity<IdentityUser, IdentityRole>(options =>
{
    options.Password.RequireDigit = false;
    options.Password.RequiredLength = 6;
    options.Password.RequireNonAlphanumeric = false;
    options.Password.RequireUppercase = false;
    options.Password.RequireLowercase = false;
    options.User.RequireUniqueEmail = false;
    options.SignIn.RequireConfirmedEmail = false;
})
.AddEntityFrameworkStores<ApplicationIdentityContext>()
.AddApiEndpoints()
.AddDefaultTokenProviders();

builder.Services.AddAuthentication();
builder.Services.AddAuthorization();

// Adicionando a URL do Key Vault ao arquivo de configuração
builder.Configuration.AddJsonFile("appsettings.json", optional: true, reloadOnChange: true);

// Configurando o Azure Key Vault usando o ClientSecretCredential
string? keyVaultName = Environment.GetEnvironmentVariable("KEYVAULT_NAME");
if (string.IsNullOrEmpty(keyVaultName))
{
    throw new InvalidOperationException("KeyVaultName environment variable is not set.");
}

builder.Configuration.AddAzureKeyVault(
    new Uri($"https://{keyVaultName}.vault.azure.net/"), 
    new DefaultAzureCredential());

// Add database
builder.Services.AddDbContext<CropProtectionContext>();

// Add services to the container.
// Learn more about configuring OpenAPI at https://aka.ms/aspnet/openapi
builder.Services.AddOpenApi();

// Add HTTP Client Service
builder.Services.AddHttpClient();

// Add Orchestrator Service
builder.Services.AddSingleton<IOrchestrator, Orchestrator>(o => new Orchestrator(
    new ContentSafety(
        builder.Configuration["content-safety-endpoint"]!,
        builder.Configuration["content-safety-key"]!),

    new CustomVision(
        builder.Configuration["custom-vision-endpoint"]!,
        builder.Configuration["custom-vison-prediction-key"]!,
        new Guid(builder.Configuration["custom-vision-project-id"]!),
        builder.Configuration["custom-vision-iteration-name"]!),

    new AISearch(
        builder.Configuration["ai-search-endpoint"]!,
        builder.Configuration["ai-search-key"]!),

     new OpenAIService(
        builder.Configuration["openai-endpoint"]!,
        builder.Configuration["openai-key"]!,
        builder.Configuration["openai-deployment-name"]!)
    )
);


builder.Services.AddSingleton<SpeechService>(s => new SpeechService(
    builder.Configuration["speech-key"]!,
    builder.Configuration["Region"]!
));

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAll",
        builder =>
        {
            builder.AllowAnyOrigin()
            .AllowAnyMethod()
            .AllowAnyHeader();
        });
});

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}


// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
}

app.UseCors("AllowAll");

app.UseHttpsRedirection();

app.UseAuthentication();
app.UseAuthorization();

app.MapIdentityApi<IdentityUser>()
    .WithTags("Identity");

app.AddMyEndpoints();

app.Run();



