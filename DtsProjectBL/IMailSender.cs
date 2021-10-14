

namespace DtsProjectBL
{
    public interface IMailSender
    {
        void SendMail(string mailTo, string body, string subject);
    }
}
