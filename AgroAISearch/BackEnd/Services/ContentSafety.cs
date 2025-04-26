using Azure;
using Azure.AI.ContentSafety;
using Microsoft.AspNetCore.DataProtection.KeyManagement;

namespace hackaton_microsoft_agro.Services
{
    public class ContentSafety(string endpoint, string key)
    {
        ContentSafetyClient contentSafetyClient = new ContentSafetyClient(new Uri(endpoint), new AzureKeyCredential(key));

        public void ValidateContent(byte[]? image, string? text)
        {
            if (ContentAnalyze(image, text))
                throw new ArgumentException("Text or image contains inappropriate content.");
        }

        private bool ContentAnalyze(byte[]? image, string? text)
        {
            bool resultImage = false;
            bool resultText = false;

            try
            {
                if (image != null)
                {
                    var request = new AnalyzeImageOptions(new ContentSafetyImageData(BinaryData.FromBytes(image)));
                    resultImage = IsInappropriateImage(contentSafetyClient.AnalyzeImage(request));
                }

                if (text != null)
                {
                    var request = new AnalyzeTextOptions(text);
                    resultText = IsInappropriateText(contentSafetyClient.AnalyzeText(request));
                }
            }
            catch (Exception ex)
            {
                throw new Exception("Error ContentAnalyze -> " + ex.Message);
            }

            return resultImage || resultText;
        }

        bool IsInappropriateImage(Response<AnalyzeImageResult> response)
        {
            return (response.Value.CategoriesAnalysis.FirstOrDefault(item => item.Category == ImageCategory.Hate)?.Severity > 0) ||
            (response.Value.CategoriesAnalysis.FirstOrDefault(item => item.Category == ImageCategory.SelfHarm)?.Severity > 0) ||
            (response.Value.CategoriesAnalysis.FirstOrDefault(item => item.Category == ImageCategory.Sexual)?.Severity > 0) ||
            (response.Value.CategoriesAnalysis.FirstOrDefault(item => item.Category == ImageCategory.Violence)?.Severity > 0);
        }

        bool IsInappropriateText(Response<AnalyzeTextResult> response)
        {
            return (response.Value.CategoriesAnalysis.FirstOrDefault(item => item.Category == TextCategory.Hate)?.Severity > 0) ||
            (response.Value.CategoriesAnalysis.FirstOrDefault(item => item.Category == TextCategory.SelfHarm)?.Severity > 0) ||
            (response.Value.CategoriesAnalysis.FirstOrDefault(item => item.Category == TextCategory.Sexual)?.Severity > 0) ||
            (response.Value.CategoriesAnalysis.FirstOrDefault(item => item.Category == TextCategory.Violence)?.Severity > 0);
        }
    }
}
