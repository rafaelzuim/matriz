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
            var width = parseInt(content.img.width());
            var height = parseInt(content.img.height());

            var sizeX = Math.ceil(width / this.cel.width); // calcula quantas células a imagem ocupa , no eixo x
            var sizeY = Math.ceil(height / this.cel.height); // calcula quantas células a imagem ocupa , no eixo x


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
            console.log("Ocorreu um erro ao tentar movel a imagem. Err:"
                    + err.toString());
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
    this.remove = function(x, y) {
        try {
            //  validacao apenas para garantir que a celula realmente existe
            if (!this.verify(x, y)) {
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
            console.log("Ocorreu um erro ao tentar movel a imagem. Err:"
                    + err.toString());
            return false;
        }

    }

    /**
     * Eventos que escutam o CONTENT de cada célula
     */
    this.bindListainers = function() {
        $(".celula").on("dragover", function(e) {
            allowDrop(e)
        });
        $(".celula").on("dragleave", function(e) {
            out(e);
        });
        $(".celula").on("dragstart", function(e) {
            start(e);
        });

    }

    /**
     * Verifica se a célula está disponível para inserção Também verifica a
     * disponibilidade das célular vizinhas no cado do CONTENT ocupar mais de
     * uma célula
     *
     * @param x =
     *            linha (cordenada x)
     * @param y =
     *            coluna (cordenada y)
     * @return boolean (livre / ocupada)
     */
    this.verify = function(x, sizeX, y, sizeY) {
        // objeto comum,
        if (sizeX == 1 && sizeY == 1) {
            return Boolean(this.matriz[x][y].free);
        } else {
            var free = false;
            for (cont = 0; (cont < sizeX && cont < sizeY); cont++) {
                if (cont < sizeX) {
                    free = Boolean(this.matriz[(parseInt(x)+parseInt(cont))][y].free)
                }
                if (cont < sizeY) {
                    free = Boolean(this.matriz[x][(parseInt(y) + parseInt(cont))].free)
                }
            }
            return free;
        }
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

