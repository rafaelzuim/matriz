<html>
<head>
    <script type="text/javascript" src="https://code.jquery.com/jquery-2.1.1.min.js"></script>
    <script type="text/javascript" src="js/matriz.js"></script>

    <link href="css/matriz.css" type="text/css" rel="stylesheet">
    <script type="text/javascript">
    $(document).ready(
        function()
        {
            /*matrizObj.init(8,6);
            matrizObj.print();*/
            matriz = new Matriz();
            matriz.init(5,8,"#wrapper");
            matriz.insert(0,0,{"img":$("<img/>").attr("src","/img/cartao.jpg")
                .attr("draggable",true)
                .attr("ondragstart","drag(event)")
                .attr("id","cartao")
                .attr("width",257)
                .attr("height",152)
            });

            matriz.insert(0,1,{"img":$("<img/>").attr("src","/img/folder.jpg")
                                                .attr("draggable",true)
                                                .attr("ondragstart","drag(event)")
                                                .attr("id","folder")
                                                .attr("width",500)
                                                .attr("height",281)
                        });
            matriz.print();
            matriz.bindListainers();
        }
    );

    </script>
    <script type="text/javascript" src="js/drag.js"></script>
</head>

<body>
<div id="wrapper">

</div>

</body>

</html>


