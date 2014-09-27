var matrizObj = new Object({
    constructor : function(){
        this.init();
    },
    matriz: [4],

    init: function(){
        for(i = 0;i< 5;i++){
            this.matriz[i] = [8];
            for(var j = 0;j< 8;j++){
                this.matriz[i][j] = "";
            }
        }
    },

    print : function()
    {
        for(x = 0 ; x < this.matriz.length; x++){
            for(y=0;y<this.matriz[x].length;y++){
                $("#wrapper").append($("<div/>").attr("class","celula").html("<span class='item'>"+x.toString()+","+y.toString()+"</span>"));
            }
        }
    }

});


