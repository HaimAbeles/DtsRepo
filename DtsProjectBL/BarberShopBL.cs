using DtsProjectDec;
using DtsProjectDL;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DtsProjectBL
{
    public class BarberShopBL : IBarberShopBL
    {
        private readonly IBarbershopDL _barbershopDL;

        public BarberShopBL(IBarbershopDL barbershopDL)
        {
            _barbershopDL = barbershopDL;
        }

        public List<CustomerQueue> GetQueueList()
        {
            return _barbershopDL.GetQueueList();
        }

        public bool InsertQueue(CustomerQueue queue)
        {
            return _barbershopDL.InsertQueue(queue);
        }

        public bool DeleteQueue(string id)
        {
            return _barbershopDL.DeleteQueue(id);
        }
    }
}
