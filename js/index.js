$(document).ready(
        function()
        {
            /*matrizObj.init(8,6);
            matrizObj.print();*/


            /**
             * 	aqui é tudo lixão , pois é apenas pra gerar o ambiente de teste
             * portanto este é o lugar para fazer merda
             *
             */
            matriz = new Matriz();
            rotate = new Rotate();


            matriz.init(11,14,"#wrapper");

            var bordas = 11 * 2;

            var ajuste = 50 // ainda não descobri o por que destes 7 pixesl que preciso adiconar a div para que caibam o numero certo de celulas
            $("#wrapper").css("width",parseInt(matriz.cel.width) * parseInt(11) + parseInt(bordas) + ajuste);
            $("#wrapper0").css("height",parseInt(matriz.cel.height) * parseInt(14) );

            contador = 1;
            for(i=0 ; i< 8 ; i++){
                for(j=0;j<=3;j++){
                    if(contador >= 15)continue;
                    matriz.insert(i,j,{"img":$("<img/>").attr("src","/img/cartao-"+contador+".jpg")
                        .attr("draggable",true)
                        .attr("ondragstart","drag(event)")
                        .attr("id","cartao-"+contador)
                        .attr("width",257)
                        .attr("height",152)

                    });
                    contador ++;
                }
            }

            matriz.insert(4,0,{"img":$("<img/>").attr("src","/img/folder-1.jpg")
                                                .attr("draggable",true)
                                                .attr("ondragstart","drag(event)")
                                                .attr("id","folder-1")
                                                .attr("width",500)
                                                .attr("height",281)


                        });
            matriz.insert(0,4,{"img":$("<img/>").attr("src","/img/folder-2.jpg")
                .attr("draggable",true)
                .attr("ondragstart","drag(event)")
                .attr("id","folder-2")
                .attr("width",500)
                .attr("height",281)


            });
            matriz.print();
            matriz.bindListainers(".celula");
            rotate.bindEvent(".celula img ")

            $('#gerar-cordenadas').on(
                    'click',function(){
                        $('.celula').css("border","0px none");
                        matriz.getPrintableArea();
                    }
            )

        }
 );