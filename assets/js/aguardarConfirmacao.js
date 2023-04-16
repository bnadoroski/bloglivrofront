let email = null;
let params = null;

(function () {
    Inicio();
  })();

function Inicio() {
    params = new URLSearchParams(window.location.search);

    if(!params.get('guid')) {
        email = localStorage.getItem("confirmarEmail");
        $("#emailConfirmacao").text(email);
    } else {
        ConfirmarEmail(params.get('guid'));
    }
}

function reenviarEmail() {
    $.ajax({
        type: 'post',
        url: `${linkAPI}/api/usuario/reenviaremail/${email}`,
        data: email,
        success: function () {
            $("#emailReenviado").show();
        }
    });
}

function ConfirmarEmail(guid) {
    $.ajax({
        type: 'post',
        url: `${linkAPI}/api/usuario/confirmaremail/${guid}`,
        data: guid,
        success: function (retorno) {
            if(retorno.sucesso) {
                Usuario.Logado = true;
                Usuario.Nome = retorno.objeto.nome;
                Usuario.ID = retorno.objeto.id;
                Usuario.Email = retorno.objeto.email;
                Usuario.Imagem = retorno.objeto.imagem;
                Usuario.NomeImagem = retorno.objeto.nomeimagem;
                
                localStorage.setItem("login", JSON.stringify(Usuario));
                InicioGeral();
            } else {
                console.log("Ocorreu um erro ao confirmar email.");
            }
        },
        error: function (retorno) {
            console.log("Ocorreu um erro ao confirmar email.");
            console.log(retorno);
        }
    });
}