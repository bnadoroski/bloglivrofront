(function () {
    Inicio();
})();

function Inicio() {
    let params = new URLSearchParams(window.location.search);
    if(params.get('id'))
        Buscar(params.get('id'));

    if(window.location.toString().includes('meuPerfil'))
    CarregarPerfil();

    if(window.localStorage.getItem('senhaRedefinida')) {
        window.localStorage.removeItem('senhaRedefinida');

        $('#senhaRedefinida').fadeIn('fast');
        setTimeout(function() {
            $('#senhaRedefinida').fadeOut('fast');
        }, 5000);
    }
}

function CarregarPerfil() {
    if(Usuario.Imagem) {
        let extensao = Usuario.NomeImagem.split(".", 4)[1];
        $("#imagemdoPerfil").attr('src', `data:image/${extensao};base64,${Usuario.Imagem}`);
    }
    $('#nomePerfil').text(Usuario.Nome);
}

function Buscar(id) {
    $.ajax({
        type: 'get',
        url: `${linkAPI}/api/usuario/buscar/${id}`,
        data: id,
        success: function (usuario) {
            $('#NomeUsuario').text(usuario.nome);
        },
        error: function (retorno) {
            console.log(retorno);
        }
    });
}