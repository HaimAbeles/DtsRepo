using Microsoft.Extensions.Configuration;

namespace DtsProjectDL.RepositoryMongoDB
{
    public class RepositorySingleTon : IRepositorySingleTon
    {
        public static RepositoryMongoDB _instance = new RepositoryMongoDB();

        public RepositoryMongoDB GetInstance() => _instance;

        public RepositorySingleTon(IConfiguration _configuration)
        {
            _instance.ConnectToMongoDBUserLogin(_configuration);
            _instance.ConnectToMongoDBCustomerQueue(_configuration);
        }
    }
}
