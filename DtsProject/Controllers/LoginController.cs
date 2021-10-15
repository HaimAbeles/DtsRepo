
using DtsProjectBL;
using DtsProjectDec;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using System;

namespace DtsProject.Controllers
{
    [ApiController]
    public class LoginController : Controller
    {
        private readonly ILogger<LoginController> _logger;
        private readonly ILoginBL _loginBL;

        public LoginController(ILogger<LoginController> logger, ILoginBL loginBL)
        {
            _logger = logger;
            _loginBL = loginBL;
        }

        [HttpGet]
        [ActionName("AccountVerification")]
        [Route("api/[controller]/[action]/{key?}")]
        public IActionResult AccountVerification([FromRoute] string key) 
        {
            try
            {
                _logger.LogInformation($"try AccountVerification, key: {key}");
                bool userVerification = _loginBL.AccountVerification(key);
                return userVerification ? Redirect("http://localhost:4321/QueueBarbershop") : BadRequest(); ;
            }
            catch(Exception ex)
            {
                _logger.LogError($"ex in AccountVerification, Message: {ex.Message}, StackTrace: {ex.StackTrace}");
                return StatusCode(500, $"שגיאה באימות פרטי משתמש");
            }
        }

        [HttpPost]
        [ActionName("CreateAccount")]
        [Route("api/[controller]/[action]")]
        public IActionResult CreateAccount([FromBody] UserLogin userLogin)
        {
            try
            {
                _logger.LogInformation($"try create account, username: {userLogin.userName}, password: {userLogin.password}");
                userLogin.logiValidation = false;
                bool isCreate = _loginBL.CreateAccount(userLogin);
                return isCreate ? Ok("משתמש נוצר בהצלחה") : BadRequest("משתמש קיים במערכת");
            }
            catch(Exception ex)
            {
                _logger.LogError($"ex in CreateAccount, Message: {ex.Message}, StackTrace: {ex.StackTrace}");
                return StatusCode(500, $"שגיאה ביצירת משתמש");
            }
        }

        [HttpPost]
        [ActionName("LoginApp")]
        [Route("api/[controller]/[action]")]
        public IActionResult LoginApp([FromBody] UserLogin userLogin)
        {
            try
            {
                _logger.LogInformation($"try to continue to app, user name: {userLogin.userName}, password: {userLogin.password}");
                bool? isValidate = _loginBL.LoginApp(userLogin);
                return isValidate == true ? Ok() : isValidate == null ? BadRequest("אחד מפרטי הזיהוי שהוקש שגוי") : StatusCode(403, "נא לבצע אימות חשבון לפני כניסה למערכת");
            }
            catch(Exception ex)
            {
                _logger.LogError($"ex in CreateAccount, Message: {ex.Message}, StackTrace: {ex.StackTrace}");
                return StatusCode(500, $"שגיאה בזיהוי פרטי המשתמש");
            }
        }

        [HttpGet]
        [ActionName("ForgetPassword")]
        [Route("api/[controller]/[action]/{email?}")]
        public IActionResult ForgetPassword([FromQuery] string email)
        {
            try
            {
                _logger.LogInformation($"try to send mail to reset password for user: {email}");
                bool isEmailActive = _loginBL.ForgetPassword(email);
                _logger.LogInformation($"email try to reset password {email} is active? {isEmailActive}");
                return Ok(isEmailActive);
            }
            catch(Exception ex)
            {
                _logger.LogError($"ex in ResetPassword, Message: {ex.Message}, StackTrace: {ex.StackTrace}");
                return StatusCode(500, $"שגיאה בבקשה לאיפוס סיסמה");
            }
        }

        [HttpGet]
        [ActionName("VerificationPasswordReset")]
        [Route("api/[controller]/[action]/{email?}/{verificationCode?}")]
        public IActionResult VerificationPasswordReset([FromRoute] string email, [FromQuery] string verificationCode)
        {
            try
            {
                _logger.LogInformation($"try Verification code reset password for user: {email}, code: {verificationCode}");
                bool? resultAuth = _loginBL.VerificationPasswordReset(verificationCode, email);
                _logger.LogInformation($"status to verificationCode is: {resultAuth}");
                return resultAuth == true ? Ok(true) : resultAuth == false ? Ok(false) : StatusCode(403, "קוד אימות שגוי");
            }
            catch(Exception ex)
            {
                _logger.LogError($"ex in VerificationPasswordReset, Message: {ex.Message}, StackTrace: {ex.StackTrace}");
                return StatusCode(500, $"שגיאה בבדיקת קוד אימות עבור איפוס סיסמה");
            }
        }

        [HttpGet]
        [ActionName("SaveNewPassword")]
        [Route("api/[controller]/[action]/{email?}/{newPassword?}")]
        public IActionResult SaveNewPassword([FromRoute] string email, [FromQuery] string newPassword)
        {
            try
            {
                _logger.LogInformation($"try save new password for user: {email}, password: {newPassword}");
                bool isSaved = _loginBL.SaveNewPassword(email, newPassword);
                return isSaved ? Ok() : StatusCode(500, "שגיאה בשמירת סיסמה חדשה");

            }
            catch (Exception ex)
            {
                _logger.LogError($"ex in SaveNewPassword, Message: {ex.Message}, StackTrace: {ex.StackTrace}");
                return StatusCode(500, $"שגיאה בשמירת סיסמה חדשה עבור המשתמש");
            }
        }
    }
}
