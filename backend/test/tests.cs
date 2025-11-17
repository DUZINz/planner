using Microsoft.AspNetCore.Mvc;

namespace Backend.Test.Tests
{
    // ====================================================================
    // DICA 1: USE ARGUMENTNULLEXCEPTION PARA VALIDAR PARÂMETROS
    // ====================================================================
    
    public class Dica1_ArgumentNullException
    {
        //  FORMA COMUM (mas não ideal)
        public class Antes
        {
            public void ProcessUser(IUserService service)
            {
                if (service == null)
                    throw new Exception("Service não pode ser nulo");
            }
        }

        //  FORMA CORRETA
        public class Depois
        {
            public void ProcessUser(IUserService service)
            {
                ArgumentNullException.ThrowIfNull(service);
            }
        }

    }


    // ====================================================================
    // DICA 2: USE NAMEOF() PARA EVITAR MAGIC STRINGS
    // ====================================================================

    public class Dica2_NameOf
    {
        // ❌ FORMA COMUM (magic strings)
        public class Antes
        {
            public ActionResult GetUser(int id)
            {
                if (id <= 0)
                    throw new ArgumentException("id"); // ❌ magic string
                
                var user = GetUserData(id);
                return RedirectToAction("GetUser"); // ❌ magic string
            }

            private ActionResult RedirectToAction(string v)
            {
                throw new NotImplementedException();
            }

            private object GetUserData(int id)
            {
                return null;
            }
        }

        // ✅ FORMA CORRETA
        public class Depois
        {
            public ActionResult GetUser(int id)
            {
                if (id <= 0)
                    throw new ArgumentException(nameof(id)); // ✅ nameof
                
                var user = GetUserData(id);
                return RedirectToAction(nameof(GetUser)); // ✅ nameof
            }

            private ActionResult RedirectToAction(string v)
            {
                throw new NotImplementedException();
            }

            private object GetUserData(int id)
            {
                return null;
            }
        }

    }


    // ====================================================================
    // DICA 3: USE FIRSTORDEFAULT EM VEZ DE FIRST
    // ====================================================================

    public class Dica3_FirstOrDefault
    {
        // ❌ FORMA COMUM (com try-catch)
        public class Antes
        {
            public ActionResult FindUser(int id)
            {
                try
                {
                    var users = new List<User>
                    {
                        new User { Id = 1, Name = "João" },
                        new User { Id = 2, Name = "Maria" }
                    };

                    // ❌ First() lança exceção se não encontrar
                    var user = users.First(u => u.Id == id);
                    return Ok(user);
                }
                catch (InvalidOperationException)
                {
                    return NotFound("Usuário não encontrado");
                }
            }

            private ActionResult NotFound(string v)
            {
                throw new NotImplementedException();
            }

            private ActionResult Ok(User user)
            {
                throw new NotImplementedException();
            }
        }

        // ✅ FORMA CORRETA
        public class Depois
        {
            public ActionResult FindUser(int id)
            {
                var users = new List<User>
                {
                    new User { Id = 1, Name = "João" },
                    new User { Id = 2, Name = "Maria" }
                };

                // ✅ FirstOrDefault() retorna null se não encontrar
                var user = users.FirstOrDefault(u => u.Id == id);
                
                if (user == null)
                    return NotFound("Usuário não encontrado");
                
                return Ok(user);
            }

            private ActionResult Ok(User user)
            {
                throw new NotImplementedException();
            }

            private ActionResult NotFound(string v)
            {
                throw new NotImplementedException();
            }
        }

    }


    // ====================================================================
    // DICA 4: USE READONLY PARA CAMPOS QUE NÃO MUDAM
    // ====================================================================

    public class Dica4_Readonly
    {
        // ❌ FORMA COMUM (sem readonly)
        public class Antes
        {
            private IUserService _service; // ❌ pode ser modificado

            public Antes(IUserService service)
            {
                _service = service;
            }

            public void Update()
            {
                _service = new UserService(); // ❌ reatribuição acidental!
            }
        }

        // ✅ FORMA CORRETA
        public class Depois
        {
            private readonly IUserService _service; // ✅ imutável

            public Depois(IUserService service)
            {
                ArgumentNullException.ThrowIfNull(service);
                _service = service;
            }

            public void Update()
            {
                // _service = new UserService(); ❌ ERRO DE COMPILAÇÃO
                _service.UpdateData(); // ✅ apenas usar, não reatribuir
            }
        }

    }


    // ====================================================================
    // EXEMPLO COMPLETO - TODAS AS 4 DICAS JUNTAS
    // ====================================================================

    public class UserController : ControllerBase
    {
        // DICA 4: readonly
        private readonly IUserService _service;

        // DICA 1: ArgumentNullException
        public UserController(IUserService service)
        {
            ArgumentNullException.ThrowIfNull(service);
            _service = service;
        }

        // DICA 2: nameof
        [HttpGet("{id}")]
        public ActionResult GetUser(int id)
        {
            // DICA 1: ArgumentNullException
            if (id <= 0)
                throw new ArgumentException(nameof(id));

            // DICA 3: FirstOrDefault
            var user = _service.GetUser(id);
            if (user == null)
                return NotFound($"Usuário {id} não encontrado");

            // DICA 2: nameof
            return RedirectToAction(nameof(GetUser));
        }
    }

    public interface IUserService
    {
        User GetUser(int id);
        void UpdateData();
    }

    public class UserService : IUserService
    {
        public User GetUser(int id)
        {
            return null;
        }

        public void UpdateData()
        {
            throw new NotImplementedException();
        }
    }

    public class User
    {
        public int Id { get; set; }
        public required string Name { get; set; }
    }
}