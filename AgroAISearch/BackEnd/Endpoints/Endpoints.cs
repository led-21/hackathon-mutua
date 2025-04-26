using hackaton_microsoft_agro.Data;
using hackaton_microsoft_agro.Interface;
using hackaton_microsoft_agro.Services;
using Microsoft.AspNetCore.Antiforgery;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Mvc;
using System.IO;

namespace hackaton_microsoft_agro.Endpoints
{
    public static class Endpoints
    {
        public static void AddMyEndpoints(this WebApplication app)
        {

            app.MapGet("/", async context =>
            {
                context.Response.Redirect("/swagger");
            });

            app.MapGet("/health", () => new Dictionary<string, string> { ["status"] = "up" }).WithName("HealthCheck");

            app.MapPost("/classify_pest", async (string url, HttpClient client, IOrchestrator orchestrator) =>
            {

                if (string.IsNullOrEmpty(url))
                    return Results.BadRequest("The 'url' parameter is required.");

                try
                {
                    byte[] imageContent = await client.GetByteArrayAsync(url);
                    var result = orchestrator.ProcessRequest(text: null, image: imageContent);

                    return Results.Ok(result);
                }
                catch (ArgumentException ex)
                {
                    return Results.BadRequest(ex.Message);
                }
                catch (Exception e)
                {
                    return Results.InternalServerError(e.Message);
                }
            })
            .WithName("ClassifyImage");


            app.MapPost("/classify_pest_file", async (IFormFile file, IOrchestrator orchestrator) =>
            {
                try
                {
                    if (file == null || file.Length == 0 || !file.ContentType.StartsWith("image"))
                        return Results.BadRequest("No file uploaded or incorrect format.");

                    using (var stream = new MemoryStream())
                    {
                        await file.CopyToAsync(stream);
                        var result = orchestrator.ProcessRequest(text: null, image: stream.ToArray());
                        return Results.Ok(result);
                    }
                }
                catch (ArgumentException ex)
                {
                    return Results.BadRequest(ex.Message);
                }
                catch (Exception e)
                {
                    return Results.InternalServerError(e.Message);
                }
            })
            .WithName("ClassifyImageFile")
            .DisableAntiforgery();

            app.MapPost("/speech_to_text", async (IFormFile file, SpeechService speechService) =>
            {
                try
                {
                    if (file == null || file.Length == 0)
                        return Results.BadRequest("No file uploaded or incorrect format.");

                    using (var stream = new MemoryStream())
                    {
                        await file.CopyToAsync(stream);
                        var result = await Task.Run(() => speechService.SpeechToText(stream.ToArray()));
                        return Results.Ok(new SpeechToTextResponse(result));
                    }
                }
                catch (ArgumentException ex)
                {
                    return Results.BadRequest(ex.Message);
                }
                catch (Exception e)
                {
                    return Results.InternalServerError(e.Message);
                }
            })
            .WithName("SpeechToText")
            .DisableAntiforgery();


            app.MapGet("/control_insect_suggestion", (string pest, IOrchestrator orchestrator) =>
            {

                if (string.IsNullOrEmpty(pest))
                    return Results.BadRequest("The 'pest' parameter is required.");

                try
                {
                    var result = orchestrator.ProcessRequest(text: "Suggest control to " + pest);

                    return Results.Ok(result);
                }
                catch (ArgumentException ex)
                {
                    return Results.BadRequest(ex.Message);
                }
                catch (Exception e)
                {
                    return Results.InternalServerError(e.Message);
                }
            })
            .WithName("ControlInsectSuggestion");


            app.MapGet("/question", (string question, HttpClient client, IOrchestrator orchestrator) =>
            {

                if (string.IsNullOrEmpty(question))
                    return Results.BadRequest("The 'question' parameter is required.");

                try
                {
                    var result = orchestrator.ProcessRequest(text: question);
                    return Results.Ok(result);
                }
                catch (ArgumentException ex)
                {
                    return Results.BadRequest(ex.Message);
                }
                catch (Exception e)
                {
                    return Results.InternalServerError(e.Message);
                }
            })
            .WithName("Question");


            app.MapGet("/get_registered_products", (CropProtectionContext database, string pest) =>
            {
                return database.Products
                         .Where(x => x.PestCommonName.ToUpper().Contains(pest.ToUpper()))
                         .Select(c => new CropProtectionDto
                         (
                             c.Id,
                             c.RegistrationNumber,
                             c.CommercialBrand,
                             c.Class,
                             c.Crop,
                             c.PestScientificName,
                             c.PestCommonName.Replace('?', 'a')
                         ))
                         .Take(20);
            })
            .WithName("GetRegisteredProducts");
        }

    }

    record CropProtectionDto(int Id, string RegistrationNumber, string CommercialBrand, string Class, string Crop, string PestScientificName, string PestCommonName);
    record SpeechToTextRequest(IFormFile file);
    record SpeechToTextResponse(string Text);
}