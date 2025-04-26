using Microsoft.CognitiveServices.Speech;
using Microsoft.CognitiveServices.Speech.Audio;

namespace hackaton_microsoft_agro.Services
{
    public class SpeechService(string apiKey, string region)
    {
        SpeechConfig config = SpeechConfig.FromSubscription(apiKey, region);

        public async Task<string> SpeechToText(byte[] audio)
        {
            try
            {
                var tempFilePath = Path.GetTempFileName();
                File.WriteAllBytes(tempFilePath, audio);
                using var audioConfig = AudioConfig.FromWavFileInput(tempFilePath);

                config.SpeechRecognitionLanguage = "en-US";
                using var recognizer = new SpeechRecognizer(config, audioConfig);

                var result = await recognizer.RecognizeOnceAsync();

                if (result.Reason == ResultReason.RecognizedSpeech)
                {
                    return result.Text;
                }
                else if (result.Reason == ResultReason.NoMatch)
                {
                    return "No speech could be recognized.";
                }
                else if (result.Reason == ResultReason.Canceled)
                {
                    var cancellation = CancellationDetails.FromResult(result);
                    return $"CANCELED: Reason={cancellation.Reason}";
                }
                else
                {
                    throw new InvalidOperationException($"Speech recognition failed: {result.Reason}");
                }
            }
            catch (Exception ex)
            {
                throw new ArgumentException("Error processing the audio file -> SpeechToText: " + ex.Message);
            }
        }
    }
}