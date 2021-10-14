using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;
using System;

namespace DtsProjectDec
{
    public class UserLogin
    {
        [BsonId]
        [BsonRepresentation(BsonType.ObjectId)]
        [BsonIgnoreIfDefault]
        public ObjectId? Id { get; set; }
        public string userName { get; set; }
        public string password { get; set; }
        public bool? logiValidation { get; set; }
        public string? key { get; set; }
        public DateTime? timeResetPassword { get; set; }
    }
}
