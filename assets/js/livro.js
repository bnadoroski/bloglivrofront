let idLivro = null;
let filtro = {
    ID: null,
    IDRelacionado: null,
    Nome: null, 
    Autor: null, 
    Colecao: null, 
    ApenasAtivos: true,
    Buscar: null,
    TagsPesquisa: [],
    Paginacao: {
        Pagina: 1,
        Tamanho: 3
    }
};
let tags = [];
let gatilhos = [];
let filtroNota = {
    IDUsuario: null,
    IDLivro: null
};

(function () {
    Inicio();
})();

function Inicio() {
    if($(window).width() < 960) {
        filtro.Paginacao.Tamanho = 2;
    }

    let params = new URLSearchParams(window.location.search);
    if(params.get('id')) {
        idLivro = params.get('id');
        Buscar(params.get('id'));
    }

    $('.closeTagGatilho').click(function(e) {
        $(".fundoModal").fadeOut();
        $(".modal").fadeOut();
    });
            
    $('.fundoModal').click(function(e) {
        if ($(e.target).closest('.modal').length === 0) {
            $(".fundoModal").fadeOut();
            $(".modal").fadeOut();
        }
    });

    $("#autor").click(function (e) {
        localStorage.setItem("buscaGeral", e.currentTarget.innerText);
        location.href = 'buscar.html';
    });
}

function PreencherFiltro(livro) {
    filtro.TagsPesquisa = livro.tags.map(x => x.id);
    filtro.IDRelacionado = livro.id;
    filtro.Colecao = livro.colecao;
    filtro.Autor = livro.autor;
    filtro.Nome = livro.nome;

    filtroNota.IDLivro = livro.id;
    filtroNota.IDUsuario = Usuario ? Usuario.ID : null;
}

function TrocaAbas(aba) {
    if (!$('#' + aba).hasClass('activeTab')) {
        $('.tabs').removeClass('activeTab');
        $('#' + aba).addClass('activeTab');
    }
}

function ConfigurarPaginas(quantidadeLivros) {
    if(filtro.Paginacao.Pagina == 1)
        $('#anteriorPagina').addClass('swiper-button-disabled');
    
    if(quantidadeLivros < filtro.Paginacao.Tamanho)
        $('#proximaPagina').addClass('swiper-button-disabled');
        
    $("#loader").addClass("hidden");
}

function Buscar(id) {
    $.ajax({
        url: `${linkAPI}/api/livro/buscar/completo`,
        type: "GET",
        contentType: "application/json;charset=utf-8",
        data: {
            ID: parseInt(id)
        },
        traditional: true,
        success: function (livro) {
            let nomeLivro = livro.colecao ? livro.nome.concat(" | ", livro.colecao) : livro.nome; 
            let extensao = livro.nomeImagem ? livro.nomeImagem.split(".", 4)[1] : null;
            $("#titulo").text($("#titulo").text().replace("", nomeLivro));
            $("#sinopse").text($("#sinopse").text().replace("", livro.sinopse));
            $("#imagemLivro").attr('src', `data:image/${extensao};base64,${livro.imagem}`);
            $("#autor").text($("#autor").text().replace("", livro.autor));
            
            PreencherFiltro(livro);
            let topTag = livro.tags.map(x => ({ x, r: Math.random() })).sort((a, b) => a.r - b.r).map(a => a.x).slice(0, 3);
            let topGatilhos = livro.gatilhos.map(x => ({ x, r: Math.random() })).sort((a, b) => a.r - b.r).map(a => a.x).slice(0, 3);

            let templateTag = Handlebars.compile($("#_exibirTags").html());
            let templateGatilho = Handlebars.compile($("#_exibirGatilhos").html());
            $("#tags").html(templateTag(topTag).concat($("#detalheTag").html()));
            $("#gatilhos").html(templateGatilho(topGatilhos).concat($("#detalheGatilho").html()));

            tags = livro.tags;
            gatilhos = livro.gatilhos;
            BuscarRelacionados();
            ExibirTags(tags);
            ExibirGatilhos(gatilhos);
            ExibirNota(livro.nota);
        }
    });
}

function BuscarRelacionados() {
    $.ajax({
        url: `${linkAPI}/api/livro/buscar/portag`,
        type: "POST",
        data: filtro,
        success: function (livros) {
            livros.forEach(livro => {
                livro.extensao = livro.nomeImagem ? livro.nomeImagem.split(".", 4)[1] : null;
            });

            if(livros.length != 0) {
                $('#livros').children().remove();
                let template = Handlebars.compile($("#_exibirRelacionados").html());
                $("#livros").prepend(template(livros));
                $('article').readmore({speed: 500});
            } else {
                $('#livros').children().show();
            }

            ConfigurarPaginas(livros.length);
        }
    });
}

function ProximaPagina() {
    $('#livros').children().hide();
    $("#loader").removeClass("hidden");
    filtro.Paginacao.Pagina++;
   BuscarRelacionados();
}

function PaginaAnterior() {
    $('#livros').children().hide();
    $("#loader").removeClass("hidden");
    filtro.Paginacao.Pagina--;
    BuscarRelacionados();
}

function ExibirNota(notaObjeto) {
    let nota = notaObjeto != null ? parseFloat(notaObjeto.valor.toFixed(1)) : 0;
    let minhaNota = notaObjeto != null ? parseFloat(notaObjeto.valorMinhaNota.toFixed(1)) : 0;
    let quantidadeNota = notaObjeto != null ? notaObjeto.quantidadeNota : 0;
    let valor = null;
    switch (true) {
        case (nota < 2):
            valor = '<i class="fa-regular fa-star" style="margin-right: 10px"></i>';
            break;
        case (nota < 4.5):
            valor = '<i class="fa fa-star-half-o" style="margin-right: 10px"></i> ';
            break;
        case (nota >= 4.5):
            valor = '<i class="fa-solid fa-star" style="margin-right: 10px"></i>';
            break;
    }

    $("#adicionarNota").prepend(valor);
    $("#nota").text(`${nota} (${quantidadeNota})`);

    if(minhaNota) {
        $("#excluirNota").show();
        let indice = minhaNota;
        // if(minhaNota % 2 != 0) {
        //     let classe = null;
        //     indice = (Math.round(-minhaNota) * -1) - 1;
        //     switch (true) {
        //         case (minhaNota < 2):
        //             classe = 'fa-regular fa-star';
        //             break;
        //         case (minhaNota < 4.5):
        //             classe = 'fa fa-star-half-o';
        //             break;
        //         case (minhaNota >= 4.5):
        //             classe = 'fa-solid fa-star';
        //             break;
        //     }
        //     $($(".estrela")[indice]).removeClass('fa-solid fa-star').addClass(classe);
        // }
        
        for (let index = 0; index < indice; index++) {
            let inverte = $(".estrela").length;
            $($(".estrela")[inverte - 1]).addClass('estrelaPreenchida');
            $(".estrelaPreenchida").removeClass('estrela');
        }
        $(".estrela").removeClass('estrela');
    } else {
        $("#excluirNota").hide();
        $(".tamanhoEstrela").addClass('estrela');
        $(".tamanhoEstrela").removeClass('estrelaPreenchida');
    }

}

function AtualizarNota() {
    $.ajax({
        url: `${linkAPI}/api/nota/buscar`,
        type: "POST",                
        data: filtroNota,
        success: function (notas) {
            if(notas) {
                $("#adicionarNota i").remove();
                ExibirNota(notas);
            }
        }
    });
}

function DarNota(nota) {
    filtroNota.Valor = nota;
    $.ajax({
        url: `${linkAPI}/api/nota/gravar`,
        type: "POST",                
        data: filtroNota,
        success: function (resultado) {
            if(resultado.sucesso) {
                AtualizarNota();
            }
        }
    });
}

function ExcluirNota() {
    $.ajax({
        url: `${linkAPI}/api/nota/excluir`,
        type: "POST",                
        data: filtroNota,
        success: function (resultado) {
            if(resultado.sucesso) {
                AtualizarNota();
            }
        }
    });
}