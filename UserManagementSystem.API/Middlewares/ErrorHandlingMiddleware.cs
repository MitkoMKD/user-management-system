using System.Net;
using System.Text.Json;

namespace UserManagementSystem.API.Middlewares
{
    public class ErrorHandlingMiddleware
    {
        private readonly RequestDelegate _next;
        private readonly ILogger<ErrorHandlingMiddleware> _logger;

        public ErrorHandlingMiddleware(RequestDelegate next, ILogger<ErrorHandlingMiddleware> logger)
        {
            _next = next;
            _logger = logger;
        }

        public async Task InvokeAsync(HttpContext context)
        {
            try
            {
                await _next(context); // continue pipeline
            }
            catch (Exception ex)
            {
                await HandleExceptionAsync(context, ex);
            }
        }

        private async Task HandleExceptionAsync(HttpContext context, Exception exception)
        {
            // Log structured error
            _logger.LogError(exception, "Unhandled exception occurred while processing request {Path}", context.Request.Path);

            var response = context.Response;
            response.ContentType = "application/json";

            // Default = 500
            response.StatusCode = (int)HttpStatusCode.InternalServerError;

            var errorResponse = new
            {
                success = false,
                error = new
                {
                    message = exception.Message,
                    detail = exception.InnerException?.Message,
                    path = context.Request.Path,
                    statusCode = response.StatusCode
                }
            };

            var options = new JsonSerializerOptions { PropertyNamingPolicy = JsonNamingPolicy.CamelCase };

            await response.WriteAsync(JsonSerializer.Serialize(errorResponse, options));
        }
    }
}
