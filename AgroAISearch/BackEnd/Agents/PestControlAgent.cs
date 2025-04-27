using Microsoft.SemanticKernel;
using Microsoft.SemanticKernel.Experimental.Agents;

namespace AgroFireAgentApi.Agents
{
#pragma warning disable

    public class PestControlAgent
    {
        private readonly ChatCompletionAgent _chatAgent;

        public PestControlAgent(Kernel kernel)
        {
            _chatAgent = new ChatCompletionAgent(kernel, "Pest Control Agent identifies pests and recommends IPM strategies.");
        }

        public async Task<string> GetPestControlAdvice(string pestData, string cropStage)
        {
            var prompt = $"At crop stage: {cropStage}, analyze the following pest data: {pestData} " +
                         "and provide integrated pest management recommendations.";

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
