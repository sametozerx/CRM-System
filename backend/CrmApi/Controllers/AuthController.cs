using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using CrmApi.Data;
using CrmApi.Models;
using Microsoft.Extensions.Logging;
using CrmApi.Repositories;

namespace CrmApi.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuthController : ControllerBase
    {
        private readonly IUserRepository _userRepository;
        private readonly IConfiguration _configuration;
        private readonly ILogger<AuthController> _logger;

        public AuthController(IUserRepository userRepository, IConfiguration configuration, ILogger<AuthController> logger)
        {
            _userRepository = userRepository;
            _configuration = configuration;
            _logger = logger;
        }

        [HttpPost("register")]
        public async Task<IActionResult> Register(User user)
        {
            if (await _userRepository.GetByUsernameAsync(user.Username) != null)
            {
                _logger.LogWarning($"Registration failed: Username already exists. ({user.Username})");
                return BadRequest("Username already exists.");
            }
            user.CreatedAt = DateTime.UtcNow;
            user.UpdatedAt = DateTime.UtcNow;
            await _userRepository.AddAsync(user);
            _logger.LogInformation($"New user registration: {user.Username}");
            return Ok("Registration successful.");
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] User login)
        {
            var user = await _userRepository.GetByUsernameAndPasswordAsync(login.Username, login.Password);
            if (user == null)
            {
                _logger.LogWarning($"Failed login attempt: {login.Username}");
                return Unauthorized("Invalid username or password.");
            }
            var token = GenerateJwtToken(user);
            _logger.LogInformation($"Successful login: {user.Username}");
            return Ok(new { token });
        }

        private string GenerateJwtToken(User user)
        {
            var jwtKey = _configuration["Jwt:Key"] ?? "supersecretkey12345";
            var jwtIssuer = _configuration["Jwt:Issuer"] ?? "crmapi";
            var securityKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtKey));
            var credentials = new SigningCredentials(securityKey, SecurityAlgorithms.HmacSha256);

            var claims = new[]
            {
                new Claim(ClaimTypes.Name, user.Username),
                new Claim(ClaimTypes.Role, user.Role)
            };

            var token = new JwtSecurityToken(
                issuer: jwtIssuer,
                audience: null,
                claims: claims,
                expires: DateTime.UtcNow.AddHours(2),
                signingCredentials: credentials
            );
            return new JwtSecurityTokenHandler().WriteToken(token);
        }
    }
} 