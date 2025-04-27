using Microsoft.SemanticKernel;
using Microsoft.SemanticKernel.Experimental.Agents;

namespace AgroFireAgentApi.Agents
{
#pragma warning disable
    public class IrrigationAgent
    {
        private readonly ChatCompletionAgent _chatAgent;

        public IrrigationAgent(Kernel kernel)
        {
            _chatAgent = new ChatCompletionAgent(kernel, "Irrigation Agent manages water resources and provides optimal irrigation schedules.");
        }

        public async Task<string> GetIrrigationRecommendation(string soilMoistureData, string weatherForecast)
        {
            var prompt = $"Based on the following soil moisture data: {soilMoistureData} " +
                         $"and weather forecast: {weatherForecast}, provide irrigation recommendations.";

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
