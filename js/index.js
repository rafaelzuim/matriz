$(document).ready(
        function()
        {

            /**
             * 	aqui é tudo lixão , pois é apenas pra gerar o ambiente de teste
             * portanto este é o lugar para fazer merda
             *
            */

            zoom = 1;
            matriz = new Matriz();
            rotate = new Rotate();


            matriz.init(11,14,"#wrapper");

            var bordas = 11 * 2;

            var ajuste = 50 // ainda não descobri o por que destes 7 pixesl que preciso adiconar a div para que caibam o numero certo de celulas
            $("#wrapper").css("width",parseInt(matriz.cel.width) * parseInt(11) + parseInt(bordas) + ajuste);
            $("#wrapper0").css("height",parseInt(matriz.cel.height) * parseInt(14) );

            contador = 1;

            for(i=1 ; i< 16 ; i++)
            {
                matriz.smartInsert({"img":$("<img/>").attr("src","/img/cartao-"+i+".jpg")
                    .attr("draggable",true)
                    .attr("ondragstart","drag(event)")
                    .attr("id","cartao-"+i)
                    .attr("width",257)
                    .attr("height",152)
                    }
                    ,"topToBottom"
                );
            }
            matriz.smartInsert({"img":$("<img/>").attr("src","/img/folder-1.jpg")
                                                .attr("draggable",true)
                                                .attr("ondragstart","drag(event)")
                                                .attr("id","folder-1")
                                                .attr("width",500)
                                                .attr("height",281)


                        });
            matriz.smartInsert({"img":$("<img/>").attr("src","/img/folder-2.jpg")
                .attr("draggable",true)
                .attr("ondragstart","drag(event)")
                .attr("id","folder-2")
                .attr("width",500)
                .attr("height",281)

            },"leftToRight");
            matriz.print();
            matriz.bindListainers(".celula");
            rotate.bindEvent(".celula img ")

            $('#gerar-cordenadas').on(
                    'click',function()
                    {
                        $('.celula').css("border","0px none");
                        matriz.getPrintableArea();
                    }
            );

            $("#wrapper").css("transform","scale("+zoom+")");

            $(document).bind('DOMMouseScroll mousewheel', function(e) {

                    // o ctrl foi precionado ?
                    if(e.ctrlKey)
                    {
                        e.preventDefault();

                        // detail > que 0 indica que o scroll foi para baixo
                        if(e.originalEvent.detail > 0 && zoom >0.8)
                        {
                            zoom -= parseFloat(0.1);
                        }
                        else if(zoom <=parseFloat(1.2))
                        {
                            zoom += parseFloat(0.1);
                        }
                        else
                        {
                            return false;
                        }

                        $("#wrapper").css("transform","scale("+zoom+")");
                        e.target.scrollIntoView(false)

                    }


                }
            );






        }

 );