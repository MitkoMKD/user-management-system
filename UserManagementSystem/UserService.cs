using Microsoft.Extensions.Logging;
using UserManagementSystem.Models;
using UserManagementSystem.Repository.Interfaces;
using UserManagementSystem.Services.Interfaces;

namespace UserManagementSystem.Services
{
    public class UserService : IUserService
    {
        private readonly IRepository<User> _repository;
        private readonly ILogger<UserService> _logger;

        public UserService(IRepository<User> repository, ILogger<UserService> logger)
        {
            _repository = repository;
            _logger = logger;
        }
        public async Task<RegistrationStatus> CreateUserAsync(RegisterDto dto)
        {
            try
            {
                var existingUser = await _repository.SelectAsync(
                    u => u.Username == dto.Username || u.Email == dto.Email
                );
                if (existingUser != null)
                {
                    _logger.LogWarning($"Attempt to create a user that already exists: {dto.Username} or {dto.Email}");
                    return RegistrationStatus.UserAlreadyExists;
                }
                // Create new user
                var user = new User
                {
                    Username = dto.Username,
                    PasswordHash = HashPassword(dto.PasswordHash),
                    Role = dto.Role,
                    IsActive = dto.IsActive,
                    Email = dto.Email,
                    FullName = dto.FullName
                };

                _repository.Add(user);
                await _repository.SaveAsync();
                _logger.LogInformation($"New user created: {user.Username}");
                return RegistrationStatus.Success;
            }
            catch (Exception)
            {
                _logger.LogError("An error occurred while creating a new user.");
                return RegistrationStatus.Failure;
            }
        }

        public async Task<bool> DeleteUserAsync(int id)
        {
            var result = _repository.Remove(id);
            if (result)
            {
                await _repository.SaveAsync();
            }
            return result;
        }

        public async Task<List<User>> GetUsersAsync(string search = "")
        {
            try
            {
                return await _repository.GetAllAsync(search);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "An error occurred while retrieving users.");
                return new List<User>();
            }
        }

        public async Task<User> LoginAsync(string username, string password)
        {
            var user = await _repository.SelectAsync(u => u.Username == username);
            if (user == null)
            {
                _logger.LogWarning($"Login attempt failed for non-existent user: {username}");
                return null;
            }

            var inputPasswordHash = HashPassword(password);
            if (user.PasswordHash != inputPasswordHash)
                return null;

            _logger.LogInformation($"User logged in: {username}");
            return user;
        }

        public async Task<User> UpdateUserAsync(User user)
        {
            var existingUser = _repository.GetById(user.Id);
            if (existingUser == null)
            {
                return null;
            }

            existingUser.Username = user.Username;
            existingUser.Role = user.Role;
            existingUser.IsActive = user.IsActive;
            existingUser.Email = user.Email;
            existingUser.FullName = user.FullName;

            // Only update password if it's different and not null/empty
            if (!string.IsNullOrEmpty(user.PasswordHash) && user.PasswordHash != existingUser.PasswordHash)
            {
                existingUser.PasswordHash = HashPassword(user.PasswordHash);
            }

            _repository.Update(existingUser);
            await _repository.SaveAsync();
            return existingUser;
        }
        private string HashPassword(string password)
        {
            using var sha = System.Security.Cryptography.SHA256.Create();
            var bytes = System.Text.Encoding.UTF8.GetBytes(password);
            var hash = sha.ComputeHash(bytes);
            return Convert.ToBase64String(hash);
        }
    }
}
