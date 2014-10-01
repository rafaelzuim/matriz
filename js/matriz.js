/**
 *
 */
function Matriz() {

    this.constructor = function() {
        alert("construtor");
    }

    this.printArea;
    this.cols = 6;
    this.rows = 6;
    this.matriz = [];
    this.cel = {"width":257,"height":152}

    /*
     * Metodo init monta inicialmente a matriz @var cols = Número de colunas da
     * matriz @var rows = Número de linhas da matriz
     */
    this.init = function(cols, rows, printArea) {
        /**
         * ajuste do tamanho da area de imprssão , isso deverá ser amplamente estudado quando chegarmos na etapa de impressao
         */
        if(cols)this.cols = cols;
        if(rows)this.rows = rows;
        if(printArea)this.printArea = printArea;

        this.matriz = new Array(this.rows);


        for (i = 0; i < this.rows; i++) {
            this.matriz[i] = new Array(this.cols)
            for (var j = 0; j < this.cols; j++) {
                this.matriz[i][j] = {
                    "content" : {},
                    "free" : true
                };
            }
        }
    };

    /**
     * Método print exibe na tela a matriz
     */
    this.print = function() {
        $(this.printArea).html("");
        for (x = 0; x < this.matriz.length; x++) {
            for (y = 0; y < this.matriz[x].length; y++) {
                var divMatriz = $("<div/>").attr("class", "celula")
                                            .attr("id","cel-" + x + "_" + y)
                                            .attr("data-x", x)
                                            .attr("data-y", y)
                                            .attr("ondrop", "drop(event)");
                if(this.matriz[x][y].content.hasOwnProperty("img")){
                    //divMatriz.html(this.matriz[x][y].content.img).append($("<canvas/>").attr("id","canvas-" + x + "_" + y)); com canvas
                    divMatriz.html(this.matriz[x][y].content.img);
                }
                $(this.printArea).append(divMatriz);
            }
        }
        return this;
    }

    /**
     * Insere o elemento na matriz
     *
     * @var x = linha onde fará a insersçao
     * @var y = coluna onde fará a inserção
     * @content = Objeto que será inserido na memório {<img/>,size-x,size-y}
     * @return = Obejto matriz ou false
     *
     */
    this.insert = function(x, y, content) {
        try {
            /**
             *  verifica se há rotação 90 e 270 , neste caso , é necessário inverter a orientação
             *  largura passa a ser altura e vice-versa
            */
            var width = 0;
            var height = 0;

            if(content.img.getRotateAngle() == 90 || content.img.getRotateAngle()==270)
            {
                width = parseInt(content.img.height());
                height = parseInt(content.img.width());
            }
            else
            {
                width = parseInt(content.img.width());
                height = parseInt(content.img.height());
            }

            var sizeX = Math.ceil(height / this.cel.height); // calcula quantas células a imagem ocupa , no eixo x
            var sizeY = Math.ceil(width / this.cel.width); // calcula quantas células a imagem ocupa , no eixo x

            // verifica se a célula esta disponível, no caso de imagens maiores
            // , verifica suas vizinhas também
            if (this.verify(x, sizeX, y, sizeY)) {
                // ocupa a celula alvo com o objeto
                this.matriz[x][y].content = {
                    'img' : content.img,
                    'sizeX' : sizeX,
                    'sizeY' : sizeY,
                    'partOf' : false
                }
                this.matriz[x][y].free = false;

                // ocupa mais de uma celula ?
                if(sizeX > 1 || sizeY >1){
                    // perorre o eixo x
                    for(contX=0 ; contX<sizeX ; contX++){
                        // validação para verificar se ja foi reservado esta célula (x,y)
                        if(this.verify(parseInt(x)+parseInt(contX), 1, y, 1))
                        {
                            /** ok , aloco esta célula com todos os valores null , apenas com um ponteiro indicando
                             * qual a célula de origem ( onde realmente foi inserido a imagem)
                             */

                            this.matriz[parseInt(x)+parseInt(contX)][y].content = {
                                    'img' : null,
                                    'sizeX' : null,
                                    'sizeY' : null,
                                    'partOf' : "["+x+"]["+y+"]"
                                }
                            this.matriz[parseInt(x)+parseInt(contX)][y].free = false;
                        }
                        // percorrendo o eixo Y la linha atual
                        for(contY=0 ; contY<sizeY ; contY++){
                            // validação para verificar se ja foi reservado esta célula (x,y)
                            if(this.verify(parseInt(x)+parseInt(contX), 1, parseInt(y)+parseInt(contY), 1))
                            {
                                /** ok , aloco esta célula com todos os valores null , apenas com um ponteiro indicando
                                 * qual a célula de origem ( onde realmente foi inserido a imagem)
                                 */
                                this.matriz[parseInt(x)+parseInt(contX)][parseInt(y)+parseInt(contY)].content = {
                                        'img' : null,
                                        'sizeX' : null,
                                        'sizeY' : null,
                                        'partOf' : "["+x+"]["+y+"]"
                                }
                                this.matriz[ parseInt(x) + parseInt(contX) ][ parseInt(y) + parseInt(contY) ].free = false;
                            }
                        }
                    }
                }
                return true;
            } else {
                return false;
            }
        } catch (err) {
            console.log("Ocorreu um erro ao tentar movel a imagem. Err:"+
                    err.lineNumber +"=>"+ err.toString() + "\n "+ err.stack);
            return false;
        }

    }

    /**
     * Remove o elemento na matriz
     *
     * @var x = linha onde fará a remoção
     * @var y = coluna onde fará a Remoção
     * @return = Obejto matriz ou false
     *
     */
    this.remove = function(x,sizeX,y,sizeY) {
        try {
            //  validacao apenas para garantir que a celula realmente existe
            if (!this.verify(x,sizeX,y,sizeY)) {
                // previne quando o usurio arrasta mas dispara o drop na mesma célula , portanto não h
                if(!this.matriz[x][y].content)return;

                var hasChildrens =(this.matriz[x][y].content.sizeX > 1) || (this.matriz[x][y].content.sizeY > 1);
                this.matriz[x][y].content = {};
                this.matriz[x][y].free = true;

                // varre a matriz todas , liberando as células filhas caso existam
                if(hasChildrens){
                    for(contX=0;contX<this.rows;contX++){
                        for(contY=0;contY<this.cols;contY++){
                            // verifica se a célula está alocada
                            if(!this.matriz[contX][contY].free){
                                // verifica se a célula alocada corresponde (partOf) a célula principal que está sendo removida
                                if(this.matriz[contX][contY].content.partOf == "["+x+"]["+y+"]")
                                {
                                    this.matriz[contX][contY].content = {};
                                    this.matriz[contX][contY].free = true;
                                }
                            }
                        }
                    }
                }
                return this;
            } else {
                return false;
            }
        } catch (err) {
            console.log("Ocorreu um erro ao tentar movel a imagem. Err:"+
                    err.lineNumber +"=>"+ err.toString() + "\n "+ err.stack);
            return false;
        }

    }

    /**
     * Eventos que escutam o CONTENT de cada célula
     */
    this.bindListainers = function(seletor) {
        $(seletor).on("dragover", function(e) {
            allowDrop(e)
        });
        $(seletor).on("dragleave", function(e) {
            out(e);
        });
        $(seletor).on("dragstart", function(e) {
            start(e);
        });

    }

    /**
     * Verifica se a célula está disponível para inserção Também verifica a
     * disponibilidade das célular vizinhas no cado do CONTENT ocupar mais de
     * uma célula
     *
     * @param x = linha (cordenada x)
     * @param y = coluna (cordenada y)
     * @param sizeX = tamanho no eixo x
     * @param sizeY = tamanho no eixo y
     * @return boolean (livre / ocupada)
     */
    this.verify = function(x, sizeX, y, sizeY) {
        // objeto comum,
        if (sizeX == 1 && sizeY == 1) {
            return Boolean(this.matriz[x][y].free);
        } else {
            var free = false;
            for (var cont = 0; (cont < sizeX || cont < sizeY); cont++) {
                if (cont < sizeX) {
                    free = Boolean(this.matriz[(parseInt(x)+parseInt(cont))][y].free)
                    if(!free)return free;
                }
                if (cont < sizeY) {
                    free = Boolean(this.matriz[x][(parseInt(y) + parseInt(cont))].free)
                    if(!free)return free;
                }
            }
            return free;
        }
    }

    /**
     * Gera ma área de impressão , sem as células ,apenas com os conteúdos de maneira absoluta
     *
     *
    */

    this.getPrintableArea = function(newPrintArea)
    {

        var newPrintArea = $("<div/>").css("position","relative");

        // percorre o eixo X
        for (x = 0; x < this.matriz.length; x++) {
            //ercorre o eixo Y
            for (y = 0; y < this.matriz[x].length; y++) {
                //verifica se existe o atributo img , para garantir que é um espaço alocado por uma imagem
                if(this.matriz[x][y].content.hasOwnProperty("img") )
                {
                    //certifica que não é apenas uma célula ocpuada por outra imagem que vazou
                    if(this.matriz[x][y].content.partOf==''){
                        // pega o posicionamento top,left do objeto
                        var img = $(this.matriz[x][y].content.img);

                        //limpando o que não é mais necessário da tag
                        img.removeAttr("draggable").removeAttr("ondragstart");

                        var offset = img.offset();



                        //cria a div que será posicionada absolutamente
                        var area =$("<div/>")
                           .css("left",offset.left)
                           .css("top",offset.top)
                           .css("position","absolute")
                           .append(img);
                        newPrintArea.append(area);
                    }
                }
            }
        }

        $(this.printArea).html("");
        $(this.printArea).html(newPrintArea);
        return true
    }





    /**
     * método para usar como debug , retorna uma representação literal do array
     */
    this.tabelaVerdade = function() {
        str = new String("");
        for (x = 0; x < this.rows; x++) {
            for (y = 0; y < this.cols; y++) {
                str += "[" + x + "," + y + "] => " + this.matriz[x][y].free
                        + ",";
            }
            str += "\n";
        }
        return str.toString();
    }

};

