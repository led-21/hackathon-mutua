using Microsoft.SemanticKernel;
using Microsoft.SemanticKernel.Experimental.Agents;

namespace AgroFireAgentApi.Agents
{
#pragma warning disable  
    public class MonitoringAgent
    {
        private readonly ChatCompletionAgent _chatAgent;

        public MonitoringAgent(Kernel kernel)
        {
            _chatAgent = new ChatCompletionAgent(kernel, "Monitoring Agent specializes in crop monitoring using sensor data and image analysis.");
        }

        public async Task<string> AnalyzeCropConditions(string sensorData, string imageData = null)
        {
            var prompt = $"Analyze the following crop conditions based on sensor data: {sensorData}";

            if (!string.IsNullOrEmpty(imageData))
            {
                prompt += $"\n\nAdditional image data analysis requested: {imageData}";
            }

            var result = await _chatAgent.InvokeAsync([new ChatMessageContent() { Content = prompt }]);

            var responseMessage = "";
            foreach (var response in result)
            {
                responseMessage += response.Content;
            }

            return responseMessage;
        }
    }
}
