using DtsProjectDec;


namespace DtsProjectDL
{
    public interface ILoginDL
    {
        bool AccountVerification(string key);
        bool CreateAccount(UserLogin userLogin);
        bool? LoginApp(UserLogin userLogin);
        bool ForgetPassword(string email, string key);
        bool? VerificationPasswordReset(string verificationCode, string email);
        bool SaveNewPassword(string email, string newPassword);
    }
}
