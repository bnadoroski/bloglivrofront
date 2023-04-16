let ResultadoLivros = [];
let ResultadoUsuarios = [];

let ampliar = {
    AmpliarLivro: {
        Contador: 0,
        Controller: null,
        Scene: null,
        Pagina: 0
    },
    AmpliarUsuario: {
        Contador: 0,
        Controller: null,
        Scene: null,
        Pagina: 0
    }
}

let geral = {
    Buscar: null,
    PaginacaoLivro: {
        Pagina: 1,
        Tamanho: 9
    },
    PaginacaoUsuario: {
        Pagina: 1,
        Tamanho: 12
    }
};

(function () {
    Inicio();
})();

function Inicio() {
    Usuario = JSON.parse(localStorage.getItem("login")) ?? Usuario;

    geral.Buscar = geral.Buscar == null ? localStorage.getItem("buscaGeral") : geral.Buscar;

    if($(window).width() < 960) {
        geral.PaginacaoLivro.Tamanho = 6;
    }

    $("#buscarLivro").keyup(function (e) {
        if(e.which == 13) {
            BuscarFiltro();
        }
    });

    $("#loaderUsuario").addClass("active");
    $("#loaderLivro").addClass("active");
    Pesquisar();
    
    ampliar.AmpliarUsuario.Controller = new ScrollMagic.Controller();
    ampliar.AmpliarUsuario.Scene = new ScrollMagic.Scene({triggerElement: ".expandirUsuarios #loaderUsuario", triggerHook: "onEnter"})
                    .addTo(ampliar.AmpliarUsuario.Controller)
                    .on("enter", function (e) {
                        if (!$("#loaderUsuario").hasClass("active") && !$('.expandirUsuarios.hidden')[0]) {
                            $("#loaderUsuario").addClass("active");
                            geral.PaginacaoUsuario.Pagina++;
                            ampliar.AmpliarUsuario.Contador++;

                            setTimeout(Pesquisar, 1000, 9);
                        }
                    });   

    ampliar.AmpliarLivro.Controller = new ScrollMagic.Controller();
    ampliar.AmpliarLivro.Scene = new ScrollMagic.Scene({triggerElement: ".expandirLivros #loaderLivro", triggerHook: "onEnter"})
                    .addTo(ampliar.AmpliarLivro.Controller)
                    .on("enter", function (e) {
                        if (!$("#loaderLivro").hasClass("active") && !$('.expandirLivros.hidden')[0]) {
                            $("#loaderLivro").addClass("active");
                            geral.PaginacaoLivro.Pagina++;
                            ampliar.AmpliarLivro.Contador++;
                            
                            setTimeout(Pesquisar, 1000, 9);
                        }
                    });
}

function TrocaAbas(aba) {
    if (!$('#' + aba).hasClass('activeTab')) {
        $('.tabs').removeClass('activeTab');
        $('#' + aba).addClass('activeTab');
    }

    if($('#' + aba).attr('id') == 'tab2') {
        $('.expandirLivros').addClass('hidden');
        $('.expandirUsuarios').removeClass('hidden');
        window.scrollTo(window.scrollX, window.scrollY + 1);
    }
    if($('#' + aba).attr('id') == 'tab1') {
        $('.expandirUsuarios').addClass('hidden');
        $('.expandirLivros').removeClass('hidden');
    }
}

function Pesquisar() {
    $.ajax({
        url: `${linkAPI}/api/geral/buscar`,
        type: "POST",
        contentType: "application/json;charset=utf-8",
        data: JSON.stringify(geral),
        dataType: 'json',
        success: function (resultados) {
            if(geral.PaginacaoLivro.Pagina > ampliar.AmpliarLivro.Pagina && geral.PaginacaoUsuario.Pagina > ampliar.AmpliarUsuario.Pagina){
                resultadoLivros(resultados.livros);
                PreparaResultadoUsuario(resultados.usuarios);
            }
            if(geral.PaginacaoLivro.Pagina > ampliar.AmpliarLivro.Pagina && geral.PaginacaoUsuario.Pagina == ampliar.AmpliarUsuario.Pagina) {
                resultadoLivros(resultados.livros);
            }
            if(geral.PaginacaoLivro.Pagina == ampliar.AmpliarLivro.Pagina && geral.PaginacaoUsuario.Pagina > ampliar.AmpliarUsuario.Pagina) {
                PreparaResultadoUsuario(resultados.usuarios);
            }
        }
    });
}

function resultadoLivros(livros) {
    if(livros.length  > 0) {
        livros.forEach(livro => {
            livro.extensao = livro.nomeImagem ? livro.nomeImagem.split(".", 4)[1] : null;
        });

        let novaDiv = document.createElement('div');
        novaDiv.setAttribute("id", "livros_" + ampliar.AmpliarLivro.Contador);
        novaDiv.setAttribute("class", "-mx-4 flex flex-wrap justify-center");

        let template = Handlebars.compile($("#_exibirLivros").html());
        $('#livros').append(novaDiv);
        $("#" + novaDiv.id).html(template(livros));

        $('article').readmore({speed: 500});
        ampliar.AmpliarLivro.Scene.update();
        ampliar.AmpliarLivro.Pagina++;
        $("#loaderLivro").removeClass("active");
        novaDiv = null;
    } else if(ampliar.AmpliarLivro.Contador == 0) {
        $("#loaderLivro").addClass("active");
        $("#loaderLivro").addClass("hidden");
        let template = Handlebars.compile($("#_exibirLivros").html());
        $("#livros").html(template(livros));
    } else {
        $("#loaderLivro").addClass("active");
        $("#loaderLivro").addClass("hidden");
    }
}

function PreparaResultadoUsuario(usuarios) {
    if (usuarios.length < 12) {
        if (usuarios.length == 0) {
            $("#loaderUsuario").addClass("active");
            $("#loaderUsuario").addClass("hidden");

            if(ampliar.AmpliarUsuario.Contador == 0) {
                let template = Handlebars.compile($("#_exibirUsuarios").html());
                $("#usuarios").html(template(usuarios));
            } 

            return;
        }
        resultadoUsuarios(usuarios);
        $("#loaderUsuario").addClass("active");
        $("#loaderUsuario").addClass("hidden");
    } else {
        resultadoUsuarios(usuarios);
    }
}

function resultadoUsuarios(usuarios) {
        usuarios.forEach(usuario => {
            usuario.extensao = usuario.nomeImagem ? usuario.nomeImagem.split(".", 4)[1] : null;
        });
        
        let novaDiv = document.createElement('div');
        novaDiv.setAttribute("id", "usuarios_" + ampliar.AmpliarUsuario.Contador);
        novaDiv.setAttribute("class", "-mx-4 flex flex-wrap justify-center");

        let template = Handlebars.compile($("#_exibirUsuarios").html());
        $('#usuarios').append(novaDiv);
        $("#" + novaDiv.id).html(template(usuarios));

        ampliar.AmpliarUsuario.Scene.update();
        $("#loaderUsuario").removeClass("active");

        novaDiv = null;
}