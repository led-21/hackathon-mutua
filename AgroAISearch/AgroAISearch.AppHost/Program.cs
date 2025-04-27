using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;

var builder = DistributedApplication.CreateBuilder(args);

var backend = builder.AddProject<Projects.hackaton_microsoft_agro>("backend");

var frontend = builder.AddDockerfile("frontend", "..\\FrontEnd\\src")
    .WithReference(backend)
    .WithHttpEndpoint(port:8503, targetPort:8501)
    .WithExternalHttpEndpoints();

builder.Build().Run();

