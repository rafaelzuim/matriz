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

            // parametro que indica o eixo de rotação da imagem.
            var center = [];
            var calc = 0;

            switch(parseInt(degree)){
                case 0 :
                    calc += "0px";
                    break;
                case 90 :
                    calc = parseInt(height) / 2;
                    calc += "px";
                    break;
                case 180 :
                    calc = (parseInt(height) / 2) * -1;
                    calc += "px";
                    break;

                case 270 :
                    calc = parseInt(width) / 2;
                    calc += "px";
                    break;
                case 360 :
                    calc += "0px";
                    break;
            }

            // duas vezes mesmo , para produzir o array [value,value]
            center.push(calc);
            center.push(calc);

            // monta o objeto de parametros para a funçõ rotate
            var parametros = {"angle":degree,"center":center};

            $(objId).rotate(parametros);
            return true;
        }catch(err)
        {
            console.log(err);
            return err;
        }
    }
}
