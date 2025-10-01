using Microsoft.EntityFrameworkCore;
using System.Linq.Expressions;
using UserManagementSystem.EF;
using UserManagementSystem.Models;
using UserManagementSystem.Repository.Interfaces;

namespace UserManagementSystem.Repository
{
    public class Repository : IRepository<User>
    {
        private readonly UserManagementSystemDbContext _context;
        public Repository(UserManagementSystemDbContext context)
        {
            _context = context;
        }

        public void Add(User addUser)
        {
            _context.Add(addUser).State = EntityState.Added;
        }

        public IEnumerable<User> GetAll()
        {
            return _context.Users.AsNoTracking().ToList();
        }

        public async Task<List<User>> GetAllAsync(string search = "")
        {
            if (string.IsNullOrWhiteSpace(search))
            {
                return await _context.Users.AsNoTracking().ToListAsync();
            }
            return await _context.Users
                .Where(x => x.Username.Contains(search) || x.Email.Contains(search))
                .AsNoTracking()
                .ToListAsync();
        }

        public User GetById(int id)
        {
            return _context.Users.AsNoTracking().FirstOrDefault(u => u.Id == id);
        }

        public async Task<User> GetByIdAsync(int id)
        {
            return await _context.Users.AsNoTracking().FirstOrDefaultAsync(u => u.Id == id);
        }

        public bool Remove(int id)
        {
            var user = _context.Users.Find(id);
            if (user == null)
                return false;
            _context.Users.Remove(user);
            return true;
        }

        public int Save()
        {
            return _context.SaveChanges();
        }

        public async Task<int> SaveAsync()
        {
            return await _context.SaveChangesAsync();
        }

        public User Select(Expression<Func<User, bool>> predicate)
        {
            return _context.Users.AsNoTracking().FirstOrDefault(predicate);
        }

        public async Task<User> SelectAsync(Expression<Func<User, bool>> predicate)
        {
            return await _context.Users.AsNoTracking().FirstOrDefaultAsync(predicate);
        }

        public void Update(User updateUser)
        {
            _context.Entry(updateUser).State = EntityState.Modified;
        }
    }
}
