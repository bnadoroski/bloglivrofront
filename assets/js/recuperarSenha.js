let guid = null;
let params = null;

(function () {
    Inicio();
  })();

function Inicio() {
    params = new URLSearchParams(window.location.search);

    if(params.get('email')) {
      $('input[name="Email"]').val(params.get('email'));
    }
    if(params.get('guid')) {
        guid = params.get('guid');
    }
}

function RecuperarSenha(e) {
    let email = $('input[name="Email"]').val();
    let continuar = true;
    $('.erroInput').hide();
    $('#erroGeral').hide();

    e.preventDefault(); 

    if(!validarEmail(email))
    {
        continuar = false;
        $('input[name="Email"]').parent().find('.erroInput').text(`O Email inserido precisa ser valido!`);
        $('input[name="Email"]').parent().find('.erroInput').show();
    }

    if (continuar) {
        $('#loader').show();
        $.ajax({
            type: 'POST',
            url: `${linkAPI}/api/usuario/recuperarsenha/${email}`,
            data: email,            
            success: function (retorno) {
                $('#loader').hide();
                if(retorno.sucesso){
                    location.href = `aguardarRecuperarSenha.html?email=${email}`;
                }else {
                    if(CodigoErro.find(x => x.Nome == "EmailNaoExisteNaBase").Valor == retorno.codigoErro) {
                        $('#loader').hide();
                        $('.erroInput').text(retorno.mensagem ? retorno.mensagem : "Ocorreu um erro. ");
                        $('.erroInput').show();
                    }
                }
            },
            error: function (retorno) {
                $('#loader').hide();
                $('#erroGeral').text(retorno.mensagem ? retorno.mensagem : "Ocorreu um erro. ");
                $('#erroGeral').show();
                console.log(retorno);
            }
        });
    }
}

function RedefinirSenha(e) {
    let continuar = true;
    $('.erroInput').hide();
    $('#erroGeral').hide();
    $("#esqueceuaSenha").hide();

    e.preventDefault(); 
    $('#senhasIncompativeis').hide();

    const form = $('#redefinirSenha');
    
    $('input[required]').each(function(index, campo) {
        if(!$(campo).val()) {
            continuar = false;
            $(campo).parent().find('.erroInput').text(`O campo ${$(campo).attr('placeholder')} deve ser preenchido.`);
            $(campo).parent().find('.erroInput').show();
        }
        if($(campo).val().length > 0 && $(campo).val().length < 6) {
            continuar = false;
            $(campo).parent().find('.erroInput').text(`O campo ${$(campo).attr('placeholder')} deve ser maior que cinco caracteres.`);
            $(campo).parent().find('.erroInput').show();
        }
        if($(campo).attr('Name') == "Email" && $(campo).val()) {
            if(!validarEmail($(campo).val()))
            {
             continuar = false;
             $(campo).parent().find('.erroInput').text(`O Email inserido precisa ser valido!`);
             $(campo).parent().find('.erroInput').show();
            }
         }
    });

    if(continuar){
        $("input[name='GuidRecuperarSenhaString']").val(guid);
        $('#loader').show();
        $.ajax({
            type: 'POST',
            url: `${linkAPI}/api/usuario/redefinirsenha`,
            data: $(form).serialize(),
            success: function (retorno) {
                $('#loader').hide();
                if (retorno.sucesso) {
                    localStorage.setItem("senhaRedefinida", true);
                    location.href = 'meuPerfil.html';
                }
                else {
                    $('#erroGeral').text(retorno.mensagem);
                    $('#erroGeral').show();
                }
            },
            error: function (retorno) {
                $('#loader').hide();
                $('#erroGeral').text(retorno.mensagem ? retorno.mensagem : "Ocorreu um erro ao cadastrar. ");
                $('#erroGeral').show();
                console.log(retorno);
            }
        });
    }
}   