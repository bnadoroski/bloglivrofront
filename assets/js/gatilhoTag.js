(function () {
    Inicio();
})();

function Inicio() {
    $(".openModalTag").click(function(){
        $(".fundoModal").css("display","block");
        $(".modalTag").css("display","block");
    });

    $(".openModalGatilho").click(function(){
        $(".fundoModal").css("display","block");
        $(".modalGatilho").css("display","block");
    });

    $(".cancelModal").click(function(){
        $(".fundoModal").fadeOut();
        $(".modal").fadeOut();
    });

    $('#adicionarTag').keydown(function(e) {
        $("#errorPesquisa").hide();
    });

    $('#adicionarTag').keyup(function(e) {
        $('.erroInput').hide();
        TagsExistentes($("#adicionarTag").val());
        if(!$("#adicionarTag").val()) {
            closeAllLists();
        }
    });

    $('#adicionarGatilho').keydown(function(e) {
        $("#errorPesquisaGatilho").hide();
    });

    $('#adicionarGatilho').keyup(function(e) {
        $('.erroInput').hide();
        GatilhosExistentes($("#adicionarGatilho").val());
        if(!$("#adicionarGatilho").val()) {
            closeAllLists();
        }
    });
}

function ExibirTags(tags) {
    if(!Usuario.Logado) {
        tags = tags.map((item) => ({ ...item, class: 'exibirConectado' }));
    }
    let cardTags = Handlebars.compile($("#_tags").html());
    $("#cardTags").html(cardTags(tags));
}

function ExibirGatilhos(gatilhos) {
    if(!Usuario.Logado) {
        gatilhos = gatilhos.map((item) => ({ ...item, class: 'exibirConectado' }));
    }
    let cardGatilhos = Handlebars.compile($("#_gatilhos").html());
    $("#cardGatilhos").html(cardGatilhos(gatilhos));
}


function RemoverTag(id) {
    $.ajax({
        url: `${linkAPI}/api/tag/${id}/remover/${idLivro}`,
        type: "DELETE",
        contentType: "application/x-www-form-urlencoded",   
        data: {
            id: id,
            idLivro: idLivro
        },        
        success: function (retorno) {
            if(retorno.sucesso) {
                $("#novaTag").find('p').text('Tag removida');
                $('#novaTag').fadeIn('fast');
                setTimeout(function() {
                    $('#novaTag').fadeOut('fast');
                    $("#novaTag").find('p').text('Nova tag adicionada 🥳');
                }, 5000);
                
                let remover = tags.findIndex(x => x.id == "tag_" + id);
                tags.splice(remover, 1);
                $(`#tag_${id}`).remove();
                ExibirTags(tags);
            } else {
                $("#novaTag").removeClass('bg-primary');
                $("#novaTag").addClass('bg-vermelho');
                $("#novaTag").find('p').text('Ocorreu um erro ao remover a tag 😥');
                $('#novaTag').show();
            }
        }
    });
}

function AdicionarTag() {
    let novaTag = $("#adicionarTag").val();
    $("#errorPesquisa").offset({left: $("#adicionarTag").offset().left});

    if(!novaTag) {
       $("#errorPesquisa").text(`Preencha o campo "Adicionar Tag".`);
       $("#errorPesquisa").show();
       return;
    } else if (novaTag.length > 0 && novaTag.length < 2) {
        $("#errorPesquisa").text(`A tag deve possuir três ou mais caracteres.`);
        $("#errorPesquisa").show();
        return;
    }

    $.ajax({
        url: `${linkAPI}/api/tag/gravar/${idLivro}`,
        type: "POST",
        contentType: "application/x-www-form-urlencoded",   
        data: {
            nome: novaTag,
            idLivro: idLivro
        },        
        success: function (retorno) {
            if(retorno.sucesso) {
                if(CodigoErro.find(x => x.Nome == "TagJaExiste").Valor == retorno.codigoErro)
                {             
                    $("#adicionarTag").parent().find('.erroInput').text(retorno.mensagem);
                    $("#adicionarTag").parent().find('.erroInput').show();
                    return;
                }

                $('#novaTag').fadeIn('fast');
                setTimeout(function() {
                    $('#novaTag').fadeOut('fast');
                }, 5000);
                tags.push(retorno.objeto);
                ExibirTags(tags);
                $("#adicionarTag").val("");
            } else {
                $("#novaTag").removeClass('bg-primary');
                $("#novaTag").addClass('bg-vermelho');
                $("#novaTag").find('p').text('Ocorreu um erro ao salvar a tag 😥');
                $('#novaTag').show();
            }
        }
    });
}

function RemoverGatilho(id) {
    $.ajax({
        url: `${linkAPI}/api/gatilho/${id}/remover/${idLivro}`,
        type: "DELETE",
        contentType: "application/x-www-form-urlencoded",   
        data: {
            id: id,
            idLivro: idLivro
        },        
        success: function (retorno) {
            if(retorno.sucesso) {
                $("#novoGatilho").find('p').text('Gatilho removido');
                $('#novoGatilho').fadeIn('fast');
                setTimeout(function() {
                    $('#novoGatilho').fadeOut('fast');
                    $("#novoGatilho").find('p').text('Novo gatilho adicionado 🥳');
                }, 5000);
                
                let remover = gatilhos.findIndex(x => x.id == "gatilho_" + id);
                gatilhos.splice(remover, 1);
                $(`#gatilho_${id}`).remove();
                ExibirGatilhos(gatilhos);
            } else {
                $("#novoGatilho").removeClass('bg-laranja');
                $("#novoGatilho").addClass('bg-vermelho');
                $("#novoGatilho").find('p').text('Ocorreu um erro ao salvar o gatilho 😥');
                $('#novoGatilho').show();
            }
        }
    });
}

function AdicionarGatilho() {
    let novoGatilho = $("#adicionarGatilho").val();
    $("#errorPesquisaGatilho").offset({left: $("#adicionarGatilho").offset().left});

    if(!novoGatilho) {
       $("#errorPesquisaGatilho").text(`Preencha o campo "Adicionar Gatilho".`);
       $("#errorPesquisaGatilho").show();
       return;
    } else if (novoGatilho.length > 0 && novoGatilho.length < 2) {
        $("#errorPesquisaGatilho").text(`O gatilho deve possuir três ou mais caracteres.`);
        $("#errorPesquisaGatilho").show();
        return;
    }

    $.ajax({
        url: `${linkAPI}/api/gatilho/gravar/${idLivro}`,
        type: "POST",
        contentType : "application/x-www-form-urlencoded",   
        data: {
            nome: novoGatilho,
            idLivro: idLivro
        },
        success: function (retorno) {
            if(retorno.sucesso) {
                if(CodigoErro.find(x => x.Nome == "GatilhoJaExiste").Valor == retorno.codigoErro)
                {             
                    $("#adicionarGatilho").parent().find('.erroInput').text(retorno.mensagem);
                    $("#adicionarGatilho").parent().find('.erroInput').show();
                    return;
                }

                $('#novoGatilho').fadeIn('fast');
                setTimeout(function() {
                    $('#novoGatilho').fadeOut('fast');
                }, 5000);
                gatilhos.push(retorno.objeto);
                ExibirGatilhos(gatilhos);
            } else {
                $("#novoGatilho").removeClass('bg-laranja');
                $("#novoGatilho").addClass('bg-vermelho');
                $("#novoGatilho").find('p').text('Ocorreu um erro ao salvar o gatilho 😥');
                $('#novoGatilho').show();
            }
        }
    });
}

function TagsExistentes(texto) {
    $.ajax({
        url: `${linkAPI}/api/tag/buscar`,
        type: "POST",
        contentType: "application/json;charset=utf-8",
        data: JSON.stringify({Nome: texto}),
        dataType: 'json',
        success: function (tagsExibir) {
            if(tagsExibir.length > 0)
                autocomplete($("#adicionarTag")[0], tagsExibir.map(x => x.nome));
            else
                autocomplete($("#adicionarTag")[0], []);
        }
    });
}

function GatilhosExistentes(texto) {
    $.ajax({
        url: `${linkAPI}/api/gatilho/buscar`,
        type: "POST",
        contentType: "application/json;charset=utf-8",
        data: JSON.stringify({Nome: texto}),
        dataType: 'json',
        success: function (gatilhosExibir) {
            if(gatilhosExibir.length > 0)
                autocomplete($("#adicionarGatilho")[0], gatilhosExibir.map(x => x.nome));
            else
                autocomplete($("#adicionarGatilho")[0], []);
        }
    });
}