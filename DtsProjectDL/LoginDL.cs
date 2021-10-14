using DtsProjectDec;
using DtsProjectDL.RepositoryMongoDB;
using Microsoft.Extensions.Logging;
using MongoDB.Driver;
using System;

namespace DtsProjectDL
{
    public class LoginDL : ILoginDL
    {
        private readonly ILogger<LoginDL> _logger;
        private readonly IRepositorySingleTon _repositorySingleTon;

        public LoginDL(ILogger<LoginDL> logger, IRepositorySingleTon repositorySingleTon)
        {
            _logger = logger;
            _repositorySingleTon = repositorySingleTon;
        }

        public bool AccountVerification(string key)
        {
            IMongoCollection<UserLogin> collection = _repositorySingleTon.GetInstance().ConnectionMongoDBUserLogin;
            var builder = Builders<UserLogin>.Filter;
            var filt = builder.Eq("key", key) & builder.Eq("logiValidation", false);
            UserLogin item = collection.Find(filt).FirstOrDefault();
            _logger.LogInformation($"find item to AccountVerification: {item}");
            //if (itams.CountDocuments() != 1) return false;
            item.logiValidation = true;
            item.key = null;
            collection.ReplaceOne(filt, item, new ReplaceOptions { IsUpsert = true });
            return true;
        }

        public bool CreateAccount(UserLogin userLogin)
        {
            IMongoCollection<UserLogin> collection = _repositorySingleTon.GetInstance().ConnectionMongoDBUserLogin;
            var builder = Builders<UserLogin>.Filter;
            var filt = builder.Eq("userName", userLogin.userName);
            var item = collection.Find(filt);
            if (item.CountDocuments() == 0)
            {
                collection.InsertOne(userLogin);
                return true;
            }
            return false;
        }

        public bool? LoginApp(UserLogin userLogin)
        {
            IMongoCollection<UserLogin> collection = _repositorySingleTon.GetInstance().ConnectionMongoDBUserLogin;
            var builder = Builders<UserLogin>.Filter;
            var filt = builder.Eq("userName", userLogin.userName) & builder.Eq("password", userLogin.password);
            var item = collection.Find(filt);
            if (item.CountDocuments() == 0)
            {
                _logger.LogError($"user not found to login app: {userLogin.userName}");
                return null;
            }
            UserLogin user = item.FirstOrDefault();
            _logger.LogInformation($"find item to AccountVerification: {user}");
            return user.logiValidation == true;
        }

        public bool ForgetPassword(string email, string key)
        {
            IMongoCollection<UserLogin> collection = _repositorySingleTon.GetInstance().ConnectionMongoDBUserLogin;
            var builder = Builders<UserLogin>.Filter;
            var filt = builder.Eq("userName", email);
            var item = collection.Find(filt);
            if (item.CountDocuments() == 0)
            {
                _logger.LogError($"user not found to reset password: {email}");
                return false;
            }
            else
            {
                UserLogin user = item.FirstOrDefault<UserLogin>();
                _logger.LogInformation($"find user to ResetPassword: {user}");
                user.key = key;
                user.timeResetPassword = DateTime.Now.AddHours(3);
                collection.ReplaceOne(filt, user, new ReplaceOptions { IsUpsert = true });
                return true;
            }
        }

        public bool? VerificationPasswordReset(string verificationCode, string email)
        {
            IMongoCollection<UserLogin> collection = _repositorySingleTon.GetInstance().ConnectionMongoDBUserLogin;
            var builder = Builders<UserLogin>.Filter;
            var filt = builder.Eq("userName", email) & builder.Eq("key", verificationCode);
            var item = collection.Find(filt);
            if (item.CountDocuments() == 0)
            {
                _logger.LogInformation($"verification code is dont correct");
                return null;
            }
            else
            {
                UserLogin user = item.FirstOrDefault();
                bool timeOver = DateTime.Now.Subtract(((DateTime)user.timeResetPassword)).TotalMinutes > 5;
                _logger.LogInformation($"verificationCode is active: {timeOver}");
                if (timeOver)
                    return false;
                user.key = null;
                collection.ReplaceOne(filt, user, new ReplaceOptions { IsUpsert = true });
                return true;
            }
        }

        public bool SaveNewPassword(string email, string newPassword)
        {
            IMongoCollection<UserLogin> collection = _repositorySingleTon.GetInstance().ConnectionMongoDBUserLogin;
            var builder = Builders<UserLogin>.Filter;
            var filt = builder.Eq("userName", email);
            UserLogin user = collection.Find(filt).FirstOrDefault<UserLogin>();
            user.password = newPassword;
            collection.ReplaceOne(filt, user, new ReplaceOptions { IsUpsert = true });
            return true;
        }
    }
}
