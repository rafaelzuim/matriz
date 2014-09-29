function allowDrop(ev) {
    ev.preventDefault();
    $(ev.target).css("background-color","#CCC");
}

function out(ev){
    $(ev.target).css("background-color","transparent");
}
function start(ev)
{
    $(ev.target).parent().css("background-color","transparent");
    x = parseInt($(ev.target).parent().attr("data-x"));
    y = parseInt($(ev.target).parent().attr("data-y"));
    matriz.remove(x,y);
}

function drag(ev) {
    ev.dataTransfer.setData("text/html", ev.target.id);
}

function drop(ev) {

        // cancela o evento padrão que abre a foto no drop
        ev.preventDefault();

        // coordenadas cartezianas baseadas na grade
        if((x=$(ev.target).attr("data-x")) && (y=$(ev.target).attr("data-y"))){
            var data = ev.dataTransfer.getData("text/html");

            var insertObj = {"img":$("#"+data)};

            if(matriz.insert(x,y,insertObj)){
                ev.target.appendChild(document.getElementById(data));
            }
            else{
                alert("Voce esta tentando posicionar em uma area que ja esta alocada");
                $(ev.target).css("background-color","transparent");
            }
        }


}
