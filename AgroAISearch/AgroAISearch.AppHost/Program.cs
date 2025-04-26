using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;

var builder = DistributedApplication.CreateBuilder(args);

var backend = builder.AddProject<Projects.hackaton_microsoft_agro>("backend")
    .WithHelloWorldCommand();

var frontend = builder.AddDockerfile("frontend", "..\\FrontEnd\\src")
    .WithReference(backend)
    .WithHttpEndpoint(port:8503, targetPort:8501)
    .WithExternalHttpEndpoints();

builder.Build().Run();

internal static class HelloWorldResourceBuilderExtensions
{
    public static IResourceBuilder<ProjectResource> WithHelloWorldCommand(this IResourceBuilder<ProjectResource> builder)
    {
        builder.WithCommand(
            name: "hello-world",
            displayName: "Hello World",
            executeCommand: context => OnRunHelloWorldCommandAsync(builder, context),
            updateState: OnUpdateResourceState,
            iconName: "EmojiSmileSlight",
            iconVariant: IconVariant.Filled
        );
        return builder;
    }

    private static async Task<ExecuteCommandResult> OnRunHelloWorldCommandAsync(IResourceBuilder<ProjectResource> builder, ExecuteCommandContext context)
    {
        var logger = context.ServiceProvider.GetRequiredService<ILogger<Program>>();
        logger.LogInformation("Hello, World!");
        return CommandResults.Success();
    }

    private static ResourceCommandState OnUpdateResourceState(UpdateCommandStateContext context)
    {
        return ResourceCommandState.Enabled;
    }
}
    