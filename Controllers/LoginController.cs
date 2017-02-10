using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;

namespace CarIntaker.Controllers
{
    [Route("api/[controller]")]
    public class LoginController : Controller
    {

        [HttpPost]
        public LoginResult Login(LoginParams param)
        {
            // Call the login service to do authentication
            return new LoginResult {
                Token = "90562"
            };
        }

        public class LoginParams {
            public string Username {get;set;}
            public string Password {get;set;}
        }

        public class LoginResult {
            public string Token {get;set;}
        }
    }
}
