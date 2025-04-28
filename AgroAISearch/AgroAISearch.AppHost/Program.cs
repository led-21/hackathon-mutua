using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;

var builder = DistributedApplication.CreateBuilder(args);

var backend = builder.AddProject<Projects.hackaton_mutua_agro>("backend");

var frontend = builder.AddNpmApp("frontend", "..\\FrontEnd\\react")
    .WithEnvironment("PORT","3001")
    .WithExternalHttpEndpoints();

builder.Build().Run();

