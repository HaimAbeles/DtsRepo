using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using System.Net.Mail;
using System.Text;

namespace DtsProjectBL
{
    public class MailSender : IMailSender
    {
        private readonly ILogger<MailSender> _logger;
        private readonly IConfiguration _configuration;

        public MailSender(ILogger<MailSender> logger, IConfiguration configuration)
        {
            _logger = logger;
            _configuration = configuration;
        }

        public void SendMail(string mailTo, string body, string subject)
        {
            _logger.LogInformation($"try to send mail to: {mailTo}, subject: {subject}");
            MailMessage mail = new MailMessage();
            mail.To.Add(mailTo);
            mail.From = new MailAddress(_configuration.GetSection("MailSettings")["Name"]);
            mail.BodyEncoding = Encoding.UTF8;
            mail.Subject = subject;
            mail.Body = body;
            mail.IsBodyHtml = true;
            SmtpClient smtp = new SmtpClient();
            smtp.Host = "smtp.gmail.com";
            smtp.Credentials = new System.Net.NetworkCredential(_configuration.GetSection("MailSettings")["Name"], _configuration.GetSection("MailSettings")["Password"]);
            smtp.EnableSsl = true;
            smtp.Send(mail);
            _logger.LogInformation($"sucsses send mail to: {mailTo}, subject: {subject}");
        }
    }
}
