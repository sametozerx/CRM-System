using System.ComponentModel.DataAnnotations;

namespace CrmApi.Models
{
    public class Customer
    {
        public int Id { get; set; }
        
        [Required]
        [StringLength(50)]
        public string FirstName { get; set; } = string.Empty;
        
        [Required]
        [StringLength(50)]
        public string LastName { get; set; } = string.Empty;
        
        [Required]
        [EmailAddress]
        [StringLength(100)]
        public string Email { get; set; } = string.Empty;
        
        [Required]
        [StringLength(100)]
        public string Region { get; set; } = string.Empty;
        
        public DateTime RegistrationDate { get; set; }
    }
} 