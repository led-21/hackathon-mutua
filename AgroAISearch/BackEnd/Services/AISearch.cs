using System.Drawing;
using Azure;
using Azure.Search.Documents;
using Azure.Search.Documents.Models;

namespace hackaton_microsoft_agro.Services
{

    public class AISearch(string endpoint, string apiKey)
    {
        SearchClient searchClient = new SearchClient(new Uri(endpoint), "vector-agro-01", new AzureKeyCredential(apiKey));

        public List<string> Search(string searchText, int size = 5)
        {
            HttpClient httpClient = new HttpClient();

            try
            {
                var options = new SearchOptions
                {
                    Size = size
                };

                var searchResults = searchClient.Search<SearchDocument>(searchText, options);
                var textResults = new List<string>();

                foreach (var document in searchResults.Value.GetResults())
                {
                    textResults.Add(document.Document["chunk"]+"\n source:"+ document.Document["title"]);
                }

                return textResults;
            }
            catch (Exception ex)
            {
                throw new Exception("Error Search -> " + ex.Message);
            }

        }
    }
}