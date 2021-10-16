using DtsProjectBL;
using DtsProjectDec;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace DtsProject.Controllers
{
    [ApiController]
    public class BarbershopController : Controller
    {
        private readonly ILogger<BarbershopController> _logger;
        private readonly IBarberShopBL _barberShopBL;

        public BarbershopController(ILogger<BarbershopController> logger, IBarberShopBL barberShopBL)
        {
            _logger = logger;
            _barberShopBL = barberShopBL;
        }

        [HttpPost]
        [ActionName("InsertQueue")]
        [Route("api/[controller]/[action]")]
        public IActionResult InsertQueue(CustomerQueue queue)
        {
            try
            {
                _logger.LogInformation($"try to insert queue: {queue}");
                bool status = _barberShopBL.InsertQueue(queue);
                return Ok(status);
            }
            catch(Exception ex)
            {
                _logger.LogError($"ex in GetQueueList, Message: {ex.Message}, StackTrace: {ex.StackTrace}");
                return StatusCode(500, $"שגיאה בשמירת התור");
            }
        }

        [HttpDelete]
        [ActionName("DeleteQueue")]
        [Route("api/[controller]/[action]/{id?}")]
        public IActionResult DeleteQueue([FromRoute] string id)
        {
            try
            {
                _logger.LogInformation($" try to delete queue, id: {id}");
                bool status = _barberShopBL.DeleteQueue(id);
                return Ok(status);
            }
            catch(Exception ex)
            {
                _logger.LogError($"ex in GetQueueList, Message: {ex.Message}, StackTrace: {ex.StackTrace}");
                return StatusCode(500, $"שגיאה במחיקת התור");
            }
        }

        [HttpGet]
        [ActionName("GetQueueList")]
        [Route("api/[controller]/[action]")]
        public IActionResult GetQueueList()
        {
            try
            {
                _logger.LogInformation($"try to get customers data queue");
                List<CustomerQueue> customersList = _barberShopBL.GetQueueList();
                return Ok(customersList);
            }
            catch(Exception ex)
            {
                _logger.LogError($"ex in GetQueueList, Message: {ex.Message}, StackTrace: {ex.StackTrace}");
                return StatusCode(500, $"שגיאה בשליפת רשימת הממתינים");
            }
        }
    }
}
