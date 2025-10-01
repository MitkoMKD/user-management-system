using FluentValidation;
using UserManagementSystem.Models;

namespace UserManagementSystem.API.Validators
{
    public class RegisterUserValidator : AbstractValidator<RegisterDto>
    {
        public RegisterUserValidator()
        {
            RuleFor(x => x.Username)
                .NotEmpty().WithMessage("Username is required")
                .MaximumLength(50);

            RuleFor(x => x.PasswordHash)
                .NotEmpty().WithMessage("Password is required")
                .MinimumLength(6);

            RuleFor(x => x.FullName)
                .NotEmpty().WithMessage("Full name is required");

            RuleFor(x => x.Role)
                .NotEmpty().WithMessage("Role is required");

            RuleFor(x => x.IsActive)
                .NotNull().WithMessage("Active flag must be specified");
        }
    }
}
