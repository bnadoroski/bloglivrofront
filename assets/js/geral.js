let linkAPI = "http://localhost:5000";

let CodigoErro = [
    {Valor: 1, Nome : "SenhasIncompativeis"},
    {Valor: 2, Nome : "EmailJaCadatrado"},
    {Valor: 3, Nome : "ErroAoLogar"},
    {Valor: 4, Nome : "TagJaExiste"},
    {Valor: 5, Nome : "GatilhoJaExiste"},
    {Valor: 6, Nome : "EmailNaoExisteNaBase"}
];

let Usuario = {
    Logado: false,
    ID: null,
    Nome: null,
    Email: null,
    Imagem: null,
    NomeImagem: null
};

(function () {
    InicioGeral();
})();

function InicioGeral() {
    Usuario = JSON.parse(localStorage.getItem("login")) ?? Usuario;
    if(Usuario.Logado) {
        Usuario.Nome = Usuario.Nome ? Usuario.Nome : "Meu Perfil";
        let extensao = Usuario.nomeImagem ? Usuario.nomeImagem.split(".", 4)[1] : null;
        let icone = Usuario.Imagem ? `<img src="data:image/${extensao};base64,${Usuario.Imagem}" alt="image" class="w-full rounded-full imgMini" /> <p class="pdl"> ${Usuario.Nome} </p>` : `<i class='fa fa-user-circle pdr'></i> ${Usuario.Nome}`;
        let iconeFirst = Usuario.Imagem ? `<img src="data:image/${extensao};base64,${Usuario.Imagem}" alt="image" class="w-full rounded-full imgMini marginTop8" />` : "<i class='fa fa-user-circle marginTop11'></i>";
        
        if( $('#livrosLista').is(":visible")) {
            $("#imagemPerfil").html(`${iconeFirst}`);
            $("#imagemPerfil").show();
            $("#loginNome").html(`${icone}`);
        } else {
            $("#imagemPerfilMin").show();
            $("#loginNomeMin").html(`${icone}`);
        }

        $("#imagemSemPerfil").remove();
        $("#imagemSemPerfilMin").remove();

        
        $(".exibirConectado").removeClass('exibirConectado');
    }
    
    $("#barraBuscar").focusout(function () {
        $("#barraBuscar").hide();
    });
    
    $("#barraBuscar").keyup(function (e) {
        if(e.which == 13) {
            localStorage.setItem("buscaGeral", e.currentTarget.value);
            location.href = 'buscar.html';
        }
    });
}

function BuscarGeral() {
    $("#barraBuscar").show();
    $("#barraBuscar").focus();
}

function Sair() {
    localStorage.clear();
    if(window.location.href.includes('meuPerfil.html'))
        window.location.href = 'index.html';
    else    
        window.location.reload();

}

function autocomplete(inp, arr) {
    var currentFocus;
    
        var a, b, i, val = $(inp).val();
        closeAllLists();
        if (!val) { return false;}
        currentFocus = -1;
        a = document.createElement("DIV");
        a.setAttribute("id", this.id + "autocomplete-list");
        a.setAttribute("class", "autocomplete-items");
        $(inp).parent().append(a);

        if(arr.length == 0) {
            closeAllLists();
        }
        for (i = 0; i < arr.length; i++) {
          if (arr[i].substr(0, val.length).toUpperCase() == val.toUpperCase()) {
            b = document.createElement("DIV");
            b.innerHTML = "<strong>" + arr[i].substr(0, val.length) + "</strong>";
            b.innerHTML += arr[i].substr(val.length);
            b.innerHTML += "<input type='hidden' value='" + arr[i] + "'>";
            b.addEventListener("click", function(e) {
                $(inp).val($(this).find('input').val());
                closeAllLists();
            });
            a.append(b);
          }
        }
}

function closeAllLists() {
    var x = document.getElementsByClassName("autocomplete-items");
    for (var i = 0; i < x.length; i++) {
        x[i].parentNode.removeChild(x[i]);
    }
}

function validarEmail(email) {
    return String(email)
        .toLowerCase()
        .match(/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/);
}

function exibirSenha(campo) {
    var campoNome = $(campo).parent().hasClass('confirmar') ? 'ConfirmarSenha' : 'Senha';
    $(campo).addClass('hidden');
    
    if($(campo).children().hasClass('fa-eye-slash')) {
        $($(campo).prev()).removeClass('hidden');
        $('input[name="'+ campoNome +'"').attr('type', 'text');
    } else {
        $($(campo).next()).removeClass('hidden');
        $('input[name="'+ campoNome +'"').attr('type', 'password');
    }
}