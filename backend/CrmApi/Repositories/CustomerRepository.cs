using CrmApi.Data;
using CrmApi.Models;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace CrmApi.Repositories
{
    public class CustomerRepository : ICustomerRepository
    {
        private readonly AppDbContext _context;
        public CustomerRepository(AppDbContext context)
        {
            _context = context;
        }
        public async Task<IEnumerable<Customer>> GetAllAsync()
        {
            return await _context.Customers.OrderBy(c => c.Id).ToListAsync();
        }
        public async Task<Customer?> GetByIdAsync(int id)
        {
            return await _context.Customers.FindAsync(id);
        }
        public async Task AddAsync(Customer customer)
        {
            _context.Customers.Add(customer);
            await _context.SaveChangesAsync();
        }
        public async Task UpdateAsync(Customer customer)
        {
            _context.Entry(customer).State = EntityState.Modified;
            await _context.SaveChangesAsync();
        }
        public async Task DeleteAsync(int id)
        {
            var customer = await _context.Customers.FindAsync(id);
            if (customer != null)
            {
                _context.Customers.Remove(customer);
                await _context.SaveChangesAsync();
            }
        }
        public async Task<IEnumerable<Customer>> FilterAsync(string? name, string? email, string? region, DateTime? registrationDate)
        {
            var query = _context.Customers.AsQueryable();
            if (!string.IsNullOrEmpty(name))
                query = query.Where(c => EF.Functions.Like(c.FirstName.ToLower(), $"%{name.ToLower()}%") || 
                                        EF.Functions.Like(c.LastName.ToLower(), $"%{name.ToLower()}%"));
            if (!string.IsNullOrEmpty(email))
                query = query.Where(c => EF.Functions.Like(c.Email.ToLower(), $"%{email.ToLower()}%"));
            if (!string.IsNullOrEmpty(region))
                query = query.Where(c => EF.Functions.Like(c.Region.ToLower(), $"%{region.ToLower()}%"));
            if (registrationDate.HasValue)
                query = query.Where(c => c.RegistrationDate.Date == registrationDate.Value.Date);
            return await query.ToListAsync();
        }
    }
} 