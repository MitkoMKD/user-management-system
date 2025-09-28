using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace UserManagementSystem.Models
{
    public class User
    {
        public int Id { get; set; }
        public string Username { get; set; } = null!;
        public string PasswordHash { get; set; } = null!;
        public string Role { get; set; } = "User"; // "Admin" or "User"
        public bool IsActive { get; set; } = true;
        public string? Email { get; set; }
        public string? FullName { get; set; }
    }
}
