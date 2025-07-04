using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using CrmApi.Data;
using CrmApi.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.Extensions.Logging;
using CrmApi.Repositories;

namespace CrmApi.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class CustomerController : ControllerBase
    {
        private readonly ICustomerRepository _repository;
        private readonly ILogger<CustomerController> _logger;

        public CustomerController(ICustomerRepository repository, ILogger<CustomerController> logger)
        {
            _repository = repository;
            _logger = logger;
        }

        // GET: api/Customer
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Customer>>> GetCustomers()
        {
            var customers = await _repository.GetAllAsync();
            return Ok(customers);
        }

        // GET: api/Customer/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Customer>> GetCustomer(int id)
        {
            var customer = await _repository.GetByIdAsync(id);
            if (customer == null)
                return NotFound();
            return Ok(customer);
        }

        // POST: api/Customer
        [HttpPost]
        [Authorize(Roles = "Admin")]
        public async Task<ActionResult<Customer>> CreateCustomer(Customer customer)
        {
            _logger.LogInformation($"Adding new customer: {customer.FirstName} {customer.LastName}");
            await _repository.AddAsync(customer);
            return CreatedAtAction(nameof(GetCustomer), new { id = customer.Id }, customer);
        }

        // PUT: api/Customer/5
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateCustomer(int id, Customer customer)
        {
            if (id != customer.Id)
            {
                _logger.LogWarning($"Update failed: ID mismatch (id: {id}, customer.Id: {customer.Id})");
                return BadRequest();
            }
            try
            {
                await _repository.UpdateAsync(customer);
                _logger.LogInformation($"Customer updated: {customer.Id} - {customer.FirstName} {customer.LastName}");
            }
            catch (DbUpdateConcurrencyException)
            {
                var exists = await _repository.GetByIdAsync(id);
                if (exists == null)
                {
                    _logger.LogWarning($"Update failed: Customer not found (id: {id})");
                    return NotFound();
                }
                else
                    throw;
            }
            return NoContent();
        }

        // DELETE: api/Customer/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteCustomer(int id)
        {
            var customer = await _repository.GetByIdAsync(id);
            if (customer == null)
            {
                _logger.LogWarning($"Delete failed: Customer not found (id: {id})");
                return NotFound();
            }
            await _repository.DeleteAsync(id);
            _logger.LogInformation($"Customer deleted: {customer.Id} - {customer.FirstName} {customer.LastName}");
            return NoContent();
        }

        // GET: api/Customer/filter?name=John&region=Europe
        [HttpGet("filter")]
        public async Task<ActionResult<IEnumerable<Customer>>> FilterCustomers(string? name, string? email, string? region, DateTime? registrationDate)
        {
            var result = await _repository.FilterAsync(name, email, region, registrationDate);
            _logger.LogInformation($"Filtering completed. Result count: {result.Count()}");
            return Ok(result);
        }
    }
} 