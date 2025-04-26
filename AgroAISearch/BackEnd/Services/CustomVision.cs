using Microsoft.Azure.CognitiveServices.Vision.CustomVision.Prediction;
using Microsoft.Rest;

namespace hackaton_microsoft_agro.Services
{
    public class CustomVision(string endpoint, string key, Guid projectId, string iterationName)
    {
        Guid projectId = projectId;
        string iterationName = iterationName;

        CustomVisionPredictionClient predictor = new CustomVisionPredictionClient(
            new ApiKeyServiceClientCredentials(key))
        {
            Endpoint = endpoint
        };

        public (string, double) AnalyseImageContent(byte[] image)
        {
            var predictions = new Dictionary<string, double>();

            using (MemoryStream imageStream = new MemoryStream(image))
            {
                var results = predictor.ClassifyImage(projectId, iterationName, imageStream);

                foreach (var prediction in results.Predictions)
                {
                    predictions[prediction.TagName] = prediction.Probability;
                }
            }
            var maxPrediction = predictions.Aggregate((l, r) => l.Value > r.Value ? l : r);

            return (maxPrediction.Key, maxPrediction.Value);
        }
    }
}
