using Microsoft.AspNetCore.Mvc;
using UserManagementSystem.Models;
using UserManagementSystem.Services.Interfaces;

namespace UserManagementSystem.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly IJwtService _jwt;
        private readonly IUserService _userService;

        public AuthController(IJwtService jwt, IUserService userService)
        {
            _jwt = jwt;
            _userService = userService;
        }

        [HttpPost("register")]
        public async Task<IActionResult> Register(RegisterDto dto)
        {
            var result = await _userService.CreateUserAsync(dto);
            if (result == RegistrationStatus.Failure) return BadRequest("Registration failed");
            if (result == RegistrationStatus.UserAlreadyExists) return Conflict("User already exists");
            return Ok(new { message = "User registered", user = dto });
        }
        [HttpPost("login")]
        public async Task<IActionResult> Login(LoginDto dto)
        {
            var user = await _userService.LoginAsync(dto.Username, dto.Password);
            if (user == null)
            {
                return Unauthorized("Invalid credentials");
            }
            
            var token = _jwt.GenerateToken(user);
            return Ok(new { token, role = user.Role, username = user.Username , isActive = user.IsActive });
        }
    }
}
