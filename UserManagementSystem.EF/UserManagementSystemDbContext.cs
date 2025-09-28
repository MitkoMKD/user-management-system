using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using System;
using UserManagementSystem.Models;

namespace UserManagementSystem.EF
{
    public class UserManagementSystemDbContext : DbContext
    {
        public DbSet<User> Users { get; set; }

        public UserManagementSystemDbContext(DbContextOptions<UserManagementSystemDbContext> options) : base(options)
        {
            
        }

        protected override void OnModelCreating(ModelBuilder builder)
        {
            base.OnModelCreating(builder);
        }

    }
}
