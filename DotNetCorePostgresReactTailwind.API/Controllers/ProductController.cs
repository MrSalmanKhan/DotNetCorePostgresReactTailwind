using Azure.AI.OpenAI;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using OpenAI.Chat;

namespace DotNetCoreAppPostgres.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class ProductsController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        private readonly ChatClient _chatClient;

        public ProductsController(ApplicationDbContext context, ChatClient chatClient)
        {
            _context = context;
            _chatClient = chatClient;
        }

        // GET: api/Products?search=abc&page=1&pageSize=50
        [HttpGet]
        public async Task<ActionResult<object>> GetProducts(string? search, int page = 1, int pageSize = 50)
        {
            var query = _context.Products.AsQueryable();

            if (!string.IsNullOrEmpty(search))
            {
                if (int.TryParse(search, out int result))
                {
                    query = query.Where(p => p.Id == result);
                }
                else
                {
                    query = query.Where(p => p.Name.ToLower().Contains(search.ToLower()) ||
                                             (p.Description != null && p.Description.ToLower().Contains(search.ToLower())));
                }
            }

            var totalCount = await query.CountAsync();
            var products = await query
                .OrderByDescending(p => p.Id)
                .Skip((page - 1) * pageSize)
                .Take(pageSize)
                .ToListAsync();

            return Ok(new
            {
                Data = products,
                Page = page,
                TotalPages = (int)Math.Ceiling(totalCount / (double)pageSize),
                TotalCount = totalCount
            });
        }

        // GET: api/Products/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Product>> GetProduct(int id)
        {
            var product = await _context.Products.FirstOrDefaultAsync(m => m.Id == id);
            if (product == null) return NotFound();

            return Ok(product);
        }

        // POST: api/Products
        [HttpPost]
        public async Task<ActionResult<Product>> CreateProduct([FromBody] Product product)
        {
            _context.Add(product);
            await _context.SaveChangesAsync();
            return CreatedAtAction(nameof(GetProduct), new { id = product.Id }, product);
        }

        // PUT: api/Products/5
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateProduct(int id, [FromBody] Product product)
        {
            if (id != product.Id) return BadRequest();

            _context.Entry(product).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!ProductExists(product.Id)) return NotFound();
                else throw;
            }

            return NoContent();
        }

        // DELETE: api/Products/5
        [HttpDelete("{id}")]
        //[Authorize(Roles = "Admin")]
        public async Task<IActionResult> DeleteProduct(int id)
        {
            var product = await _context.Products.FindAsync(id);
            if (product == null) return NotFound();

            _context.Products.Remove(product);
            await _context.SaveChangesAsync();
            return NoContent();
        }

        // POST: api/Products/5/generate-description
        [HttpPost("{productName}/generate-description")]
        public async Task<IActionResult> GenerateDescription(string productName)
        {
            var response = await _chatClient.CompleteChatAsync(new[]
            {
                new UserChatMessage($"Write a catchy one-paragraph marketing description for a product named {productName}.")
            });

            return Ok(new { Message = "AI description generated!", aiDescription = response.Value.Content[0].Text });
        }

        private bool ProductExists(int id)
        {
            return _context.Products.Any(e => e.Id == id);
        }
    }
}
