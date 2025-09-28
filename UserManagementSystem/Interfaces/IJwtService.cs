using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using UserManagementSystem.Models;

namespace UserManagementSystem.Services.Interfaces
{
    public interface IJwtService
    {
        string GenerateToken(User user);
    }
}
