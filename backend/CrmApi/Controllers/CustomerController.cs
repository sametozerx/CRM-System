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

        // GET: api/Customer - User and Admin can access
        [HttpGet]
        [Authorize(Roles = "User,Admin")]
        public async Task<ActionResult<IEnumerable<Customer>>> GetCustomers()
        {
            var customers = await _repository.GetAllAsync();
            return Ok(customers);
        }

        // GET: api/Customer/5 - User and Admin can access
        [HttpGet("{id}")]
        [Authorize(Roles = "User,Admin")]
        public async Task<ActionResult<Customer>> GetCustomer(int id)
        {
            var customer = await _repository.GetByIdAsync(id);
            if (customer == null)
                return NotFound();
            return Ok(customer);
        }

        // POST: api/Customer - Only Admin can access
        [HttpPost]
        [Authorize(Roles = "Admin")]
        public async Task<ActionResult<Customer>> CreateCustomer([FromBody] Customer customer)
        {
            // Convert DateTime to UTC
            if (customer.RegistrationDate.Kind != DateTimeKind.Utc)
            {
                customer.RegistrationDate = DateTime.SpecifyKind(customer.RegistrationDate, DateTimeKind.Utc);
            }
            
            _logger.LogInformation($"Adding new customer: {customer.FirstName} {customer.LastName}");
            await _repository.AddAsync(customer);
            return CreatedAtAction(nameof(GetCustomer), new { id = customer.Id }, customer);
        }

        // PUT: api/Customer/5 - Only Admin can access
        [HttpPut("{id}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> UpdateCustomer(int id, [FromBody] Customer customer)
        {
            if (id != customer.Id)
            {
                _logger.LogWarning($"Update failed: ID mismatch (id: {id}, customer.Id: {customer.Id})");
                return BadRequest();
            }
            
            // Convert DateTime to UTC
            if (customer.RegistrationDate.Kind != DateTimeKind.Utc)
            {
                customer.RegistrationDate = DateTime.SpecifyKind(customer.RegistrationDate, DateTimeKind.Utc);
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

        // DELETE: api/Customer/5 - Only Admin can access
        [HttpDelete("{id}")]
        [Authorize(Roles = "Admin")]
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

        // GET: api/Customer/filter?name=John&region=Europe - User and Admin can access
        [HttpGet("filter")]
        [Authorize(Roles = "User,Admin")]
        public async Task<ActionResult<IEnumerable<Customer>>> FilterCustomers(string? name, string? email, string? region, DateTime? registrationDate)
        {
            // Convert DateTime to UTC
            if (registrationDate.HasValue && registrationDate.Value.Kind != DateTimeKind.Utc)
            {
                registrationDate = DateTime.SpecifyKind(registrationDate.Value, DateTimeKind.Utc);
            }
            
            var result = await _repository.FilterAsync(name, email, region, registrationDate);
            _logger.LogInformation($"Filtering completed. Result count: {result.Count()}");
            return Ok(result);
        }
    }
} 