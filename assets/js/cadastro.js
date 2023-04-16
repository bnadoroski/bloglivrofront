(function () {
    Inicio();
})();

function Inicio() {
    $('input').keydown(function(e) {
        $(e.currentTarget).parent().find('.erroInput').hide();
    });
}

function acessar(e) {
    let continuar = true;
    e.preventDefault();

    const form = $('#acessar');

    $('input[required]').each(function (index, campo) {
        if (!$(campo).val()) {
            continuar = false;
            $(campo).parent().find('.erroInput').text(`O campo ${$(campo).attr('placeholder')} deve ser preenchido.`);
            $(campo).parent().find('.erroInput').show();
        }
        if ($(campo).val().length > 0 && $(campo).val().length < 6) {
            continuar = false;
            $(campo).parent().find('.erroInput').text(`O campo ${$(campo).attr('placeholder')} deve ser maior que cinco caracteres.`);
            $(campo).parent().find('.erroInput').show();
        }
        if ($(campo).attr('name') == "Email" && $(campo).val()) {
            if (!validarEmail($(campo).val())) {
                continuar = false;
                $(campo).parent().find('.erroInput').text(`O Email inserido precisa ser valido!`);
                $(campo).parent().find('.erroInput').show();
            }
        }
    });

    if (continuar) {
        $('#loader').show();
        $.ajax({
            type: form.attr('method') ?? 'post',
            url: form.attr('action') ?? `${linkAPI}/api/usuario/logar`,
            data: $(form).serialize(),
            success: function (retorno) {
                $('#loader').hide();
                if (retorno.sucesso) {
                    Usuario.ID = retorno.objeto.id;
                    Usuario.Email = retorno.objeto.email;
                    Usuario.Logado = true;
                    Usuario.Nome = retorno.objeto.nome;
                    Usuario.Imagem = retorno.objeto.imagem;
                    Usuario.NomeImagem = retorno.objeto.nomeImagem;

                    localStorage.setItem("login", JSON.stringify(Usuario));
                    location.href = 'index.html';
                }
                else {
                    $('#erroGeral').text(retorno.mensagem);
                    $('#erroGeral').show();
                }
            },
            error: function (retorno) {
                $('#loader').hide();
                $('#erroGeral').text(retorno.mensagem ? retorno.mensagem : "Ocorreu um erro ao logar. ");
                $('#erroGeral').show();
                console.log(retorno);
            }
        });
    }
}

function cadastrar(e) {
    let continuar = true;
    $('.erroInput').hide();
    $('#erroGeral').hide();
    $("#esqueceuaSenha").hide();

    e.preventDefault(); 
    $('#senhasIncompativeis').hide();

    const form = $('#cadastrar');
    
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
        $('#loader').show();
        $.ajax({
            type: form.attr('method') ?? 'post',
            url: form.attr('action') ?? `${linkAPI}/api/usuario/salvar`,
            data: $(form).serialize(),
            success: function (retorno) {
                $('#loader').hide();
                if (retorno.sucesso) {
                    localStorage.setItem("confirmarEmail", retorno.objeto.email);
                    location.href = 'aguardarConfirmacao.html';
                }
                else {
                    $('#erroGeral').text(retorno.mensagem);
                    $('#erroGeral').show();

                    if(CodigoErro.find(x => x.Nome == "EmailJaCadatrado").Valor == retorno.codigoErro)
                        $("#esqueceuaSenha").show();
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

function esqueciMinhaSenha() {
    location.href = `recuperarSenha.html?email=${$('input[name="Email"]').val()}`;
}