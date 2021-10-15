using DtsProjectDec;
using DtsProjectDL;
using Microsoft.Extensions.Configuration;
using System;
using System.Dynamic;


namespace DtsProjectBL
{
    public class LoginBL : ILoginBL
    {
        private readonly ILoginDL _loginDL;
        private readonly IConfiguration _configuration;
        private readonly IMailSender _mailSender;

        public LoginBL(ILoginDL loginDL, IConfiguration configuration, IMailSender mailSender)
        {
            _loginDL = loginDL;
            _configuration = configuration;
            _mailSender = mailSender;
        }

        public bool AccountVerification(string key)
        {
            return _loginDL.AccountVerification(key);
        }

        public bool CreateAccount(UserLogin userLogin)
        {
            Guid guid = Guid.NewGuid();
            string key = guid.ToString().Substring(0, guid.ToString().IndexOf('-'));
            userLogin.key = key;
            bool isCreate = _loginDL.CreateAccount(userLogin);
            if(isCreate)
            {
                dynamic mailDetails = this.DetailsMailLogin(key);
                _mailSender.SendMail(userLogin.userName, mailDetails.body, mailDetails.subject);
                return true;
            }
            return false;
        }

        public bool? LoginApp(UserLogin userLogin)
        {
            return _loginDL.LoginApp(userLogin);
        }

        public bool ForgetPassword(string email)
        {
            Random random = new Random();
            string key = string.Empty;
            for (int i = 0; i < 6; i++)
            {
                key += random.Next(i == 0 ? 1 : 0, 9);
            }
            dynamic mailMassege = MassegeResetPassword(key);
            _mailSender.SendMail(email, mailMassege.body, mailMassege.subject);
            return _loginDL.ForgetPassword(email, key);
        }

        public bool? VerificationPasswordReset(string verificationCode, string email)
        {
            return _loginDL.VerificationPasswordReset(verificationCode, email);
        }

        public bool SaveNewPassword(string email, string newPassword)
        {
            return _loginDL.SaveNewPassword(email, newPassword);
        }

        private dynamic DetailsMailLogin(string key)
        {
            //StringBuilder msg = new StringBuilder();
            //msg.Append("<!DOCTYPE html>");
            //msg.Append("<html>");
            //msg.Append("<head>");
            //msg.Append("<meta http-equiv=Content-Type content=\"text/html;\" />");
            //msg.Append("<meta http-equiv=\"X-UA-Compatible\" content=\"IE=edge\">");
            //msg.Append("<meta charset=\"utf-8\" />");
            //msg.Append("<style>");
            //msg.Append(@".form { background: rgba(255, 255, 255, 0.85);border-radius: 20px; margin: 0 auto; padding: 20px; height: auto; width: 380px; direction: rtl; text-align: center; overflow: hidden;} .form span{ display: none;}");
            //msg.Append("</style>");
            //msg.Append("</head>");
            //msg.Append("<body>");
            //msg.Append("<div class=\"form\">");

            string body = "<div dir='rtl'>" +
                            $"<a target='_blank' href={_configuration["BaseUrl"]}/api/Login/AccountVerification/{key} >לחץ כאן לאימות החשבון</a>" +
                          "</div>";
            string subject = "DtsProject - אימות חשבון"; 
            dynamic obj = new ExpandoObject();
            obj.body = body;
            obj.subject = subject;
            return obj;
        }

        private dynamic MassegeResetPassword(string key)
        {
            string body = $"<div dir='rtl'>" +
                            $"<div>" +
                                $"<div>קוד האימות לאיפוס הסיסמה הוא: {key}</div>" +
                                $"<div>הסיסמה תקפה לחמש דקות בלבד!</div>" +
                            $"</div>" +
                          $"</div>";
            string subject = "DtsProject - איפוס סיסמה";
            dynamic obj = new ExpandoObject();
            obj.body = body;
            obj.subject = subject;
            return obj;
        }
    }
}
