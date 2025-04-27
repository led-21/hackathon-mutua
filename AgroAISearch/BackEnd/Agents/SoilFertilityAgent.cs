using Microsoft.SemanticKernel;
using Microsoft.SemanticKernel.Experimental.Agents;



namespace AgroFireAgentApi.Agents
{
#pragma warning disable
    public class SoilFertilityAgent
    {
        private readonly ChatCompletionAgent _chatAgent;

        public SoilFertilityAgent(Kernel kernel)
        {
            _chatAgent = new ChatCompletionAgent(kernel, "Soil Fertility Agent analyzes soil nutrients and recommends amendments.");
        }

        public async Task<string> GetFertilityRecommendation(string soilTestResults, string cropRequirements)
        {
            var prompt = $"Based on these soil test results: {soilTestResults} " +
                         $"and crop requirements: {cropRequirements}, provide fertility recommendations " +
                         "including organic and synthetic fertilizer options.";

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
