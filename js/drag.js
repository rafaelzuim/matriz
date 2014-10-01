function allowDrop(ev) {
    ev.preventDefault();
    $(ev.target).css("background-color", "#CCC");
}

function out(ev) {
    $(ev.target).css("background-color", "transparent");
}
function start(ev) {
    // remove a cor de fundo da célula onde se iniciou o movimento drag
    $(ev.target).parent().css("background-color", "transparent");

    // captura as cordenadas da célula
    x = parseInt($(ev.target).parent().attr("data-x"));
    y = parseInt($(ev.target).parent().attr("data-y"));

    var sizeX = Math.ceil($(ev.target).height() / matriz.cel.height); // calcula quantas células a imagem ocupa , no eixo x
    var sizeY = Math.ceil($(ev.target).width()/ matriz.cel.width); // calcula quantas células a imagem ocupa , no eixo x

    // remove da matriz
    matriz.remove(x,sizeX,y,sizeY);

    // adiciona as cordeadas da célula de origem ao objeto que está sendo movido
    $(ev.target).attr({
        "data-x" : x,
        "data-y" : y
    })

}

function drag(ev) {
    ev.dataTransfer.setData("text/html", ev.target.id);
}

function drop(ev) {

    // cancela o evento padrão que abre a foto no drop
    ev.preventDefault();
    // conteúdo que está sendo arrastado
    var data = ev.dataTransfer.getData("text/html");
    //coordenadas da origem do conteúdo
    var origem = {
            "x" : parseInt($("#" + data).attr("data-x")),
            "y" : parseInt($("#" + data).attr("data-y"))
        };



    // verifica se o destino é igual a origem (arrastou e soltou no mesmo lugar)
    if(origem.x == $(ev.target).attr("data-x") && origem.y == $(ev.target).attr("data-y")){
        matriz.insert(origem.x,origem.y,{"img":$("#"+data)})
        return false;
    }

    //limpa os atributos da imagem para não poluirr o html
    $("#"+data).removeAttr("data-x").removeAttr("data-y");

    var insertObj = {
        "img" : $("#" + data)
    };


    // coordenadas cartezianas baseadas na grade
    if ((x = $(ev.target).attr("data-x")) && (y = $(ev.target).attr("data-y"))) {
        if (matriz.insert(x, y, insertObj)) {
            ev.target.appendChild(document.getElementById(data));
        } else {
            alert("Voce esta tentando posicionar em uma area que ja esta alocada");
            $(ev.target).css("background-color", "transparent");
        }
    } else {
        // se não encotrou as propriedades data-x e data-y , é por que o drop
        // provavelmente foi feito em cima de outro cartão
        if ($(ev.target).parent().hasClass("celula")) {
            // com certeza o drop aconteceu em cima de uma célula ocupada, vamos
            // iniciar um "SWAP" de conteúdo

            // Como o drop aconteceu em cima de um conteúdo dentro de uma célula
            // , pego as cordenadas através do parent()
            var destino = {
                "x" : parseInt($(ev.target).parent().attr("data-x")),
                "y" : parseInt($(ev.target).parent().attr("data-y"))
            };

            var sizeX = Math.ceil($(ev.target).height() / matriz.cel.height); // calcula quantas células a imagem ocupa , no eixo x
            var sizeY = Math.ceil($(ev.target).width()/ matriz.cel.width); // calcula quantas células a imagem ocupa , no eixo x

            // remove da matriz o conteúdo da célula onde ocorreu o drop
            matriz.remove(destino.x,sizeX,destino.y,sizeY);

            // insere na matriz o conteúdo na célula destino
            if (matriz.insert(destino.x, destino.y, insertObj)) {
                // imagem que será colocada na origem da ação
                var removedObj = {"img":$(ev.target)};
                // remove fisicamente a imagem do destino
                $(ev.target).remove();

                //insere na célula de origem (o conteúdo que foi removido do destino)
                if (matriz.insert(origem.x, origem.y, removedObj))
                {
                    //facilitando a monagem da string
                    var id_origem = "#cel-"+origem.x+"_"+origem.y;
                    //inserindo físicamente o conteúdo na grade
                    $(id_origem).append(removedObj.img);

                }
                //dropa conteúdo na célula destino
                var id_destino = "#cel-"+destino.x+"_"+destino.y;

                $(id_destino).append($("#"+data));
            }
            // como as imagens podem ter sido removidas e inseridas , ativo novamente o ind doos eventos de rotação no click
            rotate.resetBindEvent(".celula img");
            rotate.bindEvent(".celula img");
        }

    }

}
