using Microsoft.EntityFrameworkCore;
using CrmApi.Models;

namespace CrmApi.Data
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

        public DbSet<User> Users { get; set; }
        public DbSet<Customer> Customers { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // User entity configuration
            modelBuilder.Entity<User>(entity =>
            {
                entity.Property(e => e.Username)
                    .HasMaxLength(32)
                    .IsRequired();
                
                entity.Property(e => e.Password)
                    .HasMaxLength(32)
                    .IsRequired();
                
                entity.Property(e => e.Role)
                    .HasConversion<string>()
                    .HasMaxLength(10)
                    .IsRequired();
            });

            // Customer entity configuration
            modelBuilder.Entity<Customer>(entity =>
            {
                entity.Property(e => e.FirstName)
                    .HasMaxLength(50)
                    .IsRequired();
                
                entity.Property(e => e.LastName)
                    .HasMaxLength(50)
                    .IsRequired();
                
                entity.Property(e => e.Email)
                    .HasMaxLength(100)
                    .IsRequired();
                
                entity.Property(e => e.Region)
                    .HasMaxLength(100)
                    .IsRequired();
            });
        }
    }
} 