namespace hackaton_microsoft_agro.Models
{
    public class CropProtection
    {
        public int Id { get; set; }
        public string RegistrationNumber { get; set; } = string.Empty;
        public string CommercialBrand { get; set; } = string.Empty;
        public string Formulation { get; set; } = string.Empty;
        public string ActiveIngredient { get; set; } = string.Empty;
        public string RegistrationHolder { get; set; } = string.Empty;
        public string Class { get; set; } = string.Empty;
        public string ModeOfAction { get; set; } = string.Empty;
        public string Crop { get; set; } = string.Empty;
        public string PestScientificName { get; set; } = string.Empty;
        public string PestCommonName { get; set; } = string.Empty;
        public string CompanyCountryType { get; set; } = string.Empty;
        public string ToxicologicalClass { get; set; } = string.Empty;
        public string EnvironmentalClass { get; set; } = string.Empty;
        public string Organic { get; set; } = string.Empty;
        public string Status { get; set; } = string.Empty;
    }
}
