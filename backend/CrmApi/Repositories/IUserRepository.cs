using CrmApi.Models;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace CrmApi.Repositories
{
    public interface IUserRepository
    {
        Task<IEnumerable<User>> GetAllAsync();
        Task<User?> GetByIdAsync(int id);
        Task<User?> GetByUsernameAsync(string username);
        Task<User?> GetByUsernameAndPasswordAsync(string username, string password);
        Task AddAsync(User user);
        Task UpdateAsync(User user);
        Task DeleteAsync(int id);
    }
} 