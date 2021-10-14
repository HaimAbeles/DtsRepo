using DtsProjectDec;

namespace DtsProjectBL
{
    public interface ILoginBL
    {
        bool AccountVerification(string key);
        bool CreateAccount(UserLogin userLogin);
        bool? LoginApp(UserLogin userLogin);
        bool ForgetPassword(string email);
        bool? VerificationPasswordReset(string verificationCode, string email);
        bool SaveNewPassword(string email, string newPassword);
    }
}
