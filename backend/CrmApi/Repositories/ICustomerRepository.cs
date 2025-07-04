using CrmApi.Models;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace CrmApi.Repositories
{
    public interface ICustomerRepository
    {
        Task<IEnumerable<Customer>> GetAllAsync();
        Task<Customer?> GetByIdAsync(int id);
        Task AddAsync(Customer customer);
        Task UpdateAsync(Customer customer);
        Task DeleteAsync(int id);
        Task<IEnumerable<Customer>> FilterAsync(string? name, string? email, string? region, DateTime? registrationDate);
    }
} 