using UserManagementSystem.Services;
using UserManagementSystem.Models;
using UserManagementSystem.Repository.Interfaces;
using Moq;

namespace UserManagementSystem.UnitTests
{
    public class UserServiceTests
    {
        [Fact]
        public void Constructor_ShouldCreateInstance()
        {
            // Arrange
            var mockRepository = new Mock<IRepository<User>>();
            var mockLogger = new Mock<Microsoft.Extensions.Logging.ILogger<UserService>>();

            // Act
            var service = new UserService(mockRepository.Object, mockLogger.Object);

            // Assert
            Assert.NotNull(service);
        }

        [Fact]
        public async Task CreateUserAsync_ShouldReturnSuccess_WhenUserIsCreated()
        {
            // Arrange
            var mockRepository = new Mock<IRepository<User>>();
            var mockLogger = new Mock<Microsoft.Extensions.Logging.ILogger<UserService>>();
            var service = new UserService(mockRepository.Object, mockLogger.Object);
            var dto = new RegisterDto { Username = "testuser", PasswordHash = "hashed", Role = "User", IsActive = true };

            mockRepository.Setup(r => r.SelectAsync(It.IsAny<System.Linq.Expressions.Expression<Func<User, bool>>>()))
                .ReturnsAsync((User)null!);
            mockRepository.Setup(r => r.Add(It.IsAny<User>()));
            mockRepository.Setup(r => r.SaveAsync()).ReturnsAsync(1);

            // Act
            var result = await service.CreateUserAsync(dto);

            // Assert
            Assert.Equal(RegistrationStatus.Success, result);
        }

        [Fact]
        public async Task DeleteUserAsync_ShouldReturnTrue_WhenUserIsDeleted()
        {
            // Arrange
            var mockRepository = new Mock<IRepository<User>>();
            var mockLogger = new Mock<Microsoft.Extensions.Logging.ILogger<UserService>>();
            var service = new UserService(mockRepository.Object, mockLogger.Object);
            int userId = 1;

            mockRepository.Setup(r => r.Remove(userId)).Returns(true);
            mockRepository.Setup(r => r.SaveAsync()).ReturnsAsync(1);

            // Act
            var result = await service.DeleteUserAsync(userId);

            // Assert
            Assert.True(result);
        }

        [Fact]
        public async Task GetUsersAsync_ShouldReturnListOfUsers()
        {
            // Arrange
            var mockRepository = new Mock<IRepository<User>>();
            var mockLogger = new Mock<Microsoft.Extensions.Logging.ILogger<UserService>>();
            var service = new UserService(mockRepository.Object, mockLogger.Object);
            var users = new List<User> { new User { Id = 1, Username = "user1" } };

            mockRepository.Setup(r => r.GetAllAsync(It.IsAny<string>())).ReturnsAsync(users);

            // Act
            var result = await service.GetUsersAsync("");

            // Assert
            Assert.NotNull(result);
            Assert.Single(result);
            Assert.Equal("user1", result[0].Username);
        }

        [Fact]
        public async Task LoginAsync_ShouldReturnUser_WhenCredentialsAreValid()
        {
            // Arrange
            var mockRepository = new Mock<IRepository<User>>();
            var mockLogger = new Mock<Microsoft.Extensions.Logging.ILogger<UserService>>();
            var service = new UserService(mockRepository.Object, mockLogger.Object);
            var user = new User { Id = 1, Username = "user1", PasswordHash = "password" };
            user.PasswordHash = HashPassword("password");
            mockRepository.Setup(r => r.SelectAsync(It.IsAny<System.Linq.Expressions.Expression<Func<User, bool>>>()))
                .ReturnsAsync(user);

            // Act
            var result = await service.LoginAsync("user1", "password");

            // Assert
            Assert.NotNull(result);
            Assert.Equal("user1", result.Username);
        }

        private string HashPassword(string password)
        {
            using var sha = System.Security.Cryptography.SHA256.Create();
            var bytes = System.Text.Encoding.UTF8.GetBytes(password);
            var hash = sha.ComputeHash(bytes);
            return Convert.ToBase64String(hash);
        }

        [Fact]
        public async Task UpdateUserAsync_ShouldReturnUpdatedUser()
        {
            // Arrange
            var mockRepository = new Mock<IRepository<User>>();
            var mockLogger = new Mock<Microsoft.Extensions.Logging.ILogger<UserService>>();
            var service = new UserService(mockRepository.Object, mockLogger.Object);
            var user = new User { Id = 1, Username = "user1" };

            mockRepository.Setup(r => r.GetById(It.IsAny<int>())).Returns(user);
            mockRepository.Setup(r => r.SaveAsync()).ReturnsAsync(1);

            // Act
            var result = await service.UpdateUserAsync(user);

            // Assert
            Assert.NotNull(result);
            Assert.Equal("user1", result.Username);
        }
    }
}
