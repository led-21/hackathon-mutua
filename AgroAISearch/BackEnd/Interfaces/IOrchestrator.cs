namespace hackaton_microsoft_agro.Interface
{
    public interface IOrchestrator
    {
        public Dictionary<string, string> ProcessRequest(string? text = null, byte[]? image = null);
    }
}
