let controller = null;
let scene = null;
let contador = 0;
let fecharModal = true;
let imagemLivro = null;
let arrayTag = [];
let arrayGatilho = [];

let filtro = {
    ID: null,
    Nome: null, 
    Autor: null, 
    Colecao: null, 
    ApenasAtivos: true,
    Buscar: null,
    Paginacao: {
        Pagina: 1,
        Tamanho: 9
    }
};

let filtroBusca = {
    ID: null,
    Nome: null,
    IDLivro: null
};

(function () {
    Inicio();
})();

function Inicio() {
    if($(window).width() < 960) {
        filtro.Paginacao.Tamanho = 6;
    }

    $("#buscarLivro").keyup(function (e) {
        if(e.which == 13) {
            BuscarFiltro();
        }
    });

    $("#loader").addClass("active");
    BuscarTodos();
    controller = new ScrollMagic.Controller();
    scene = new ScrollMagic.Scene({triggerElement: ".expandirLivros #loader", triggerHook: "onEnter"})
                    .addTo(controller)
                    .on("enter", function (e) {
                        if (!$("#loader").hasClass("active")) {
                            $("#loader").addClass("active");

                            setTimeout(BuscarTodos, 1000, 9);
                        }
                    });

    $(".openModalAddLivro").click(function(){
        $(".fundoModal").css("display","block");
        $("#modalAddLivro").css("display","block");
    });

    $(".close").click(function(){
        fecharModal = true;
        $("#modalCrop").css("display","none");
        $(".fundoModal").css("display","block");
        $("#modalAddLivro").css("display","block");
    });

    $('.closeTagGatilho').click(function(e) {
            $(".modalSecundario").css("display","none");
    });
        
    $('.fundoModal').click(function(e) {
        if($('.modalSecundario:visible').length > 0) {
            $(".modalSecundario").css("display","none");
        } else {
            if ($(e.target).closest('#modalAddLivro').length === 0 && fecharModal) {
                $(".fundoModal").fadeOut();
                $("#modalAddLivro").fadeOut();
            }
        }
    });
}

function BuscarFiltro() {
    filtro.Buscar = $("#buscarLivro").val();
    filtro.Paginacao.Pagina = 1;

    $.ajax({
        url: `${linkAPI}/api/livro/buscar`,
        type: "POST",
        contentType: "application/json;charset=utf-8",
        data: JSON.stringify(filtro),
        dataType: 'json',
        success: function (livros) {
            livros.forEach(livro => {
                livro.extensao = livro.nomeImagem ? livro.nomeImagem.split(".", 4)[1] : null;
            });

            $('#livros').children().remove();
            if(livros.length  > 0) {

                let novaDiv = document.createElement('div');
                novaDiv.setAttribute("id", "livros_" + contador);
                novaDiv.setAttribute("class", "-mx-4 flex flex-wrap");

                let template = Handlebars.compile($("#_exibirLivros").html());
                $('#livros').append(novaDiv);
                $("#" + novaDiv.id).html(template(livros));

                $('article').readmore({speed: 500});
                scene.update();
                $("#loader").removeClass("active");

                filtro.Paginacao.Pagina++;
                novaDiv = null;
                contador++;
                
            } else {
                $("#loader").addClass("active");
                $("#loader").addClass("hidden");
                let template = Handlebars.compile($("#_exibirLivros").html());
                $("#livros").html(template(livros));
            }
        }
    });
}

function BuscarTodos() {
    $.ajax({
        url: `${linkAPI}/api/livro/buscar`,
        type: "POST",
        contentType: "application/json;charset=utf-8",
        data: JSON.stringify(filtro),
        dataType: 'json',
        success: function (livros) {
            livros.forEach(livro => {
                livro.extensao = livro.nomeImagem ? livro.nomeImagem.split(".", 4)[1] : null;
            });

            if(livros.length  > 0) {
                let novaDiv = document.createElement('div');
                novaDiv.setAttribute("id", "livros_" + contador);
                novaDiv.setAttribute("class", "-mx-4 flex flex-wrap");

                let template = Handlebars.compile($("#_exibirLivros").html());
                $('#livros').append(novaDiv);
                $("#" + novaDiv.id).html(template(livros));

                $('article').readmore({speed: 500});
                scene.update();
                $("#loader").removeClass("active");

                filtro.Paginacao.Pagina++;
                novaDiv = null;
                contador++;
            } else {
                $("#loader").addClass("active");
                $("#loader").addClass("hidden");
            }
        }
    });
}

function InserirImagem(imagem) {
    var file = $("input[type=file]").get(0).files[0];

    if(file){

        $("#nomeImagem").val(file.name);
        var img_link = URL.createObjectURL(file);
        AbrirModalCrop(img_link);
    }
}

function AbrirModalCrop(imagem) {
    fecharModal = false;
    $("#modalAddLivro").css("display","none");

    const cropOptions = {
        image: imagem,
        imgFormat: '418x600',
        minWidth: 418,
        minHeight: 600,
        zoomable: true,
        background: 'transparent',
        btnDoneAttr: '#crop'
    }

    $('#modalCrop .modal-body').cropimage(cropOptions, function(imgURL){
        fecharModal = true;
        imagemLivro = imgURL;
        $("#modalCrop").css("display","none");
        $("#imagemCapaPrevew").attr("src", imgURL);
        $("#imagemCapa").attr("src", imgURL);
        $("#modalAddLivro").css("display","block");
    });
    
    $("#modalCrop").css("display","block");
}


function gravarLivro(e) {
    $('#erroAddLivro').fadeOut('fast');
    let continuar = true;
    e.preventDefault();

    $('input[required], textarea[required]').each(function (index, campo) {
        if (!$(campo).val() || $(campo).val().trim() == '') {
            continuar = false;
            $(campo).parent().find('.erroInput').text(`O campo ${$(campo).attr('placeholder')} deve ser preenchido.`);
            $(campo).parent().find('.erroInput').show();
        }
    });

    if (continuar) {             
        $("#btnSalvar").hide();
        $('#loader').show();   
        var formArray = $('#salvarLivro').serializeArray();
        var returnArray = {};
        for (var i = 0; i < formArray.length; i++){
            returnArray[formArray[i]['name']] = formArray[i]['value'];
        }
        returnArray.Imagem = imagemLivro;
        returnArray.Tags = arrayTag;
        returnArray.Gatilhos = arrayGatilho;

            $.ajax({
                type: "POST",	
                url: `${linkAPI}/api/livro/gravar`,
                contentType: "application/json; charset=utf-8",
                data: JSON.stringify(returnArray),
                dataType: "json",
                success: function (retorno) {
                    $('#loader').hide();
                    if (retorno.sucesso) {
                        location.href = `livros-ver.html?id=${retorno.objeto.id}`;
                    }
                    else {
                        $("#btnSalvar").show();
                        $("#erroAddLivro").find('p').text(retorno.mensagem);
                        $('#erroAddLivro').show();
                    }
                },
                error: function (retorno) {
                    $('#loader').hide();
                    $("#btnSalvar").show();
                    $("#erroAddLivro").find('p').text('Ocorreu um erro ao salvar o livro. 😥');
                    $('#erroAddLivro').show();
                    console.log(retorno);
                }
            });
    }
}

function AdicionarArrayTag() {
    $(".ajustaCardTag").removeClass('hidden');
    let tag = $("#adicionarTag").val();
    arrayTag.push({ID: arrayTag.length + 1, Nome: tag});
    ExibirTags(arrayTag);
    $("#tagContagem").text(arrayTag.length);
    $("#adicionarTag").val("");
}

function RemoverTagArray(id) {
    let remover = arrayTag.findIndex(x => x.id == id);
    arrayTag.splice(remover, 1);
    ExibirTags(arrayTag);
    $("#tagContagem").text(arrayTag.length);
}

function AdicionarArrayGatilho() {
    $(".ajustaCardGatilho").removeClass('hidden');
    let gatilho = $("#adicionarGatilho").val();
    arrayGatilho.push({ID: arrayGatilho.length + 1, Nome: gatilho});
    ExibirGatilhos(arrayGatilho);
    $("#gatilhoContagem").text(arrayGatilho.length);
    $("#adicionarGatilho").val("");
}

function RemoverGatilhoArray(id) {
    let remover = arrayGatilho.findIndex(x => x.id == id);
    arrayGatilho.splice(remover, 1);
    ExibirGatilhos(arrayGatilho);
    $("#gatilhoContagem").text(arrayGatilho.length);
}