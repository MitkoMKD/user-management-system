using UserManagementSystem.Models;

namespace UserManagementSystem.Services.Interfaces
{
    public interface IUserService
    {
        Task<RegistrationStatus> CreateUserAsync(RegisterDto dto);
        Task<User> LoginAsync(string username, string password);
        Task<bool> DeleteUserAsync(int id);
        Task<User> UpdateUserAsync(User user);
        Task<List<User>> GetUsersAsync(string search = "");
    }
}
