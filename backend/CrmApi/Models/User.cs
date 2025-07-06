using System.ComponentModel.DataAnnotations;

namespace CrmApi.Models
{
    public enum UserRole
    {
        User,
        Admin
    }

    public class User
    {
        public int Id { get; set; }
        
        [Required]
        [StringLength(32)]
        public string Username { get; set; } = string.Empty;
        
        [Required]
        [StringLength(32)]
        public string Password { get; set; } = string.Empty;
        
        [Required]
        public UserRole Role { get; set; } = UserRole.User;
        
        public DateTime CreatedAt { get; set; }
        public DateTime UpdatedAt { get; set; }
    }
} 