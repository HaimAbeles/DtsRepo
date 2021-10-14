using DtsProjectDec;
using Microsoft.Extensions.Configuration;
using MongoDB.Driver;

namespace DtsProjectDL.RepositoryMongoDB
{
    public interface IRepositoryMongoDB
    {
        IMongoCollection<UserLogin> ConnectToMongoDBUserLogin(IConfiguration _configuration);
    }
}
