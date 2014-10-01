/**
 * Dependences
 * 	- jQuery 2.x .js
 *  - Matriz.js
 *
 * Esta library é apenas um helper que para fazer os cálculos e rotacionar as imagens dentroo da célula ,
 * sempre mantendo-as no ponto top left da célula.
 * Também precisa recalcular a área ocupada pela imagem apó a rotação e fazer o devido insert na Matriz
 */

Rotate = function(){
    /**
     * faz a rotação da imagem mantendo seuy posicionamento ao top-left da célula
     */

    this.doRotate = function(objId,degree,matriz){
        try{


            var width = $(objId).width();
            var height = $(objId).height();

            // valores width e height reais (após rotação)
            var realWidth =0;
            var realHeight =0;


            // parametro que indica o eixo de rotação da imagem.
            var center = [];
            var calcA = 0;
            var calcB = 0;

            // definindo o parametro "transform-origin"=>array  que será passados ao jQueryRotate
            switch(parseInt(degree)){
                case 0 :
                    calcA = calcB = calcB + "0px";
                    realWidth = width;
                    realHeight = height;
                    break;
                case 90 || -90:
                    calcA = calcB = (parseInt(height) / 2) + "px";
                    realWidth = height;
                    realHeight = width;
                    break;
                case 180 :
                    calcA = (parseInt(width) / 2) + "px";
                    calcB = (parseInt(height) / 2) + "px";
                    realWidth = width;
                    realHeight = height;
                    break;
                case 270 :
                    calcA = calcB = (parseInt(width) / 2) + "px";
                    realWidth = height;
                    realHeight = width;
                    break;
                case 360 :
                    calcA = calcB = calcB + "0px";
                    realWidth = width;
                    realHeight = height;
                    break;
            }

            // tamanho na grade (antes da rotacao rotação)
            var actualSizeX = Math.ceil(height / matriz.cel.height); // calcula quantas células a imagem ocupa , no eixo x
            var actualSizeY = Math.ceil(width / matriz.cel.width); // calcula quantas células a imagem ocupa , no eixo x

            // tamanho na grade (após rotação)
            var sizeX = Math.ceil(realHeight / matriz.cel.height); // calcula quantas células a imagem ocupa , no eixo x
            var sizeY = Math.ceil(realWidth / matriz.cel.width); // calcula quantas células a imagem ocupa , no eixo x

            var x = parseInt($(objId).parent().attr("data-x"));
            var y = parseInt($(objId).parent().attr("data-y"));

            // verificando se após a rotação o objeto vai caber na area  escolhida

            // removendo primeiro para poder verificar depois
            matriz.remove(x,actualSizeX,y,actualSizeY);

            if(!matriz.verify(x,sizeX,y,sizeY))
            {
                // não cabe , insiro novamente na matriz a imagem original sem rotacionar
                matriz.insert(x,y,{"img":$(objId)});
                alert("Não ha espaco para rotacionar o conteudo");
                return false;
            }

            // monta o array com os parametros
            center.push(calcA);
            center.push(calcB);

            // monta o objeto de parametros para a funçõ rotate
            var parametros = {"angle":degree,"center":center};

            $(objId).rotate(parametros);
            //atualizando a alocação de células da matriz, visto que ao girar a imagem ela vai ocupar um espaço diferente do original
            matriz.insert(x,y,{"img":$(objId)});

            return true;
        }catch(err)
        {
            console.log(err);
            return err;
        }
    },
    /**
     * Ativa o duplo click para rotacionar as imagens
     * @param seletor = seletor css para capturar os objetos
     */
    this.bindEvent= function(seletor){
        $(seletor).bind(
                "dblclick",function(){
                    var angulo = (isNaN(parseInt($(this).getRotateAngle()))?0:parseInt($(this).getRotateAngle()));
                    switch(angulo){
                        case 0 :
                            rotate.doRotate("#"+$(this).attr("id"),90,matriz);
                            break;
                        case 90 :
                            rotate.doRotate("#"+$(this).attr("id"),180,matriz);
                            break;
                        case 180 :
                            rotate.doRotate("#"+$(this).attr("id"),270,matriz);
                            break;
                        case 270 :
                            rotate.doRotate("#"+$(this).attr("id"),0,matriz);
                            break;

                    }
                }
        );
    },

    /**
     * Limpa os Binds dos objetos
     */
    this.resetBindEvent= function(seletor){
        $(seletor).unbind("dblclick");
    }

}
