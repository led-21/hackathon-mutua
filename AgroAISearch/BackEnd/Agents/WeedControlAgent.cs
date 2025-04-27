using Microsoft.SemanticKernel;
using Microsoft.SemanticKernel.Experimental.Agents;



namespace AgroFireAgentApi.Agents
{
#pragma warning disable

    public class WeedControlAgent
    {
        private readonly ChatCompletionAgent _chatAgent;

        public WeedControlAgent(Kernel kernel)
        {
            _chatAgent = new ChatCompletionAgent(kernel, "Weed Control Agent identifies weed species and recommends control strategies.");
        }

        public async Task<string> GetWeedControlAdvice(string weedData, string cropType)
        {
            var prompt = $"For crop type: {cropType}, analyze the following weed data: {weedData} " +
                         "and provide recommendations for weed control, including organic and chemical options.";

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
